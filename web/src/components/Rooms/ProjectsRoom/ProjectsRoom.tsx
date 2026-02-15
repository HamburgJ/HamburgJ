import React from 'react';
import { SitePhase } from '../../../hooks/useSiteState';
import { projects as projectsData } from '../../../data/projects';

interface ProjectsRoomProps {
  navigateTo: (phase: SitePhase) => void;
}

interface Project {
  name: string;
  description: string;
  color: string;
  url: string;
  cta: string;
  slug: string;
}

const toSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const projects: Project[] = projectsData.map(p => ({
  name: p.name,
  description: p.description,
  color: p.color,
  url: p.liveUrl,
  cta: p.actionText,
  slug: toSlug(p.name),
}));

// Suppress unused variable warning — projects data is used for URL references
void projects;

const ProjectsRoom: React.FC<ProjectsRoomProps> = ({ navigateTo }) => {
  return (
    <div className="projects-room">
      <style>{mainStyles}</style>

      {/* ── NAV ── */}
      <nav className="proj-nav">
        <button className="proj-nav-link" onClick={() => navigateTo('lobby')}>
          ← Lobby
        </button>
        <div className="proj-nav-right">
          <button className="proj-nav-link" onClick={() => navigateTo('about')}>About</button>
          <button className="proj-nav-link active">Projects</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="proj-hero">
        <p className="proj-hero-label">Selected Works</p>
        <h1 className="proj-hero-title">Things I've Built</h1>
        <p className="proj-hero-subtitle">
          Games, tools, and the occasional questionable decision.
        </p>
      </section>

      {/* ── PROJECT CARDS ── */}
      <section className="proj-gallery">
        {renderInfiniteLevelsCard()}
        {renderFourNinesCard()}
        {renderMatchFiveCard()}
        {renderSurvivorStatsCard()}
        {renderPlantGuruCard()}
      </section>

      {/* ── FOOTER NAV ── */}
      <footer className="proj-footer">
        <button className="proj-footer-link" onClick={() => navigateTo('about')}>
          ← Back to About
        </button>
        <button className="proj-footer-link" onClick={() => navigateTo('lobby')}>
          Lobby →
        </button>
      </footer>

      <style>{cardStyles}</style>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// CARD 1: INFINITE LEVELS — Dark green puzzle-game aesthetic
// ══════════════════════════════════════════════════════════════════════════════

function renderInfiniteLevelsCard() {
  return (
    <a href="https://hamburgj.github.io/Infinite-Levels/" target="_blank" rel="noopener noreferrer" className="card-link">
      <div className="proj-card proj-card-infinite">
        <div className="infinite-stripes" />
        <div className="infinite-level-badge">Level ∞</div>
        <div className="proj-card-body">
          <div className="proj-card-meta">
            <span className="proj-card-tag infinite-tag">puzzle</span>
            <span className="proj-card-tag infinite-tag">math</span>
          </div>
          <h2 className="proj-card-title">Infinite Levels!</h2>
          <p className="proj-card-desc">
            A recursive puzzle game where levels are procedurally generated. Every level you beat
            reveals another level. There is no end. There was never a beginning.
          </p>
          <div className="proj-card-footer">
            <span className="proj-card-detail">∞ levels · procedural generation</span>
            <span className="proj-card-cta">Play →</span>
          </div>
        </div>
      </div>
    </a>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CARD 2: FOUR NINES — Dark navy code-style mathematical puzzle
// ══════════════════════════════════════════════════════════════════════════════

function renderFourNinesCard() {
  return (
    <a href="https://hamburgj.github.io/four-nines-game/" target="_blank" rel="noopener noreferrer" className="card-link">
      <div className="proj-card proj-card-nines">
        <div className="nines-equation">9 · 9 − 9 + 9</div>
        <div className="proj-card-body">
          <div className="proj-card-meta">
            <span className="proj-card-tag nines-tag">daily</span>
            <span className="proj-card-tag nines-tag">math</span>
          </div>
          <h2 className="proj-card-title">Four Nines</h2>
          <p className="proj-card-desc">
            You get four 9s. Combine them with any mathematical operation to hit the daily target.
            Sounds simple until you try to make 73.
          </p>
          <div className="proj-card-footer">
            <span className="proj-card-detail">daily puzzle · 9 9 9 9</span>
            <span className="proj-card-cta">Play Today →</span>
          </div>
        </div>
      </div>
    </a>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CARD 3: MATCH FIVE — Colorful emoji word puzzle
// ══════════════════════════════════════════════════════════════════════════════

function renderMatchFiveCard() {
  return (
    <a href="https://hamburgj.github.io/match-five/" target="_blank" rel="noopener noreferrer" className="card-link">
      <div className="proj-card proj-card-match">
        <div className="match-emoji-strip">🟣 ⛄ 🧠 🍫 🌳 🔵 🎯</div>
        <div className="proj-card-body">
          <div className="proj-card-meta">
            <span className="proj-card-tag match-tag">word</span>
            <span className="proj-card-tag match-tag">daily</span>
          </div>
          <h2 className="proj-card-title">Match Five</h2>
          <p className="proj-card-desc">
            One word. Five meanings. A clean, precise puzzle where vocabulary meets lateral thinking.
            No clutter. No noise. Just words.
          </p>
          <div className="proj-card-footer">
            <span className="proj-card-detail">vocabulary · lateral thinking</span>
            <span className="proj-card-cta">Play →</span>
          </div>
        </div>
      </div>
    </a>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CARD 4: SURVIVOR STATS — Dark 3D network visualization aesthetic
// ══════════════════════════════════════════════════════════════════════════════

function renderSurvivorStatsCard() {
  return (
    <a href="https://hamburgj.github.io/survivor-stats/" target="_blank" rel="noopener noreferrer" className="card-link">
      <div className="proj-card proj-card-survivor">
        <div className="survivor-nodes">
          <div className="survivor-node" style={{ top: '15%', right: '12%', background: '#ff6b35', width: 10, height: 10 }} />
          <div className="survivor-node" style={{ top: '30%', right: '22%', background: '#4fc3f7', width: 7, height: 7 }} />
          <div className="survivor-node" style={{ top: '60%', right: '8%', background: '#66bb6a', width: 8, height: 8 }} />
          <div className="survivor-node" style={{ top: '45%', right: '28%', background: '#ffd54f', width: 6, height: 6 }} />
          <div className="survivor-node" style={{ top: '75%', right: '18%', background: '#ef5350', width: 9, height: 9 }} />
          <div className="survivor-node" style={{ top: '20%', right: '35%', background: '#ba68c8', width: 5, height: 5 }} />
        </div>
        <div className="proj-card-body">
          <div className="proj-card-meta">
            <span className="proj-card-tag survivor-tag">data viz</span>
            <span className="proj-card-tag survivor-tag">analytics</span>
          </div>
          <h2 className="proj-card-title">Survivor Stats</h2>
          <p className="proj-card-desc">
            47+ seasons of Survivor data — blindsides, alliances, and immunity idols —
            turned into interactive analytics. The tribe has spoken: give me a database.
          </p>
          <div className="proj-card-footer">
            <span className="proj-card-detail">47+ seasons · 800+ castaways</span>
            <span className="proj-card-cta">Explore →</span>
          </div>
        </div>
      </div>
    </a>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CARD 5: PLANTGURU — Green gradient botanical theme
// ══════════════════════════════════════════════════════════════════════════════

function renderPlantGuruCard() {
  return (
    <a href="https://plantguru-fydp.github.io/PlantGuru/" target="_blank" rel="noopener noreferrer" className="card-link">
      <div className="proj-card proj-card-plant">
        <div className="plant-leaf">🌿</div>
        <div className="proj-card-body">
          <div className="proj-card-meta">
            <span className="proj-card-tag plant-tag">IoT</span>
            <span className="proj-card-tag plant-tag">capstone</span>
          </div>
          <h2 className="proj-card-title">PlantGuru</h2>
          <p className="proj-card-desc">
            IoT-powered botanical intelligence. Cloud-predicted watering schedules,
            sensor-verified soil data, and a dashboard that makes your houseplants
            feel like a space mission. UWaterloo Capstone project.
          </p>
          <div className="proj-card-footer">
            <span className="proj-card-detail">IoT sensors · cloud ML · mobile app</span>
            <span className="proj-card-cta">View →</span>
          </div>
        </div>
      </div>
    </a>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE STYLES
// ══════════════════════════════════════════════════════════════════════════════

const mainStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&family=Caveat:wght@400;700&family=Edu+AU+VIC+WA+NT+Pre:wght@400;700&display=swap');

  .projects-room *, .projects-room *::before, .projects-room *::after {
    margin: 0; padding: 0; box-sizing: border-box;
  }
  .projects-room {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #fafafa;
    color: #111827;
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  .card-link { text-decoration: none; display: block; }

  /* ── NAV ── */
  .proj-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 20px 40px;
    display: flex; justify-content: space-between; align-items: center;
    background: rgba(250,250,250,0.85);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid #eee;
  }
  .proj-nav-link {
    font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 500;
    color: #6b7280; text-decoration: none; letter-spacing: 0.02em;
    transition: color 0.2s; cursor: pointer; background: none; border: none;
  }
  .proj-nav-link:hover { color: #111827; }
  .proj-nav-link.active { color: #111827; font-weight: 600; }
  .proj-nav-right { display: flex; gap: 24px; }

  /* ── HERO ── */
  .proj-hero {
    padding: 160px 40px 40px; max-width: 900px; margin: 0 auto;
    opacity: 0; transform: translateY(30px);
    animation: projFadeUp 0.8s ease forwards 0.1s;
  }
  .proj-hero-label {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 13px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.12em; color: #6366f1; margin-bottom: 20px;
  }
  .proj-hero-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(40px, 6vw, 72px); font-weight: 700; line-height: 1;
    letter-spacing: -0.03em; color: #0a0a0a; margin-bottom: 20px;
  }
  .proj-hero-subtitle {
    font-size: 18px; line-height: 1.6; color: #6b7280; max-width: 560px;
  }
  /* ── GALLERY ── */
  .proj-gallery {
    max-width: 900px; margin: 0 auto;
    padding: 40px 40px 80px;
    display: flex; flex-direction: column; gap: 32px;
  }

  /* ── FOOTER ── */
  .proj-footer {
    max-width: 900px; margin: 0 auto; padding: 60px 40px 80px;
    display: flex; justify-content: space-between; align-items: center;
    border-top: 1px solid #eee;
    opacity: 0; animation: projFadeUp 0.6s ease forwards 0.7s;
  }
  .proj-footer-link {
    font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 500;
    color: #6b7280; text-decoration: none; cursor: pointer;
    background: none; border: none; transition: color 0.2s;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .proj-footer-link:hover { color: #111827; }

  @keyframes projFadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 700px) {
    .proj-hero { padding: 140px 20px 30px; }
    .proj-gallery { padding: 30px 20px 60px; }
    .proj-nav { padding: 16px 20px; }
    .proj-footer { padding: 40px 20px 60px; flex-direction: column; gap: 20px; }
  }
`;

// ══════════════════════════════════════════════════════════════════════════════
// CARD STYLES — Custom per-project aesthetics
// ══════════════════════════════════════════════════════════════════════════════

const cardStyles = `
  /* ── Base Card ── */
  .proj-card {
    position: relative;
    display: flex;
    border-radius: 16px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    opacity: 0;
    animation: projFadeUp 0.6s ease forwards;
  }
  .proj-card-infinite  { animation-delay: 0.2s; }
  .proj-card-nines     { animation-delay: 0.3s; }
  .proj-card-match     { animation-delay: 0.4s; }
  .proj-card-survivor  { animation-delay: 0.5s; }
  .proj-card-plant     { animation-delay: 0.6s; }

  /* ── Body ── */
  .proj-card-body {
    flex: 1;
    padding: 32px 36px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
    z-index: 1;
  }

  /* ── Meta / Tags ── */
  .proj-card-meta {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .proj-card-tag {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 100px;
    border: 1px solid;
    background: transparent;
  }

  /* ── Title ── */
  .proj-card-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 26px;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0;
  }

  /* ── Description ── */
  .proj-card-desc {
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    line-height: 1.65;
    margin: 0;
    max-width: 540px;
  }

  /* ── Footer ── */
  .proj-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: 8px;
  }
  .proj-card-detail {
    font-size: 12px;
    letter-spacing: 0.02em;
  }
  .proj-card-cta {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.01em;
    transition: opacity 0.2s;
  }
  .proj-card:hover .proj-card-cta {
    opacity: 0.8;
  }

  /* ═══════════════════════════════════════════════════════════════
     CARD 1: INFINITE LEVELS — Light frosted-glass with diagonal stripes
     (matches the actual game's Level 0 aesthetic)
     ═══════════════════════════════════════════════════════════════ */
  .proj-card-infinite {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  }
  .proj-card-infinite:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
  }
  .infinite-stripes {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    border-radius: 16px;
    background-image: repeating-linear-gradient(
      -45deg,
      #f8f9fa,
      #f8f9fa 2rem,
      #e9ecef 2rem,
      #e9ecef 4rem
    );
    background-size: 200% 200%;
    opacity: 0.45;
    animation: infiniteStripeScroll 20s ease-in-out infinite;
  }
  @keyframes infiniteStripeScroll {
    0%, 100% { background-position: 50% 100%; }
    50% { background-position: 0 0; }
  }
  .proj-card-infinite .proj-card-title {
    font-family: 'Edu AU VIC WA NT Pre', cursive;
    font-weight: 700;
    font-size: 34px;
    color: #333;
    letter-spacing: 1px;
  }
  .proj-card-infinite .proj-card-desc {
    color: #555;
  }
  .proj-card-infinite .proj-card-detail {
    font-family: 'Inter', sans-serif;
    color: rgba(0, 0, 0, 0.35);
  }
  .proj-card-infinite .proj-card-cta {
    color: #007bff;
  }
  .infinite-tag {
    color: rgba(0, 0, 0, 0.5) !important;
    border-color: rgba(0, 0, 0, 0.12) !important;
    background: rgba(0, 0, 0, 0.03) !important;
    font-family: 'Inter', sans-serif;
  }
  .infinite-level-badge {
    position: absolute;
    top: 16px;
    right: 20px;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.5);
    background: rgba(0, 0, 0, 0.04);
    padding: 4px 12px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    z-index: 1;
  }

  /* ═══════════════════════════════════════════════════════════════
     CARD 2: FOUR NINES — Dark navy code-style
     ═══════════════════════════════════════════════════════════════ */
  .proj-card-nines {
    background: linear-gradient(160deg, #0d1117 0%, #161b22 40%, #1a1a2e 100%);
    border: 1px solid rgba(255, 87, 34, 0.15);
    box-shadow: 0 4px 24px rgba(13, 17, 23, 0.5);
  }
  .proj-card-nines:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(13, 17, 23, 0.7), 0 0 20px rgba(255, 87, 34, 0.08);
  }
  .proj-card-nines .proj-card-title {
    font-family: 'Space Grotesk', sans-serif;
    color: #e6edf3;
  }
  .proj-card-nines .proj-card-desc {
    color: rgba(230, 237, 243, 0.55);
  }
  .proj-card-nines .proj-card-detail {
    font-family: 'Share Tech Mono', monospace;
    color: rgba(230, 237, 243, 0.3);
  }
  .proj-card-nines .proj-card-cta {
    color: #ff5722;
  }
  .nines-tag {
    color: #ff7043 !important;
    border-color: rgba(255, 87, 34, 0.3) !important;
    font-family: 'Share Tech Mono', monospace;
  }
  .nines-equation {
    position: absolute;
    right: 32px;
    top: 50%;
    transform: translateY(-50%);
    font-family: 'Share Tech Mono', monospace;
    font-size: 44px;
    color: rgba(255, 87, 34, 0.07);
    pointer-events: none;
    z-index: 0;
    letter-spacing: 4px;
    white-space: nowrap;
  }

  /* ═══════════════════════════════════════════════════════════════
     CARD 3: MATCH FIVE — Colorful emoji playful
     ═══════════════════════════════════════════════════════════════ */
  .proj-card-match {
    background: #ffffff;
    border: 2px solid #e8e0f0;
    box-shadow: 0 4px 20px rgba(123, 31, 162, 0.08);
  }
  .proj-card-match:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 36px rgba(123, 31, 162, 0.15);
    border-color: #ce93d8;
  }
  .proj-card-match .proj-card-title {
    font-family: 'Space Grotesk', sans-serif;
    color: #4a148c;
  }
  .proj-card-match .proj-card-desc {
    color: #5e5174;
  }
  .proj-card-match .proj-card-detail {
    font-family: 'Space Grotesk', sans-serif;
    color: #9e8fb5;
  }
  .proj-card-match .proj-card-cta {
    color: #7b1fa2;
  }
  .match-tag {
    color: #7b1fa2 !important;
    border-color: rgba(123, 31, 162, 0.25) !important;
    background: rgba(123, 31, 162, 0.05) !important;
    font-family: 'Space Grotesk', sans-serif;
  }
  .match-emoji-strip {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 26px;
    letter-spacing: 4px;
    opacity: 0.15;
    pointer-events: none;
    z-index: 0;
    writing-mode: vertical-rl;
    line-height: 1.8;
  }

  /* ═══════════════════════════════════════════════════════════════
     CARD 4: SURVIVOR STATS — Dark data viz with network nodes
     ═══════════════════════════════════════════════════════════════ */
  .proj-card-survivor {
    background: linear-gradient(135deg, #0a0a0a 0%, #121212 50%, #1a1a1a 100%);
    border: 1px solid rgba(230, 81, 0, 0.2);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
  }
  .proj-card-survivor:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(230, 81, 0, 0.15), 0 4px 20px rgba(0, 0, 0, 0.6);
  }
  .proj-card-survivor .proj-card-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 22px;
    color: #ff8f00;
    letter-spacing: 0.05em;
  }
  .proj-card-survivor .proj-card-desc {
    color: rgba(255, 255, 255, 0.5);
  }
  .proj-card-survivor .proj-card-detail {
    font-family: 'Share Tech Mono', monospace;
    color: rgba(255, 143, 0, 0.4);
  }
  .proj-card-survivor .proj-card-cta {
    color: #E65100;
  }
  .survivor-tag {
    color: #ff8f00 !important;
    border-color: rgba(255, 143, 0, 0.25) !important;
    font-family: 'Orbitron', sans-serif;
    font-size: 10px !important;
    letter-spacing: 0.12em !important;
  }
  .survivor-nodes {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  .survivor-node {
    position: absolute;
    border-radius: 50%;
    opacity: 0.4;
    box-shadow: 0 0 12px currentColor;
    animation: nodeGlow 3s ease-in-out infinite alternate;
  }
  @keyframes nodeGlow {
    from { opacity: 0.25; transform: scale(1); }
    to { opacity: 0.5; transform: scale(1.3); }
  }

  /* ═══════════════════════════════════════════════════════════════
     CARD 5: PLANTGURU — Green gradient botanical
     ═══════════════════════════════════════════════════════════════ */
  .proj-card-plant {
    background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 60%, #388e3c 100%);
    border: 1px solid rgba(76, 175, 80, 0.3);
    box-shadow: 0 4px 24px rgba(27, 94, 32, 0.3);
  }
  .proj-card-plant:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(27, 94, 32, 0.45);
  }
  .proj-card-plant .proj-card-title {
    font-family: 'Space Grotesk', sans-serif;
    color: #ffffff;
  }
  .proj-card-plant .proj-card-desc {
    color: rgba(255, 255, 255, 0.75);
  }
  .proj-card-plant .proj-card-detail {
    font-family: 'Space Grotesk', sans-serif;
    color: rgba(255, 255, 255, 0.4);
  }
  .proj-card-plant .proj-card-cta {
    color: #c8e6c9;
  }
  .plant-tag {
    color: #c8e6c9 !important;
    border-color: rgba(200, 230, 201, 0.3) !important;
    font-family: 'Space Grotesk', sans-serif;
  }
  .plant-leaf {
    position: absolute;
    right: 24px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 80px;
    opacity: 0.12;
    pointer-events: none;
    z-index: 0;
  }

  /* ── Responsive ── */
  @media (max-width: 700px) {
    .proj-card-body { padding: 24px 20px; }
    .proj-card-title { font-size: 22px; }
    .proj-card-infinite .proj-card-title { font-size: 28px; }
    .proj-card-desc { font-size: 14px; }
    .infinite-level-badge { font-size: 10px; padding: 3px 10px; }
    .nines-equation { font-size: 30px; right: 16px; }
    .match-emoji-strip { font-size: 20px; right: 8px; }
    .plant-leaf { font-size: 56px; right: 12px; }
  }
`;

export default ProjectsRoom;
