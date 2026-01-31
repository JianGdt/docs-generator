import Groq from "groq-sdk";
import { ENV } from "../../constants";

let groqInstance: Groq | null = null;

export function getGroqClient(): Groq {
  if (!groqInstance) {
    if (!ENV.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    groqInstance = new Groq({
      apiKey: ENV.GROQ_API_KEY,
    });
  }

  return groqInstance;
}

export function resetGroqClient(): void {
  groqInstance = null;
}

export function isGroqConfigured(): boolean {
  return Boolean(ENV.GROQ_API_KEY);
}
