import Groq from "groq-sdk";
import { DocType } from "./types";
import { ENV } from "./constants";

const groq = new Groq({
  apiKey: ENV.GROQ_API_KEY,
});

interface RepoContext {
  owner: string;
  repoName: string;
  name: string;
  description: string;
  packageJson?: any;
  techStack?: any;
  fileStructure: string[];
  files: Array<{ path: string; content: string }>;
}

function buildReadmePrompt(repo: RepoContext): string {
  const dirs = [
    ...new Set(repo.fileStructure.map((f) => f.split("/")[0])),
  ].sort();

  return `Generate a professional documents.

REPOSITORY: ${repo.name}
DESCRIPTION: ${repo.description || "No description"}

${
  repo.packageJson?.dependencies
    ? `DEPENDENCIES:\n${JSON.stringify(
        repo.packageJson.dependencies,
        null,
        2,
      )}\n`
    : ""
}
${
  repo.packageJson?.scripts
    ? `NPM SCRIPTS:\n${JSON.stringify(repo.packageJson.scripts, null, 2)}\n`
    : ""
}
${
  repo.techStack
    ? `TECH STACK:\n- Framework: ${repo.techStack.framework.join(
        ", ",
      )}\n- UI: ${repo.techStack.ui.join(
        ", ",
      )}\n- Auth: ${repo.techStack.auth.join(
        ", ",
      )}\n- Database: ${repo.techStack.database.join(
        ", ",
      )}\n- APIs: ${repo.techStack.api.join(", ")}\n`
    : ""
}

DIRECTORIES: ${dirs.join(", ")}

FILES:
${repo.files.map((f) => `--- ${f.path} ---\n${f.content.slice(0, 1500)}`).join("\n\n")}
`;
}

export async function generateDocumentation(
  contextData: string | RepoContext,
  type: DocType,
): Promise<string> {
  try {
    const prompt =
      typeof contextData === "object"
        ? buildReadmePrompt(contextData)
        : contextData;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 4096,
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error: any) {
    console.error("Groq API Error:", error);
    throw new Error(`AI generation failed: ${error.message}`);
  }
}
