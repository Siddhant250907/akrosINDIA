import React, { useState } from 'react';
import {
  Wallet,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Crown,
  Compass,
  Star,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function BudgetCalculator({ onNavigate }) {
  const { t, dict } = useLanguage();
  const [travellers, setTravellers] = useState(2);
  const [days, setDays] = useState(5);
  const [experienceTier, setExperienceTier] = useState('luxury'); // 'comfort' | 'luxury' | 'royal'

  // Refined Subtle Tiers with translations
  const tiers = {
    comfort: {
      id: 'comfort',
      title: dict?.budgetCalc?.tiers?.comfort?.title || 'Curated Comfort',
      icon: Compass,
      badge: dict?.budgetCalc?.tiers?.comfort?.badge || 'Heritage & Comfort',
      dailyRatePerPerson: 4800,
      description: dict?.budgetCalc?.tiers?.comfort?.desc || 'Charming boutique havelis & verified homestays, AC transit, and curated local culinary trails.',
      highlights: [
        dict?.budgetCalc?.tiers?.comfort?.h1 || 'Boutique havelis & resorts',
        dict?.budgetCalc?.tiers?.comfort?.h2 || 'Private AC road transfers',
        dict?.budgetCalc?.tiers?.comfort?.h3 || 'Local food & heritage walks',
      ],
    },
    luxury: {
      id: 'luxury',
      title: dict?.budgetCalc?.tiers?.luxury?.title || 'Signature Luxury',
      icon: Star,
      badge: dict?.budgetCalc?.tiers?.luxury?.badge || 'Most Popular',
      dailyRatePerPerson: 9800,
      description: dict?.budgetCalc?.tiers?.luxury?.desc || 'Handpicked 4–5★ heritage palaces, scheduled flights, private chauffeur, and private monument guides.',
      highlights: [
        dict?.budgetCalc?.tiers?.luxury?.h1 || 'Heritage palaces & villas',
        dict?.budgetCalc?.tiers?.luxury?.h2 || 'Flights + dedicated chauffeur',
        dict?.budgetCalc?.tiers?.luxury?.h3 || 'Curated cultural immersions',
      ],
    },
    royal: {
      id: 'royal',
      title: dict?.budgetCalc?.tiers?.royal?.title || 'Royal Bespoke',
      icon: Crown,
      badge: dict?.budgetCalc?.tiers?.royal?.badge || 'Ultra-Luxury',
      dailyRatePerPerson: 19500,
      description: dict?.budgetCalc?.tiers?.royal?.desc || 'Iconic royal sanctuaries (Taj / Oberoi), luxury private charters, round-the-clock bespoke concierge.',
      highlights: [
        dict?.budgetCalc?.tiers?.royal?.h1 || 'Grand palace suites',
        dict?.budgetCalc?.tiers?.royal?.h2 || 'VIP access & private boats',
        dict?.budgetCalc?.tiers?.royal?.h3 || 'Dedicated 24/7 concierge',
      ],
    },
  };

  const currentTier = tiers[experienceTier];
  const estimatedTotal = currentTier.dailyRatePerPerson * travellers * days;
  const perPersonCost = currentTier.dailyRatePerPerson * days;

  // Approximate subtle breakdown
  const stayCost = Math.round(estimatedTotal * 0.52);
  const transitCost = Math.round(estimatedTotal * 0.28);
  const expCost = estimatedTotal - stayCost - transitCost;

  const quickDays = [3, 5, 7, 10, 14];
  const quickTravellers = [
    { label: t('budgetCalc.partySolo', 'Solo'), count: 1 },
    { label: t('budgetCalc.partyCouple', 'Couple'), count: 2 },
    { label: t('budgetCalc.partyFamily', 'Family of 4'), count: 4 },
  ];

  return (
    <div className="inner-page-wrapper glass-page-wrapper">
      <div className="inner-page-stage">
        <div className="budget-subtle-container animate-fade-in">
          
          {/* Header */}
          <div className="form-editorial-header">
            <span className="editorial-badge">
              <Wallet size={13} />
              <span>{t('budgetCalc.badge', 'Transparent Cost Intelligence')}</span>
            </span>
            <h1 className="editorial-page-title">{t('budgetCalc.title', 'Trip Budget Calculator')}</h1>
            <p className="editorial-page-subtitle">
              {t('budgetCalc.subtitle', 'A clean, unhurried estimate tailored to your travel party and preferred comfort tier.')}
            </p>
          </div>

          {/* Core Interactive Card */}
          <div className="budget-subtle-card">
            
            {/* Quick Controls Row */}
            <div className="budget-quick-inputs-grid">
              
              {/* Travellers Control */}
              <div className="subtle-input-box">
                <div className="subtle-input-header">
                  <div className="subtle-icon-pill">
                    <Users size={16} />
                  </div>
                  <div>
                    <h3 className="subtle-box-title">{t('budgetCalc.partyTitle', 'Travel Party')}</h3>
                    <span className="subtle-box-desc">
                      {travellers} {travellers === 1 ? t('budgetCalc.partyGuest', 'Guest') : t('budgetCalc.partyGuests', 'Guests')}
                    </span>
                  </div>
                </div>

                <div className="quick-pill-row">
                  {quickTravellers.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setTravellers(item.count)}
                      className={`subtle-pill-btn ${travellers === item.count ? 'active' : ''}`}
                    >
                      {item.label}
                    </button>
                  ))}
                  
                  {/* Stepper for custom count */}
                  <div className="subtle-stepper">
                    <button
                      type="button"
                      onClick={() => setTravellers(Math.max(1, travellers - 1))}
                      className="stepper-arrow-btn"
                      aria-label="Decrease travellers"
                    >
                      -
                    </button>
                    <span className="stepper-num">{travellers}</span>
                    <button
                      type="button"
                      onClick={() => setTravellers(travellers + 1)}
                      className="stepper-arrow-btn"
                      aria-label="Increase travellers"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Days Control */}
              <div className="subtle-input-box">
                <div className="subtle-input-header">
                  <div className="subtle-icon-pill">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <h3 className="subtle-box-title">{t('budgetCalc.durationTitle', 'Trip Duration')}</h3>
                    <span className="subtle-box-desc">{days} {t('budgetCalc.durationExpedition', 'Days Expedition')}</span>
                  </div>
                </div>

                <div className="quick-pill-row">
                  {quickDays.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDays(d)}
                      className={`subtle-pill-btn ${days === d ? 'active' : ''}`}
                    >
                      {d} {t('budgetCalc.days', 'Days')}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Experience Tiers (3 refined subtle options) */}
            <div className="subtle-tier-section">
              <div className="subtle-tier-title-row">
                <h3 className="subtle-tier-heading">{t('budgetCalc.selectTier', 'Select Experience Tier')}</h3>
                <span className="subtle-tier-sub">{t('budgetCalc.tierStandards', 'Curated all-inclusive standards')}</span>
              </div>

              <div className="subtle-tier-grid">
                {Object.values(tiers).map((tierItem) => {
                  const isSelected = experienceTier === tierItem.id;
                  const Icon = tierItem.icon;
                  return (
                    <div
                      key={tierItem.id}
                      onClick={() => setExperienceTier(tierItem.id)}
                      className={`subtle-tier-card ${isSelected ? 'selected' : ''}`}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="tier-card-top">
                        <div className="tier-card-icon-wrap">
                          <Icon size={18} />
                        </div>
                        <span className={`tier-card-badge ${tierItem.id === 'luxury' ? 'featured' : ''}`}>
                          {tierItem.badge}
                        </span>
                      </div>

                      <h4 className="tier-card-name">{tierItem.title}</h4>
                      <p className="tier-card-desc">{tierItem.description}</p>

                      <div className="tier-card-price-line">
                        <span className="tier-card-price">₹{tierItem.dailyRatePerPerson.toLocaleString('en-IN')}</span>
                        <span className="tier-card-price-unit">{t('budgetCalc.perPersonDay', '/ person / day')}</span>
                      </div>

                      <ul className="tier-card-bullets">
                        {tierItem.highlights.map((h, i) => (
                          <li key={i}>
                            <Check size={13} className="bullet-check" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="tier-select-indicator">
                        {isSelected ? (
                          <span className="tier-selected-label">
                            <Check size={14} /> Selected Tier
                          </span>
                        ) : (
                          <span className="tier-select-action">Choose Tier</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Subtle Result Banner */}
            <div className="subtle-estimation-banner">
              <div className="estimation-content-side">
                <span className="estimation-tag">
                  <Sparkles size={13} />
                  <span>{t('budgetCalc.totalEstimate', 'Real-Time Cost Estimate')}</span>
                </span>
                <div className="estimation-figures">
                  <div className="primary-fig">
                    <span className="fig-curr">₹</span>
                    <span className="fig-val">{estimatedTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="secondary-fig">
                    <span>₹{perPersonCost.toLocaleString('en-IN')}</span>
                    <span className="fig-sub">{t('budgetCalc.perPersonTotal', 'Per person:')} ({days} {t('budgetCalc.days', 'days')})</span>
                  </div>
                </div>

                {/* Subtle high-level breakdown */}
                <div className="subtle-breakdown-row">
                  <div className="breakdown-item">
                    <span className="breakdown-dot dot-stay" />
                    <span className="breakdown-name">{t('budgetCalc.breakdown.stays', 'Stays & Heritage Haveli')}:</span>
                    <strong className="breakdown-amt">~₹{stayCost.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-dot dot-transit" />
                    <span className="breakdown-name">{t('budgetCalc.breakdown.transit', 'Chauffeur Transit & Flights')}:</span>
                    <strong className="breakdown-amt">~₹{transitCost.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-dot dot-exp" />
                    <span className="breakdown-name">{t('budgetCalc.breakdown.experiences', 'Curated Meals & Guides')}:</span>
                    <strong className="breakdown-amt">~₹{expCost.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>

              <div className="estimation-action-side">
                <button
                  type="button"
                  onClick={() => onNavigate?.('Plan Your Trip')}
                  className="subtle-plan-cta"
                  id="btn-budget-to-plan"
                >
                  <span>{t('budgetCalc.ctaPlan', 'Plan Trip With This Tier')}</span>
                  <div className="cta-circle-arrow">
                    <ArrowRight size={16} />
                  </div>
                </button>
                <div className="estimation-guarantee">
                  <ShieldCheck size={14} />
                  <span>{t('budgetCalc.guarantee', 'Transparent luxury pricing. Actual rates may vary by festive seasonality.')}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
