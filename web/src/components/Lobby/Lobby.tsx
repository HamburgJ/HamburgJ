import React, { useRef, useCallback, useState, useEffect } from 'react';
import DocumentsDrawer from './DocumentsDrawer';

interface LobbyProps {
  navigateTo: (phase: 'about' | 'projects') => void;
  firstArrival?: boolean;
}

const Lobby: React.FC<LobbyProps> = ({ navigateTo, firstArrival = false }) => {
  const lobbyTopRef = useRef<HTMLDivElement>(null);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(firstArrival);

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const scrollToTop = useCallback(() => {
    lobbyTopRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,800;1,9..144,400&family=Inter:wght@300;400;600&family=Crimson+Pro:ital@1&family=Instrument+Serif&display=swap');

        @keyframes lobbyFloat1 {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50% { transform: translateY(-8px) rotate(-2deg); }
        }
        @keyframes lobbyFloat2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(0.5deg); }
        }
        @keyframes lobbyFloat3 {
          0%, 100% { transform: translateY(0px) rotate(2deg); }
          50% { transform: translateY(-7px) rotate(3deg); }
        }
        @keyframes lobbyPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes lobbyBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        @keyframes lobbyWelcomeFade {
          0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
          10% { opacity: 1; transform: translateX(-50%) translateY(0); }
          80% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-5px); }
        }


        .lobby-root {
          position: relative;
          background: #fcfbf9;
          overflow-x: hidden;
        }

        .lobby-hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px 40px;
          background: radial-gradient(ellipse at 50% 40%, rgba(255,252,240,0.7) 0%, transparent 70%);
        }

        .lobby-name {
          font-family: 'Fraunces', serif;
          font-size: 3.2rem;
          font-weight: 800;
          letter-spacing: -1px;
          color: #1a1a1a;
          margin: 0 0 10px;
          text-align: center;
        }

        .lobby-tagline {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 1.15rem;
          color: #666;
          margin: 0 0 12px;
          text-align: center;
          max-width: 500px;
        }

        .lobby-bio {
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          color: #777;
          font-weight: 300;
          margin: 0 0 60px;
          text-align: center;
          max-width: 520px;
          line-height: 1.5;
        }

        /* Portals row */
        .lobby-portals {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 70px;
          margin-bottom: 60px;
          flex-wrap: wrap;
        }

        .lobby-portal-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          outline: none;
        }

        .lobby-portal-label {
          font-family: 'Inter', sans-serif;
          font-size: 0.82rem;
          text-transform: uppercase;
          color: #999;
          letter-spacing: 0.04em;
          margin-top: 16px;
          transition: transform 0.25s ease;
        }

        .lobby-portal-wrapper:hover .lobby-portal-label {
          transform: scale(1.06);
        }

        /* Sticky Note */
        .lobby-sticky {
          width: 180px;
          height: 180px;
          background: #fff9c4;
          border-radius: 2px;
          box-shadow: 2px 3px 10px rgba(0,0,0,0.10);
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          animation: lobbyFloat1 4s ease-in-out infinite;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease;
        }
        .lobby-portal-wrapper:hover .lobby-sticky {
          transform: translateY(-10px) scale(1.04) rotate(0deg);
          box-shadow: 3px 8px 20px rgba(0,0,0,0.15);
          animation: none;
        }
        .lobby-sticky-pin {
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: radial-gradient(circle at 40% 35%, #e85454, #b71c1c);
          box-shadow: 0 1px 3px rgba(0,0,0,0.25);
          border: 1.5px solid #c0c0c0;
        }
        .lobby-sticky-title {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          color: #5a4a00;
          margin-top: 10px;
        }
        .lobby-sticky-sub {
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem;
          color: #8a7a30;
          margin-top: 4px;
          font-weight: 300;
        }

        /* Manila Folder */
        .lobby-folder {
          width: 210px;
          height: 170px;
          background: #f0d9a0;
          border-radius: 3px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 2px 3px 10px rgba(0,0,0,0.10);
          animation: lobbyFloat2 4.5s ease-in-out infinite;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease;
        }
        .lobby-portal-wrapper:hover .lobby-folder {
          transform: translateY(-10px) scale(1.04);
          box-shadow: 3px 8px 20px rgba(0,0,0,0.15);
          animation: none;
        }
        .lobby-folder::before {
          content: '';
          position: absolute;
          top: -14px;
          left: 20px;
          width: 70px;
          height: 18px;
          background: #e8cc8a;
          border-radius: 4px 4px 0 0;
        }
        .lobby-folder::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 15px;
          right: 15px;
          height: 8px;
          background: #fff;
          border-radius: 0 0 2px 2px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .lobby-folder-title {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          color: #6b5520;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .lobby-folder-sub {
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem;
          color: #9a8550;
          margin-top: 6px;
          font-weight: 300;
        }

        /* Diploma */
        .lobby-diploma {
          width: 185px;
          height: 180px;
          background: #fffef8;
          border: 2px solid #d4c9a8;
          border-radius: 2px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 2px 3px 10px rgba(0,0,0,0.08);
          animation: lobbyFloat3 5s ease-in-out infinite;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease;
          padding: 12px;
        }
        .lobby-portal-wrapper:hover .lobby-diploma {
          transform: translateY(-10px) scale(1.04) rotate(0deg);
          box-shadow: 3px 8px 20px rgba(0,0,0,0.14);
          animation: none;
        }
        .lobby-diploma-cap {
          width: 30px;
          height: 20px;
          position: relative;
          margin-bottom: 6px;
        }
        .lobby-diploma-cap-board {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%) rotate(-5deg);
          width: 30px;
          height: 6px;
          background: #333;
          border-radius: 1px;
        }
        .lobby-diploma-cap-top {
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 16px solid transparent;
          border-right: 16px solid transparent;
          border-bottom: 12px solid #333;
        }
        .lobby-diploma-cap-tassel {
          position: absolute;
          bottom: 0;
          right: 1px;
          width: 2px;
          height: 10px;
          background: #c9a832;
        }
        .lobby-diploma-cap-tassel-end {
          position: absolute;
          bottom: -2px;
          right: -1px;
          width: 6px;
          height: 4px;
          background: #c9a832;
          border-radius: 0 0 3px 3px;
        }
        .lobby-diploma-title {
          font-family: 'Fraunces', serif;
          font-size: 1.05rem;
          color: #3a3520;
          margin-top: 2px;
        }
        .lobby-diploma-sub {
          font-family: 'Inter', sans-serif;
          font-size: 0.68rem;
          color: #999;
          margin-top: 4px;
          text-align: center;
          line-height: 1.35;
          font-weight: 300;
        }
        .lobby-diploma-seal {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: radial-gradient(circle at 40% 35%, #f0d060, #c9a832, #a08520);
          margin-top: 10px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.12);
          border: 1.5px solid #b89c2a;
        }

        /* Projects Portal */
        .lobby-projects {
          width: 190px;
          height: 170px;
          background: #1a1a2e;
          border-radius: 6px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 2px 3px 10px rgba(0,0,0,0.15);
          animation: lobbyFloat2 5.2s ease-in-out infinite;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease;
          overflow: hidden;
        }
        .lobby-portal-wrapper:hover .lobby-projects {
          transform: translateY(-10px) scale(1.04);
          box-shadow: 3px 8px 24px rgba(92,107,188,0.3);
          animation: none;
        }
        .lobby-projects::before {
          content: '>';
          position: absolute;
          top: 16px;
          left: 18px;
          font-family: 'Courier Prime', monospace;
          font-size: 0.75rem;
          color: rgba(92,107,188,0.5);
          animation: lobbyPulse 2s ease-in-out infinite;
        }
        .lobby-projects-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          margin-bottom: 10px;
        }
        .lobby-projects-dot {
          width: 16px;
          height: 16px;
          border-radius: 3px;
          opacity: 0.8;
        }
        .lobby-projects-title {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.92rem;
          color: #e0e0ff;
          letter-spacing: 0.03em;
        }
        .lobby-projects-sub {
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          color: rgba(200,200,255,0.5);
          margin-top: 4px;
          font-weight: 300;
        }

        /* Contact */
        .lobby-contact {
          display: flex;
          align-items: center;
          gap: 28px;
          border-top: 1px solid #eee;
          padding-top: 20px;
          margin-bottom: 40px;
        }
        .lobby-contact a {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          color: #999;
          text-decoration: none;
          transition: color 0.2s;
        }
        .lobby-contact a:hover {
          color: #555;
        }
        .lobby-contact svg {
          width: 16px;
          height: 16px;
          fill: currentColor;
        }



        /* Descent zone */
        .lobby-spacer {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fcfbf9;
        }
        .lobby-spacer-text {
          font-family: 'Crimson Pro', serif;
          font-style: italic;
          font-size: 0.85rem;
          color: #ccc;
          animation: lobbyPulse 3s ease-in-out infinite;
        }
        .lobby-gradient {
          height: 9000px;
          background: linear-gradient(to bottom, #fcfbf9 0%, #000000 35%, #000000 100%);
          position: relative;
        }
        .lobby-gradient-arrow {
          position: absolute;
          top: 600px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 1.8rem;
          color: rgba(150,150,150,0.3);
          animation: lobbyBob 2.5s ease-in-out infinite;
          user-select: none;
        }
        .lobby-gradient-text {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Instrument Serif', serif;
          font-size: 17px;
          text-align: center;
          max-width: 400px;
          line-height: 1.5;
          user-select: none;
        }
        .lobby-back-link {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Instrument Serif', serif;
          font-size: 13px;
          color: #666;
          cursor: pointer;
          background: none;
          border: none;
          padding: 8px 16px;
          transition: color 0.2s;
        }
        .lobby-back-link:hover {
          color: #999;
        }

        /* Explorer folder icon */
        .lobby-folder-icon {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #888;
          transition: color 0.3s ease, transform 0.3s ease;
          background: none;
          border: none;
          padding: 16px;
        }
        .lobby-folder-icon:hover {
          color: #e2b340;
          transform: translateX(-50%) scale(1.1);
        }

        /* Responsive */
        @media (max-width: 800px) {
          .lobby-name { font-size: 2.4rem; }
          .lobby-tagline { font-size: 1rem; }
          .lobby-portals { gap: 40px; }
          .lobby-sticky { width: 150px; height: 150px; }
          .lobby-folder { width: 175px; height: 145px; }
          .lobby-diploma { width: 155px; height: 155px; }
          .lobby-projects { width: 160px; height: 145px; }
        }
        @media (max-width: 580px) {
          .lobby-portals {
            flex-direction: column;
            align-items: center;
            gap: 36px;
          }
          .lobby-name { font-size: 2rem; }
          .lobby-tagline { font-size: 0.95rem; }
          .lobby-bio { font-size: 0.88rem; }
          .lobby-contact { gap: 18px; flex-wrap: wrap; justify-content: center; }
        }
      `}</style>

      <div className="lobby-root" ref={lobbyTopRef}>
        {/* Documents Drawer */}
        <DocumentsDrawer isOpen={explorerOpen} onClose={() => setExplorerOpen(false)} />

        {/* Hero / Main Lobby */}
        <div className="lobby-hero">
          {/* Welcome banner — only on first arrival from auto-sequence */}
          {showWelcome && (
            <div style={{
              position: 'fixed',
              bottom: 28,
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: '"SF Mono", "Fira Code", "Consolas", monospace',
              fontSize: '0.82rem',
              color: '#888',
              background: 'rgba(30,30,30,0.92)',
              border: '1px solid #333',
              borderRadius: '8px',
              padding: '10px 20px',
              zIndex: 9000,
              backdropFilter: 'blur(8px)',
              animation: 'lobbyWelcomeFade 5s ease forwards',
              whiteSpace: 'nowrap',
            }}>
              <span style={{ color: '#666' }}>$</span>{' '}
              <span style={{ color: '#aaa' }}>ok, I think it's working now. take a look around.</span>
            </div>
          )}

          <h1 className="lobby-name">Joshua Hamburger</h1>
          <p className="lobby-tagline">Injecting the human condition into unwitting robots.</p>
          <p className="lobby-bio">
            Software developer at Expertise AI. Waterloo CE grad. Makes games about math and infinity.
          </p>

          {/* Portal Objects */}
          <div className="lobby-portals">
            {/* About Me — Sticky Note */}
            <button className="lobby-portal-wrapper" onClick={() => navigateTo('about')} aria-label="About Me">
              <div className="lobby-sticky">
                <div className="lobby-sticky-pin" />
                <span className="lobby-sticky-title">About Me</span>
                <span className="lobby-sticky-sub">who is this guy?</span>
              </div>
              <span className="lobby-portal-label">About</span>
            </button>

            {/* Projects — Dark Terminal Card */}
            <button className="lobby-portal-wrapper" onClick={() => navigateTo('projects')} aria-label="Projects">
              <div className="lobby-projects">
                <div className="lobby-projects-grid">
                  <div className="lobby-projects-dot" style={{ background: '#FF5722' }} />
                  <div className="lobby-projects-dot" style={{ background: '#5C6BC0' }} />
                  <div className="lobby-projects-dot" style={{ background: '#7B1FA2' }} />
                  <div className="lobby-projects-dot" style={{ background: '#2E7D32' }} />
                </div>
                <span className="lobby-projects-title">Projects</span>
                <span className="lobby-projects-sub">games & tools</span>
              </div>
              <span className="lobby-portal-label">Projects</span>
            </button>
          </div>

          {/* Contact Links */}
          <div className="lobby-contact">
            <a href="https://github.com/HamburgJ" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/joshua-hamburger-0807342b8/" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.016-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
              </svg>
              LinkedIn
            </a>
            <a href="mailto:joshua.hamburger@uwaterloo.ca">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M0 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v.217l7 4.2 7-4.2V4a1 1 0 00-1-1H2zm13 2.383l-4.708 2.825L15 11.105V5.383zm-.034 6.876L10.93 8.572 8 10.3l-2.93-1.728L1.034 11.26A1 1 0 002 12h12a1 1 0 00.966-.74zM1 11.105l4.708-2.897L1 5.383v5.722z" />
              </svg>
              Email
            </a>
          </div>

        </div>

        {/* Descent Zone */}
        <div className="lobby-spacer">
          <span className="lobby-spacer-text">keep scrolling...</span>
        </div>

        <div className="lobby-gradient">
          {/* Arrow hint */}
          <div className="lobby-gradient-arrow">↓</div>

          {/* Underworld sparse text */}
          <div className="lobby-gradient-text" style={{ top: 2000, color: '#444' }}>
            There's nothing else down here.
          </div>
          <div className="lobby-gradient-text" style={{ top: 5000, color: '#ccc' }}>
            You're still scrolling?
          </div>
          {/* Explorer folder icon */}
          <button className="lobby-folder-icon" onClick={() => setExplorerOpen(true)} aria-label="Open file explorer" style={{ top: 8000 }}>
            <svg width="64" height="64" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M1.5 1h5l1 2H14.5a.5.5 0 01.5.5v10a.5.5 0 01-.5.5h-13a.5.5 0 01-.5-.5v-12a.5.5 0 01.5-.5z" />
            </svg>
          </button>

          {/* Back to lobby */}
          <button
            className="lobby-back-link"
            style={{ top: 8700 }}
            onClick={scrollToTop}
          >
            ↑ back to lobby
          </button>
        </div>
      </div>
    </>
  );
};

export default Lobby;
