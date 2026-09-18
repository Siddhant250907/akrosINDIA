import React from 'react';
import {
  MapPin,
  Clock,
  Navigation,
  Compass,
  ArrowRight,
  Sparkles,
  Plane,
  Train,
  Bus,
  Car,
  CheckCircle2,
  Calendar,
  Wallet,
  ArrowLeft,
  Share2,
} from 'lucide-react';

export default function Results({ tripData, onEdit, onNavigate }) {
  const {
    startLocation = 'New Delhi',
    destination = 'Udaipur, Rajasthan',
    budget = '₹65,000',
    duration = '5 Days',
    travelMode = 'Flight',
    interests = ['Heritage', 'Nature', 'Relaxation'],
  } = tripData || {};

  const travelModeIcons = {
    Flight: Plane,
    Train: Train,
    Bus: Bus,
    Car: Car,
  };
  const ModeIcon = travelModeIcons[travelMode] || Compass;

  // Calculate realistic distance and time based on destination
  const isSouthOrEast = destination.includes('Assam') || destination.includes('Madurai') || destination.includes('Coorg');
  const distance = isSouthOrEast ? '1,840 km' : '660 km';
  const travelTime = travelMode === 'Flight' ? '1 hr 25 mins' : travelMode === 'Train' ? '9 hrs 30 mins' : travelMode === 'Car' ? '11 hrs' : '14 hrs';

  return (
    <div className="inner-page-container animate-fade-in">
      {/* Route Header Banner */}
      <div className="results-header-card">
        <div className="results-top-bar">
          <button onClick={onEdit} className="back-link-btn">
            <ArrowLeft size={16} />
            <span>Modify Preferences</span>
          </button>
          
          <div className="trip-status-pill">
            <Sparkles size={13} className="text-amber-300" />
            <span>Curated Expedition Ready</span>
          </div>
        </div>

        <div className="results-route-summary">
          <div className="route-endpoints">
            <div className="endpoint-node">
              <span className="node-tag">Origin</span>
              <h2 className="node-city">{startLocation}</h2>
            </div>

            <div className="route-connector-vector">
              <div className="route-line" />
              <div className="route-icon-badge">
                <ModeIcon size={16} />
              </div>
              <div className="route-line" />
            </div>

            <div className="endpoint-node">
              <span className="node-tag">Destination</span>
              <h2 className="node-city">{destination}</h2>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="route-metrics-bar">
            <div className="metric-pill">
              <Navigation size={14} className="metric-icon" />
              <span className="metric-label">Distance:</span>
              <strong className="metric-value">{distance}</strong>
            </div>
            <div className="metric-pill">
              <Clock size={14} className="metric-icon" />
              <span className="metric-label">Travel Time:</span>
              <strong className="metric-value">{travelTime}</strong>
            </div>
            <div className="metric-pill">
              <Calendar size={14} className="metric-icon" />
              <span className="metric-label">Duration:</span>
              <strong className="metric-value">{duration}</strong>
            </div>
            <div className="metric-pill">
              <Wallet size={14} className="metric-icon" />
              <span className="metric-label">Budget Target:</span>
              <strong className="metric-value">{budget}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Styled Luxury Map Area Placeholder */}
      <div className="map-placeholder-card">
        <div className="map-background-canvas">
          {/* Topographic Contour Lines Decoration */}
          <div className="map-contours" />
          
          {/* Floating Route Pin Point A */}
          <div className="map-marker-pin pin-a">
            <div className="pin-pulse" />
            <div className="pin-box">
              <span className="pin-point">A</span>
              <span className="pin-name">{startLocation}</span>
            </div>
          </div>

          {/* Stylized Curved Route Line */}
          <svg className="map-route-svg" viewBox="0 0 600 200" preserveAspectRatio="none">
            <path
              d="M 100 120 Q 300 30 500 90"
              fill="none"
              stroke="#ad5c3e"
              strokeWidth="2.5"
              strokeDasharray="6,6"
              className="route-svg-path"
            />
          </svg>

          {/* Floating Route Pin Point B */}
          <div className="map-marker-pin pin-b">
            <div className="pin-pulse pin-pulse-gold" />
            <div className="pin-box pin-box-active">
              <MapPin size={14} />
              <span className="pin-name">{destination}</span>
            </div>
          </div>

          <div className="map-legend-overlay">
            <Compass size={14} />
            <span>Interactive Geodesic Track • Cartographic View</span>
          </div>
        </div>
      </div>

      {/* Comparative Plans: Preferred Plan vs. Recommended Plan */}
      <div className="plans-comparison-grid">
        
        {/* Plan 1: Preferred Plan */}
        <div className="curated-plan-card preferred-plan">
          <div className="plan-card-header">
            <div className="plan-type-chip">
              <span>Your Preferred Plan</span>
            </div>
            <h3 className="plan-title">{travelMode} & Heritage Journey</h3>
            <p className="plan-subtitle">Formulated precisely around your chosen {travelMode.toLowerCase()} travel and preferred pace.</p>
          </div>

          <div className="plan-specs-list">
            <div className="spec-row">
              <span className="spec-label">Transport</span>
              <span className="spec-value">
                {travelMode === 'Flight' ? 'Non-Stop Executive Flight' : travelMode === 'Train' ? '1st AC Rajdhani / Vande Bharat' : travelMode === 'Car' ? 'Private Innova Crysta Chauffeur' : 'Volvo Multi-Axle AC Sleeper'}
              </span>
            </div>

            <div className="spec-row">
              <span className="spec-label">Stay Category</span>
              <span className="spec-value">Curated Boutique Haveli & Heritage Retreats</span>
            </div>

            <div className="spec-row">
              <span className="spec-label">Major Places</span>
              <span className="spec-value">
                {destination.includes('Goa') ? 'Fontainhas Latin Quarter, Morjim Beach, Cabo de Rama' : destination.includes('Madurai') ? 'Meenakshi Amman Temple, Thirumalai Nayakkar Mahal, Gandhi Memorial' : destination.includes('Assam') ? 'Kaziranga Buffer Zone, Heritage Tea Estate, Majuli Island' : destination.includes('Coorg') ? 'Raja’s Seat, Abbey Falls, Madikeri Fort, Coffee Plantations' : 'City Palace Complex, Jag Mandir, Saheliyon-ki-Bari'}
              </span>
            </div>

            <div className="spec-row">
              <span className="spec-label">Curated Activities</span>
              <div className="spec-activities-chips">
                {interests.map((int, i) => (
                  <span key={i} className="activity-chip">✓ {int} Immersion</span>
                ))}
                <span className="activity-chip">✓ Private Local Historian Tour</span>
              </div>
            </div>
          </div>

          <div className="plan-footer-box">
            <div className="plan-price-group">
              <span className="price-lead">Estimated Cost</span>
              <span className="price-amount">{budget}</span>
              <span className="price-caption">inclusive of taxes & passes</span>
            </div>

            <button
              onClick={() => onNavigate?.('Budget Calculator')}
              className="plan-select-btn"
            >
              <span>View Budget Breakdown</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Plan 2: Recommended Plan (Bespoke Luxury Alternative) */}
        <div className="curated-plan-card recommended-plan">
          <div className="recommended-highlight-ribbon">
            <Sparkles size={13} />
            <span>akrosINDIA Signature Recommendation</span>
          </div>

          <div className="plan-card-header">
            <div className="plan-type-chip recommended-chip">
              <span>Bespoke Curated Sanctuary</span>
            </div>
            <h3 className="plan-title">Imperial Sanctuary Experience</h3>
            <p className="plan-subtitle">Elevated bespoke itinerary featuring private luxury charters and heritage palace stays.</p>
          </div>

          <div className="plan-specs-list">
            <div className="spec-row">
              <span className="spec-label">Transport</span>
              <span className="spec-value">Private Luxury Chauffeur + Priority Chartered Transit</span>
            </div>

            <div className="spec-row">
              <span className="spec-label">Stay Category</span>
              <span className="spec-value">5-Star Palace Sanctuary (Private Pool Villa / Lake View Suite)</span>
            </div>

            <div className="spec-row">
              <span className="spec-label">Major Places</span>
              <span className="spec-value">
                {destination.includes('Goa') ? 'Private Yacht to Butterfly Island, Old Goa Cathedrals, Private Spiced Plantation' : destination.includes('Madurai') ? 'Exclusive VIP Darshan at Dawn, Royal Palace Chamber Sitar Evening' : destination.includes('Assam') ? 'Private Brahmaputra Sunset Cruise, Private Elephant Safari & Tea Tasting' : destination.includes('Coorg') ? 'Private Rainforest Coffee Estate Stay, Tadiandamol Peak Trek' : 'Private Lake Pichola Sunset Charter, Royal Crystal Gallery, Sajjangarh Monsoon Palace'}
              </span>
            </div>

            <div className="spec-row">
              <span className="spec-label">Curated Activities</span>
              <div className="spec-activities-chips">
                <span className="activity-chip gold">★ Private Chef Royal Dinner</span>
                <span className="activity-chip gold">★ Bespoke Photography Concierge</span>
                <span className="activity-chip gold">★ Ayurvedic Rejuvenation Spa</span>
              </div>
            </div>
          </div>

          <div className="plan-footer-box">
            <div className="plan-price-group">
              <span className="price-lead">Signature Package Cost</span>
              <span className="price-amount" style={{ color: '#ab583a' }}>
                ₹{parseInt(budget.replace(/[^0-9]/g, '') || 65000) > 0 ? (parseInt(budget.replace(/[^0-9]/g, '') || 65000) * 1.35).toLocaleString('en-IN') : '88,000'}
              </span>
              <span className="price-caption">all-inclusive luxury concierge</span>
            </div>

            <button
              onClick={() => onNavigate?.('Budget Calculator')}
              className="plan-select-btn signature-btn"
            >
              <span>Calculate Custom Budget</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
