import React, { useState, useEffect, useCallback, useRef } from 'react';
import VibeCodingOverlay from '../../VibeCodingOverlay/VibeCodingOverlay';
import HintTerminal from '../../VibeCodingOverlay/HintTerminal';
import {
  ABOUT_HINT_LINES,
  ABOUT_ERROR_JOSH_LINES,
  ABOUT_ERROR_TERMINAL_LINES,
  ABOUT_TO_PROJECTS_COPILOT,
} from '../../VibeCodingOverlay/sequences';
import type { VibeCodingSequence, TerminalLine } from '../../VibeCodingOverlay/VibeCodingOverlay';

interface AboutRoomProps {
  navigateTo: (phase: 'lobby' | 'projects') => void;
  autoSequence?: boolean;
  onSequenceComplete?: () => void;
}

const AboutRoom: React.FC<AboutRoomProps> = ({ navigateTo, autoSequence = false, onSequenceComplete }) => {
  const [viewerCount, setViewerCount] = useState(12);
  const [countdown, setCountdown] = useState({ h: 23, m: 59, s: 12 });
  const [showReactError, setShowReactError] = useState(false);
  const [vibeActive, setVibeActive] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const viewerInterval = setInterval(() => {
      setViewerCount((prev) => prev + Math.floor(Math.random() * 3) - 1);
    }, 3000);
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => {
      clearInterval(viewerInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  // Auto-sequence: after delay, show hint terminal if user hasn't clicked
  useEffect(() => {
    if (!autoSequence) return;
    autoTimerRef.current = setTimeout(() => {
      setHintVisible(true);
      // After hint is shown for a while, auto-trigger the bug
      hintTimerRef.current = setTimeout(() => {
        triggerBug();
      }, 10000);
    }, 12000);

    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, [autoSequence]);

  const triggerBug = useCallback(() => {
    if (showReactError || vibeActive) return;
    // Cancel all pending auto timers
    if (autoTimerRef.current) { clearTimeout(autoTimerRef.current); autoTimerRef.current = null; }
    if (hintTimerRef.current) { clearTimeout(hintTimerRef.current); hintTimerRef.current = null; }
    setHintVisible(false);
    setShowReactError(true);
    setTimeout(() => setVibeActive(true), 2000);
  }, [showReactError, vibeActive]);

  const handleAddToCart = useCallback(() => {
    triggerBug();
  }, [triggerBug]);

  const handleVibeComplete = useCallback(() => {
    setVibeActive(false);
    setShowReactError(false);
    if (onSequenceComplete) onSequenceComplete();
  }, [onSequenceComplete]);

  const allJoshLines: TerminalLine[] = [
    ...ABOUT_ERROR_JOSH_LINES,
    ...ABOUT_ERROR_TERMINAL_LINES,
  ];

  const vibeSequence: VibeCodingSequence = {
    joshLines: allJoshLines,
    copilotMessages: ABOUT_TO_PROJECTS_COPILOT,
    onComplete: handleVibeComplete,
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&display=swap');

        .about-room *, .about-room *::before, .about-room *::after {
          margin: 0; padding: 0; box-sizing: border-box;
        }
        .about-room {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #ffffff;
          color: #111827;
          height: 100vh;
          overflow: hidden;
          -webkit-font-smoothing: antialiased;
          display: flex;
          flex-direction: column;
        }

        /* NAV */
        .about-nav {
          flex-shrink: 0;
          padding: 12px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #f3f4f6;
          z-index: 100;
        }
        .about-nav-link {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #6b7280;
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: color 0.2s;
          cursor: pointer;
          background: none;
          border: none;
        }
        .about-nav-link:hover { color: #111827; }
        .about-nav-right { display: flex; gap: 20px; }

        /* MAIN LAYOUT */
        .about-main {
          flex: 1;
          min-height: 0;
          display: flex;
          overflow: hidden;
        }

        /* BIO PANEL (Left) */
        .about-bio {
          width: 42%;
          flex-shrink: 0;
          padding: 32px 40px 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow-y: auto;
          opacity: 0;
          transform: translateY(12px);
          animation: aboutFadeUp 0.5s ease forwards 0.1s;
        }
        .about-bio-highlights {
          list-style: none;
          padding: 0;
          margin: 16px 0 20px;
        }
        .about-bio-highlights li {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: #4b5563;
          padding: 7px 0;
          border-bottom: 1px solid #f3f4f6;
          line-height: 1.45;
        }
        .about-bio-highlights li:last-child { border-bottom: none; }

        .about-work-summary {
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
        }
        .about-work-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin: 0 0 8px;
        }
        .about-work-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .about-work-list li {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          color: #4b5563;
          padding: 4px 0;
          line-height: 1.4;
        }
        .about-work-date {
          color: #9ca3af;
          font-size: 11px;
          margin-left: 4px;
        }

        .about-bio-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #0a0a0a;
          display: inline;
        }
        .about-bio-name-accent {
          color: #0d9488;
        }
        .about-bio-role {
          font-size: 14px;
          color: #6b7280;
          margin-top: 2px;
        }
        .about-bio-tagline {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 13px;
          color: #9ca3af;
          margin-top: 2px;
        }

        /* COMPARISON SECTION (Right) */
        .about-comparison-section {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          padding: 16px 24px 0;
          overflow: hidden;
          border-left: 1px solid #f3f4f6;
        }
        .about-comparison-header {
          text-align: center;
          padding: 4px 0 10px;
          flex-shrink: 0;
          opacity: 0;
          transform: translateY(10px);
          animation: aboutFadeUp 0.5s ease forwards 0.2s;
        }
        .about-comparison-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #0a0a0a;
          line-height: 1.1;
        }
        .about-comparison-subtitle {
          font-size: 12px;
          color: #9ca3af;
        }
        .about-comparison-rating {
          font-size: 12px;
          color: #f59e0b;
          margin-top: 2px;
        }

        /* TABLE */
        .about-table-wrap {
          flex: 1; min-height: 0;
          overflow-y: auto; overflow-x: hidden;
          max-width: 1100px; margin: 0 auto; width: 100%;
          opacity: 0; transform: translateY(10px);
          animation: aboutFadeUp 0.5s ease forwards 0.35s;
        }
        .about-table-wrap::-webkit-scrollbar { width: 4px; }
        .about-table-wrap::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }

        .about-comparison-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 0 0 1px #e5e7eb, 0 2px 12px rgba(0,0,0,0.04);
        }
        .about-comparison-table thead {
          position: sticky; top: 0; z-index: 10;
        }
        .about-comparison-table thead th {
          padding: 14px 16px 12px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.08em;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        .about-comparison-table thead th:first-child {
          background: #f9fafb; color: #6b7280; width: 22%;
        }
        .about-col-normal {
          background: #f9fafb !important; color: #9ca3af !important;
          width: 30%; text-align: center !important;
        }
        .about-col-this {
          background: #111827 !important;
          color: white !important;
          width: 48%; text-align: center !important;
          position: relative;
        }
        .about-most-popular {
          position: absolute; top: -1px; left: 50%;
          transform: translateX(-50%);
          background: #0d9488; color: white;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 9px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          padding: 2px 10px; border-radius: 0 0 6px 6px;
        }

        .about-comparison-table tbody tr { transition: background 0.15s; }
        .about-comparison-table tbody tr:hover { background: #fafaff; }
        .about-comparison-table tbody td {
          padding: 10px 16px; font-size: 13px; line-height: 1.4;
          border-bottom: 1px solid #f3f4f6; vertical-align: middle;
        }
        .about-comparison-table tbody tr:last-child td { border-bottom: none; }
        .about-comparison-table tbody td:first-child {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600; color: #1f2937; font-size: 12px;
        }
        .about-comparison-table tbody td:nth-child(2) {
          text-align: center; color: #9ca3af; font-size: 12px;
        }
        .about-comparison-table tbody td:nth-child(3) {
          text-align: left; color: #374151; font-weight: 500;
          border-left: 2px solid #0d9488;
          background: rgba(13, 148, 136, 0.02);
          font-size: 12px;
        }

        .about-cell-boring { color: #c0c0c0 !important; font-style: italic; }
        .about-cell-fine-print {
          display: block; font-size: 9px; color: #9ca3af;
          font-style: italic; font-weight: 400; margin-top: 2px;
        }
        .about-cell-highlight {
          background: linear-gradient(to right, rgba(13,148,136,0.08), transparent);
          padding: 2px 4px; border-radius: 3px;
        }

        /* CTA ROW */
        .about-cta-row {
          flex-shrink: 0; text-align: left; padding: 4px 0;
          opacity: 0; animation: aboutFadeUp 0.4s ease forwards 0.5s;
        }
        .about-cta-button {
          display: inline-block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px; font-weight: 700; letter-spacing: 0.02em;
          color: white;
          background: #111827;
          padding: 10px 28px; border-radius: 8px;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
          cursor: pointer; border: none; position: relative;
        }
        .about-cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }
        .about-cta-fine-print { font-size: 10px; color: #9ca3af; margin-top: 4px; font-style: italic; }
        .about-urgency {
          display: inline-block; font-size: 11px; color: #dc2626;
          font-weight: 600; margin-left: 12px;
          animation: aboutPulse 1.5s ease infinite;
        }

        /* FLOATING INDICATORS */
        .about-viewers {
          position: fixed; bottom: 52px; left: 16px;
          background: #111827; color: white;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 11px; font-weight: 500;
          padding: 6px 12px; border-radius: 6px; z-index: 200;
          display: flex; align-items: center; gap: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          opacity: 0; animation: aboutSlideIn 0.6s ease forwards 1.2s;
        }
        .about-viewers-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #22c55e; animation: aboutPulse 1.5s ease infinite;
        }
        .about-countdown {
          position: fixed; bottom: 52px; right: 16px;
          background: #dc2626; color: white;
          font-family: 'Space Grotesk', monospace;
          font-size: 11px; font-weight: 600;
          padding: 6px 12px; border-radius: 6px; z-index: 200;
          box-shadow: 0 4px 12px rgba(220,38,38,0.3);
          opacity: 0; animation: aboutSlideIn 0.6s ease forwards 1.5s;
        }

        /* BOTTOM NAV */
        .about-bottom-nav {
          flex-shrink: 0; padding: 6px 32px;
          display: flex; justify-content: space-between; align-items: center;
          border-top: 1px solid #e5e7eb; background: #fff; z-index: 100;
        }
        .about-bottom-nav-link {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 12px; font-weight: 500; color: #6b7280;
          text-decoration: none; transition: color 0.2s;
          cursor: pointer; background: none; border: none;
        }
        .about-bottom-nav-link:hover { color: #111827; }
        .about-next-link {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px; font-weight: 600; color: #111827;
          display: flex; align-items: center; gap: 6px;
          text-decoration: none; transition: color 0.2s;
          cursor: pointer; background: none; border: none;
        }
        .about-next-link:hover { color: #0d9488; }
        .about-next-arrow {
          font-size: 16px; transition: transform 0.2s; display: inline-block;
        }
        .about-next-link:hover .about-next-arrow { transform: translateX(4px); }

        @keyframes aboutFadeUp { to { opacity: 1; transform: translateY(0); } }
        @keyframes aboutPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes aboutSlideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 860px) {
          .about-main { flex-direction: column; }
          .about-bio { width: 100%; padding: 12px 16px; }
          .about-comparison-section { border-left: none; border-top: 1px solid #f3f4f6; padding: 8px 8px 0; }
          .about-nav { padding: 10px 16px; }
          .about-comparison-table thead th,
          .about-comparison-table tbody td { padding: 8px 8px; font-size: 11px; }
          .about-bottom-nav { padding: 6px 16px; }
        }
        @media (max-width: 600px) {
          .about-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .about-comparison-table { min-width: 580px; }
        }
      `}</style>

      <div className="about-room">
        {/* NAV — hidden during auto-sequence */}
        {!autoSequence && (
        <nav className="about-nav">
          <button className="about-nav-link" onClick={() => navigateTo('lobby')}>
            &larr; Back to Lobby
          </button>
          <div className="about-nav-right">
            <span className="about-nav-link" style={{ color: '#111827', fontWeight: 600, cursor: 'default' }}>About</span>
            <button className="about-nav-link" onClick={() => navigateTo('projects')}>Projects</button>
          </div>
        </nav>
        )}

        <div className="about-main">
        {/* BIO PANEL (Left) */}
        <section className="about-bio">
          <div>
            <span className="about-bio-name">Joshua </span>
            <span className="about-bio-name about-bio-name-accent">Hamburger</span>
          </div>
          <div className="about-bio-role">
            Full-stack dev · Prompt engineer · Robot whisperer
          </div>
          <div className="about-bio-tagline">
            &ldquo;Injecting the human condition into unwitting robots.&rdquo;
          </div>

          <ul className="about-bio-highlights">
            <li><strong>Currently:</strong> Building AI sales agents at Expertise AI</li>
            <li><strong>Education:</strong> BASc Computer Engineering, University of Waterloo (Dean&apos;s Honours)</li>
            <li><strong>Side quests:</strong> Games about math, infinity, and five-letter words</li>
            <li><strong>This site:</strong> Built by a human and a very confident AI</li>
          </ul>

          {/* Condensed work history */}
          <div className="about-work-summary">
            <h3 className="about-work-title">Work History</h3>
            <ul className="about-work-list">
              <li><strong>Expertise AI</strong> — Software Developer <span className="about-work-date">2025–Present</span></li>
              <li><strong>Descartes Systems</strong> — Software Developer Co-op <span className="about-work-date">2024</span></li>
              <li><strong>CharityCAN</strong> — Full Stack Developer Co-op <span className="about-work-date">2022–2023</span></li>
              <li><strong>CASI</strong> — Embedded Software Developer <span className="about-work-date">2021–2022</span></li>
              <li><strong>Quilt.AI</strong> — Software Engineering Intern <span className="about-work-date">2021</span></li>
            </ul>
          </div>

          <div className="about-cta-row">
            <button
              className="about-cta-button"
              onClick={handleAddToCart}
            >
              🛒 Add to Cart — FREE
            </button>
            <div>
              <span className="about-urgency">🔴 Only 1 left in stock!</span>
              <p className="about-cta-fine-print">
                No credit card required. No features included.
              </p>
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="about-comparison-section">
          <div className="about-comparison-header">
            <h2 className="about-comparison-title">An Honest Comparison</h2>
            <p className="about-comparison-subtitle">
              Completely unbiased. I wrote both columns.
            </p>
          </div>

          <div className="about-table-wrap">
            <table className="about-comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th className="about-col-normal">Normal Portfolio</th>
                  <th className="about-col-this">
                    <span className="about-most-popular">RECOMMENDED</span>
                    This Website
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Hero Section</td>
                  <td className="about-cell-boring">"Hi, I'm a developer"</td>
                  <td>
                    <span className="about-cell-highlight">Cinematic loading sequence</span>
                    <span className="about-cell-fine-print">Complete with fake progress bar</span>
                  </td>
                </tr>

                <tr>
                  <td>Skills</td>
                  <td className="about-cell-boring">Progress bars (90%)</td>
                  <td>
                    No skill bars. If I were 90% at something I'd finish the other 10%
                  </td>
                </tr>

                <tr>
                  <td>Dark Mode</td>
                  <td className="about-cell-boring">Toggle switch</td>
                  <td>
                    Just keep scrolling, you'll find it
                  </td>
                </tr>

                <tr>
                  <td>AI-Powered</td>
                  <td>❌</td>
                  <td>
                    ✅ The AI already broke this page 30 seconds ago
                    <span className="about-cell-fine-print">That's a feature</span>
                  </td>
                </tr>

                <tr>
                  <td>Contact</td>
                  <td className="about-cell-boring">Contact form</td>
                  <td>
                    A chatbot that may or may not be napping
                    <span className="about-cell-fine-print">Response time: ¯\_(ツ)_/¯</span>
                  </td>
                </tr>

                <tr>
                  <td>Testimonials</td>
                  <td className="about-cell-boring"><em>"Great work" — Some Guy</em></td>
                  <td>
                    The chatbot said something nice once
                    <span className="about-cell-fine-print">Possibly hallucinating</span>
                  </td>
                </tr>

                <tr>
                  <td>Price</td>
                  <td className="about-cell-boring">$0</td>
                  <td>
                    <span style={{ textDecoration: 'line-through', color: '#9ca3af' }}>$999/mo</span>{' '}
                    → <strong style={{ color: '#0d9488' }}>FREE</strong>
                    <span className="about-cell-fine-print">Was never $999</span>
                  </td>
                </tr>

                <tr>
                  <td>Performance</td>
                  <td className="about-cell-boring">Lighthouse: 100</td>
                  <td>
                    It loads. Usually
                    <span className="about-cell-fine-print">Sometimes even on the first try</span>
                  </td>
                </tr>

                <tr>
                  <td>Design</td>
                  <td className="about-cell-boring">Figma → Code</td>
                  <td>
                    No Figma was harmed in the making of this site
                  </td>
                </tr>

                <tr>
                  <td>Mobile</td>
                  <td className="about-cell-boring">✓ Responsive</td>
                  <td>
                    Probably. I haven't checked on your phone specifically
                  </td>
                </tr>

                <tr>
                  <td>Guarantee</td>
                  <td className="about-cell-boring">N/A</td>
                  <td>
                    30-day money-back guarantee
                    <span className="about-cell-fine-print">There is no money</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </section>
        </div>{/* close about-main */}

        {/* BOTTOM NAV — only show when not in auto-sequence */}
        {!autoSequence && (
          <div className="about-bottom-nav">
            <button className="about-bottom-nav-link" onClick={() => navigateTo('lobby')}>
              &larr; Lobby
            </button>
            <button className="about-next-link" onClick={() => navigateTo('projects')}>
              Next: Projects <span className="about-next-arrow">&rarr;</span>
            </button>
          </div>
        )}

        {/* FLOATING INDICATORS */}
        {!vibeActive && !showReactError && (
          <>
            <div className="about-viewers">
              <div className="about-viewers-dot" />
              👀 {Math.max(1, viewerCount)} people viewing this developer right now
            </div>
            <div className="about-countdown">
              ⏰ Offer expires in {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
            </div>
          </>
        )}
      </div>

      {/* Fake React Error Boundary */}
      {showReactError && !vibeActive && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#1e1e1e',
          color: '#f44747',
          fontFamily: 'monospace',
          padding: '40px',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          overflow: 'auto',
        }}>
          <h1 style={{ color: '#f44747', fontSize: '2rem', marginBottom: '1rem' }}>
            Unhandled Runtime Error
          </h1>
          <div style={{
            backgroundColor: '#2d2020',
            border: '1px solid #f44747',
            borderRadius: '4px',
            padding: '16px',
            marginBottom: '1rem',
          }}>
            <p style={{ color: '#f44747', fontSize: '1.1rem', margin: '0 0 12px 0' }}>
              TypeError: Cannot read properties of undefined (reading 'checkout')
            </p>
            <p style={{ color: '#888', fontSize: '0.85rem', margin: 0, lineHeight: 1.7 }}>
              at CartProvider.addItem (Cart.tsx:42:18)<br/>
              at AboutRoom.handleAddToCart (AboutRoom.tsx:156:9)<br/>
              at onClick (AboutRoom.tsx:204:22)<br/>
              at HTMLButtonElement.dispatch (react-dom.production.min.js:44)<br/>
              at HTMLButtonElement.handleClick (react-dom.production.min.js:44)
            </p>
          </div>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>
            There is no cart. There was never a cart.
          </p>
        </div>
      )}

      {/* Hint Terminal (compact, shown if user doesn't click Add to Cart) */}
      <HintTerminal lines={ABOUT_HINT_LINES} visible={hintVisible && !showReactError && !vibeActive} />

      {/* VibeCoding Overlay */}
      <VibeCodingOverlay sequence={vibeSequence} active={vibeActive} />
    </>
  );
};

export default AboutRoom;
