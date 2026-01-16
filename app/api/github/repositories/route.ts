import { auth } from "@/app/lib/auth";
import { GitHubService } from "@/app/lib/github";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.accessToken || session?.provider !== "github") {
      return NextResponse.json(
        { error: "Unauthorized - GitHub authentication required" },
        { status: 401 }
      );
    }

    const github = new GitHubService(session.accessToken);
    const repos = await github.getUserRepositories();

    const repositories = repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      owner: repo.owner.login,
      defaultBranch: repo.default_branch,
    }));

    return NextResponse.json({ repositories });
  } catch (error: any) {
    console.error("Error fetching repositories:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}
