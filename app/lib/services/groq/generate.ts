/**
 * Documentation Generation Service
 *
 * Handles all documentation generation logic
 */

import { getGroqClient } from "./client";
import { GROQ_CONFIG } from "./config";
import { DocType, RepoContext } from "../../@types/common";
import { validateContextData, validateDocType, withRetry } from "../../utils";
import { buildAnalysisPrompt, buildSystemPrompt } from "./prompt";

/**
 * Generate documentation for a repository or code snippet
 */
export async function generateDocumentation(
  contextData: string | RepoContext,
  docType: DocType,
): Promise<string> {
  try {
    // Validate inputs
    validateDocType(docType);
    validateContextData(contextData);

    // Build prompts
    const systemPrompt = buildSystemPrompt(docType);
    let userPrompt: string;

    if (typeof contextData === "object") {
      userPrompt = buildAnalysisPrompt(contextData, docType);
    } else {
      userPrompt = `Analyze the following code and generate ${docType} documentation:\n\n${contextData}`;
    }

    // Generate documentation with retry logic
    const documentation = await withRetry(async () => {
      const groq = getGroqClient();

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        model: GROQ_CONFIG.model,
        temperature: GROQ_CONFIG.temperature,
        max_tokens: GROQ_CONFIG.maxTokens,
        top_p: GROQ_CONFIG.topP,
      });

      const content = completion.choices[0]?.message?.content;

      if (!content || content.trim().length === 0) {
        throw new Error("Generated documentation is empty");
      }

      return content;
    });

    return documentation;
  } catch (error: any) {
    console.error("Documentation generation error:", {
      message: error.message,
      docType,
      contextType: typeof contextData,
    });

    // Provide user-friendly error messages
    if (error.message?.includes("rate_limit")) {
      throw new Error(
        "Rate limit exceeded. Please try again in a moment. If this persists, consider upgrading your Groq API plan.",
      );
    }

    if (error.message?.includes("context_length")) {
      throw new Error(
        "Repository is too large for processing. Try with fewer files or reduce file sizes.",
      );
    }

    if (error.message?.includes("authentication")) {
      throw new Error(
        "API authentication failed. Please check your GROQ_API_KEY configuration.",
      );
    }

    if (error.message?.includes("GROQ_API_KEY")) {
      throw error;
    }

    throw new Error(
      `Documentation generation failed: ${error.message || "Unknown error"}`,
    );
  }
}
