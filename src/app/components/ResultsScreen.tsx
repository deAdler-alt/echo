import { Copy, Check, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface ResultsScreenProps {
  originalMessage: string;
  situation: string;
  onBack: () => void;
  onStartOver: () => void;
}

const mockResults = {
  conflict: {
    improved: "I've noticed we have different perspectives on this, and I'd really like to understand your point of view better. Can we find a time to talk through this together?",
    explanation: "This version acknowledges the disagreement without being confrontational, shows genuine interest in understanding, and invites collaboration.",
    alternatives: {
      calm: "I think there might be a misunderstanding between us. Would you be open to discussing this when we both have time?",
      assertive: "I value our relationship and I think we need to address this difference directly. Let's schedule time to work through it.",
      empathetic: "I can sense there's some tension, and I want you to know I care about resolving this in a way that works for both of us."
    }
  },
  feedback: {
    improved: "I appreciate the effort you put into this project. I noticed a few areas where we could make it even stronger—would you be open to discussing some ideas?",
    explanation: "This approach starts with genuine appreciation, frames suggestions as improvements rather than criticisms, and invites dialogue.",
    alternatives: {
      calm: "Thanks for your work on this. I have a few thoughts that might help refine it further. When would be a good time to chat?",
      assertive: "Your work shows promise, and I'd like to share specific feedback that will help you grow. Can we meet to discuss?",
      empathetic: "I know you worked hard on this, and I want to support you in making it the best it can be. Let's talk through some ideas together."
    }
  },
  dating: {
    improved: "I've really enjoyed getting to know you, and I feel like there's something special here. Would you like to continue exploring this together?",
    explanation: "This message is warm and genuine, expresses positive feelings clearly, and invites mutual participation without pressure.",
    alternatives: {
      calm: "I've had a great time with you lately. I'd like to see where this goes—how do you feel about that?",
      assertive: "I'm really interested in you and I'd like to be more intentional about spending time together. What do you think?",
      empathetic: "I feel a real connection with you and I wanted to share that. I'd love to know if you feel the same way."
    }
  },
  apology: {
    improved: "I'm truly sorry for what I did. I understand how it affected you, and I take full responsibility. I'm committed to doing better and would like to make things right.",
    explanation: "This apology is direct and sincere, demonstrates understanding of the impact, takes ownership, and offers a path forward.",
    alternatives: {
      calm: "I apologize for my actions and I recognize they were hurtful. I'd like to discuss how I can make amends.",
      assertive: "I made a mistake and I own that completely. I want to be clear that I'm sorry and I'm taking steps to ensure it doesn't happen again.",
      empathetic: "I'm so sorry—I can only imagine how this made you feel. Your feelings are valid, and I want to do whatever I can to repair our relationship."
    }
  },
  work: {
    improved: "I wanted to touch base about the project timeline. I'm running into some challenges that might affect our deadline. Could we discuss potential solutions together?",
    explanation: "This message is proactive and professional, clearly states the issue without making excuses, and invites collaborative problem-solving.",
    alternatives: {
      calm: "I'm reaching out about the project. There are a few obstacles I'm navigating, and I think it would be helpful to align on next steps.",
      assertive: "I need to discuss the project timeline with you. I've identified some challenges and I want to address them directly to stay on track.",
      empathetic: "I know we're all counting on this project timeline. I'm facing some hurdles and I wanted to be transparent so we can work through them together."
    }
  }
};

export function ResultsScreen({ originalMessage, situation, onBack, onStartOver }: ResultsScreenProps) {
  const [selectedTone, setSelectedTone] = useState<'calm' | 'assertive' | 'empathetic'>('calm');
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedAlt, setCopiedAlt] = useState(false);

  const result = mockResults[situation as keyof typeof mockResults];

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
            <p className="text-gray-900 leading-relaxed">{result.improved}</p>
          </div>

          {/* Explanation */}
          <div className="bg-white p-5 rounded-2xl border-2 border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-2">Why it works</p>
            <p className="text-gray-600 leading-relaxed">{result.explanation}</p>
          </div>

          {/* Alternative Tones */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Try a different tone</p>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setSelectedTone('calm')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTone === 'calm'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Calm
              </button>
              <button
                onClick={() => setSelectedTone('assertive')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTone === 'assertive'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Assertive
              </button>
              <button
                onClick={() => setSelectedTone('empathetic')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTone === 'empathetic'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Empathetic
              </button>
            </div>

            <div className="bg-blue-50 p-5 rounded-2xl border-2 border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-blue-700 capitalize">{selectedTone}</p>
                <button
                  onClick={() => copyToClipboard(result.alternatives[selectedTone], false)}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {copiedAlt ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-gray-900 leading-relaxed">{result.alternatives[selectedTone]}</p>
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
