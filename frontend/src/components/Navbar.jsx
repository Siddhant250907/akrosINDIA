import React, { useState } from 'react';
import { Compass, User, Globe, Menu, X, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ activePage = 'Home', onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const { currentLanguage, setLanguage, t, supportedLanguages } = useLanguage();

  const navItems = [
    { label: t('nav.home', 'Home'), id: 'Home' },
    { label: t('nav.planTrip', 'Plan Your Trip'), id: 'Plan Your Trip' },
    { label: t('nav.budgetCalc', 'Budget Calculator'), id: 'Budget Calculator' },
    { label: t('nav.whereToGo', 'Where to go'), id: 'Plan Your Trip' },
  ];

  return (
    <header className="navbar-wrapper">
      <nav className="navbar-pill glass-navbar">
        {/* Left: Brand & Vertical Divider */}
        <div className="nav-left-cluster">
          <div
            className="nav-brand-group"
            onClick={() => onNavigate?.('Home')}
            role="button"
            tabIndex={0}
          >
            <span className="nav-brand-title">
              akros<span>INDIA</span>
            </span>
          </div>

          <div className="nav-vertical-divider" />

          {/* Left Nav Menu Links */}
          <div className="nav-menu-links">
            {navItems.map((item, idx) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={`${item.id}-${idx}`}
                  onClick={() => onNavigate?.(item.id)}
                  className={`nav-link-btn ${isActive ? 'active' : ''}`}
                >
                  <span>{item.label}</span>
                  {item.id === 'Home' && <ChevronDown size={13} className="nav-chevron-icon" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Text Link, Globe, and Reference [ ☰ 👤 ] Profile Pill */}
        <div className="nav-right-cluster">
          {/* Subtle text link */}
          <button
            onClick={() => onNavigate?.('Plan Your Trip')}
            className="nav-host-link desktop-action"
          >
            {t('nav.curateJourney', 'Curate Journey')}
          </button>

          {/* Interactive Globe Language Selector */}
          <div className="nav-globe-wrapper">
            <button
              onClick={() => {
                setLanguageDropdownOpen(!languageDropdownOpen);
                setProfileDropdownOpen(false);
              }}
              className={`nav-globe-btn desktop-action ${languageDropdownOpen ? 'active' : ''}`}
              title={t('nav.selectLanguage', 'Select Language')}
              aria-label="Select Language"
            >
              <Globe size={18} />
              <span className="nav-globe-lang-code">{currentLanguage}</span>
            </button>

            {/* Frosted Glass Language Dropdown */}
            {languageDropdownOpen && (
              <div className="nav-language-dropdown animate-fade-in">
                <div className="language-dropdown-header">
                  <Globe size={14} />
                  <span>{t('nav.selectLanguage', 'Select Language')}</span>
                </div>
                <div className="language-dropdown-list">
                  {supportedLanguages.map((lang) => {
                    const isSelected = currentLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLanguageDropdownOpen(false);
                        }}
                        className={`language-item-btn ${isSelected ? 'active' : ''}`}
                      >
                        <div className="language-item-left">
                          <span className="language-flag">{lang.flag}</span>
                          <span className="language-native-name">{lang.nativeLabel}</span>
                          <span className="language-english-label">({lang.label})</span>
                        </div>
                        {isSelected && <Check size={16} className="language-check-mark" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Profile Pill Button: [ ☰ 👤 ] */}
          <div className="nav-profile-pill-wrapper">
            <button
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setLanguageDropdownOpen(false);
              }}
              className="nav-profile-pill"
              aria-label="User account menu"
            >
              <Menu size={16} className="profile-menu-bars" />
              <div className="profile-user-avatar">
                <User size={15} />
              </div>
            </button>

            {/* Profile Menu Dropdown */}
            {profileDropdownOpen && (
              <div className="nav-profile-dropdown glass-dropdown animate-fade-in">
                <div className="dropdown-header">
                  <strong>{t('nav.sanctuaryTitle', 'Traveler Sanctuary')}</strong>
                  <span>{t('nav.memberStatus', 'akrosINDIA Member')}</span>
                </div>
                <div className="dropdown-divider" />
                <button
                  onClick={() => {
                    onNavigate?.('Login');
                    setProfileDropdownOpen(false);
                  }}
                  className="dropdown-item primary"
                >
                  <User size={15} />
                  <span>{t('nav.loginSignup', 'Log in / Sign up')}</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate?.('Plan Your Trip');
                    setProfileDropdownOpen(false);
                  }}
                  className="dropdown-item"
                >
                  <span>{t('nav.planTrip', 'Plan Your Trip')}</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate?.('Budget Calculator');
                    setProfileDropdownOpen(false);
                  }}
                  className="dropdown-item"
                >
                  <span>{t('nav.budgetCalc', 'Budget Calculator')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger toggle for full drawer */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="nav-mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="nav-mobile-menu glass-panel animate-fade-in">
          {navItems.map((item, idx) => (
            <button
              key={`m-${item.id}-${idx}`}
              onClick={() => {
                onNavigate?.(item.id);
                setMobileOpen(false);
              }}
              className="nav-mobile-link"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              onNavigate?.('Login');
              setMobileOpen(false);
            }}
            className="nav-mobile-link profile-link"
          >
            <User size={16} />
            <span>{t('nav.loginSignup', 'Login / Account')}</span>
          </button>

          {/* Mobile Language Selector Row */}
          <div style={{ padding: '12px 14px 4px', borderTop: '1px solid rgba(255,255,255,0.12)', marginTop: '8px' }}>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={13} />
              <span>{t('nav.language', 'Language')}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {supportedLanguages.map((lang) => (
                <button
                  key={`mob-${lang.code}`}
                  onClick={() => {
                    setLanguage(lang.code);
                    setMobileOpen(false);
                  }}
                  style={{
                    background: currentLanguage === lang.code ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                    border: currentLanguage === lang.code ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    borderRadius: '9999px',
                    padding: '4px 10px',
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                  }}
                >
                  {lang.flag} {lang.nativeLabel}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

