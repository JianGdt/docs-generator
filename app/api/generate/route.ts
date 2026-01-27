import { generateDocumentation } from "@/app/lib/ai";
import { auth } from "@/app/lib/auth";
import { fetchGitHubRepo } from "@/app/lib/github";
import { generateRequestSchema } from "@/app/lib/validators";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { method, data, docType } = generateRequestSchema.parse(
      await req.json(),
    );

    let documentation: string;
    let metadata: { name?: string; description?: string; url?: string } = {};

    if (method === "github") {
      const repo = await fetchGitHubRepo(data);

      if (docType === "readme") {
        documentation = await generateDocumentation(repo, docType);
      } else {
        const textContext = `Repository: ${repo.name}\nDescription: ${
          repo.description
        }\n\n${repo.files
          .map((file: any) => `--- ${file.path} ---\n${file.content}`)
          .join("\n\n")}`;

        documentation = await generateDocumentation(textContext, docType);
      }

      metadata = {
        name: repo.name,
        description: repo.description,
        url: data,
      };
    } else {
      documentation = await generateDocumentation(data, docType);
      metadata = {};
    }

    return NextResponse.json({
      success: true,
      documentation,
      metadata,
    });
  } catch (error) {
    console.error("Generate documentation error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: (error as Error).message || "Failed to generate" },
      { status: 500 },
    );
  }
}
