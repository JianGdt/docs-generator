import "server-only";
import { cache } from "react";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import { getUserById } from "./database";

export const verifySession = cache(async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return {
    isAuth: true,
    userId: session.user.id as string,
    user: session.user,
  };
});

export const getUser = cache(async () => {
  const session = await verifySession();

  if (!session) return null;

  try {
    const user = await getUserById(session.userId);

    if (!user) {
      return null;
    }

    return {
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
});

export const getCurrentUserId = cache(async () => {
  const session = await auth();
  return session?.user?.id || null;
});
