import { auth } from "@/app/lib/auth";
import { getGitHubCommitsByUser } from "@/app/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20");

    const commits = await getGitHubCommitsByUser(session.user.id, limit);

    return NextResponse.json({
      commits: commits.map((commit) => ({
        id: commit._id?.toString(),
        repository: commit.repositoryFullName,
        filePath: commit.filePath,
        message: commit.commitMessage,
        commitUrl: commit.commitUrl,
        pullRequestNumber: commit.pullRequestNumber,
        pullRequestUrl: commit.pullRequestUrl,
        createdAt: commit.createdAt,
      })),
    });
  } catch (error) {
    console.error("GitHub history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch commit history" },
      { status: 500 }
    );
  }
}