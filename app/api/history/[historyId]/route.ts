import { auth } from "@//lib/auth";
import { deleteDocHistory, getHistoryVersion } from "@//lib/database";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ historyId: string }> | { historyId: string };
};

export async function GET(req: NextRequest, context: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await Promise.resolve(context.params);
    const { historyId } = params;

    console.log("GET - historyId:", historyId);

    const historyEntry = await getHistoryVersion(historyId, session.user.id);

    if (!historyEntry) {
      return NextResponse.json(
        { error: "History version not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(historyEntry, { status: 200 });
  } catch (error) {
    console.error("Error fetching history version:", error);
    return NextResponse.json(
      { error: "Failed to fetch history version" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteParams) {
  console.log("DELETE endpoint shesh");
  try {
    const session = await auth();
    console.log("sess", session?.user?.id);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const params = await Promise.resolve(context.params);
    const { historyId } = params;
    const historyEntry = await getHistoryVersion(historyId, session.user.id);

    if (!historyEntry) {
      return NextResponse.json(
        { error: "History entry not found" },
        { status: 404 },
      );
    }

    const success = await deleteDocHistory(historyId, session.user.id);
    console.log("Delete success:", success);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete history entry" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "History entry deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting history entry:", error);
    return NextResponse.json(
      { error: "Failed to delete history entry" },
      { status: 500 },
    );
  }
}
