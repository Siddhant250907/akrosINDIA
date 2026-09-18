import React, { useState } from 'react';
import { Compass, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';

export default function Login({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleSocialLogin = (provider) => {
    setLoggedInUser(`Traveler via ${provider}`);
    setTimeout(() => {
      onNavigate?.('Home');
    }, 1200);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setLoggedInUser(email);
      setTimeout(() => {
        onNavigate?.('Home');
      }, 1200);
    }
  };

  return (
    <div className="login-fullscreen-wrapper">
      {/* Background Indian Travel Image */}
      <div className="login-backdrop-image" />
      
      {/* Warm Dark Overlay */}
      <div className="login-warm-overlay" />

      {/* Top Bar with Return Link */}
      <div className="login-top-bar">
        <button
          onClick={() => onNavigate?.('Home')}
          className="login-back-button"
        >
          <ArrowLeft size={16} />
          <span>Return to akrosINDIA</span>
        </button>
      </div>

      {/* Centered Glassmorphism Card */}
      <div className="login-center-stage">
        <div className="login-glass-card animate-fade-in">
          
          {/* Brand Emblem */}
          <div className="login-brand-head">
            <div className="login-compass-badge">
              <Compass size={24} style={{ color: '#faefe7' }} />
            </div>
            <span className="login-brand-tagline">akrosINDIA Sanctuary</span>
          </div>

          {/* Heading */}
          <h1 className="login-title">Welcome to akrosINDIA</h1>
          <p className="login-subtitle">
            Sign in to unlock personalized royal expeditions, sanctuary itineraries, and private concierge planning.
          </p>

          {loggedInUser ? (
            <div className="login-success-state animate-fade-in">
              <CheckCircle2 size={36} style={{ color: '#cfa376' }} />
              <h3 className="login-success-title">Welcome, Honored Traveler</h3>
              <p className="login-success-text">Connecting to your personal sanctuary...</p>
            </div>
          ) : (
            <>
              {/* 3 Social Login Buttons: Google, Meta, Instagram in Warm Luxury Language */}
              <div className="social-auth-stack">
                
                {/* 1. Google */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="social-auth-btn"
                >
                  <svg className="social-svg-icon" viewBox="0 0 24 24" fill="#221815">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 13.88c-.62.6-1.52 1-2.64 1-2.22 0-4-1.78-4-4s1.78-4 4-4c1.1 0 1.95.42 2.53.96l1.42-1.42C16.8 6.48 15.15 6 14 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c3.15 0 5.42-2.18 5.62-5.18H14v-2.2h7.62c.08.43.12.92.12 1.48 0 3.32-2.26 5.86-5.1 5.78z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* 2. Meta */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Meta')}
                  className="social-auth-btn"
                >
                  <svg className="social-svg-icon" viewBox="0 0 24 24" fill="#221815">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  <span>Continue with Meta</span>
                </button>

                {/* 3. Instagram */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Instagram')}
                  className="social-auth-btn"
                >
                  <svg className="social-svg-icon" viewBox="0 0 24 24" fill="#221815">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span>Continue with Instagram</span>
                </button>
              </div>

              {/* Minimal Email Divider */}
              <div className="login-or-divider">
                <div className="divider-hairline" />
                <span className="divider-text">or member passkey</span>
                <div className="divider-hairline" />
              </div>

              {/* Email Entry */}
              <form onSubmit={handleEmailSubmit} className="login-email-form">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email..."
                  className="login-email-input"
                  required
                />
                <button type="submit" className="login-submit-btn">
                  <span>Sign In</span>
                </button>
              </form>
            </>
          )}

          {/* Privacy / Ethos Note */}
          <div className="login-footer-ethos">
            <Sparkles size={12} style={{ color: '#cfa376' }} />
            <span>Encrypted sanctuary profile • Royal bespoke travel</span>
          </div>

        </div>
      </div>
    </div>
  );
}
