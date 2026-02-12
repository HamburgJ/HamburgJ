import React, { useState, useEffect, useCallback } from 'react';
import { SitePhase } from '../../hooks/useSiteState';

interface VoidPageProps {
  navigateTo: (phase: SitePhase) => void;
}

const VoidPage: React.FC<VoidPageProps> = ({ navigateTo }) => {
  const [typed, setTyped] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [revealedLines, setRevealedLines] = useState<string[]>([]);

  const responses = [
    'You found the void.',
    'There is nothing here.',
    'And yet... you keep typing.',
    'Why?',
    'Are you looking for something?',
    'There is no easter egg here. Just darkness.',
    'Okay fine, the darkness is the easter egg.',
    'Congratulations.',
    'You can go back now.',
    '...or keep typing into the void, I guess.',
    'The void does not judge.',
    'The void is indifferent.',
    'The void is actually kind of hungry.',
    'For hamburgers, specifically.',
  ];

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      navigateTo('lobby');
      return;
    }
    if (e.key === 'Backspace') {
      setTyped(prev => prev.slice(0, -1));
      return;
    }
    if (e.key === 'Enter') {
      if (typed.trim()) {
        const idx = revealedLines.length % responses.length;
        setRevealedLines(prev => [...prev, responses[idx]]);
        setTyped('');
      }
      return;
    }
    if (e.key.length === 1) {
      setTyped(prev => prev + e.key);
    }
  }, [typed, revealedLines, navigateTo, responses]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000000',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Courier New', Courier, monospace",
      color: '#33ff33',
      fontSize: '16px',
      cursor: 'text',
      overflow: 'hidden',
    }}>
      {/* Back button */}
      <button
        onClick={() => navigateTo('lobby')}
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          background: 'none',
          border: '1px solid #33ff3344',
          color: '#33ff3366',
          fontFamily: "'Courier New', monospace",
          fontSize: '12px',
          padding: '6px 14px',
          cursor: 'pointer',
          borderRadius: '2px',
          transition: 'all 0.3s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#33ff33';
          e.currentTarget.style.color = '#33ff33';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#33ff3344';
          e.currentTarget.style.color = '#33ff3366';
        }}
      >
        [ESC] exit void
      </button>

      {/* Revealed lines */}
      <div style={{
        maxWidth: '600px',
        width: '90%',
        marginBottom: '40px',
      }}>
        {revealedLines.map((line, i) => (
          <div key={i} style={{
            opacity: 0,
            animation: `voidFadeIn 1.5s ease ${i * 0.1}s forwards`,
            marginBottom: '12px',
            color: i % 2 === 0 ? '#33ff33' : '#33ff3399',
          }}>
            &gt; {line}
          </div>
        ))}
      </div>

      {/* Typing area */}
      <div style={{
        maxWidth: '600px',
        width: '90%',
        minHeight: '24px',
      }}>
        <span style={{ color: '#33ff3366' }}>$ </span>
        <span>{typed}</span>
        <span style={{
          opacity: cursorVisible ? 1 : 0,
          transition: 'opacity 0.1s',
        }}>█</span>
      </div>

      {/* Hint */}
      <div style={{
        position: 'absolute',
        bottom: 30,
        color: '#33ff3333',
        fontSize: '11px',
        letterSpacing: '0.1em',
      }}>
        type something and press enter
      </div>

      <style>{`
        @keyframes voidFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default VoidPage;
