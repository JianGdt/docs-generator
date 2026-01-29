import { auth } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { connected: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    const isGitHubConnected =
      session.provider === "github" && !!session.accessToken;

    return NextResponse.json({
      connected: isGitHubConnected,
      user: session.user,
      provider: session.provider,
    });
  } catch (error) {
    console.error("GitHub connect check error:", error);
    return NextResponse.json(
      { error: "Failed to check GitHub connection" },
      { status: 500 },
    );
  }
}
