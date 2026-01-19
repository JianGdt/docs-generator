import { NextRequest, NextResponse } from "next/server";
import { auth } from "@//lib/auth";
import {
  restoreDocFromHistory,
  getDocById,
  getHistoryVersion,
} from "@//lib/database";
import { z } from "zod";

const restoreSchema = z.object({
  historyId: z.string().min(1, "History ID is required"),
});

type RouteParams = {
  params: Promise<{ docId: string }> | { docId: string };
};

export async function POST(req: NextRequest, context: RouteParams) {
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

    const body = await req.json();
    const validation = restoreSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.message },
        { status: 400 }
      );
    }

    const { historyId } = validation.data;

    const historyEntry = await getHistoryVersion(historyId, session.user.email);
    if (!historyEntry) {
      return NextResponse.json(
        { error: "History version not found" },
        { status: 404 }
      );
    }

    if (historyEntry.docId !== docId) {
      return NextResponse.json(
        { error: "History version does not belong to this document" },
        { status: 403 }
      );
    }

    const success = await restoreDocFromHistory(
      docId,
      historyId,
      session.user.email
    );

    if (!success) {
      return NextResponse.json(
        { error: "Failed to restore document" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Document restored successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    console.error("Error restoring document:", error);
    return NextResponse.json(
      { error: "Failed to restore document" },
      { status: 500 }
    );
  }
}
