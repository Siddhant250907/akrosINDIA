import React, { useState } from 'react';
import Hero from '../components/Hero';

export default function Home({ onNavigate, activeScene, currentIndex, setCurrentIndex }) {
  const [toastMessage, setToastMessage] = useState(null);

  const handlePlanTrip = (scene) => {
    setToastMessage(`Curating bespoke journey for ${scene ? scene.locationName : 'akrosINDIA'}...`);
    setTimeout(() => {
      setToastMessage(null);
      onNavigate?.('Plan Your Trip');
    }, 1200);
  };

  return (
    <main className="home-minimal-page">
      {/* Subtle Toast Feedback */}
      {toastMessage && (
        <div className="luxury-toast glass-toast animate-fade-in">
          ✨ {toastMessage}
        </div>
      )}

      {/* Cinematic Hero Stage */}
      <Hero
        onNavigate={onNavigate}
        onPlanTrip={handlePlanTrip}
        activeScene={activeScene}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </main>
  );
}
