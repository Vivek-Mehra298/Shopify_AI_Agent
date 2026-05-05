// src/agent/utils.ts
import Groq from "groq-sdk";

export function extractJSON<T>(text: string): T {
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in response");
  return JSON.parse(match[0]) as T;
}

export async function callClaude(
  client: Groq,
  system: string,
  userMessage: string,
  maxTokens = 2000,
  _useWebSearch = false   // Groq doesn't support web search — ignored
): Promise<string> {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: system },
      { role: "user", content: userMessage },
    ],
  });

  return response.choices[0]?.message?.content ?? "";
}