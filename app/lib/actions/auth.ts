"use server";

import { signUpSchema, signInSchema } from "@/app/lib/validators";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { createUser, getUserByEmail } from "../database";
import { signIn, signOut } from "next-auth/react";
import { FormState } from "../types";

export async function signUpAction(formData: FormData): Promise<FormState> {
  try {
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const validatedData = signUpSchema.parse(rawData);

    const existingUser = await getUserByEmail(validatedData.email);
    if (existingUser) {
      return {
        errors: {
          email: ["An account with this email already exists"],
        },
      };
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    await createUser({
      username: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
    });

    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return {
      message: "Account created successfully",
    };
  } catch (error: any) {
    if (error.name === "ZodError") {
      return {
        errors: error.flatten().fieldErrors,
      };
    }

    return {
      message: "An error occurred. Please try again.",
    };
  }
}

export async function signInAction(
  formData: FormData
): Promise<FormState> {
  try {
    const rawData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const validatedData = signInSchema.parse(rawData);
    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return {
      message: "Signed in successfully",
    };
  } catch (error: any) {
    if (error.name === "ZodError") {
      return {
        errors: error.flatten().fieldErrors,
      };
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid email or password",
          };
        default:
          return {
            message: "Something went wrong. Please try again.",
          };
      }
    }

    return {
      message: "An error occurred. Please try again.",
    };
  }
}

export async function signOutAction() {
  await signOut({ redirect: false });
  redirect("/login");
}
