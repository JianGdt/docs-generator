import { auth } from "@/lib/auth";
import { GitHubService } from "@/lib/github";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.accessToken || session?.provider !== "github") {
      return NextResponse.json(
        { error: "Unauthorized - GitHub authentication required" },
        { status: 401 }
      );
    }

    const { owner, repo, path, content, message, branch } = await req.json();

    if (!owner || !repo || !path || !content || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const github = new GitHubService(session.accessToken);
    
    const result = await github.commitFile({
      owner,
      repo,
      path,
      content,
      message,
      branch: branch || "main",
    });

    return NextResponse.json({
      success: true,
      commit: result,
    });
  } catch (error: any) {
    console.error("Error committing file:", error);
    return NextResponse.json(
      { error: error.message || "Failed to commit file" },
      { status: 500 }
    );
  }
}
