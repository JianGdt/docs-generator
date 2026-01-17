import { generateDocumentation } from "@/app/lib/ai";
import { auth } from "@/app/lib/auth";
import { saveDocumentation } from "@/app/lib/database";
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
      await req.json()
    );

    let documentation: string;

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

      await saveDocumentation({
        userId: session.user.id!,
        title: `${repo.name} - ${docType}`,
        content: documentation,
        docType,
      }).catch(console.warn);
    } else {
      documentation = await generateDocumentation(data, docType);

      await saveDocumentation({
        userId: session.user.id!,
        title: `${docType} Documentation`,
        content: documentation,
        docType,
      }).catch(console.warn);
    }

    return NextResponse.json({ success: true, documentation });
  } catch (error) {
    console.error("Generate documentation error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: (error as Error).message || "Failed to generate" },
      { status: 500 }
    );
  }
}
