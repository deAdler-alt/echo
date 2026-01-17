import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface InputScreenProps {
  situation: string;
  onSubmit: (message: string) => void;
  onBack: () => void;
}

export function InputScreen({ situation, onSubmit, onBack }: InputScreenProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim()) {
      onSubmit(message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen px-6 py-12">
      <div className="max-w-md w-full mx-auto flex-1 flex flex-col">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-600 transition-colors mb-4"
          >
            ← Back
          </button>
          <h2 className="text-3xl mb-2">What do you want to say?</h2>
          <p className="text-gray-500 capitalize">
            {situation === 'work' ? 'Work situation' : situation}
          </p>
        </div>

        <div className="flex-1 flex flex-col">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 min-h-[200px] p-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none resize-none text-lg"
          />

          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={!message.trim()}
              className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-4 rounded-full flex items-center justify-center gap-2 transition-colors text-lg font-medium"
            >
              Improve Message
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
