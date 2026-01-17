import { Copy, Check, RotateCcw, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ResultsScreenProps {
  originalMessage: string;
  situation: string;
  onBack: () => void;
  onStartOver: () => void;
}

// Typ danych, których oczekujemy od AI
interface AIResponse {
  improved: string;
  explanation: string;
  alternatives: {
    calm: string;
    assertive: string;
    empathetic: string;
  };
}

export function ResultsScreen({ originalMessage, situation, onBack, onStartOver }: ResultsScreenProps) {
  const [selectedTone, setSelectedTone] = useState<'calm' | 'assertive' | 'empathetic'>('calm');
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedAlt, setCopiedAlt] = useState(false);
  
  // Stany do obsługi API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIResponse | null>(null);

  useEffect(() => {
    generateResponse();
  }, []);

  const generateResponse = async () => {
    setLoading(true);
    setError(null);

    // Prompt inżynieria level: Hackathon Speedrun
    // Prosimy model o JSON, żeby łatwo wyświetlić to w Twoim UI.
    const systemPrompt = `You are an expert communication coach.
    Analyze the user's DRAFT message in the context of "${situation}".
    Your goal is to rewrite it to be effective, empathetic, and professional.
    
    You MUST return ONLY a valid JSON object. Do not include markdown formatting like \`\`\`json.
    
    The JSON structure must be exactly:
    {
      "improved": "The main improved version of the message",
      "explanation": "One sentence explaining why this version is better",
      "alternatives": {
        "calm": "A very calm variation",
        "assertive": "A firm but polite variation",
        "empathetic": "A variation focused on feelings"
      }
    }`;

    const userPrompt = `DRAFT: "${originalMessage}"`;

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "mistral", // Zmień na 'llama3' lub inny model, który masz!
          prompt: `${systemPrompt}\n\n${userPrompt}`,
          stream: false,
          format: "json" // Wymusza JSON na nowszych wersjach Ollamy
        })
      });

      if (!response.ok) throw new Error('Failed to connect to Ollama');

      const data = await response.json();
      
      // Parsowanie odpowiedzi (czasem modele dodają tekst przed/po JSON)
      let parsedData: AIResponse;
      try {
        parsedData = JSON.parse(data.response);
      } catch (e) {
        // Fallback jeśli JSON jest uszkodzony - ratujemy demo!
        console.warn("JSON parse error, attempting cleanup", data.response);
        const cleanJson = data.response.replace(/```json|```/g, '').trim();
        parsedData = JSON.parse(cleanJson);
      }

      setResult(parsedData);
    } catch (err) {
      console.error(err);
      setError("Model is thinking too hard or offline. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, isMain: boolean) => {
    await navigator.clipboard.writeText(text);
    if (isMain) {
      setCopiedMain(true);
      setTimeout(() => setCopiedMain(false), 2000);
    } else {
      setCopiedAlt(true);
      setTimeout(() => setCopiedAlt(false), 2000);
    }
  };

  // 1. EKRAN ŁADOWANIA
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <h3 className="text-xl font-medium text-gray-700">Refining your vibe...</h3>
        <p className="text-gray-500 mt-2">Connecting to local AI brain</p>
      </div>
    );
  }

  // 2. EKRAN BŁĘDU (żebyś mógł kliknąć "Try again" na demo)
  if (error || !result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-medium text-gray-800">Connection Error</h3>
        <p className="text-gray-500 mt-2 mb-6">{error}</p>
        <button 
          onClick={generateResponse}
          className="bg-indigo-500 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-600 transition"
        >
          Try Again
        </button>
        <button onClick={onBack} className="mt-4 text-gray-400 text-sm">Go Back</button>
      </div>
    );
  }

  // 3. EKRAN WYNIKÓW (To co miałeś wcześniej, ale z danymi z 'result')
  return (
    <div className="flex flex-col min-h-screen px-6 py-12 pb-24">
      <div className="max-w-md w-full mx-auto flex-1 flex flex-col">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-600 transition-colors mb-4"
          >
            ← Back
          </button>
          <h2 className="text-3xl mb-2">Here's your improved message</h2>
        </div>

        <div className="space-y-6">
          {/* Original Message */}
          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-sm text-gray-500 mb-2">Original</p>
            <p className="text-gray-700">{originalMessage}</p>
          </div>

          {/* Improved Message */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl border-2 border-indigo-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-indigo-700">Improved</p>
              <button
                onClick={() => copyToClipboard(result.improved, true)}
                className="text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                {copiedMain ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-gray-900 leading-relaxed font-medium">{result.improved}</p>
          </div>

          {/* Explanation */}
          <div className="bg-white p-5 rounded-2xl border-2 border-gray-100 shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-2">Why it works</p>
            <p className="text-gray-600 leading-relaxed italic">"{result.explanation}"</p>
          </div>

          {/* Alternative Tones */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Try a different tone</p>
            <div className="flex gap-2 mb-4">
              {(['calm', 'assertive', 'empathetic'] as const).map((tone) => (
                <button
                  key={tone}
                  onClick={() => setSelectedTone(tone)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                    selectedTone === tone
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500 capitalize">{selectedTone} Version</p>
                <button
                  onClick={() => copyToClipboard(result.alternatives[selectedTone], false)}
                  className="text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  {copiedAlt ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-gray-800 leading-relaxed">{result.alternatives[selectedTone]}</p>
            </div>
          </div>

          {/* Start Over Button */}
          <button
            onClick={onStartOver}
            className="w-full mt-4 border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 text-gray-700 px-8 py-4 rounded-full flex items-center justify-center gap-2 transition-all text-lg font-medium"
          >
            <RotateCcw className="w-5 h-5" />
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}