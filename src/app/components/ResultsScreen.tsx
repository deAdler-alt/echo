import { useEffect, useMemo, useState } from "react";
import type { EchoResult, Situation, Tone } from "../lib/echoTypes";
import { improveMessage } from "../lib/llm";

interface ResultsScreenProps {
  situation: string;
  originalMessage: string;
  onBack: () => void;
}

export default function ResultsScreen({ situation, originalMessage, onBack }: ResultsScreenProps) {
  const [selectedTone, setSelectedTone] = useState<Tone>("calm");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EchoResult | null>(null);

  const situationSafe = useMemo(() => situation as Situation, [situation]);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await improveMessage({
        situation: situationSafe,
        originalMessage,
      });
      setResult(res);
    } catch (e: any) {
      setResult(null);
      setError(e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!originalMessage?.trim()) return;
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [situationSafe, originalMessage]);

  const toneText = result?.alternatives?.[selectedTone] ?? "";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-2xl space-y-4">
        <button className="text-sm text-gray-600 hover:text-gray-900" onClick={onBack}>
          ← Back
        </button>

        <h1 className="text-2xl font-semibold text-gray-900">Your Results</h1>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="text-sm font-medium text-gray-700">Original</h2>
          <p className="mt-2 text-gray-800 whitespace-pre-wrap">{originalMessage}</p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700">Improved</h2>
            <button
              className="text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
              onClick={run}
              disabled={loading}
            >
              Regenerate
            </button>
          </div>

          {loading && (
            <p className="mt-2 text-gray-600">Generating…</p>
          )}

          {error && (
            <div className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <div className="font-medium">Generation error</div>
              <div className="mt-1">{error}</div>
              <div className="mt-2 text-xs text-red-600">
                Tip: ensure Ollama is running and the model is pulled.
              </div>
            </div>
          )}

          {!loading && !error && result && (
            <p className="mt-2 text-gray-800 whitespace-pre-wrap">{result.improved}</p>
          )}
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="text-sm font-medium text-gray-700">Why this works</h2>
          {!loading && !error && result ? (
            <p className="mt-2 text-gray-800 whitespace-pre-wrap">{result.explanation}</p>
          ) : (
            <p className="mt-2 text-gray-600">—</p>
          )}
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700">Alternative tones</h2>

            <div className="flex gap-2">
              {(["calm", "assertive", "empathetic"] as Tone[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTone(t)}
                  className={[
                    "rounded-full px-3 py-1 text-sm",
                    selectedTone === t ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                  ].join(" ")}
                  disabled={!result}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {!loading && !error && result ? (
            <p className="mt-2 text-gray-800 whitespace-pre-wrap">{toneText}</p>
          ) : (
            <p className="mt-2 text-gray-600">—</p>
          )}
        </div>
      </div>
    </div>
  );
}
