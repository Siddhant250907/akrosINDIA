import React, { useState, useEffect } from 'react';
import { SCENES } from '../data/destinations';
import Navbar from './Navbar';
import { ArrowRight } from 'lucide-react';

export default function Hero({ onNavigate, onPlanTrip }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeScene = SCENES[currentIndex];

  // Slideshow automatically and continuously repeats in an endless loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SCENES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-viewport-frame">
      {/* Floating Cinematic Rounded Hero Canvas */}
      <div className="hero-floating-canvas">
        
        {/* Background Images with smooth crossfade & slow cinematic zoom (Endless repeat slideshow) */}
        <div className="hero-photographic-layers">
          {SCENES.map((scene, idx) => (
            <div
              key={scene.id}
              className={`hero-image-slide ${idx === currentIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${scene.image})` }}
              aria-hidden={idx !== currentIndex}
            />
          ))}

          {/* Vignette & Soft Mist Gradient Base */}
          <div className="hero-dark-vignette" />
          <div className="hero-soft-mist-base" />
        </div>

        {/* Minimal Navigation Bar inside Hero Header */}
        <Navbar activePage="Home" onNavigate={onNavigate} />

        {/* Hero Core Content */}
        <div className="hero-stage-content">
          <div className="hero-editorial-row hero-single-column">
            
            {/* Main Narrative Column */}
            <div className="hero-typography-block">
              
              {/* PERMANENT TITLE: "akrosINDIA" strictly matching screenshot font and next-level faded shadow */}
              <h1 className="hero-permanent-title" data-text="akrosINDIA">
                <span className="brand-akros">akros</span><span className="brand-india">INDIA</span>
              </h1>

              {/* Small Location Name (secondary and much smaller, with smooth slide transition) */}
              <div
                className="hero-location-subheading hero-transition-text"
                key={`loc-${activeScene.id}`}
              >
                <span className="location-pulse-dot" />
                <span className="location-label-text">{activeScene.locationName}</span>
                <span className="location-region-divider">•</span>
                <span className="location-scene-tag">{activeScene.accentNote}</span>
              </div>

              {/* Short Supporting Sentence with smooth slide transition */}
              <p
                className="hero-short-description hero-transition-text"
                key={`desc-${activeScene.id}`}
              >
                {activeScene.description}
              </p>

              {/* Action Button: [ Plan Your Trip ] — Main CTA */}
              <div className="hero-action-line">
                <button
                  onClick={() => onPlanTrip?.(activeScene)}
                  className="hero-primary-cta"
                  id="btn-plan-your-trip"
                >
                  <span>Plan Your Trip</span>
                  <div className="cta-arrow-circle">
                    <ArrowRight className="cta-arrow-icon" />
                  </div>
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
