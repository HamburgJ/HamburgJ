import React from 'react';

interface UnderworldProps {
  navigateTo: (phase: 'lobby') => void;
  collectClue: (clueId: number) => void;
}

const Underworld: React.FC<UnderworldProps> = ({ navigateTo, collectClue }) => {
  return (
    <div style={{
      minHeight: '9000px',
      background: 'linear-gradient(to bottom, #ffffff, #000000)',
      fontFamily: "'Instrument Serif', Georgia, serif",
      position: 'relative',
    }}>
      {/* Back to lobby - top */}
      <button
        onClick={() => {
          navigateTo('lobby');
        }}
        style={{
          position: 'fixed',
          top: '24px',
          left: '28px',
          zIndex: 100,
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: '0.9rem',
          color: '#999',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          opacity: 0.7,
          transition: 'opacity 0.3s',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '0.7'; }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        back to lobby
      </button>

      {/* Text 1 */}
      <div style={{
        position: 'absolute',
        top: '2000px',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: '17px',
        letterSpacing: '0.02em',
        lineHeight: 1.6,
        color: '#444444',
        padding: '0 24px',
      }}>
        There's nothing else down here.
      </div>

      {/* Text 2 */}
      <div style={{
        position: 'absolute',
        top: '5000px',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: '17px',
        letterSpacing: '0.02em',
        lineHeight: 1.6,
        color: '#cccccc',
        padding: '0 24px',
      }}>
        You're still scrolling?
      </div>

      {/* Text 3 - scavenger hunt clue hidden here */}
      <div
        style={{
          position: 'absolute',
          top: '8000px',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: '17px',
          letterSpacing: '0.02em',
          lineHeight: 1.6,
          color: '#ffffff',
          padding: '0 24px',
          maxWidth: '480px',
          margin: '0 auto',
          cursor: 'default',
        }}
        onClick={() => collectClue(4)}
      >
        Okay, fine. You found it. There's nothing here. But you looked, and that's something.
      </div>

      {/* Back to lobby - bottom */}
      <button
        onClick={() => {
          navigateTo('lobby');
        }}
        style={{
          position: 'absolute',
          top: '8700px',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: '13px',
          color: '#666666',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'color 0.3s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#999999'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#666666'; }}
      >
        ↑ back to lobby
      </button>
    </div>
  );
};

export default Underworld;
