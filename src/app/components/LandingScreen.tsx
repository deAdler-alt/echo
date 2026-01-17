import { ArrowRight } from 'lucide-react';

interface LandingScreenProps {
  onStart: () => void;
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full">
        <div className="mb-8">
          <h1 className="text-6xl mb-4 text-center">Echo</h1>
          <p className="text-xl text-gray-600 text-center">Say it better.</p>
        </div>
        
        <p className="text-center text-gray-500 mb-12 max-w-sm">
          An AI assistant that helps you rephrase what you want to say into more empathetic and effective communication.
        </p>
        
        <button
          onClick={onStart}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-full flex items-center gap-2 transition-colors text-lg font-medium"
        >
          Get Started
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
