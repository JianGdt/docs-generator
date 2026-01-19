import { auth } from "@//lib/auth";
import { getDocById, getDocHistory } from "@//lib/database";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ docId: string }> | { docId: string };
};

export async function GET(req: NextRequest, context: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await Promise.resolve(context.params);
    const { docId } = params;

    const doc = await getDocById(docId, session.user.email);
    if (!doc) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    const result = await getDocHistory(docId, session.user.email, page, limit);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching document history:", error);
    return NextResponse.json(
      { error: "Failed to fetch document history" },
      { status: 500 }
    );
  }
}
