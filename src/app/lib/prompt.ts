import type { ImproveMessageInput, Situation } from "./echoTypes";

function situationHint(s: Situation): string {
  switch (s) {
    case "conflict":
      return "Context: conflict de-escalation and mutual understanding.";
    case "feedback":
      return "Context: giving constructive feedback without sounding harsh.";
    case "dating":
      return "Context: dating conversation—warm, respectful, confident.";
    case "apology":
      return "Context: apology—accountability, sincerity, repair.";
    case "work":
      return "Context: professional workplace communication—clear, diplomatic.";
    default:
      return "Context: interpersonal communication.";
  }
}

export function buildEchoSystemPrompt(): string {
  return [
    "You are Echo, an expert communication coach.",
    "You must respond with STRICT JSON only (no markdown, no backticks, no extra text).",
    "Return a JSON object with exactly these keys:",
    `{"improved": string, "explanation": string, "alternatives": {"calm": string, "assertive": string, "empathetic": string}}`,
    "Rules:",
    "- Keep improved message concise (1–4 sentences).",
    "- explanation: 2–5 bullet-like sentences (but still a plain string).",
    "- alternatives must be meaningfully different tones, not minor paraphrases.",
    "- Do not include any personally identifying info or assumptions.",
  ].join("\n");
}

export function buildEchoUserPrompt(input: ImproveMessageInput): string {
  return [
    situationHint(input.situation),
    "Task: Rewrite the user's message to be clearer, more empathetic, and more effective.",
    "User's original message:",
    input.originalMessage,
    "Output: STRICT JSON only.",
  ].join("\n");
}
