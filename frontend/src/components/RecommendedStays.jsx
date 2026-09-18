import React, { useState } from 'react';
import { RECOMMENDED_STAYS } from '../data/destinations';
import { Heart, Star, MapPin, ArrowUpRight } from 'lucide-react';

export default function RecommendedStays({ onSelectStay }) {
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="recommended-section-wrapper">
      <div className="recommended-container">
        
        {/* Section Header */}
        <div className="recommended-header-row">
          <div>
            <span className="recommended-eyebrow">Handpicked Sanctuaries</span>
            <h2 className="recommended-title">Recommended Places to Stay</h2>
          </div>
          
          <button className="recommended-see-all-btn">
            <span>See All</span>
            <ArrowUpRight className="see-all-icon" />
          </button>
        </div>

        {/* Stay Cards Grid */}
        <div className="recommended-cards-grid">
          {RECOMMENDED_STAYS.map((stay) => {
            const isFav = !!favorites[stay.id];
            return (
              <div
                key={stay.id}
                className="stay-luxury-card"
                onClick={() => onSelectStay?.(stay)}
              >
                {/* Image & Badges */}
                <div className="stay-image-box">
                  <img
                    src={stay.image}
                    alt={stay.name}
                    className="stay-photo"
                    loading="lazy"
                  />
                  
                  {/* Price Badge */}
                  <div className="stay-price-badge">
                    <span className="stay-price-amount">{stay.price}</span>
                    <span className="stay-price-unit">/{stay.period}</span>
                  </div>

                  {/* Heart Wishlist Button */}
                  <button
                    onClick={(e) => toggleFavorite(stay.id, e)}
                    className={`stay-wishlist-btn ${isFav ? 'active' : ''}`}
                    aria-label={`Save ${stay.name} to wishlist`}
                  >
                    <Heart className={`heart-icon ${isFav ? 'filled' : ''}`} />
                  </button>

                  {/* Category Pill */}
                  <div className="stay-badge-pill">
                    {stay.badge}
                  </div>
                </div>

                {/* Info Content */}
                <div className="stay-info-content">
                  <div className="stay-title-row">
                    <h3 className="stay-name">{stay.name}</h3>
                    <div className="stay-rating-pill">
                      <Star className="star-icon" />
                      <span>{stay.rating}</span>
                    </div>
                  </div>

                  <div className="stay-location-row">
                    <MapPin className="stay-pin-icon" />
                    <span>{stay.location}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
