import React from 'react';
import { SCENES } from '../data/destinations';

export default function BackgroundCanvas({ currentIndex, activeScene }) {
  return (
    <div className="global-background-canvas" aria-hidden="true">
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

        {/* Living Atmospheric Animation Layers (Floating clouds in Himalayas, Waves in Goa, Sacred embers in Madurai, etc.) */}
        <div className={`hero-living-atmosphere atmosphere-${activeScene?.animationType || 'default'}`}>
          {activeScene?.animationType === 'clouds' && (
            <>
              <div className="ambient-cloud-layer cloud-layer-1" />
              <div className="ambient-cloud-layer cloud-layer-2" />
            </>
          )}
          {activeScene?.animationType === 'waves' && (
            <>
              <div className="ambient-wave-shimmer" />
              <div className="ambient-coastal-tide-layer" />
            </>
          )}
          {activeScene?.animationType === 'temple-embers' && (
            <>
              <div className="ambient-temple-glow" />
              <div className="ambient-sacred-embers">
                <span className="ember-particle ember-1" />
                <span className="ember-particle ember-2" />
                <span className="ember-particle ember-3" />
                <span className="ember-particle ember-4" />
                <span className="ember-particle ember-5" />
              </div>
            </>
          )}
          {activeScene?.animationType === 'valley-mist' && (
            <>
              <div className="ambient-valley-mist mist-1" />
              <div className="ambient-valley-mist mist-2" />
            </>
          )}
          {activeScene?.animationType === 'twilight-shimmer' && (
            <>
              <div className="ambient-lake-shimmer" />
              <div className="ambient-twilight-aura" />
            </>
          )}
        </div>

        {/* Subtle Natural Vignette Scrim for Contrast & Legibility */}
        <div className="hero-dark-vignette" />
      </div>
    </div>
  );
}
