import { useState } from 'react';
import { LandingScreen } from '@/app/components/LandingScreen';
import { SituationScreen } from '@/app/components/SituationScreen';
import { InputScreen } from '@/app/components/InputScreen';
import { ResultsScreen } from '@/app/components/ResultsScreen';

type Screen = 'landing' | 'situation' | 'input' | 'results';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [selectedSituation, setSelectedSituation] = useState<string>('');
  const [userMessage, setUserMessage] = useState<string>('');

  const handleStart = () => {
    setCurrentScreen('situation');
  };

  const handleSituationSelect = (situation: string) => {
    setSelectedSituation(situation);
    setCurrentScreen('input');
  };

  const handleMessageSubmit = (message: string) => {
    setUserMessage(message);
    setCurrentScreen('results');
  };

  const handleStartOver = () => {
    setSelectedSituation('');
    setUserMessage('');
    setCurrentScreen('landing');
  };

  const handleBackToSituation = () => {
    setCurrentScreen('situation');
  };

  const handleBackToInput = () => {
    setCurrentScreen('input');
  };

  const handleBackToLanding = () => {
    setCurrentScreen('landing');
  };

  return (
    <div className="min-h-screen bg-white">
      {currentScreen === 'landing' && <LandingScreen onStart={handleStart} />}
      {currentScreen === 'situation' && (
        <SituationScreen onSelect={handleSituationSelect} onBack={handleBackToLanding} />
      )}
      {currentScreen === 'input' && (
        <InputScreen
          situation={selectedSituation}
          onSubmit={handleMessageSubmit}
          onBack={handleBackToSituation}
        />
      )}
      {currentScreen === 'results' && (
        <ResultsScreen
          originalMessage={userMessage}
          situation={selectedSituation}
          onBack={handleBackToInput}
          onStartOver={handleStartOver}
        />
      )}
    </div>
  );
}
