import type { EchoResult, ImproveMessageInput } from "./echoTypes";
import { buildEchoSystemPrompt, buildEchoUserPrompt } from "./prompt";

const DEFAULT_MODEL = "llama3.1:8b";
const OLLAMA_CHAT_ENDPOINT = "/ollama/api/chat";

function tryParseJsonObject(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) {
      const slice = text.slice(start, end + 1);
      try {
        return JSON.parse(slice);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function isEchoResult(x: any): x is EchoResult {
  return (
    x &&
    typeof x === "object" &&
    typeof x.improved === "string" &&
    typeof x.explanation === "string" &&
    x.alternatives &&
    typeof x.alternatives === "object" &&
    typeof x.alternatives.calm === "string" &&
    typeof x.alternatives.assertive === "string" &&
    typeof x.alternatives.empathetic === "string"
  );
}

async function callOllamaChat(rawPrompt: { system: string; user: string }, model = DEFAULT_MODEL): Promise<string> {
  const res = await fetch(OLLAMA_CHAT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        { role: "system", content: rawPrompt.system },
        { role: "user", content: rawPrompt.user },
      ],
      // Dla stabilności demo
      options: {
        temperature: 0.3,
        top_p: 0.9,
      },
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Ollama HTTP ${res.status}. ${txt}`.trim());
  }

  const data = (await res.json()) as any;
  const content = data?.message?.content;

  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Ollama returned empty content.");
  }
  return content.trim();
}

export async function improveMessage(input: ImproveMessageInput, opts?: { model?: string }): Promise<EchoResult> {
  const system = buildEchoSystemPrompt();
  const user = buildEchoUserPrompt(input);
  const model = opts?.model ?? DEFAULT_MODEL;

  // Retry #1: normal prompt
  let text = await callOllamaChat({ system, user }, model);
  let parsed = tryParseJsonObject(text);

  if (isEchoResult(parsed)) return parsed;

  // Retry #2: “hard” correction prompt
  const repairUser = [
    "Your previous output was invalid.",
    "Return ONLY valid JSON with the required schema. Do not add any other text.",
    "Required schema:",
    `{"improved":"...","explanation":"...","alternatives":{"calm":"...","assertive":"...","empathetic":"..."}}`,
    "Now, generate the JSON for this same input:",
    user,
  ].join("\n");

  text = await callOllamaChat({ system, user: repairUser }, model);
  parsed = tryParseJsonObject(text);

  if (isEchoResult(parsed)) return parsed;

  throw new Error("Model did not return valid JSON. Try a different model or retry.");
}
