import { ReviewResult } from "../../@types/common";
import { withRetry } from "../../utils";
import { getGroqClient } from "./client";
import { GROQ_CONFIG } from "./config";
import { buildReviewerSystemPrompt, buildReviewPrompt } from "./prompt";

export async function reviewDocumentation(data: string): Promise<ReviewResult> {
  try {
    if (!data || data.trim().length === 0) {
      throw new Error("Documentation data cannot be empty");
    }

    const result = await withRetry(async () => {
      const groq = getGroqClient();

      const completion = await groq.chat.completions.create({
        model: GROQ_CONFIG.model,
        temperature: 0,
        max_tokens: 1200,
        messages: [
          { role: "system", content: buildReviewerSystemPrompt() },
          { role: "user", content: buildReviewPrompt(data) },
        ],
      });

      const content = completion.choices[0]?.message?.content;

      if (!content) {
        throw new Error("Empty AI review response");
      }
      try {
        const cleanContent = content
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();

        const parsed = JSON.parse(cleanContent);

        // Validate the structure
        if (typeof parsed.score !== "number") {
          throw new Error("Invalid review format: missing or invalid score");
        }

        return parsed as ReviewResult;
      } catch (parseError) {
        console.error("Failed to parse AI response:", content);
        throw new Error(
          `AI returned invalid JSON: ${
            parseError instanceof Error
              ? parseError.message
              : "Unknown parse error"
          }`,
        );
      }
    });

    return result;
  } catch (error: any) {
    console.error("Documentation review error:", error.message);

    if (error.message?.includes("rate_limit")) {
      throw new Error(
        "Rate limit exceeded during review. Please try again in a moment.",
      );
    }

    throw new Error(`Documentation review failed: ${error.message}`);
  }
}
