import React, { useState, useEffect } from 'react';
import { SitePhase } from '../../hooks/useSiteState';

interface HamburgerPageProps {
  navigateTo: (phase: SitePhase) => void;
}

const HAMBURGER = '🍔';

const HAMBURGER_FACTS = [
  'Welcome to the Hamburger Dimension.',
  'Everything here is hamburgers.',
  'The name "Hamburger" comes from Hamburg, Germany.',
  'Josh\'s last name is literally Hamburger.',
  'This is not a joke. Check his LinkedIn.',
  'The average American eats 3 hamburgers a week. Josh finds this statistic personally validating.',
  'The largest hamburger ever made weighed 2,566 lbs.',
  'This page has no purpose.',
  'You are still here.',
  'The hamburger applauds your dedication. 🍔👏',
  'There are no more facts.',
  'Actually there never were. I made them up.',
  'Except the name thing. That\'s real.',
];

const HamburgerPage: React.FC<HamburgerPageProps> = ({ navigateTo }) => {
  const [factIndex, setFactIndex] = useState(0);
  const [burgerPositions, setBurgerPositions] = useState<{ x: number; y: number; size: number; delay: number; rotation: number }[]>([]);

  // Generate floating hamburgers
  useEffect(() => {
    const positions = Array.from({ length: 40 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 16 + Math.random() * 48,
      delay: Math.random() * 8,
      rotation: Math.random() * 360,
    }));
    setBurgerPositions(positions);
  }, []);

  // Cycle through facts
  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex(prev => Math.min(prev + 1, HAMBURGER_FACTS.length - 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(135deg, #ff6b00, #ff9100, #ffab00, #ff6b00)',
      backgroundSize: '400% 400%',
      animation: 'burgerGradient 8s ease infinite',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Floating hamburgers */}
      {burgerPositions.map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            fontSize: `${pos.size}px`,
            animation: `burgerFloat 6s ease-in-out ${pos.delay}s infinite`,
            transform: `rotate(${pos.rotation}deg)`,
            opacity: 0.4,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {HAMBURGER}
        </div>
      ))}

      {/* Center content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        padding: '40px',
      }}>
        <div style={{
          fontSize: '120px',
          marginBottom: '20px',
          animation: 'burgerSpin 4s ease-in-out infinite',
        }}>
          {HAMBURGER}
        </div>

        <h1 style={{
          fontFamily: "'Comic Sans MS', 'Comic Sans', cursive",
          fontSize: 'clamp(24px, 5vw, 48px)',
          color: '#fff',
          textShadow: '3px 3px 0 #8B4513, -1px -1px 0 #8B4513',
          marginBottom: '30px',
          letterSpacing: '2px',
        }}>
          THE HAMBURGER DIMENSION
        </h1>

        {/* Facts ticker */}
        <div style={{
          maxWidth: '500px',
          margin: '0 auto',
          minHeight: '60px',
        }}>
          {HAMBURGER_FACTS.slice(0, factIndex + 1).map((fact, i) => (
            <p key={i} style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '14px',
              color: '#fff',
              background: 'rgba(139, 69, 19, 0.5)',
              padding: '8px 16px',
              borderRadius: '8px',
              marginBottom: '8px',
              backdropFilter: 'blur(4px)',
              opacity: 0,
              animation: `burgerFactIn 0.5s ease ${i * 0.1}s forwards`,
            }}>
              {HAMBURGER} {fact}
            </p>
          ))}
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={() => navigateTo('lobby')}
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 20,
          background: 'rgba(139, 69, 19, 0.6)',
          border: '2px solid #fff',
          color: '#fff',
          fontFamily: "'Comic Sans MS', cursive",
          fontSize: '14px',
          padding: '8px 20px',
          borderRadius: '20px',
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(139, 69, 19, 0.9)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(139, 69, 19, 0.6)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {HAMBURGER} escape dimension
      </button>

      <style>{`
        @keyframes burgerGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes burgerFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(10deg); }
          50% { transform: translateY(-10px) rotate(-5deg); }
          75% { transform: translateY(-25px) rotate(8deg); }
        }
        @keyframes burgerSpin {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(10deg) scale(1.05); }
          50% { transform: rotate(0deg) scale(1); }
          75% { transform: rotate(-10deg) scale(1.05); }
        }
        @keyframes burgerFactIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default HamburgerPage;
