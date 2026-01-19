import { NextRequest, NextResponse } from "next/server";
import {
  updateDoc,
  getDocById,
  saveDocHistory,
  deleteDoc,
} from "@//lib/database";
import { z } from "zod";
import { auth } from "@//lib/auth";

const updateDocSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  documentType: z.string().min(1, "Document type is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  changeDescription: z.string().optional(),
});

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

    return NextResponse.json(doc, { status: 200 });
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, context: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Handle both Promise and direct params
    const params = await Promise.resolve(context.params);
    const { docId } = params;

    // Get current document before updating
    const currentDoc = await getDocById(docId, session.user.email);
    if (!currentDoc) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const validation = updateDocSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation error", details: validation.error.message },
        { status: 400 }
      );
    }

    const validatedData = validation.data;

    if (validatedData.content && validatedData.content !== currentDoc.content) {
      try {
        await saveDocHistory({
          docId: docId,
          userId: session.user.email,
          title: currentDoc.title,
          documentType: currentDoc.docType,
          content: currentDoc.content,
          version: (currentDoc.version || 0) + 1,
          changeDescription:
            validatedData.changeDescription || "Document updated",
        });
      } catch (historyError) {
        console.error("Failed to save history:", historyError);
      }
    }

    const updateData = {
      ...validatedData,
      version: (currentDoc.version || 0) + 1,
    };

    const success = await updateDoc(docId, session.user.email, updateData);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update document" },
        { status: 500 }
      );
    }

    const updatedDoc = await getDocById(docId, session.user.email);

    return NextResponse.json(
      {
        success: true,
        message: "Document updated successfully",
        document: updatedDoc,
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

    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Handle both Promise and direct params
    const params = await Promise.resolve(context.params);
    const { docId } = params;

    const doc = await getDocById(docId, session.user.email);
    if (!doc) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const success = await deleteDoc(docId, session.user.email);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete document" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Document deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
