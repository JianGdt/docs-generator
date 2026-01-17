import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { getUserByEmailOrUsername, createUser } from "./database";
import { checkLoginRateLimit } from "./rate-limit";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (
          !credentials?.identifier ||
          !credentials?.password ||
          typeof credentials.identifier !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        const identifier = credentials.identifier.trim();
        const password = credentials.password;

        if (identifier.length < 3 || identifier.length > 255) {
          return null;
        }

        if (password.length < 6 || password.length > 255) {
          return null;
        }

        try {
          const rateLimit = await checkLoginRateLimit(identifier);

          if (!rateLimit.success) {
            throw new Error(
              `Too many login attempts. Please try again in ${Math.ceil(
                (rateLimit.reset.getTime() - Date.now()) / 1000 / 60
              )} minutes.`
            );
          }

          const user = await getUserByEmailOrUsername(identifier);

          if (!user || !user.password) {
            await bcrypt.compare(
              password,
              "$2a$10$dummyhashtopreventtimingattacks1234567890"
            );
            return null;
          }

          const isCorrectPassword = await bcrypt.compare(
            password,
            user.password
          );

          if (!isCorrectPassword) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.username,
            username: user.username,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          if (error instanceof Error && error.message.includes("Too many")) {
            throw error;
          }
          return null;
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
      if (account?.provider === "google" || account?.provider === "github") {
        if (!user.email) {
          console.error("OAuth user missing email");
          return false;
        }

        try {
          const existingUser = await getUserByEmailOrUsername(user.email);

          if (!existingUser) {
            const username = user.email.split("@")[0];
            const sanitizedUsername = username
              .toLowerCase()
              .replace(/[^a-z0-9_-]/g, "")
              .slice(0, 30);

            const newUser = await createUser({
              username: sanitizedUsername,
              email: user.email.toLowerCase(),
              password: "",
            });

            user.id = newUser._id.toString();
            user.name = newUser.username;
          } else {
            user.id = existingUser._id.toString();
            user.name = existingUser.username;
          }

          return true;
        } catch (error) {
          console.error("Sign in error:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).user.username || user.name;
        token.email = user.email;
      }

      if (account) {
        token.provider = account.provider;

        if (account.provider === "github") {
          token.accessToken = account.access_token;
          token.githubId = profile?.id as string;
        }

        if (account.provider === "google") {
          token.accessToken = account.access_token;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.username as string;
        session.user.email = token.email as string;
      }

      session.accessToken = token.accessToken;
      session.provider = token.provider;
      session.githubId = token.githubId;

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

  cookies: {
    sessionToken: {
      name: `${
        process.env.NODE_ENV === "production" ? "__Secure-" : ""
      }next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});
