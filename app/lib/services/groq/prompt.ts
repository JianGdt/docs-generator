import { DocType, RepoContext } from "../../@types/common";
import { buildTechStackSection, truncateContent } from "../../utils";
import { CONTENT_LIMITS } from "./config";

/**
 * Build system prompt based on documentation type
 */
export function buildSystemPrompt(docType: DocType): string {
  const basePrompt = `You are an expert technical documentation generator specializing in analyzing codebases and creating professional documentation.

CORE COMPETENCIES:
- Deep understanding of modern web frameworks (Next.js, React, Vue, etc.)
- Expertise in TypeScript/JavaScript ecosystems
- Knowledge of database systems (MongoDB, PostgreSQL, etc.)
- Understanding of authentication patterns (NextAuth, Auth.js, JWT)
- Familiarity with UI frameworks (Tailwind, Radix UI, Material UI)
- API integration patterns and best practices

ANALYSIS APPROACH:
1. Identify the project's primary purpose and architecture
2. Map out the technology stack and dependencies
3. Understand the file structure and organization patterns
4. Recognize key features and functionality
5. Identify authentication, database, and API patterns
6. Note development and deployment configurations`;

  const docTypeSpecifics: Record<DocType, string> = {
    readme: `

README GENERATION REQUIREMENTS:
- Create a compelling project overview with clear value proposition
- Include comprehensive installation and setup instructions
- Document environment variables and configuration
- Provide usage examples and code snippets
- List all features with descriptions
- Include API endpoints if applicable
- Add troubleshooting section
- Document deployment process
- Include contribution guidelines
- Add license information

FORMAT: Professional markdown with proper headers, code blocks, badges, and tables.`,

    api: `

API DOCUMENTATION REQUIREMENTS:
- Document all API endpoints with HTTP methods
- Include request/response schemas with examples
- Specify authentication requirements
- Document query parameters, headers, and body structure
- Provide error codes and messages
- Include rate limiting information
- Add authentication flow documentation
- Document WebSocket connections if applicable

FORMAT: Clear REST API documentation with request/response examples.`,

    guide: `

SETUP GUIDE REQUIREMENTS:
- Step-by-step installation instructions
- Prerequisites and system requirements
- Environment setup (Node.js version, package manager)
- Database setup and configuration
- Environment variables with descriptions
- Authentication provider configuration
- Third-party service integrations
- Development server setup
- Common troubleshooting issues

FORMAT: Beginner-friendly guide with command examples.`,

    architecture: `

ARCHITECTURE DOCUMENTATION REQUIREMENTS:
- System overview and design philosophy
- Component architecture and relationships
- Data flow and state management
- Database schema and relationships
- Authentication and authorization flow
- API layer structure
- Frontend component hierarchy
- File structure explanation
- Design patterns used
- Scalability considerations

FORMAT: Technical documentation with diagrams descriptions and code references.`,

    contributing: `

CONTRIBUTING GUIDE REQUIREMENTS:
- Code of conduct
- Development setup instructions
- Branch naming conventions
- Commit message guidelines
- Pull request process
- Code style and linting rules
- Testing requirements
- Documentation standards
- Issue reporting guidelines
- Review process

FORMAT: Clear guidelines for contributors.`,
  };

  return basePrompt + (docTypeSpecifics[docType] || "");
}

export function buildAnalysisPrompt(
  repo: RepoContext,
  docType: DocType,
): string {
  const directories = [
    ...new Set(repo.fileStructure.map((f) => f.split("/")[0])),
  ].sort();

  const hasApi = directories.some((d) =>
    ["api", "pages/api", "app/api", "src"].some((pattern) =>
      d.startsWith(pattern),
    ),
  );

  const hasComponents = directories.some((d) =>
    ["components", "src/components"].some((pattern) => d.startsWith(pattern)),
  );

  const hasLib = directories.some((d) =>
    ["lib", "utils", "helpers"].some((pattern) => d.startsWith(pattern)),
  );

  const hasAuth = repo.files.some(
    (f) =>
      f.path.includes("auth") ||
      f.content.toLowerCase().includes("nextauth") ||
      f.content.toLowerCase().includes("session"),
  );

  const hasDatabase = repo.files.some(
    (f) =>
      f.path.includes("database") ||
      f.path.includes("db") ||
      f.content.toLowerCase().includes("mongodb") ||
      f.content.toLowerCase().includes("prisma"),
  );

  let prompt = `# REPOSITORY ANALYSIS REQUEST

## Project Information
- **Repository**: ${repo.owner}/${repo.repoName}
- **Name**: ${repo.name}
- **Description**: ${repo.description || "No description provided"}
- **Primary Language**: ${repo.language}

## Technology Stack
`;

  if (repo.techStack) {
    prompt += buildTechStackSection(repo.techStack);
  }

  if (repo.packageJson) {
    prompt += `\n## Package Configuration\n`;

    if (repo.packageJson.scripts) {
      prompt += `\n### Available Scripts\n\`\`\`json\n${JSON.stringify(
        repo.packageJson.scripts,
        null,
        2,
      )}\n\`\`\`\n`;
    }

    if (repo.packageJson.dependencies) {
      const depCount = Object.keys(repo.packageJson.dependencies).length;
      prompt += `\n### Dependencies (${depCount} packages)\n`;

      const keyDeps = Object.entries(repo.packageJson.dependencies).filter(
        ([key]) =>
          ["next", "react", "mongodb", "next-auth", "tailwindcss"].some(
            (important) => key.includes(important),
          ),
      );

      if (keyDeps.length > 0) {
        prompt += `Key dependencies:\n${keyDeps
          .map(([k, v]) => `- ${k}@${v}`)
          .join("\n")}\n`;
      }
    }
  }

  prompt += `\n## Project Structure

### Directory Organization
${directories.map((d) => `- \`${d}/\``).join("\n")}

### Architecture Patterns Detected
${hasApi ? "- ✅ API Routes (Backend endpoints present)" : ""}
${hasComponents ? "- ✅ Component-based architecture" : ""}
${hasLib ? "- ✅ Utility/Helper functions separated" : ""}
${hasAuth ? "- ✅ Authentication system implemented" : ""}
${hasDatabase ? "- ✅ Database integration" : ""}

`;

  prompt += `\n## Key Files Analysis\n\n`;

  const configFiles = repo.files.filter((f) =>
    [
      "package.json",
      "tsconfig.json",
      "next.config.js",
      ".env.example",
    ].includes(f.path),
  );
  const authFiles = repo.files.filter((f) => f.path.includes("auth"));
  const apiFiles = repo.files.filter((f) => f.path.includes("api"));

  if (configFiles.length > 0) {
    prompt += `### Configuration Files\n`;
    configFiles.forEach((file) => {
      const content = truncateContent(file.content, CONTENT_LIMITS.config);
      prompt += `\n#### ${file.path}\n\`\`\`\n${content}\n\`\`\`\n`;
    });
  }

  if (authFiles.length > 0) {
    prompt += `\n### Authentication Files\n`;
    authFiles.forEach((file) => {
      const content = truncateContent(file.content, CONTENT_LIMITS.auth);
      prompt += `\n#### ${file.path}\n\`\`\`typescript\n${content}\n\`\`\`\n`;
    });
  }

  if (apiFiles.length > 0 && docType === "api") {
    prompt += `\n### API Routes\n`;
    apiFiles.forEach((file) => {
      const content = truncateContent(file.content, CONTENT_LIMITS.api);
      prompt += `\n#### ${file.path}\n\`\`\`typescript\n${content}\n\`\`\`\n`;
    });
  }

  const remainingFiles = repo.files.filter(
    (f) =>
      !configFiles.includes(f) &&
      !authFiles.includes(f) &&
      !apiFiles.includes(f),
  );

  if (remainingFiles.length > 0) {
    prompt += `\n### Other Important Files\n`;
    remainingFiles.forEach((file) => {
      const content = truncateContent(file.content, CONTENT_LIMITS.other);
      prompt += `\n#### ${file.path}\n\`\`\`\n${content}\n\`\`\`\n`;
    });
  }

  prompt += `\n\n---

## DOCUMENTATION REQUEST

Based on the above repository analysis, generate comprehensive **${docType.toUpperCase()}** documentation.

### Requirements:
1. Analyze the code structure and identify key features
2. Use the actual technology stack detected
3. Reference specific file paths and code patterns found
4. Include practical examples based on the actual codebase
5. Maintain professional technical writing standards
6. Ensure accuracy with the detected configurations

### Output Format:
- Use proper Markdown formatting
- Include code blocks with syntax highlighting
- Add badges for technologies used (if README)
- Create tables for structured data
- Use emojis sparingly for section headers
- Ensure the documentation is actionable and complete

Generate the ${docType} documentation now.`;

  return prompt;
}

export function buildReviewerSystemPrompt(): string {
  return `You are a senior software engineer reviewing technical documentation.

GOALS:
- Evaluate documentation quality and completeness
- Detect missing sections
- Identify outdated or incorrect information
- Suggest concrete improvements
- Highlight strengths

RULES:
- Do NOT rewrite documentation
- Do NOT generate new documentation
- Be concise and actionable
- Output STRICTLY valid JSON only

Return JSON matching this structure:
{
  "score": number (0-100),
  "summary": "brief overall assessment",
  "missingSections": ["section1", "section2"],
  "outdatedWarnings": ["warning1", "warning2"],
  "improvements": ["improvement1", "improvement2"],
  "positives": ["positive1", "positive2"]
}`;
}

export function buildReviewPrompt(data: string): string {
  return `DOCUMENTATION TO REVIEW:
"""
${data}
"""
S
Review this documentation now and return ONLY valid JSON.`;
}
