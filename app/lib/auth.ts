import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getUserByEmailOrUsername, createUser } from "./database";

const redis = Redis.fromEnv();
const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
  prefix: "ratelimit:login",
});

const DUMMY_HASH = "$2a$10$dummyhashtopreventtimingattacks1234567890";

async function checkRateLimit(identifier: string) {
  const key = `login:${identifier.toLowerCase()}`;
  const { success, reset } = await loginRateLimit.limit(key);

  if (!success) {
    const minutes = Math.ceil((reset - Date.now()) / 1000 / 60);
    throw new Error(
      `Too many login attempts. Try again in ${minutes} minute${
        minutes !== 1 ? "s" : ""
      }.`
    );
  }
}

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
          await checkRateLimit(identifier);

          const user = await getUserByEmailOrUsername(identifier);

          if (!user || !user.password) {
            await bcrypt.compare(password, DUMMY_HASH);
            return null;
          }

          // Verify password
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
          if (error instanceof Error && error.message.includes("Too many")) {
            console.error(`Rate limit: ${error.message}`);
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
      if (account?.provider !== "google" && account?.provider !== "github") {
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
        token.username = user.username || user.name || undefined;
        token.email = user.email || undefined;
      }

      // Store OAuth tokens
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
      // Add custom fields to session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.username as string;
        session.user.email = token.email as string;
      }

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

  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});
