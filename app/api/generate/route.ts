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

    const codeContext =
      method === "github"
        ? await fetchGitHubRepo(data).then(
            (repo: any) =>
              `Repository: ${repo.name}\nDescription: ${
                repo.description
              }\n\n${repo.files
                .map((file: any) => `--- ${file.path} ---\n${file.content}`)
                .join("\n\n")}`
          )
        : data;

    const documentation = await generateDocumentation(codeContext, docType);

    await saveDocumentation({
      userId: session.user.id!,
      title: `${docType} Documentation`,
      content: documentation,
      docType,
    }).catch(console.warn);

    return NextResponse.json({ success: true, documentation });
  } catch (error) {
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
