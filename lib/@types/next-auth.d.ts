import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username?: string;
    } & DefaultSession["user"];
    accessToken?: string;
    provider?: string;
    githubId?: string;
  }

  interface User extends DefaultUser {
    username?: string;
  }
}

