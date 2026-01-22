import { NextRequest, NextResponse } from "next/server";
import { auth } from "@//lib/auth";
import { saveDocumentationWithHistory, getUserDocs } from "@//lib/database";
import { z } from "zod";

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

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = saveDocSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation error", details: validation.error.message },
        { status: 400 },
      );
    }

    const { title, content, docType, repositoryUrl, repositoryName } =
      validation.data;

    const savedDoc = await saveDocumentationWithHistory({
      userId: session.user.email,
      title,
      content,
      docType,
      repositoryUrl,
      repositoryName,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Document saved successfully",
        document: savedDoc,
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

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");

    const allDocs = await getUserDocs(session.user.email);
    const total = allDocs.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDocs = allDocs.slice(startIndex, endIndex);

    return NextResponse.json(
      {
        documents: {
          data: paginatedDocs,
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
