export function safeParseJSON(raw: string) {
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error("RAW AI RESPONSE:", raw);
      throw new Error("No JSON object found in AI response");
    }

    let jsonStr = match[0];
    jsonStr = fixCommonJSONIssues(jsonStr);
    return JSON.parse(jsonStr);
  } catch (error: any) {
    console.error("JSON Parse Error:", error.message);
    console.error("Attempted to parse:", raw.substring(0, 500));

    try {
      const cleaned = aggressiveJSONClean(raw);
      return JSON.parse(cleaned);
    } catch (secondError: any) {
      throw new Error(
        `AI returned invalid JSON: ${error.message}. Response preview: ${raw.substring(0, 200)}...`,
      );
    }
  }
}

function fixCommonJSONIssues(jsonStr: string): string {
  jsonStr = jsonStr.replace(/,(\s*[}\]])/g, "$1");
  jsonStr = jsonStr.replace(/([^\\])"([^"]*[^\\])"([^:])/g, '$1\\"$2\\"$3');
  jsonStr = jsonStr.replace(/[\x00-\x1F\x7F]/g, "");
  jsonStr = jsonStr.replace(/\n/g, "\\n");
  jsonStr = jsonStr.replace(/\r/g, "\\r");
  jsonStr = jsonStr.replace(/\t/g, "\\t");
  return jsonStr;
}

function aggressiveJSONClean(raw: string): string {
  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No valid JSON object boundaries found");
  }

  let jsonStr = raw.substring(firstBrace, lastBrace + 1);
  jsonStr = fixUnterminatedStrings(jsonStr);
  jsonStr = fixCommonJSONIssues(jsonStr);
  return jsonStr;
}

function fixUnterminatedStrings(jsonStr: string): string {
  const lines = jsonStr.split("\n");
  const fixed: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const quoteCount = (line.match(/"/g) || []).length;

    if (quoteCount % 2 !== 0) {
      if (line.includes(":")) {
        if (line.includes(",")) {
          line = line.replace(/,\s*$/, '",');
        } else if (
          i === lines.length - 1 ||
          lines[i + 1].trim().startsWith("}")
        ) {
          line = line + '"';
        }
      }
    }

    fixed.push(line);
  }

  return fixed.join("\n");
}

export function safeParseJSONWithFallback<T>(raw: string, fallback: T): T {
  try {
    return safeParseJSON(raw) as T;
  } catch (error) {
    console.error("Failed to parse JSON, using fallback:", error);
    return fallback;
  }
}
