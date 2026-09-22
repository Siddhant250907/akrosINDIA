import React, { useState } from 'react';
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
  Calendar,
  Wallet,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Check,
  Sun,
  Sunset,
  Moon
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Results({ tripData, apiResult, onEdit, onNavigate }) {
  const { t } = useLanguage();
  const [expandedPlan, setExpandedPlan] = useState('preferred'); // 'preferred' | 'recommended' | null

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

  // Real backend metrics or fallback estimation
  const isSouthOrEast = destination.includes('Assam') || destination.includes('Madurai') || destination.includes('Coorg');
  const fallbackDistance = isSouthOrEast ? '1,840 km' : '660 km';
  const fallbackTime = travelMode === 'Flight' ? '1 hr 25 mins' : travelMode === 'Train' ? '9 hrs 30 mins' : travelMode === 'Car' ? '11 hrs' : '14 hrs';

  const distance = apiResult?.route?.distance || fallbackDistance;
  const travelTime = apiResult?.route?.travelTime || fallbackTime;

  const pref = apiResult?.preferredPlan;
  const rec = apiResult?.recommendedPlan;

  const toggleItinerary = (planType) => {
    setExpandedPlan((prev) => (prev === planType ? null : planType));
  };

  return (
    <div className="inner-page-container animate-fade-in">
      {/* Route Header Banner */}
      <div className="results-header-card">
        <div className="results-top-bar">
          <button onClick={onEdit} className="back-link-btn">
            <ArrowLeft size={16} />
            <span>{t('results.modify', 'Modify Preferences')}</span>
          </button>
          
          <div className="trip-status-pill">
            <Sparkles size={13} className="text-amber-300" />
            <span>{apiResult ? 'Verified Backend Expedition' : t('results.generatedBadge', 'Curated Expedition Ready')}</span>
          </div>
        </div>

        <div className="results-route-summary">
          <div className="route-endpoints">
            <div className="endpoint-node">
              <span className="node-tag">{t('results.origin', 'Origin')}</span>
              <h2 className="node-city">{apiResult?.trip?.startLocation || startLocation}</h2>
            </div>

            <div className="route-connector-vector">
              <div className="route-line" />
              <div className="route-icon-badge">
                <ModeIcon size={16} />
              </div>
              <div className="route-line" />
            </div>

            <div className="endpoint-node">
              <span className="node-tag">{t('results.destination', 'Destination')}</span>
              <h2 className="node-city">{apiResult?.trip?.destination || destination}</h2>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="route-metrics-bar">
            <div className="metric-pill">
              <Navigation size={14} className="metric-icon" />
              <span className="metric-label">{t('results.approxDistance', 'Distance')}:</span>
              <strong className="metric-value">{distance}</strong>
            </div>
            <div className="metric-pill">
              <Clock size={14} className="metric-icon" />
              <span className="metric-label">{t('results.travelTime', 'Travel Time')}:</span>
              <strong className="metric-value">{travelTime}</strong>
            </div>
            <div className="metric-pill">
              <Calendar size={14} className="metric-icon" />
              <span className="metric-label">{t('planTrip.step4', 'Duration')}:</span>
              <strong className="metric-value">{apiResult?.trip?.duration ? `${apiResult.trip.duration} Days` : duration}</strong>
            </div>
            <div className="metric-pill">
              <Wallet size={14} className="metric-icon" />
              <span className="metric-label">{t('results.estBudget', 'Budget')}:</span>
              <strong className="metric-value">{apiResult?.trip?.budget ? `₹${apiResult.trip.budget.toLocaleString('en-IN')}` : budget}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Styled Luxury Map Area Placeholder */}
      <div className="map-placeholder-card">
        <div className="map-background-canvas">
          <div className="map-contours" />
          
          {/* Floating Route Pin Point A */}
          <div className="map-marker-pin pin-a">
            <div className="pin-pulse" />
            <div className="pin-box">
              <span className="pin-point">A</span>
              <span className="pin-name">{apiResult?.trip?.startLocation || startLocation}</span>
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
              <span className="pin-name">{apiResult?.trip?.destination || destination}</span>
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
            <h3 className="plan-title">{pref?.planTitle || `${travelMode} & Heritage Journey`}</h3>
            <p className="plan-subtitle">
              {pref?.explanation || pref?.tagline || `Formulated precisely around your chosen ${travelMode.toLowerCase()} travel and preferred pace.`}
            </p>
          </div>

          <div className="plan-specs-list">
            <div className="spec-row">
              <span className="spec-label">Transport</span>
              <span className="spec-value">
                {pref?.transport
                  ? `${pref.transport.provider} • ${pref.transport.transitDetails} (${pref.transport.travelTime})`
                  : (travelMode === 'Flight' ? 'Non-Stop Executive Flight' : travelMode === 'Train' ? '1st AC Rajdhani / Vande Bharat' : travelMode === 'Car' ? 'Private Innova Crysta Chauffeur' : 'Volvo Multi-Axle AC Sleeper')}
              </span>
            </div>

            <div className="spec-row">
              <span className="spec-label">Stay Sanctuary</span>
              <span className="spec-value">
                {pref?.stay
                  ? `${pref.stay.name} (${pref.stay.tier}) • ₹${pref.stay.pricePerNight?.toLocaleString('en-IN')}/night • ${pref.stay.rating}★`
                  : 'Curated Boutique Haveli & Heritage Retreats'}
              </span>
            </div>

            <div className="spec-row">
              <span className="spec-label">Major Places</span>
              <span className="spec-value">
                {pref?.places && pref.places.length > 0
                  ? pref.places.map((p) => p.name).join(', ')
                  : (destination.includes('Goa') ? 'Fontainhas Latin Quarter, Morjim Beach, Cabo de Rama' : destination.includes('Madurai') ? 'Meenakshi Amman Temple, Thirumalai Nayakkar Mahal, Gandhi Memorial' : destination.includes('Assam') ? 'Kaziranga Buffer Zone, Heritage Tea Estate, Majuli Island' : destination.includes('Coorg') ? 'Raja’s Seat, Abbey Falls, Madikeri Fort, Coffee Plantations' : 'City Palace Complex, Jag Mandir, Saheliyon-ki-Bari')}
              </span>
            </div>

            <div className="spec-row">
              <span className="spec-label">Curated Activities</span>
              <div className="spec-activities-chips">
                {pref?.activities && pref.activities.length > 0 ? (
                  pref.activities.map((act, i) => (
                    <span key={i} className="activity-chip">✓ {act.name}</span>
                  ))
                ) : (
                  <>
                    {interests.map((int, i) => (
                      <span key={i} className="activity-chip">✓ {int} Immersion</span>
                    ))}
                    <span className="activity-chip">✓ Private Local Historian Tour</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Accordion Toggle for LLM Day-wise Itinerary */}
          {pref?.itinerary && pref.itinerary.length > 0 && (
            <div style={{ marginBottom: '22px' }}>
              <button
                type="button"
                onClick={() => toggleItinerary('preferred')}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '10px 16px',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'background 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={14} className="text-amber-300" />
                  <span>Day-by-Day Itinerary ({pref.itinerary.length} Days Synthesized)</span>
                </div>
                {expandedPlan === 'preferred' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {expandedPlan === 'preferred' && (
                <div style={{
                  marginTop: '12px',
                  padding: '14px',
                  background: 'rgba(0, 0, 0, 0.25)',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {pref.itinerary.map((d) => (
                    <div key={d.day} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
                      <strong style={{ color: '#f3c78a', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>
                        Day {d.day}: {d.title}
                      </strong>
                      <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.85)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                          <Sun size={12} style={{ marginTop: '3px', color: '#fcd34d', flexShrink: 0 }} />
                          <span><strong>Morning:</strong> {d.morning}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                          <Sunset size={12} style={{ marginTop: '3px', color: '#fb923c', flexShrink: 0 }} />
                          <span><strong>Afternoon:</strong> {d.afternoon}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                          <Moon size={12} style={{ marginTop: '3px', color: '#93c5fd', flexShrink: 0 }} />
                          <span><strong>Evening:</strong> {d.evening}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="plan-footer-box">
            <div className="plan-price-group">
              <span className="price-lead">Estimated Cost</span>
              <span className="price-amount">
                {pref?.estimatedCost ? `₹${pref.estimatedCost.toLocaleString('en-IN')}` : budget}
              </span>
              <span className="price-caption">inclusive of transport, stay, food & passes</span>
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
            <h3 className="plan-title">{rec?.planTitle || 'Imperial Sanctuary Experience'}</h3>
            <p className="plan-subtitle">
              {rec?.explanation || rec?.tagline || 'Elevated bespoke itinerary featuring private luxury charters and heritage palace stays.'}
            </p>
          </div>

          <div className="plan-specs-list">
            <div className="spec-row">
              <span className="spec-label">Transport</span>
              <span className="spec-value">
                {rec?.transport
                  ? `${rec.transport.provider} • ${rec.transport.transitDetails} (${rec.transport.travelTime})`
                  : 'Private Luxury Chauffeur + Priority Chartered Transit'}
              </span>
            </div>

            <div className="spec-row">
              <span className="spec-label">Stay Sanctuary</span>
              <span className="spec-value">
                {rec?.stay
                  ? `${rec.stay.name} (${rec.stay.tier}) • ₹${rec.stay.pricePerNight?.toLocaleString('en-IN')}/night • ${rec.stay.rating}★`
                  : '5-Star Palace Sanctuary (Private Pool Villa / Lake View Suite)'}
              </span>
            </div>

            <div className="spec-row">
              <span className="spec-label">Major Places</span>
              <span className="spec-value">
                {rec?.places && rec.places.length > 0
                  ? rec.places.map((p) => p.name).join(', ')
                  : (destination.includes('Goa') ? 'Private Yacht to Butterfly Island, Old Goa Cathedrals, Private Spiced Plantation' : destination.includes('Madurai') ? 'Exclusive VIP Darshan at Dawn, Royal Palace Chamber Sitar Evening' : destination.includes('Assam') ? 'Private Brahmaputra Sunset Cruise, Private Elephant Safari & Tea Tasting' : destination.includes('Coorg') ? 'Private Rainforest Coffee Estate Stay, Tadiandamol Peak Trek' : 'Private Lake Pichola Sunset Charter, Royal Crystal Gallery, Sajjangarh Monsoon Palace')}
              </span>
            </div>

            <div className="spec-row">
              <span className="spec-label">Curated Activities</span>
              <div className="spec-activities-chips">
                {rec?.activities && rec.activities.length > 0 ? (
                  rec.activities.map((act, i) => (
                    <span key={i} className="activity-chip gold">★ {act.name}</span>
                  ))
                ) : (
                  <>
                    <span className="activity-chip gold">★ Private Chef Royal Dinner</span>
                    <span className="activity-chip gold">★ Bespoke Photography Concierge</span>
                    <span className="activity-chip gold">★ Ayurvedic Rejuvenation Spa</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Accordion Toggle for LLM Day-wise Itinerary */}
          {rec?.itinerary && rec.itinerary.length > 0 && (
            <div style={{ marginBottom: '22px' }}>
              <button
                type="button"
                onClick={() => toggleItinerary('recommended')}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  padding: '10px 16px',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'background 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={14} className="text-amber-300" />
                  <span>Day-by-Day Itinerary ({rec.itinerary.length} Days Synthesized)</span>
                </div>
                {expandedPlan === 'recommended' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {expandedPlan === 'recommended' && (
                <div style={{
                  marginTop: '12px',
                  padding: '14px',
                  background: 'rgba(0, 0, 0, 0.25)',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {rec.itinerary.map((d) => (
                    <div key={d.day} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
                      <strong style={{ color: '#f3c78a', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>
                        Day {d.day}: {d.title}
                      </strong>
                      <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.85)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                          <Sun size={12} style={{ marginTop: '3px', color: '#fcd34d', flexShrink: 0 }} />
                          <span><strong>Morning:</strong> {d.morning}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                          <Sunset size={12} style={{ marginTop: '3px', color: '#fb923c', flexShrink: 0 }} />
                          <span><strong>Afternoon:</strong> {d.afternoon}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                          <Moon size={12} style={{ marginTop: '3px', color: '#93c5fd', flexShrink: 0 }} />
                          <span><strong>Evening:</strong> {d.evening}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="plan-footer-box">
            <div className="plan-price-group">
              <span className="price-lead">Signature Package Cost</span>
              <span className="price-amount" style={{ color: '#ab583a' }}>
                {rec?.estimatedCost
                  ? `₹${rec.estimatedCost.toLocaleString('en-IN')}`
                  : `₹${parseInt(budget.replace(/[^0-9]/g, '') || 65000) > 0 ? (parseInt(budget.replace(/[^0-9]/g, '') || 65000) * 1.35).toLocaleString('en-IN') : '88,000'}`}
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
