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
// CARD 1: INFINITE LEVELS — Subtle mathematical infinity motif
// ══════════════════════════════════════════════════════════════════════════════

function renderInfiniteLevelsCard() {
  return (
    <a href="https://hamburgj.github.io/Infinite-Levels/" target="_blank" rel="noopener noreferrer" className="card-link">
      <div className="proj-card proj-card-infinite">
        <div className="proj-card-accent" style={{ background: 'linear-gradient(135deg, #2d4a3e, #1e3a2f)' }} />
        <div className="proj-card-body">
          <div className="proj-card-meta">
            <span className="proj-card-tag" style={{ color: '#4a8c6f', borderColor: 'rgba(74,140,111,0.3)' }}>puzzle</span>
            <span className="proj-card-tag" style={{ color: '#4a8c6f', borderColor: 'rgba(74,140,111,0.3)' }}>math</span>
          </div>
          <h2 className="proj-card-title">Infinite Levels!</h2>
          <p className="proj-card-desc">
            A recursive puzzle game where levels are procedurally generated. Every level you beat
            reveals another level. There is no end. There was never a beginning.
          </p>
          <div className="proj-card-footer">
            <span className="proj-card-detail">∞ levels · procedural generation</span>
            <span className="proj-card-cta" style={{ color: '#4a8c6f' }}>Play →</span>
          </div>
        </div>
      </div>
    </a>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CARD 2: FOUR NINES — Clean daily puzzle card
// ══════════════════════════════════════════════════════════════════════════════

function renderFourNinesCard() {
  return (
    <a href="https://hamburgj.github.io/four-nines-game/" target="_blank" rel="noopener noreferrer" className="card-link">
      <div className="proj-card proj-card-nines">
        <div className="proj-card-accent" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }} />
        <div className="proj-card-body">
          <div className="proj-card-meta">
            <span className="proj-card-tag" style={{ color: '#ff5722', borderColor: 'rgba(255,87,34,0.3)' }}>daily</span>
            <span className="proj-card-tag" style={{ color: '#ff5722', borderColor: 'rgba(255,87,34,0.3)' }}>math</span>
          </div>
          <h2 className="proj-card-title">Four Nines</h2>
          <p className="proj-card-desc">
            You get four 9s. Combine them with any mathematical operation to hit the daily target.
            Sounds simple until you try to make 73.
          </p>
          <div className="proj-card-footer">
            <span className="proj-card-detail">daily puzzle · 9 9 9 9</span>
            <span className="proj-card-cta" style={{ color: '#ff5722' }}>Play Today →</span>
          </div>
        </div>
      </div>
    </a>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CARD 3: MATCH FIVE — Minimal word puzzle
// ══════════════════════════════════════════════════════════════════════════════

function renderMatchFiveCard() {
  return (
    <a href="https://hamburgj.github.io/match-five/" target="_blank" rel="noopener noreferrer" className="card-link">
      <div className="proj-card proj-card-match">
        <div className="proj-card-accent" style={{ background: '#111' }} />
        <div className="proj-card-body">
          <div className="proj-card-meta">
            <span className="proj-card-tag" style={{ color: '#555', borderColor: '#ddd' }}>word</span>
            <span className="proj-card-tag" style={{ color: '#555', borderColor: '#ddd' }}>daily</span>
          </div>
          <h2 className="proj-card-title">Match Five</h2>
          <p className="proj-card-desc">
            One word. Five meanings. A clean, precise puzzle where vocabulary meets lateral thinking.
            No clutter. No noise. Just words.
          </p>
          <div className="proj-card-footer">
            <span className="proj-card-detail">vocabulary · lateral thinking</span>
            <span className="proj-card-cta" style={{ color: '#111' }}>Play →</span>
          </div>
        </div>
      </div>
    </a>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CARD 4: SURVIVOR STATS — Warm data-driven card
// ══════════════════════════════════════════════════════════════════════════════

function renderSurvivorStatsCard() {
  return (
    <a href="https://hamburgj.github.io/survivor-stats/" target="_blank" rel="noopener noreferrer" className="card-link">
      <div className="proj-card proj-card-survivor">
        <div className="proj-card-accent" style={{ background: 'linear-gradient(135deg, #E65100, #ff8f00)' }} />
        <div className="proj-card-body">
          <div className="proj-card-meta">
            <span className="proj-card-tag" style={{ color: '#E65100', borderColor: 'rgba(230,81,0,0.3)' }}>data viz</span>
            <span className="proj-card-tag" style={{ color: '#E65100', borderColor: 'rgba(230,81,0,0.3)' }}>analytics</span>
          </div>
          <h2 className="proj-card-title">Survivor Stats</h2>
          <p className="proj-card-desc">
            47+ seasons of Survivor data — blindsides, alliances, and immunity idols —
            turned into interactive analytics. The tribe has spoken: give me a database.
          </p>
          <div className="proj-card-footer">
            <span className="proj-card-detail">47+ seasons · 800+ castaways</span>
            <span className="proj-card-cta" style={{ color: '#E65100' }}>Explore →</span>
          </div>
        </div>
      </div>
    </a>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CARD 5: PLANTGURU — Green IoT card
// ══════════════════════════════════════════════════════════════════════════════

function renderPlantGuruCard() {
  return (
    <a href="https://plantguru-fydp.github.io/PlantGuru/" target="_blank" rel="noopener noreferrer" className="card-link">
      <div className="proj-card proj-card-plant">
        <div className="proj-card-accent" style={{ background: 'linear-gradient(135deg, #1b5e20, #4caf50)' }} />
        <div className="proj-card-body">
          <div className="proj-card-meta">
            <span className="proj-card-tag" style={{ color: '#2e7d32', borderColor: 'rgba(46,125,50,0.3)' }}>IoT</span>
            <span className="proj-card-tag" style={{ color: '#2e7d32', borderColor: 'rgba(46,125,50,0.3)' }}>capstone</span>
          </div>
          <h2 className="proj-card-title">PlantGuru</h2>
          <p className="proj-card-desc">
            IoT-powered botanical intelligence. Cloud-predicted watering schedules,
            sensor-verified soil data, and a dashboard that makes your houseplants
            feel like a space mission. UWaterloo Capstone project.
          </p>
          <div className="proj-card-footer">
            <span className="proj-card-detail">IoT sensors · cloud ML · mobile app</span>
            <span className="proj-card-cta" style={{ color: '#2e7d32' }}>View →</span>
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
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&family=Caveat:wght@400;700&display=swap');

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
// CARD STYLES — Unified cohesive card system
// ══════════════════════════════════════════════════════════════════════════════

const cardStyles = `
  /* ── Base Card ── */
  .proj-card {
    position: relative;
    display: flex;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    opacity: 0;
    animation: projFadeUp 0.6s ease forwards;
  }
  .proj-card-infinite  { animation-delay: 0.2s; }
  .proj-card-nines     { animation-delay: 0.3s; }
  .proj-card-match     { animation-delay: 0.4s; }
  .proj-card-survivor  { animation-delay: 0.5s; }
  .proj-card-plant     { animation-delay: 0.6s; }

  .proj-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
  }

  /* ── Accent Bar (left edge) ── */
  .proj-card-accent {
    width: 6px;
    flex-shrink: 0;
    border-radius: 12px 0 0 12px;
  }

  /* ── Body ── */
  .proj-card-body {
    flex: 1;
    padding: 28px 32px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* ── Meta / Tags ── */
  .proj-card-meta {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .proj-card-tag {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 100px;
    border: 1px solid;
    background: transparent;
  }

  /* ── Title ── */
  .proj-card-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0;
  }

  /* ── Description ── */
  .proj-card-desc {
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    line-height: 1.65;
    color: #6b7280;
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
    font-family: 'Space Grotesk', sans-serif;
    font-size: 12px;
    color: #9ca3af;
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
    opacity: 0.75;
  }

  /* ── Responsive ── */
  @media (max-width: 700px) {
    .proj-card-body { padding: 20px 20px; }
    .proj-card-title { font-size: 20px; }
    .proj-card-desc { font-size: 14px; }
  }
`;

export default ProjectsRoom;
