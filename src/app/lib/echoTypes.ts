export type Situation = "conflict" | "feedback" | "dating" | "apology" | "work";
export type Tone = "calm" | "assertive" | "empathetic";

export type EchoAlternatives = Record<Tone, string>;

export interface EchoResult {
  improved: string;
  explanation: string;
  alternatives: EchoAlternatives;
}

export interface ImproveMessageInput {
  situation: Situation;
  originalMessage: string;
}
