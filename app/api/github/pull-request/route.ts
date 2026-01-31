import { auth } from "@/lib/auth";
import { GitHubService } from "@/lib/github";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.accessToken || session?.provider !== "github") {
      return NextResponse.json(
        { error: "Unauthorized - GitHub authentication required" },
        { status: 401 },
      );
    }

    const { owner, repo, path, content, message, title, body, base, head } =
      await req.json();

    if (!owner || !repo || !path || !content || !message || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const github = new GitHubService(session.accessToken);

    const branchName = head || `docs/${path.replace(/\//g, "-")}-${Date.now()}`;
    const baseBranch = base || "main";

    try {
      await github.createBranch({
        owner,
        repo,
        branch: branchName,
        fromBranch: baseBranch,
      });
    } catch (error: any) {
      console.log("Branch creation note:", error.message);
    }

    await github.commitFile({
      owner,
      repo,
      path,
      content,
      message,
      branch: branchName,
    });

    const pullRequest = await github.createPullRequest({
      owner,
      repo,
      title,
      body,
      head: branchName,
      base: baseBranch,
    });

    return NextResponse.json({
      success: true,
      pullRequest: {
        number: pullRequest.number,
        url: pullRequest.html_url,
        title: pullRequest.title,
      },
    });
  } catch (error: any) {
    console.error("Error creating pull request:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create pull request" },
      { status: 500 },
    );
  }
}
