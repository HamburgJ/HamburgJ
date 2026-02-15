import React, { useState, useEffect, useRef } from 'react';
import { OctocatSVG } from '../VibeCodingOverlay/Shared/Icons';

/**
 * A quick GitHub Pages "rebuild & deploy" success screen.
 * Shows after Copilot fixes something — simulates the site actually rebuilding.
 * Progress fills to 100%, shows a green ✓, then calls onComplete.
 */

interface RebuildDeployProps {
  onComplete: () => void;
  /** Total duration in ms (default 3200) */
  duration?: number;
}

const FONT_STACK =
  'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const RebuildDeploy: React.FC<RebuildDeployProps> = ({
  onComplete,
  duration = 3200,
}) => {
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // Stable ref for onComplete so the timeout effect doesn't reset
  // when the parent re-renders with a new callback reference
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Smooth progress → 100%
  useEffect(() => {
    const buildTime = duration * 0.65; // 65% of duration for the bar
    const start = performance.now();
    let raf: number;

    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / buildTime, 1);
      // Ease-out curve for natural feel
      const eased = 1 - Math.pow(1 - t, 2.5);
      setProgress(eased * 100);
      if (t < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setSuccess(true);
      }
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [duration]);

  // After success, brief pause → fade out → complete
  useEffect(() => {
    if (!success) return;
    const t1 = setTimeout(() => setFadeOut(true), 600);
    const t2 = setTimeout(() => onCompleteRef.current(), 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [success]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#f0f0f0',
        fontFamily: FONT_STACK,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease',
      }}
    >
      {/* GitHub-style header */}
      <div
        style={{
          background: '#24292e',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <OctocatSVG size={24} />
        <span
          style={{
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          GitHub Pages / hamburgj.github.io
        </span>
      </div>

      {/* Main card area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
        }}
      >
        <div
          style={{
            background: '#fff',
            border: '1px solid #d5d8db',
            borderRadius: '4px',
            padding: '40px 50px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: '13px',
              color: '#999',
              margin: '0 0 12px',
            }}
          >
            hamburgj.github.io
          </p>

          <h1
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: success ? '#1a7f37' : '#1a1a1a',
              margin: '0 0 24px',
              transition: 'color 0.3s ease',
            }}
          >
            {success ? '✓ Deploy successful' : 'Deploying to GitHub Pages'}
          </h1>

          <div
            style={{
              height: '4px',
              background: '#e8e8e8',
              borderRadius: '2px',
              overflow: 'hidden',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                height: '100%',
                background: success ? '#1a7f37' : '#3b82f6',
                borderRadius: '2px',
                width: `${progress}%`,
                transition: success
                  ? 'background 0.3s ease'
                  : 'none',
              }}
            />
          </div>

          <p
            style={{
              fontSize: '13px',
              color: '#777',
              margin: '0 0 6px',
            }}
          >
            {success ? (
              <>
                Site is live at{' '}
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                  hamburgj.github.io
                </span>
              </>
            ) : (
              <>
                Rebuilding from branch{' '}
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                  main
                </span>{' '}
                &middot; commit{' '}
                <span style={{ fontFamily: 'monospace' }}>a3f91d2</span>
              </>
            )}
          </p>

          <p
            style={{
              fontSize: '11px',
              color: '#bbb',
              borderTop: '1px solid #eee',
              paddingTop: '16px',
              margin: '20px 0 0',
            }}
          >
            github.com/HamburgJ &middot; GitHub Actions
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          background: '#fafbfc',
          borderTop: '1px solid #e1e4e8',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '12px',
          color: '#586069',
        }}
      >
        <OctocatSVG size={16} color="#586069" />
        <span>
          This site is deployed via GitHub Pages &middot; &copy; 2026 GitHub,
          Inc.
        </span>
      </div>
    </div>
  );
};

export default RebuildDeploy;
