import React, { useState, useCallback } from 'react';
import VibeCodingOverlay from '../../VibeCodingOverlay/VibeCodingOverlay';
import DeveloperShop from './DeveloperShop';
import {
  ABOUT_ERROR_JOSH_LINES,
  ABOUT_ERROR_TERMINAL_LINES,
  ABOUT_TO_LOBBY_COPILOT,
} from '../../VibeCodingOverlay/sequences';
import type { VibeCodingSequence, TerminalLine } from '../../VibeCodingOverlay/VibeCodingOverlay';

interface AboutRoomProps {
  navigateTo: (phase: 'lobby' | 'projects') => void;
}

const AboutRoom: React.FC<AboutRoomProps> = ({ navigateTo }) => {
  const [showReactError, setShowReactError] = useState(false);
  const [vibeActive, setVibeActive] = useState(false);
  const [showShop, setShowShop] = useState(false);

  // "Add to Cart" easter egg — triggers fake React error → VibeCoding overlay
  const handleAddToCart = useCallback(() => {
    if (showReactError || vibeActive) return;
    setShowReactError(true);
    setTimeout(() => setVibeActive(true), 2000);
  }, [showReactError, vibeActive]);

  const handleVibeComplete = useCallback(() => {
    setVibeActive(false);
    setShowReactError(false);
  }, []);

  const allJoshLines: TerminalLine[] = [...ABOUT_ERROR_JOSH_LINES, ...ABOUT_ERROR_TERMINAL_LINES];

  const vibeSequence: VibeCodingSequence = {
    joshLines: allJoshLines,
    copilotMessages: ABOUT_TO_LOBBY_COPILOT,
    onComplete: handleVibeComplete,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700&display=swap');

        /* ═══════════════════════════════════════
           ABOUT ROOM — v3 editorial table
           ═══════════════════════════════════════ */
        .about-room *, .about-room *::before, .about-room *::after {
          margin: 0; padding: 0; box-sizing: border-box;
        }
        .about-room {
          font-family: 'Lato', sans-serif;
          background: #fff;
          color: #111;
          height: 100vh;
          overflow: hidden;
          -webkit-font-smoothing: antialiased;
          display: flex;
          flex-direction: column;
        }

        /* ── TWO-COLUMN LAYOUT ── */
        .about-layout {
          display: flex;
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }

        /* ── LEFT COLUMN ── */
        .about-left {
          width: 40%;
          background: #fafafa;
          border-right: 1px solid #ddd;
          padding: 48px 40px 80px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
        }

        .about-name h1 {
          font-weight: 900;
          font-size: 46px;
          line-height: 1.05;
          letter-spacing: -1px;
          margin-bottom: 18px;
        }

        .about-name-rule {
          width: 100%;
          height: 2.5px;
          background: #111;
          margin-bottom: 28px;
        }

        .about-section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 10px;
          margin-top: 22px;
        }

        /* Education */
        .about-edu-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }
        .about-edu-row img {
          width: 36px;
          height: 36px;
          object-fit: contain;
        }
        .about-edu-text {
          font-size: 14px;
          line-height: 1.35;
        }
        .about-edu-text strong { font-weight: 700; }
        .about-edu-text span { color: #666; font-size: 12px; }

        /* Experience list */
        .about-exp-list { list-style: none; }
        .about-exp-list li {
          font-size: 13px;
          line-height: 1.55;
          padding: 3px 0;
          display: flex;
          justify-content: space-between;
        }
        .about-exp-list .role { font-weight: 700; }
        .about-exp-list .dates { color: #888; font-size: 12px; white-space: nowrap; margin-left: 8px; }

        /* Contact */
        .about-contact {
          margin-top: 22px;
          font-size: 12px;
          color: #666;
          line-height: 1.7;
        }
        .about-contact a {
          color: #111;
          text-decoration: none;
          border-bottom: 1px solid #ccc;
        }
        .about-contact a:hover { border-color: #111; }

        /* ── RIGHT COLUMN ── */
        .about-right {
          width: 60%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 40px 48px 80px;
          position: relative;
          overflow: hidden;
        }

        .about-table-wrapper {
          width: 100%;
          max-width: 600px;
        }

        /* Title area */
        .about-table-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 4px;
        }
        .about-table-title h2 {
          font-size: 26px;
          font-weight: 900;
          letter-spacing: -0.5px;
        }
        .about-quill {
          font-size: 22px;
          display: inline-block;
          animation: aboutQuillWrite 2s ease-in-out infinite;
          transform-origin: bottom center;
        }
        @keyframes aboutQuillWrite {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }

        .about-table-subtitle {
          font-size: 14px;
          font-style: italic;
          color: #999;
          margin-bottom: 12px;
        }
        .about-title-rule {
          width: 100%;
          height: 1px;
          background: #ccc;
          margin-bottom: 22px;
        }

        /* ── TABLE ── */
        .about-table {
          width: 100%;
          border-collapse: collapse;
        }

        .about-table thead th {
          padding: 14px 16px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          text-align: center;
          border: 2px solid #111;
        }
        .about-table thead th:first-child {
          text-align: left;
          background: transparent;
          border: none;
          border-bottom: 2px solid #111;
          width: 42%;
        }
        .about-table thead th.about-th-other {
          background: #333;
          color: #fff;
        }
        .about-table thead th.about-th-portfolio {
          background: #111;
          color: #fff;
          position: relative;
          overflow: hidden;
        }

        /* ink-drop on portfolio header */
        .about-table thead th.about-th-portfolio::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 10px;
          height: 10px;
          background: rgba(255,255,255,0.12);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          animation: aboutInkDrop 1.2s ease-out 0.6s forwards;
        }
        @keyframes aboutInkDrop {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(28); opacity: 0; }
        }

        .about-star {
          display: inline-block;
          color: #f59e42;
          font-size: 16px;
          margin-left: 6px;
          animation: aboutRotateStar 8s linear infinite;
        }
        @keyframes aboutRotateStar {
          to { transform: rotate(360deg); }
        }

        .about-table tbody tr {
          opacity: 0;
          transform: translateX(40px);
          animation: aboutRowSlide 0.45s ease-out forwards;
        }
        @keyframes aboutRowSlide {
          to { opacity: 1; transform: translateX(0); }
        }
        .about-table tbody tr:nth-child(1) { animation-delay: 0.15s; }
        .about-table tbody tr:nth-child(2) { animation-delay: 0.20s; }
        .about-table tbody tr:nth-child(3) { animation-delay: 0.25s; }
        .about-table tbody tr:nth-child(4) { animation-delay: 0.30s; }
        .about-table tbody tr:nth-child(5) { animation-delay: 0.35s; }
        .about-table tbody tr:nth-child(6) { animation-delay: 0.40s; }
        .about-table tbody tr:nth-child(7) { animation-delay: 0.45s; }
        .about-table tbody tr:nth-child(8) { animation-delay: 0.50s; }

        .about-table tbody td {
          padding: 11px 16px;
          border-bottom: 1px solid #ddd;
          vertical-align: middle;
        }
        .about-table tbody td:first-child {
          text-align: left;
        }
        .about-table tbody td:nth-child(2),
        .about-table tbody td:nth-child(3) {
          text-align: center;
          border-left: 1px solid #ddd;
        }

        .about-feat-name {
          font-size: 16px;
          font-weight: 700;
          line-height: 1.25;
        }
        .about-feat-detail {
          font-size: 13px;
          font-style: italic;
          color: #888;
          margin-top: 2px;
        }

        .about-mark {
          font-size: 22px;
          font-weight: 700;
        }
        .about-mark-yes { color: #1a9e3f; }
        .about-mark-no  { color: #d32f2f; }

        /* Price row */
        .about-table tr.about-price-row td {
          border-top: 4px double #111;
          padding-top: 14px;
          font-size: 16px;
          font-weight: 700;
        }
        .about-table tr.about-price-row td:nth-child(2) { color: #888; }
        .about-table tr.about-price-row td:nth-child(3) { color: #111; }

        /* ── CTA AREA ── */
        .about-cta-area {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 22px;
          justify-content: flex-end;
        }

        .about-cta-btn {
          display: inline-block;
          padding: 14px 34px;
          background: #111;
          color: #fff;
          font-family: 'Lato', sans-serif;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.5px;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          animation: aboutBreathe 3s ease-in-out infinite;
          transition: transform 0.3s ease;
        }
        .about-cta-btn:hover {
          transform: scale(1.04);
        }

        /* Breathing box-shadow pulse */
        @keyframes aboutBreathe {
          0%, 100% { box-shadow: 0 2px 8px rgba(0,0,0,0.18); }
          50% { box-shadow: 0 4px 24px rgba(0,0,0,0.35); }
        }

        /* Shimmer sweep */
        .about-cta-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
          animation: aboutShimmer 4s ease-in-out infinite;
        }
        @keyframes aboutShimmer {
          0%   { left: -100%; }
          50%  { left: 140%; }
          100% { left: 140%; }
        }

        /* Best Value typewriter */
        .about-best-value {
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #f59e42;
          white-space: nowrap;
          overflow: hidden;
          border-right: 2px solid #f59e42;
          width: 0;
          animation: aboutTypewriter 2s steps(10) 1.2s forwards, aboutBlink 0.6s step-end infinite;
        }
        @keyframes aboutTypewriter {
          to { width: 10ch; }
        }
        @keyframes aboutBlink {
          50% { border-color: transparent; }
        }

        /* ── FINE PRINT ── */
        .about-fine-print {
          margin-top: 14px;
          font-size: 11px;
          font-style: italic;
          color: #bbb;
          line-height: 1.5;
          text-align: center;
        }

        /* ── BOTTOM NAV ── */
        .about-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          background: #111;
          z-index: 100;
        }
        .about-bottom-nav button {
          color: #999;
          font-family: 'Lato', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .about-bottom-nav button:hover { color: #fff; }

        @media (max-width: 768px) {
          .about-layout { flex-direction: column; }
          .about-left { width: 100%; padding: 24px 20px 20px; }
          .about-right { width: 100%; padding: 20px; }
          .about-name h1 { font-size: 32px; }
          .about-table-title h2 { font-size: 20px; }
          .about-feat-name { font-size: 14px; }
          .about-mark { font-size: 18px; }
        }
      `}</style>

      <div className="about-room">

        {/* ── TWO-COLUMN LAYOUT ── */}
        <div className="about-layout">

          {/* ── LEFT: Resume ── */}
          <div className="about-left">
            <div className="about-name">
              <h1>Joshua<br/>Hamburger</h1>
            </div>
            <div className="about-name-rule"></div>

            {/* Education */}
            <div className="about-section-label">Education</div>
            <div className="about-edu-row">
              <img src={`${process.env.PUBLIC_URL}/images/University_of_Waterloo_seal.svg.png`} alt="UWaterloo" />
              <div className="about-edu-text">
                <strong>University of Waterloo</strong><br/>
                <span>BASc Computer Engineering · Dean&apos;s Honours</span>
              </div>
            </div>

            {/* Experience */}
            <div className="about-section-label">Experience</div>
            <ul className="about-exp-list">
              <li><span className="role">Expertise AI — Software Developer</span><span className="dates">2025–Present</span></li>
              <li><span className="role">Descartes Systems — Software Developer Co-op</span><span className="dates">2024</span></li>
              <li><span className="role">CharityCAN — Full Stack Developer Co-op</span><span className="dates">2022–2023</span></li>
              <li><span className="role">CASI — Embedded Software Developer</span><span className="dates">2021–2022</span></li>
              <li><span className="role">Quilt.AI — Software Engineering Intern</span><span className="dates">2021</span></li>
            </ul>

            {/* Contact */}
            <div className="about-contact">
              <div className="about-section-label" style={{ marginTop: 22 }}>Contact</div>
              <a href="https://github.com/HamburgJ" target="_blank" rel="noopener noreferrer">github.com/HamburgJ</a><br/>
              <a href="https://linkedin.com/in/joshuahamburger" target="_blank" rel="noopener noreferrer">linkedin.com/in/joshuahamburger</a><br/>
              <a href="mailto:josh@hamburger.dev">josh@hamburger.dev</a>
            </div>
          </div>

          {/* ── RIGHT: Comparison Table / Shop ── */}
          <div className="about-right">
            {showShop ? (
              <DeveloperShop onClose={() => setShowShop(false)} />
            ) : (
            <div className="about-table-wrapper">

              <div className="about-table-title" onClick={() => setShowShop(true)} style={{ cursor: 'pointer' }} title="Click to browse the full shop...">
                <h2>Select Your Developer</h2>
                <span className="about-quill">✒</span>
              </div>
              <p className="about-table-subtitle">A side-by-side comparison</p>
              <div className="about-title-rule"></div>

              <table className="about-table">
                <thead>
                  <tr>
                    <th></th>
                    <th className="about-th-other">The Other Guy</th>
                    <th className="about-th-portfolio">This Portfolio<span className="about-star">★</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="about-feat-name">Clean Code</div>
                      <div className="about-feat-detail">Readable, maintainable</div>
                    </td>
                    <td><span className="about-mark about-mark-no">✗</span></td>
                    <td><span className="about-mark about-mark-yes">✓</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="about-feat-name">Full-Stack</div>
                      <div className="about-feat-detail">Front-end to back-end</div>
                    </td>
                    <td><span className="about-mark about-mark-no">✗</span></td>
                    <td><span className="about-mark about-mark-yes">✓</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="about-feat-name">Reads Error Messages</div>
                      <div className="about-feat-detail">The whole stack trace</div>
                    </td>
                    <td><span className="about-mark about-mark-no">✗</span></td>
                    <td><span className="about-mark about-mark-yes">✓</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="about-feat-name">Deploys on Fridays</div>
                      <div className="about-feat-detail">And doesn&apos;t get fired</div>
                    </td>
                    <td><span className="about-mark about-mark-no">✗</span></td>
                    <td><span className="about-mark about-mark-yes">✓</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="about-feat-name">Code Comments</div>
                      <div className="about-feat-detail">Mostly apologies</div>
                    </td>
                    <td><span className="about-mark about-mark-no">✗</span></td>
                    <td><span className="about-mark about-mark-yes">✓</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="about-feat-name">Has a Portfolio Site</div>
                      <div className="about-feat-detail">You&apos;re on it right now</div>
                    </td>
                    <td><span className="about-mark about-mark-no">✗</span></td>
                    <td><span className="about-mark about-mark-yes">✓</span></td>
                  </tr>
                  <tr className="about-price-row">
                    <td>Price</td>
                    <td>$$$</td>
                    <td style={{ color: '#1a9e3f' }}>Free</td>
                  </tr>
                </tbody>
              </table>

              <div className="about-cta-area">
                <span className="about-best-value">BEST VALUE</span>
                <button className="about-cta-btn" onClick={handleAddToCart}>🛒 Add to Cart</button>
              </div>

              <p className="about-fine-print">
                * No developers were harmed in the making of this comparison table. Results not guaranteed.
              </p>

            </div>
            )}
          </div>

        </div>

        {/* BOTTOM NAV */}
          <nav className="about-bottom-nav">
            <button onClick={() => navigateTo('lobby')}>
              &larr; Lobby
            </button>
            <button onClick={() => navigateTo('projects')}>
              See what I&apos;ve built &rarr;
            </button>
          </nav>

      </div>

      {/* Fake React Error Boundary */}
      {showReactError && (
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
            There is no CartProvider wrapping this component.
          </p>
        </div>
      )}

      {/* VibeCoding Overlay (easter egg — triggered by "Add to Cart") */}
      <VibeCodingOverlay sequence={vibeSequence} active={vibeActive} />
    </>
  );
};

export default AboutRoom;
