import { MessageSquare, Briefcase, Heart, MessageCircle, UserCheck } from 'lucide-react';

interface SituationScreenProps {
  onSelect: (situation: string) => void;
  onBack: () => void;
}

const situations = [
  { id: 'conflict', label: 'Conflict', icon: MessageSquare, color: 'bg-rose-100 text-rose-600' },
  { id: 'feedback', label: 'Feedback', icon: MessageCircle, color: 'bg-amber-100 text-amber-600' },
  { id: 'dating', label: 'Dating', icon: Heart, color: 'bg-pink-100 text-pink-600' },
  { id: 'apology', label: 'Apology', icon: UserCheck, color: 'bg-purple-100 text-purple-600' },
  { id: 'work', label: 'Work', icon: Briefcase, color: 'bg-blue-100 text-blue-600' },
];

export function SituationScreen({ onSelect, onBack }: SituationScreenProps) {
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
          <h2 className="text-3xl mb-2">What's the situation?</h2>
          <p className="text-gray-500">Choose the context for your message</p>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          {situations.map((situation) => {
            const Icon = situation.icon;
            return (
              <button
                key={situation.id}
                onClick={() => onSelect(situation.id)}
                className="flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all text-left"
              >
                <div className={`${situation.color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-lg font-medium">{situation.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
