import { NextRequest, NextResponse } from "next/server";
import { auth } from "@//lib/auth";
import { getHistoryVersion } from "@//lib/database";

export async function GET(
  req: NextRequest,
  { params }: { params: { historyId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

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