import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { getUserByEmailOrUsername, createUser } from "./database";
import { DUMMY_HASH } from "./constants";
import { checkRateLimit } from "./rate-limit";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        const identifier = String(credentials.identifier).trim();
        const password = String(credentials.password);
        if (identifier.length < 3 || password.length < 6) {
          return null;
        }

        try {
          const headersList = await headers();
          const ip =
            headersList.get("x-forwarded-for")?.split(",")[0] ||
            headersList.get("x-real-ip") ||
            "unknown";
          await checkRateLimit(identifier, ip);

          const user = await getUserByEmailOrUsername(identifier);

          if (!user || !user.password) {
            await bcrypt.compare(password, DUMMY_HASH);
            return null;
          }

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.username,
            username: user.username,
          };
        } catch (error) {
          // Handle rate limit errors
          if (error instanceof Error && error.message.includes("Too many")) {
            console.error(`Rate limit exceeded: ${identifier}`);
          }
          throw error;
        }
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }

      if (!user.email) {
        console.error("OAuth user missing email");
        return false;
      }

      try {
        const existingUser = await getUserByEmailOrUsername(user.email);

        if (existingUser) {
          user.id = existingUser._id.toString();
          user.name = existingUser.username;
        } else {
          const username = user.email.split("@")[0].toLowerCase();
          const newUser = await createUser({
            username,
            email: user.email.toLowerCase(),
            password: "",
          });

          user.id = newUser._id.toString();
          user.name = newUser.username;
        }

        return true;
      } catch (error) {
        console.error("OAuth sign-in error:", error);
        return false;
      }
    },

    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.username = user.username || user.name;
        token.email = user.email;
      }

      // Store OAuth metadata
      if (account) {
        token.provider = account.provider;

        if (account.provider === "github") {
          token.accessToken = account.access_token;
          token.githubId = String(profile?.id);
        } else if (account.provider === "google") {
          token.accessToken = account.access_token;
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Attach user data to session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.username as string;
        session.user.email = token.email as string;
      }

      // Attach OAuth metadata
      session.accessToken = token.accessToken as string;
      session.provider = token.provider as string;
      session.githubId = token.githubId as string;

      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});
