import { NextRequest, NextResponse } from "next/server";
import { auth } from "@//lib/auth";
import { getHistoryVersion } from "@//lib/database";

type RouteParams = {
  params: Promise<{ historyId: string }> | { historyId: string };
};

export async function GET(req: NextRequest, context: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await Promise.resolve(context.params);
    const { historyId } = params;

    const historyEntry = await getHistoryVersion(historyId, session.user.email);

    if (!historyEntry) {
      return NextResponse.json(
        { error: "History version not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(historyEntry, { status: 200 });
  } catch (error) {
    console.error("Error fetching history version:", error);
    return NextResponse.json(
      { error: "Failed to fetch history version" },
      { status: 500 }
    );
  }
}
