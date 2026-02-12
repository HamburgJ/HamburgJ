import React from 'react';

interface ScavengerHuntProps {
  progress: number[];
  totalClues: number;
}

const ScavengerHunt: React.FC<ScavengerHuntProps> = ({ progress, totalClues }) => {
  const allFound = progress.length >= totalClues;

  return (
    <>
      {/* Progress indicator */}
      <div className="scav-indicator" style={{
        position: 'fixed',
        bottom: '96px',
        left: '28px',
        zIndex: 998,
        fontFamily: "'Inter', sans-serif",
        fontSize: '12px',
        color: '#999',
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(8px)',
        padding: '6px 12px',
        borderRadius: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid rgba(0,0,0,0.06)',
        cursor: 'default',
        userSelect: 'none',
        transition: 'all 0.3s ease',
      }}>
        <span style={{ fontWeight: 600, color: allFound ? '#10b981' : '#6366f1' }}>
          {progress.length}/{totalClues}
        </span>
        <span style={{ marginLeft: '6px', color: '#bbb' }}>
          {allFound ? 'All clues found!' : 'clues found'}
        </span>
      </div>

      {/* Completion modal */}
      {allFound && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          animation: 'scavFadeIn 0.5s ease',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '48px',
            maxWidth: '440px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            animation: 'scavSlideUp 0.5s ease',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '24px',
              fontWeight: 700,
              color: '#111',
              marginBottom: '12px',
            }}>
              Certified Website Explorer
            </h2>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '15px',
              color: '#666',
              lineHeight: 1.6,
              marginBottom: '8px',
            }}>
              You found all {totalClues} hidden clues. Most people don't even scroll past the fold.
            </p>
            <p style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: 'italic',
              fontSize: '14px',
              color: '#999',
              lineHeight: 1.5,
            }}>
              This certificate is worth exactly nothing, but you earned it.
            </p>
            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
            }}>
              <p style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: '11px',
                color: '#999',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '4px',
              }}>
                Awarded to
              </p>
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '16px',
                fontWeight: 600,
                color: '#333',
              }}>
                A Very Curious Visitor
              </p>
              <p style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: '11px',
                color: '#bbb',
                marginTop: '8px',
              }}>
                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scavFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scavSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 480px) {
          .scav-indicator {
            bottom: 16px !important;
            left: 16px !important;
            font-size: 11px !important;
            padding: 5px 10px !important;
          }
        }
      `}</style>
    </>
  );
};

export default ScavengerHunt;
