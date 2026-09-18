import React, { useState } from 'react';
import Hero from '../components/Hero';

export default function Home({ onNavigate }) {
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
        <div className="luxury-toast animate-fade-in">
          ✨ {toastMessage}
        </div>
      )}

      {/* Cinematic Hero dominating the entire viewport */}
      <Hero onNavigate={onNavigate} onPlanTrip={handlePlanTrip} />
    </main>
  );
}
