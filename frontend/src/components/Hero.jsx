import React from 'react';
import { SCENES } from '../data/destinations';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Hero({ onPlanTrip, activeScene, currentIndex, setCurrentIndex }) {
  const { t, dict } = useLanguage();
  const scene = activeScene || SCENES[0];

  // Resolve translated scene narrative if available
  const sceneTranslations = dict?.hero?.slides?.[scene.id];
  const locationName = sceneTranslations?.name || scene.locationName;
  const accentNote = sceneTranslations?.note || scene.accentNote;
  const description = sceneTranslations?.desc || scene.description;

  return (
    <div className="hero-stage-content hero-full-screen-stage">
      <div className="hero-editorial-row hero-single-column">
        
        {/* Main Narrative Column */}
        <div className="hero-typography-block">
          
          {/* PERMANENT TITLE: "akrosINDIA" with ethereal faded blend font style */}
          <h1 className="hero-permanent-title hero-title-fadein" data-text="akrosINDIA">
            <span className="brand-akros">akros</span><span className="brand-india">INDIA</span>
          </h1>

          {/* Small Location Name */}
          <div
            className="hero-location-subheading hero-transition-text"
            key={`loc-${scene.id}`}
          >
            <span className="location-pulse-dot" />
            <span className="location-label-text">{locationName}</span>
            <span className="location-region-divider">•</span>
            <span className="location-scene-tag">{accentNote}</span>
          </div>

          {/* Short Supporting Sentence */}
          <p
            className="hero-short-description hero-transition-text"
            key={`desc-${scene.id}`}
          >
            {description}
          </p>

          {/* Action Button: [ Plan Your Trip ] — Main CTA */}
          <div className="hero-action-line">
            <button
              onClick={() => onPlanTrip?.(scene)}
              className="hero-primary-cta glass-cta"
              id="btn-plan-your-trip"
            >
              <span>{t('hero.planTripCta', 'Plan Your Trip')}</span>
              <div className="cta-arrow-circle">
                <ArrowRight className="cta-arrow-icon" />
              </div>
            </button>
          </div>

        </div>

      </div>

      {/* Minimal Slide Indicators */}
      <div className="hero-slide-track">
        {SCENES.map((s, idx) => {
          const sTrans = dict?.hero?.slides?.[s.id];
          const sName = sTrans?.name || s.locationName;
          return (
            <button
              key={s.id}
              onClick={() => setCurrentIndex?.(idx)}
              className={`slide-track-pill ${idx === currentIndex ? 'active' : ''}`}
              aria-label={`Go to slide ${sName}`}
            >
              <span className="track-fill" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
