import Groq from "groq-sdk";
import { DocType } from "./types";
import { ENV } from "./constants";

const groq = new Groq({
  apiKey: ENV.GROQ_API_KEY,
});

const PROMPTS: Record<DocType, (context: string) => string> = {
  readme: (context) => `Generate a comprehensive, professional README.md file.

Include:
- Project title with badges
- Overview (2-3 paragraphs)
- Key Features (with emojis)
- Prerequisites
- Installation steps
- Usage examples
- Configuration
- Project structure
- Testing
- Deployment
- Contributing
- License

Project Info:
${context}

Generate ONLY markdown content.`,

  api: (context) => `Generate comprehensive API documentation.

Include all endpoints with:
- HTTP Method and Path
- Description
- Parameters
- Request/Response examples
- Status codes
- Error handling

Code:
${context}`,

  guide: (context) => `Generate a User Guide.

Include:
- Introduction
- Getting Started
- Features Guide
- Use Cases
- Best Practices
- Troubleshooting
- FAQ

Project:
${context}`,

  contributing: (context) => `Generate CONTRIBUTING.md.

Include:
- How to contribute
- Development setup
- Coding standards
- Commit guidelines
- PR process
- Testing

Project:
${context}`,
};

export async function generateDocumentation(
  codeContext: string,
  type: DocType
): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: PROMPTS[type](codeContext),
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4096,
      top_p: 1,
      stream: false,
    });
    return completion.choices[0]?.message?.content || "";
  } catch (error: any) {
    console.error("Groq API Error:", error);
    throw new Error(`AI generation failed: ${error.message}`);
  }
}
