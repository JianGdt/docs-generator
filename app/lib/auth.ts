import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { getUserByEmailOrUsername, createUser } from "./database";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await getUserByEmailOrUsername(
          credentials.identifier as string
        );

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username,
          username: user.username,
        };
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          const existingUser = await getUserByEmailOrUsername(user.email!);

          if (!existingUser) {
            const username = user.email!.split("@")[0];
            const newUser = await createUser({
              username: username.toLowerCase(),
              email: user.email!.toLowerCase(),
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
          console.error("Error in signIn callback:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username || user.name;
        token.email = user.email;
      }

      if (account) {
        token.provider = account.provider;

        // Store GitHub access token for API calls
        if (account.provider === "github") {
          token.accessToken = account.access_token;
          token.githubId = profile?.id;
        }

        // Store Google access token if needed
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

      // Add access token and provider to session
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
  },

  secret: process.env.AUTH_SECRET,
});
