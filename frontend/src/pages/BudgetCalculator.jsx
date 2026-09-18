import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import {
  Wallet,
  Users,
  Calendar,
  Plane,
  Home,
  Utensils,
  Sparkles,
  Compass,
  Car,
  ArrowRight,
  Info,
  Check,
} from 'lucide-react';

export default function BudgetCalculator({ onNavigate }) {
  const [travellers, setTravellers] = useState(2);
  const [days, setDays] = useState(5);

  // Selected tiers
  const [transportTier, setTransportTier] = useState('flight');
  const [stayTier, setStayTier] = useState('boutique');
  const [foodTier, setFoodTier] = useState('gourmet');
  const [activityTier, setActivityTier] = useState('guided');
  const [localTier, setLocalTier] = useState('chauffeur');

  // Pricing configuration
  const transportOptions = {
    flight: { label: 'Executive Flight', ratePerPerson: 12500, icon: Plane, desc: 'Direct scheduled flight' },
    train: { label: '1st AC Royal Rail', ratePerPerson: 4200, icon: Compass, desc: 'Tejas / Rajdhani Express' },
    chauffeur: { label: 'Outstation Luxury Cab', ratePerPerson: 6500, icon: Car, desc: 'Private door-to-door drive' },
    coach: { label: 'Premium Volvo', ratePerPerson: 2200, icon: Compass, desc: 'Comfort intercity coach' },
  };

  const stayOptions = {
    palace: { label: 'Royal Palace Sanctuary', ratePerDay: 26000, desc: 'Taj / Oberoi heritage luxury' },
    boutique: { label: 'Boutique Heritage Haveli', ratePerDay: 12000, desc: 'Curated royal courtyard haveli' },
    resort: { label: 'Deluxe Nature Resort', ratePerDay: 6500, desc: 'Scenic garden & valley views' },
    comfort: { label: 'Comfort Villa', ratePerDay: 3800, desc: 'Clean, verified homestays' },
  };

  const foodOptions = {
    royal: { label: 'Royal Banquets & Fine Dining', ratePerPersonPerDay: 3200, desc: 'Multi-course regal thalis' },
    gourmet: { label: 'Curated Regional Gourmet', ratePerPersonPerDay: 1800, desc: 'Chef-curated local bistros' },
    local: { label: 'Authentic Local Specialties', ratePerPersonPerDay: 850, desc: 'Iconic street & heritage cafes' },
  };

  const activityOptions = {
    vip: { label: 'Private Charters & Safaris', ratePerPersonPerDay: 3000, desc: 'Exclusive boats, private guides' },
    guided: { label: 'Curated Cultural Immersion', ratePerPersonPerDay: 1400, desc: 'Fort entry, sitar soirees' },
    leisure: { label: 'Self-Paced Explorer', ratePerPersonPerDay: 600, desc: 'Audio tours, walking trails' },
  };

  const localTravelOptions = {
    chauffeur: { label: 'Dedicated 24/7 Chauffeur', ratePerDay: 2400, desc: 'Private AC Sedan at your service' },
    cabs: { label: 'On-Demand City Cabs', ratePerDay: 1200, desc: 'Point-to-point transfers' },
    tuk: { label: 'Auto & Heritage Walk', ratePerDay: 500, desc: 'Local tuk-tuks & walking' },
  };

  // Calculations
  const totalTransport = transportOptions[transportTier].ratePerPerson * travellers;
  const totalStay = stayOptions[stayTier].ratePerDay * days;
  const totalFood = foodOptions[foodTier].ratePerPersonPerDay * travellers * days;
  const totalActivities = activityOptions[activityTier].ratePerPersonPerDay * travellers * days;
  const totalLocalTravel = localTravelOptions[localTier].ratePerDay * days;

  const estimatedTotal = totalTransport + totalStay + totalFood + totalActivities + totalLocalTravel;
  const perPersonCost = Math.round(estimatedTotal / travellers);

  return (
    <div className="inner-page-wrapper">
      <Navbar activePage="Budget Calculator" onNavigate={onNavigate} />

      <div className="inner-page-stage">
        <div className="budget-calculator-card animate-fade-in">
          
          {/* Header */}
          <div className="form-editorial-header">
            <span className="editorial-badge">
              <Wallet size={13} className="text-amber-400" />
              <span>Transparent Cost Intelligence</span>
            </span>
            <h1 className="editorial-page-title">Expedition Budget Calculator</h1>
            <p className="editorial-page-subtitle">
              Configure your group dynamics and service standards to view an exact, uninflated cost formulation.
            </p>
          </div>

          {/* EQUATION FORMULATION DISPLAY (HERO BANNER OF THIS PAGE) */}
          <div className="budget-equation-banner">
            <div className="equation-title-row">
              <span className="equation-label">The akrosINDIA Cost Equation</span>
              <span className="equation-sub">Instant Real-Time Formulation</span>
            </div>

            <div className="equation-formula-row">
              <div className="formula-term">
                <span className="term-name">Transport</span>
                <strong className="term-value">₹{totalTransport.toLocaleString('en-IN')}</strong>
              </div>
              <span className="formula-operator">+</span>

              <div className="formula-term">
                <span className="term-name">Stay</span>
                <strong className="term-value">₹{totalStay.toLocaleString('en-IN')}</strong>
              </div>
              <span className="formula-operator">+</span>

              <div className="formula-term">
                <span className="term-name">Food</span>
                <strong className="term-value">₹{totalFood.toLocaleString('en-IN')}</strong>
              </div>
              <span className="formula-operator">+</span>

              <div className="formula-term">
                <span className="term-name">Activities</span>
                <strong className="term-value">₹{totalActivities.toLocaleString('en-IN')}</strong>
              </div>
              <span className="formula-operator">+</span>

              <div className="formula-term">
                <span className="term-name">Local Travel</span>
                <strong className="term-value">₹{totalLocalTravel.toLocaleString('en-IN')}</strong>
              </div>
              <span className="formula-operator">=</span>

              <div className="formula-term result-term">
                <span className="term-name">Estimated Total</span>
                <strong className="term-value result-highlight">
                  ₹{estimatedTotal.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>

            <div className="equation-footer-meta">
              <span>{travellers} {travellers === 1 ? 'Traveller' : 'Travellers'} • {days} Days Expedition</span>
              <span className="dot-sep">•</span>
              <span><strong>₹{perPersonCost.toLocaleString('en-IN')}</strong> per person</span>
            </div>
          </div>

          {/* Input Controls Grid */}
          <div className="calculator-controls-grid">
            
            {/* Top Bar: Travellers & Days Counters */}
            <div className="counter-controls-bar">
              {/* Travellers */}
              <div className="counter-unit">
                <div className="counter-icon-wrap">
                  <Users size={18} />
                </div>
                <div className="counter-content">
                  <span className="counter-title">Number of Travellers</span>
                  <div className="counter-stepper">
                    <button
                      type="button"
                      onClick={() => setTravellers(Math.max(1, travellers - 1))}
                      className="step-btn"
                    >
                      -
                    </button>
                    <span className="step-val">{travellers}</span>
                    <button
                      type="button"
                      onClick={() => setTravellers(travellers + 1)}
                      className="step-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Days */}
              <div className="counter-unit">
                <div className="counter-icon-wrap">
                  <Calendar size={18} />
                </div>
                <div className="counter-content">
                  <span className="counter-title">Expedition Days</span>
                  <div className="counter-stepper">
                    <button
                      type="button"
                      onClick={() => setDays(Math.max(1, days - 1))}
                      className="step-btn"
                    >
                      -
                    </button>
                    <span className="step-val">{days} Days</span>
                    <button
                      type="button"
                      onClick={() => setDays(days + 1)}
                      className="step-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 1. Transport Tier Selection */}
            <div className="tier-selection-section">
              <div className="tier-header-line">
                <h4 className="tier-section-title">1. Transport Method (Origin to Destination)</h4>
                <span className="tier-total-badge">Subtotal: ₹{totalTransport.toLocaleString('en-IN')}</span>
              </div>
              <div className="options-selection-grid">
                {Object.entries(transportOptions).map(([key, opt]) => {
                  const isSelected = transportTier === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setTransportTier(key)}
                      className={`tier-option-card ${isSelected ? 'active' : ''}`}
                    >
                      <div className="opt-top-row">
                        <span className="opt-name">{opt.label}</span>
                        <span className="opt-rate">₹{opt.ratePerPerson.toLocaleString('en-IN')}/person</span>
                      </div>
                      <span className="opt-desc">{opt.desc}</span>
                      {isSelected && <div className="opt-check"><Check size={12} /></div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Stay Tier Selection */}
            <div className="tier-selection-section">
              <div className="tier-header-line">
                <h4 className="tier-section-title">2. Stay Category (Nightly Accommodations)</h4>
                <span className="tier-total-badge">Subtotal: ₹{totalStay.toLocaleString('en-IN')}</span>
              </div>
              <div className="options-selection-grid">
                {Object.entries(stayOptions).map(([key, opt]) => {
                  const isSelected = stayTier === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setStayTier(key)}
                      className={`tier-option-card ${isSelected ? 'active' : ''}`}
                    >
                      <div className="opt-top-row">
                        <span className="opt-name">{opt.label}</span>
                        <span className="opt-rate">₹{opt.ratePerDay.toLocaleString('en-IN')}/day</span>
                      </div>
                      <span className="opt-desc">{opt.desc}</span>
                      {isSelected && <div className="opt-check"><Check size={12} /></div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Food Tier Selection */}
            <div className="tier-selection-section">
              <div className="tier-header-line">
                <h4 className="tier-section-title">3. Dining & Gastronomy Standard</h4>
                <span className="tier-total-badge">Subtotal: ₹{totalFood.toLocaleString('en-IN')}</span>
              </div>
              <div className="options-selection-grid grid-3-col">
                {Object.entries(foodOptions).map(([key, opt]) => {
                  const isSelected = foodTier === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setFoodTier(key)}
                      className={`tier-option-card ${isSelected ? 'active' : ''}`}
                    >
                      <div className="opt-top-row">
                        <span className="opt-name">{opt.label}</span>
                        <span className="opt-rate">₹{opt.ratePerPersonPerDay.toLocaleString('en-IN')}/p/d</span>
                      </div>
                      <span className="opt-desc">{opt.desc}</span>
                      {isSelected && <div className="opt-check"><Check size={12} /></div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Activities Tier Selection */}
            <div className="tier-selection-section">
              <div className="tier-header-line">
                <h4 className="tier-section-title">4. Curated Activities & Sightseeing</h4>
                <span className="tier-total-badge">Subtotal: ₹{totalActivities.toLocaleString('en-IN')}</span>
              </div>
              <div className="options-selection-grid grid-3-col">
                {Object.entries(activityOptions).map(([key, opt]) => {
                  const isSelected = activityTier === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setActivityTier(key)}
                      className={`tier-option-card ${isSelected ? 'active' : ''}`}
                    >
                      <div className="opt-top-row">
                        <span className="opt-name">{opt.label}</span>
                        <span className="opt-rate">₹{opt.ratePerPersonPerDay.toLocaleString('en-IN')}/p/d</span>
                      </div>
                      <span className="opt-desc">{opt.desc}</span>
                      {isSelected && <div className="opt-check"><Check size={12} /></div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. Local Travel Tier Selection */}
            <div className="tier-selection-section">
              <div className="tier-header-line">
                <h4 className="tier-section-title">5. Local Commute & Transfers within Destination</h4>
                <span className="tier-total-badge">Subtotal: ₹{totalLocalTravel.toLocaleString('en-IN')}</span>
              </div>
              <div className="options-selection-grid grid-3-col">
                {Object.entries(localTravelOptions).map(([key, opt]) => {
                  const isSelected = localTier === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setLocalTier(key)}
                      className={`tier-option-card ${isSelected ? 'active' : ''}`}
                    >
                      <div className="opt-top-row">
                        <span className="opt-name">{opt.label}</span>
                        <span className="opt-rate">₹{opt.ratePerDay.toLocaleString('en-IN')}/day</span>
                      </div>
                      <span className="opt-desc">{opt.desc}</span>
                      {isSelected && <div className="opt-check"><Check size={12} /></div>}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Action Footer */}
          <div className="calculator-footer-action">
            <button
              onClick={() => onNavigate?.('Plan Your Trip')}
              className="generate-trip-cta-btn"
            >
              <span>Apply Budget to Plan Your Trip</span>
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => onNavigate?.('Home')}
              className="secondary-return-btn"
            >
              Return to Sanctuary Home
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
