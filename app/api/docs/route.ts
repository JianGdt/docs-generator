import { NextRequest, NextResponse } from "next/server";
import { auth } from "@//lib/auth";
import {
  saveDocumentationWithHistory,
  getUserDocs,
  getDatabase,
} from "@//lib/database";
import { z } from "zod";
import { SavedDoc } from "@//lib/@types/docs";

const saveDocSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  docType: z.enum(["readme", "api", "guide", "contributing"]),
  repositoryUrl: z.string().optional(),
  repositoryName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("📝 API/DOCS POST called with title:", body.title);
    console.log("📝 Content length:", body.content?.length);

    const validation = saveDocSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation error", details: validation.error.message },
        { status: 400 },
      );
    }

    const { title, content, docType, repositoryUrl, repositoryName } =
      validation.data;

    // ✅ Check for duplicates - prevent saving the same document twice
    const db = await getDatabase();
    const existingDoc = await db.collection<SavedDoc>("docs").findOne({
      userId: session.user.id,
      title,
      content,
      docType,
    });

    if (existingDoc) {
      console.log(
        "⚠️ Duplicate detected, returning existing document:",
        existingDoc._id,
      );
      return NextResponse.json(
        {
          success: true,
          message: "Document already exists",
          document: existingDoc,
          isDuplicate: true,
        },
        { status: 200 },
      );
    }

    console.log("✅ Saving new document:", {
      title,
      docType,
      userId: session.user.id,
    });

    const savedDoc = await saveDocumentationWithHistory({
      userId: session.user.id,
      title,
      content,
      docType,
      repositoryUrl,
      repositoryName,
    });

    console.log("✅ Document saved with ID:", savedDoc._id);

    return NextResponse.json(
      {
        success: true,
        message: "Document saved successfully",
        document: savedDoc,
        isDuplicate: false,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error saving document:", error);
    return NextResponse.json(
      { error: "Failed to save document" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");

    const allDocs = await getUserDocs(session.user.id);
    const total = allDocs.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDocs = allDocs.slice(startIndex, endIndex);

    return NextResponse.json(
      {
        data: {
          documents: paginatedDocs,
          page,
          limit,
          total,
          totalPages,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 },
    );
  }
}
