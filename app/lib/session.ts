import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.NEXTAUTH_SECRET!;
const encodedKey = new TextEncoder().encode(secretKey);

export type SessionPayload = {
  userId: string;
  username: string;
  email: string;
  expiresAt: Date;
};

export type UserPreferences = {
  inputMethod: "github" | "code";
  docType: "api" | "readme" | "guide";
  githubUrl?: string;
  codeInput?: string;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.error("Failed to verify session:", error);
    return null;
  }
}

export async function createSession(
  userId: string,
  username: string,
  email: string
) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, username, email, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  return session;
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) return null;

  return await decrypt(session);
}

export async function updateSession() {
  const session = await getSession();

  if (!session) return null;

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const newSession = await encrypt({
    ...session,
    expiresAt,
  });

  const cookieStore = await cookies();

  cookieStore.set("session", newSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  return session;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("user-preferences");
}

export async function setUserPreferences(preferences: UserPreferences) {
  const cookieStore = await cookies();
  cookieStore.set("user-preferences", JSON.stringify(preferences), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
    path: "/",
  });
}

export async function getUserPreferences(): Promise<UserPreferences | null> {
  const cookieStore = await cookies();
  const prefs = cookieStore.get("user-preferences")?.value;

  if (!prefs) return null;

  try {
    return JSON.parse(prefs);
  } catch {
    return null;
  }
}
