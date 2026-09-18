import React, { useState } from 'react';
import { Compass, User, Globe, Menu, X } from 'lucide-react';

export default function Navbar({ activePage = 'Home', onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Home', id: 'Home' },
    { label: 'Plan Your Trip', id: 'Plan Your Trip' },
    { label: 'Budget Calculator', id: 'Budget Calculator' },
  ];

  return (
    <header className="navbar-wrapper">
      <nav className="navbar-pill">
        {/* Brand & Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            className="nav-brand-group"
            onClick={() => onNavigate?.('Home')}
            role="button"
            tabIndex={0}
          >
            <div className="nav-brand-icon">
              <Compass size={17} />
            </div>
            <span className="nav-brand-title">
              akros<span>INDIA</span>
            </span>
          </div>

          <div className="nav-divider-line" />
        </div>

        {/* Center Nav Links */}
        <div className="nav-menu-links">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate?.(item.id)}
                className={`nav-link-btn ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Section: Globe & Login */}
        <div className="nav-actions-right">
          <div
            className="desktop-action"
            style={{ color: 'rgba(255,255,255,0.85)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '6px' }}
            title="Region: India (English)"
          >
            <Globe size={18} />
          </div>

          <button
            onClick={() => onNavigate?.('Login')}
            className="nav-login-pill desktop-action"
          >
            <User className="nav-login-icon" />
            <span>Login</span>
          </button>

          {/* Mobile toggle */}
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
        <div className="nav-mobile-menu animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.id}
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
            className="nav-login-pill"
            style={{ justifyContent: 'center', marginTop: '10px' }}
          >
            <User className="nav-login-icon" />
            <span>Login / Account</span>
          </button>
        </div>
      )}
    </header>
  );
}
