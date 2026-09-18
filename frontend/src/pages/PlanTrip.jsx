import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Results from './Results';
import {
  MapPin,
  Navigation,
  Compass,
  Train,
  Bus,
  Plane,
  Car,
  Calendar,
  Sparkles,
  ArrowRight,
  Check,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

export default function PlanTrip({ onNavigate }) {
  // Form State
  const [startType, setStartType] = useState('Current Location'); // 'Current Location' | 'Manual'
  const [manualStart, setManualStart] = useState('New Delhi');
  const [destination, setDestination] = useState('Udaipur, Rajasthan');
  const [budget, setBudget] = useState(65000);
  const [duration, setDuration] = useState('5 Days');
  const [travelMode, setTravelMode] = useState('Flight');
  const [interests, setInterests] = useState(['Heritage', 'Nature', 'Relaxation']);
  const [submitted, setSubmitted] = useState(false);

  // Quick suggestions
  const popularStarts = ['New Delhi', 'Mumbai', 'Bengaluru', 'Kolkata', 'Chennai', 'Hyderabad'];
  const popularDests = [
    'Udaipur, Rajasthan',
    'Goa Coast',
    'Madurai, Tamil Nadu',
    'Assam Tea Country',
    'Coorg, Karnataka',
    'Leh-Ladakh, Himalayas',
    'Varanasi, Uttar Pradesh',
  ];

  const travelModes = [
    { id: 'Flight', label: 'Flight', icon: Plane, desc: 'Fast & executive' },
    { id: 'Train', label: 'Train', icon: Train, desc: 'Classic regal tracks' },
    { id: 'Car', label: 'Car', icon: Car, desc: 'Private chauffeur' },
    { id: 'Bus', label: 'Bus', icon: Bus, desc: 'Scenic express' },
  ];

  const interestOptions = [
    'Nature',
    'Beaches',
    'Mountains',
    'Heritage',
    'Temples',
    'Food',
    'Adventure',
    'Relaxation',
  ];

  const toggleInterest = (item) => {
    if (interests.includes(item)) {
      if (interests.length > 1) {
        setInterests(interests.filter((i) => i !== item));
      }
    } else {
      setInterests([...interests, item]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tripData = {
    startLocation: startType === 'Current Location' ? 'New Delhi (Current Location)' : manualStart,
    destination,
    budget: `₹${budget.toLocaleString('en-IN')}`,
    duration,
    travelMode,
    interests,
  };

  return (
    <div className="inner-page-wrapper">
      <Navbar activePage="Plan Your Trip" onNavigate={onNavigate} />

      <div className="inner-page-stage">
        {submitted ? (
          <Results
            tripData={tripData}
            onEdit={() => setSubmitted(false)}
            onNavigate={onNavigate}
          />
        ) : (
          <div className="plan-form-card animate-fade-in">
            {/* Header / Intro */}
            <div className="form-editorial-header">
              <span className="editorial-badge">
                <Sparkles size={13} className="text-amber-400" />
                <span>Custom Expedition Planner</span>
              </span>
              <h1 className="editorial-page-title">Plan Your Bespoke Indian Journey</h1>
              <p className="editorial-page-subtitle">
                Select your coordinates, travel rhythm, and passions to generate a tailored luxury expedition.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="plan-form-body">
              {/* 1. Starting Location */}
              <div className="form-section-card">
                <div className="section-title-line">
                  <div className="section-step-num">1</div>
                  <div>
                    <h3 className="section-heading">Starting Location</h3>
                    <p className="section-subtext">Choose your departure origin</p>
                  </div>
                </div>

                {/* Toggle: Current Location vs Manual */}
                <div className="location-toggle-row">
                  <button
                    type="button"
                    onClick={() => setStartType('Current Location')}
                    className={`toggle-option-btn ${startType === 'Current Location' ? 'active' : ''}`}
                  >
                    <Navigation size={15} />
                    <span>Current Location</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStartType('Manual')}
                    className={`toggle-option-btn ${startType === 'Manual' ? 'active' : ''}`}
                  >
                    <MapPin size={15} />
                    <span>Manual Entry</span>
                  </button>
                </div>

                {startType === 'Current Location' ? (
                  <div className="detected-location-box">
                    <div className="gps-live-dot" />
                    <div>
                      <span className="detected-label">Detected Position:</span>
                      <strong className="detected-city">New Delhi, NCR (Indira Gandhi Int'l)</strong>
                    </div>
                  </div>
                ) : (
                  <div className="manual-location-input-wrap">
                    <input
                      type="text"
                      value={manualStart}
                      onChange={(e) => setManualStart(e.target.value)}
                      placeholder="e.g. Mumbai, Bengaluru, Hyderabad..."
                      className="clean-text-input"
                      required
                    />
                    <div className="quick-suggestions-chips">
                      <span className="chips-label">Popular:</span>
                      {popularStarts.map((city) => (
                        <button
                          type="button"
                          key={city}
                          onClick={() => setManualStart(city)}
                          className={`mini-chip ${manualStart === city ? 'active' : ''}`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Destination */}
              <div className="form-section-card">
                <div className="section-title-line">
                  <div className="section-step-num">2</div>
                  <div>
                    <h3 className="section-heading">Destination</h3>
                    <p className="section-subtext">Where do you wish to journey?</p>
                  </div>
                </div>

                <div className="destination-input-wrap">
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Enter Indian destination..."
                    className="clean-text-input"
                    required
                  />
                  <div className="quick-suggestions-chips">
                    <span className="chips-label">Featured:</span>
                    {popularDests.map((dest) => (
                      <button
                        type="button"
                        key={dest}
                        onClick={() => setDestination(dest)}
                        className={`mini-chip ${destination === dest ? 'active' : ''}`}
                      >
                        {dest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Budget & Trip Duration in a 2-Column Row */}
              <div className="form-grid-two-col">
                {/* Budget */}
                <div className="form-section-card">
                  <div className="section-title-line">
                    <div className="section-step-num">3</div>
                    <div>
                      <h3 className="section-heading">Budget</h3>
                      <p className="section-subtext">Allocated expedition budget</p>
                    </div>
                  </div>

                  <div className="budget-slider-box">
                    <div className="budget-value-display">
                      <span className="budget-number">₹{budget.toLocaleString('en-IN')}</span>
                      <span className="budget-tier-tag">
                        {budget < 40000 ? 'Curated Classic' : budget < 90000 ? 'Royal Heritage' : 'Imperial Sanctuary'}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="15000"
                      max="250000"
                      step="5000"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="clean-range-slider"
                    />

                    <div className="slider-labels-row">
                      <span>₹15,000</span>
                      <span>₹1,25,000</span>
                      <span>₹2,50,000+</span>
                    </div>
                  </div>
                </div>

                {/* Trip Duration */}
                <div className="form-section-card">
                  <div className="section-title-line">
                    <div className="section-step-num">4</div>
                    <div>
                      <h3 className="section-heading">Trip Duration</h3>
                      <p className="section-subtext">Number of days</p>
                    </div>
                  </div>

                  <div className="duration-pill-group">
                    {['3 Days', '5 Days', '7 Days', '10 Days', '14 Days'].map((d) => (
                      <button
                        type="button"
                        key={d}
                        onClick={() => setDuration(d)}
                        className={`duration-pill-btn ${duration === d ? 'active' : ''}`}
                      >
                        <Calendar size={14} />
                        <span>{d}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5. Preferred Travel Mode */}
              <div className="form-section-card">
                <div className="section-title-line">
                  <div className="section-step-num">5</div>
                  <div>
                    <h3 className="section-heading">Preferred Travel Mode</h3>
                    <p className="section-subtext">Choose your desired transit mode</p>
                  </div>
                </div>

                <div className="travel-modes-grid">
                  {travelModes.map((mode) => {
                    const Icon = mode.icon;
                    const isSelected = travelMode === mode.id;
                    return (
                      <div
                        key={mode.id}
                        onClick={() => setTravelMode(mode.id)}
                        className={`travel-mode-card ${isSelected ? 'active' : ''}`}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="mode-icon-circle">
                          <Icon size={20} />
                        </div>
                        <h4 className="mode-title">{mode.label}</h4>
                        <span className="mode-desc">{mode.desc}</span>
                        {isSelected && <div className="mode-check-mark"><Check size={12} /></div>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 6. Interests */}
              <div className="form-section-card">
                <div className="section-title-line">
                  <div className="section-step-num">6</div>
                  <div>
                    <h3 className="section-heading">Travel Interests</h3>
                    <p className="section-subtext">Select all that inspire you</p>
                  </div>
                </div>

                <div className="interests-pill-cloud">
                  {interestOptions.map((interest) => {
                    const isSelected = interests.includes(interest);
                    return (
                      <button
                        type="button"
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`interest-select-pill ${isSelected ? 'active' : ''}`}
                      >
                        {isSelected && <Check size={13} className="pill-check-icon" />}
                        <span>{interest}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="form-submit-container">
                <button
                  type="submit"
                  className="generate-trip-cta-btn"
                  id="btn-generate-trip"
                >
                  <Sparkles size={18} />
                  <span>Generate My Trip</span>
                  <ArrowRight size={18} />
                </button>
                <p className="submit-sub-note">
                  Generates both your Preferred Plan & akrosINDIA Recommended Sanctuary Route.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
