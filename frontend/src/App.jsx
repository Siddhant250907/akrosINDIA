import React, { useState, useEffect } from 'react';
import { SCENES } from './data/destinations';
import BackgroundCanvas from './components/BackgroundCanvas';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PlanTrip from './pages/PlanTrip';
import BudgetCalculator from './pages/BudgetCalculator';
import Login from './pages/Login';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  const [currentPage, setCurrentPage] = useState('Home');
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeScene = SCENES[currentIndex];

  // Persistent 7.5-second slideshow & living scene transitions across ALL pages
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SCENES.length);
    }, 7500);
    return () => clearInterval(timer);
  }, []);

  // Scroll to top upon navigating between pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <LanguageProvider>
      <div className="app-root">
        {/* Persistent Living Drone Scenery Backdrop across all pages */}
        <BackgroundCanvas currentIndex={currentIndex} activeScene={activeScene} />

        {/* Global Reference Frosted Glass Navbar */}
        <Navbar activePage={currentPage} onNavigate={setCurrentPage} />

        {/* Page Content Layers (Pure Glassmorphism) */}
        <div className="app-page-viewport">
          {currentPage === 'Home' && (
            <Home
              onNavigate={setCurrentPage}
              activeScene={activeScene}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
          )}
          {currentPage === 'Plan Your Trip' && <PlanTrip onNavigate={setCurrentPage} />}
          {currentPage === 'Budget Calculator' && <BudgetCalculator onNavigate={setCurrentPage} />}
          {currentPage === 'Login' && <Login onNavigate={setCurrentPage} />}
        </div>
      </div>
    </LanguageProvider>
  );
}
