import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { BookingModal } from './components/modals/BookingModal';

import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { CoveragePage } from './pages/CoveragePage';
import { AboutPage } from './pages/AboutPage';
import { GiftCardsPage } from './pages/GiftCardsPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPortalPage } from './pages/AdminPortalPage';

// Scroll to top helper on navigation
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1E2923] font-sans antialiased">
        <Navbar onOpenBookingModal={() => setIsBookingOpen(true)} />

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/servicios" element={<ServicesPage />} />
            <Route path="/cobertura" element={<CoveragePage />} />
            <Route path="/nosotros" element={<AboutPage />} />
            <Route path="/regalos" element={<GiftCardsPage />} />
            <Route path="/preguntas" element={<FAQPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/admin" element={<AdminPortalPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>

        <Footer />

        {/* Global Quick Booking Modal */}
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
        />
      </div>
    </Router>
  );
}
