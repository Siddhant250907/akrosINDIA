import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import PlanTrip from './pages/PlanTrip';
import BudgetCalculator from './pages/BudgetCalculator';
import Login from './pages/Login';

export default function App() {
  const [currentPage, setCurrentPage] = useState('Home');

  // Scroll to top upon navigating between pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="app-root">
      {currentPage === 'Home' && <Home onNavigate={setCurrentPage} />}
      {currentPage === 'Plan Your Trip' && <PlanTrip onNavigate={setCurrentPage} />}
      {currentPage === 'Budget Calculator' && <BudgetCalculator onNavigate={setCurrentPage} />}
      {currentPage === 'Login' && <Login onNavigate={setCurrentPage} />}
    </div>
  );
}
