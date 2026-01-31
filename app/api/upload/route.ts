import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/database";
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided" },
        { status: 400 },
      );
    }

    if (files.length > 10) {
      return NextResponse.json(
        { success: false, error: "Maximum 10 files allowed" },
        { status: 400 },
      );
    }

    const uploadedFiles = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            error: `File ${file.name} exceeds 5MB limit`,
          },
          { status: 400 },
        );
      }

      const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
        return NextResponse.json(
          {
            success: false,
            error: `File type ${fileExt} not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`,
          },
          { status: 400 },
        );
      }

      const content = await file.text();

      const timestamp = Date.now();
      const uniqueFilename = `${timestamp}-${file.name}`;

      const savedFile = await saveUploadedFile({
        userId: session.user.id,
        filename: uniqueFilename,
        originalName: file.name,
        mimeType: file.type || "text/plain",
        size: file.size,
        content: content,
      });

      uploadedFiles.push({
        id: savedFile._id?.toString(),
        filename: savedFile.filename,
        originalName: savedFile.originalName,
        mimeType: savedFile.mimeType,
        size: savedFile.size,
        uploadedAt: savedFile.createdAt,
      });
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Upload failed" },
      { status: 500 },
    );
  }
}
