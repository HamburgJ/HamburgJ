import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SitePhase } from '../../../hooks/useSiteState';
import { projects as projectsData } from '../../../data/projects';
import VibeCodingOverlay from '../../VibeCodingOverlay/VibeCodingOverlay';
import {
  PROJECTS_INTRO_JOSH_LINES,
  PROJECT_VIBE_STEPS,
} from '../../VibeCodingOverlay/sequences';
import type { VibeCodingSequence } from '../../VibeCodingOverlay/VibeCodingOverlay';

interface ProjectsRoomProps {
  navigateTo: (phase: SitePhase) => void;
  autoSequence?: boolean;
  onSequenceComplete?: () => void;
}

interface Project {
  name: string;
  description: string;
  color: string;
  url: string;
  cta: string;
  flagship?: boolean;
  slug: string;
}

const FLAGSHIP_NAMES = new Set(['Infinite Levels!', 'Four Nines']);

const toSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const projects: Project[] = projectsData.map(p => ({
  name: p.name,
  description: p.description,
  color: p.color,
  url: p.liveUrl,
  cta: p.actionText,
  flagship: FLAGSHIP_NAMES.has(p.name),
  slug: toSlug(p.name),
}));

// Project order for vibe-coding reveal
const PROJECT_REVEAL_ORDER = [
  'infinite-levels',
  'four-nines',
  'match-five',
  'survivor-stats',
  'plantguru',
];

const ProjectsRoom: React.FC<ProjectsRoomProps> = ({ navigateTo, autoSequence = false, onSequenceComplete }) => {
  const [vibeActive, setVibeActive] = useState(false);
  // Track which vibecoded cards have been revealed (by index in PROJECT_REVEAL_ORDER)
  const [revealedCards, setRevealedCards] = useState<number>(0);
  // Whether we're showing the vibecoded versions vs original
  const [showVibeCards, setShowVibeCards] = useState(false);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-sequence: start vibecoding immediately after a short delay
  useEffect(() => {
    if (!autoSequence) return;
    autoTimerRef.current = setTimeout(() => {
      setVibeActive(true);
      setShowVibeCards(true);
    }, 3000);

    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, [autoSequence]);

  const handleStepComplete = useCallback((stepIndex: number) => {
    // Each step reveals a project card (except the last step which is the wrap-up)
    if (stepIndex < PROJECT_REVEAL_ORDER.length) {
      setRevealedCards(stepIndex + 1);
    }
  }, []);

  const handleVibeComplete = useCallback(() => {
    setVibeActive(false);
    if (onSequenceComplete) onSequenceComplete();
  }, [onSequenceComplete]);

  const vibeSequence: VibeCodingSequence = {
    joshLines: PROJECTS_INTRO_JOSH_LINES,
    copilotMessages: [], // Not used — steps handles the flow
    steps: PROJECT_VIBE_STEPS,
    onStepComplete: handleStepComplete,
    onComplete: handleVibeComplete,
  };

  return (
    <div className="projects-room">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

        .projects-room *, .projects-room *::before, .projects-room *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .projects-room {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #ffffff;
          color: #111827;
          min-height: 100vh;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        /* ── NAV ── */
        .proj-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid #f3f4f6;
        }
        .proj-nav-link {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: color 0.2s;
          cursor: pointer;
          background: none;
          border: none;
        }
        .proj-nav-link:hover { color: #111827; }
        .proj-nav-link.active {
          color: #111827;
          font-weight: 600;
        }
        .proj-nav-right {
          display: flex;
          gap: 24px;
        }

        /* ── HERO HEADER ── */
        .proj-hero {
          padding: 160px 40px 60px;
          max-width: 1200px;
          margin: 0 auto;
          opacity: 0;
          transform: translateY(30px);
          animation: projFadeUp 0.8s ease forwards;
          animation-delay: 0.1s;
        }
        .proj-hero-label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #6366f1;
          margin-bottom: 20px;
        }
        .proj-hero-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(40px, 6vw, 72px);
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.03em;
          color: #0a0a0a;
          margin-bottom: 20px;
        }
        .proj-hero-subtitle {
          font-size: 18px;
          line-height: 1.6;
          color: #6b7280;
          max-width: 560px;
        }

        /* ── GALLERY ── */
        .proj-gallery {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 40px 80px;
        }
        .proj-flagships {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          margin-bottom: 28px;
          opacity: 0;
          transform: translateY(30px);
          animation: projFadeUp 0.7s ease forwards;
          animation-delay: 0.3s;
        }
        .proj-secondary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          opacity: 0;
          transform: translateY(30px);
          animation: projFadeUp 0.7s ease forwards;
          animation-delay: 0.5s;
        }

        /* ── CARD BASE ── */
        .proj-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          text-decoration: none;
          display: block;
          transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      box-shadow 0.35s ease;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        }
        .proj-card:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }
        .proj-card-flagship { height: 420px; }
        .proj-card-secondary { height: 300px; }

        /* ── CSS VISUAL BACKGROUND ── */
        .proj-card-visual {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        /* ── OVERLAY ── */
        .proj-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.82) 0%,
            rgba(0,0,0,0.40) 45%,
            rgba(0,0,0,0.10) 100%
          );
          transition: background 0.35s ease;
          z-index: 1;
        }
        .proj-card:hover .proj-card-overlay {
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.88) 0%,
            rgba(0,0,0,0.45) 45%,
            rgba(0,0,0,0.15) 100%
          );
        }

        /* ── CARD CONTENT ── */
        .proj-card-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 32px;
          z-index: 2;
        }
        .proj-card-color-bar {
          width: 32px;
          height: 3px;
          border-radius: 2px;
          margin-bottom: 14px;
          transition: width 0.3s ease;
        }
        .proj-card:hover .proj-card-color-bar { width: 56px; }

        .proj-card-name {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 6px;
          line-height: 1.15;
          letter-spacing: -0.01em;
        }
        .proj-card-flagship .proj-card-name { font-size: 32px; }
        .proj-card-secondary .proj-card-name { font-size: 22px; }

        .proj-card-desc {
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          line-height: 1.5;
          color: rgba(255,255,255,0.85);
          margin-bottom: 20px;
          max-width: 420px;
        }
        .proj-card-secondary .proj-card-desc {
          font-size: 13px;
          margin-bottom: 16px;
        }

        .proj-card-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          padding: 10px 22px;
          border-radius: 8px;
          text-decoration: none;
          transition: transform 0.2s ease, opacity 0.2s ease;
          letter-spacing: 0.02em;
        }
        .proj-card-cta:hover {
          transform: translateX(3px);
          opacity: 0.9;
        }
        .proj-card-cta-arrow {
          transition: transform 0.2s ease;
        }
        .proj-card:hover .proj-card-cta-arrow {
          transform: translateX(4px);
        }

        /* ════════════════════════════════════════════
           CUSTOM CSS BACKGROUNDS PER PROJECT
           ════════════════════════════════════════════ */

        /* ── SURVIVOR STATS · Torch / Flame ── */
        .proj-visual-survivor-stats {
          background: linear-gradient(
            180deg,
            #1a0800 0%,
            #3d1200 20%,
            #E65100 55%,
            #ff8f00 75%,
            #ffcc02 100%
          );
          background-size: 100% 200%;
          animation: survivorFlicker 3s ease-in-out infinite alternate;
        }
        .proj-visual-survivor-stats::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 80% at 30% 90%, rgba(255,140,0,0.6) 0%, transparent 70%),
            radial-gradient(ellipse 50% 70% at 70% 85%, rgba(255,87,34,0.5) 0%, transparent 65%),
            radial-gradient(ellipse 40% 50% at 50% 95%, rgba(255,204,2,0.4) 0%, transparent 60%);
          animation: survivorGlow 2s ease-in-out infinite alternate;
        }
        .proj-visual-survivor-stats::after {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 30% 60% at 50% 70%, rgba(255,200,50,0.25) 0%, transparent 70%),
            radial-gradient(ellipse 20% 45% at 45% 80%, rgba(255,140,0,0.3) 0%, transparent 60%),
            radial-gradient(ellipse 25% 50% at 55% 75%, rgba(255,87,34,0.2) 0%, transparent 65%);
          animation: survivorEmber 2.5s ease-in-out infinite alternate-reverse;
        }
        @keyframes survivorFlicker {
          0% { background-position: 0% 0%; }
          50% { background-position: 0% 15%; }
          100% { background-position: 0% 5%; }
        }
        @keyframes survivorGlow {
          0% { opacity: 0.7; }
          100% { opacity: 1; }
        }
        @keyframes survivorEmber {
          0% { opacity: 0.4; transform: scale(1); }
          100% { opacity: 0.8; transform: scale(1.05); }
        }
        /* Tribal pattern bars */
        .survivor-tribal {
          position: absolute;
          inset: 0;
          opacity: 0.12;
          background:
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 18px,
              rgba(255,200,100,0.5) 18px,
              rgba(255,200,100,0.5) 20px
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 40px,
              rgba(255,150,50,0.3) 40px,
              rgba(255,150,50,0.3) 42px
            );
        }

        /* ── INFINITE LEVELS · Infinity / Recursion ── */
        .proj-visual-infinite-levels {
          background: linear-gradient(135deg, #1a1a3e 0%, #2c2c6c 40%, #5C6BC0 80%, #7986CB 100%);
        }
        .proj-visual-infinite-levels::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 50% 50%, transparent 18%, rgba(92,107,192,0.15) 19%, rgba(92,107,192,0.15) 20%, transparent 21%),
            radial-gradient(circle at 50% 50%, transparent 28%, rgba(92,107,192,0.12) 29%, rgba(92,107,192,0.12) 30%, transparent 31%),
            radial-gradient(circle at 50% 50%, transparent 38%, rgba(92,107,192,0.10) 39%, rgba(92,107,192,0.10) 40%, transparent 41%),
            radial-gradient(circle at 50% 50%, transparent 48%, rgba(92,107,192,0.08) 49%, rgba(92,107,192,0.08) 50%, transparent 51%),
            radial-gradient(circle at 50% 50%, transparent 58%, rgba(92,107,192,0.06) 59%, rgba(92,107,192,0.06) 60%, transparent 61%),
            radial-gradient(circle at 50% 50%, transparent 68%, rgba(92,107,192,0.04) 69%, rgba(92,107,192,0.04) 70%, transparent 71%);
          animation: infinitePulse 4s ease-in-out infinite;
        }
        .proj-visual-infinite-levels::after {
          content: '\\221E';
          position: absolute;
          font-family: 'Space Grotesk', serif;
          font-size: 220px;
          font-weight: 700;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -60%);
          color: rgba(255,255,255,0.06);
          animation: infiniteFloat 6s ease-in-out infinite;
        }
        .infinite-squares {
          position: absolute;
          inset: 0;
        }
        .infinite-squares span {
          position: absolute;
          border: 2px solid rgba(121,134,203,0.15);
          border-radius: 4px;
          top: 50%;
          left: 50%;
          animation: infiniteRotate 20s linear infinite;
        }
        .infinite-squares span:nth-child(1) { width: 60px; height: 60px; margin: -30px 0 0 -30px; }
        .infinite-squares span:nth-child(2) { width: 100px; height: 100px; margin: -50px 0 0 -50px; animation-direction: reverse; }
        .infinite-squares span:nth-child(3) { width: 150px; height: 150px; margin: -75px 0 0 -75px; animation-duration: 25s; }
        .infinite-squares span:nth-child(4) { width: 210px; height: 210px; margin: -105px 0 0 -105px; animation-direction: reverse; animation-duration: 30s; }
        .infinite-squares span:nth-child(5) { width: 280px; height: 280px; margin: -140px 0 0 -140px; animation-duration: 35s; }

        @keyframes infinitePulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.03); }
        }
        @keyframes infiniteFloat {
          0%, 100% { transform: translate(-50%, -60%) scale(1); opacity: 0.06; }
          50% { transform: translate(-50%, -60%) scale(1.08); opacity: 0.1; }
        }
        @keyframes infiniteRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* ── FOUR NINES · Math / Numbers ── */
        .proj-visual-four-nines {
          background: linear-gradient(135deg, #1b0a00 0%, #4a1800 30%, #bf360c 60%, #FF5722 100%);
        }
        .four-nines-digits {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .four-nines-digits span {
          font-family: 'Space Grotesk', monospace;
          font-size: 120px;
          font-weight: 700;
          color: rgba(255,255,255,0.07);
          line-height: 1;
          animation: ninesFloat 3s ease-in-out infinite;
        }
        .four-nines-digits span:nth-child(2) { animation-delay: 0.3s; }
        .four-nines-digits span:nth-child(3) { animation-delay: 0.6s; }
        .four-nines-digits span:nth-child(4) { animation-delay: 0.9s; }

        .four-nines-symbols {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .four-nines-symbols span {
          position: absolute;
          font-family: 'Space Grotesk', monospace;
          font-weight: 600;
          color: rgba(255,255,255,0.06);
        }
        .four-nines-symbols span:nth-child(1) { font-size: 36px; top: 12%; left: 8%; transform: rotate(-15deg); }
        .four-nines-symbols span:nth-child(2) { font-size: 28px; top: 20%; right: 12%; transform: rotate(20deg); }
        .four-nines-symbols span:nth-child(3) { font-size: 42px; top: 8%; left: 55%; transform: rotate(10deg); }
        .four-nines-symbols span:nth-child(4) { font-size: 30px; bottom: 50%; left: 15%; transform: rotate(-25deg); }
        .four-nines-symbols span:nth-child(5) { font-size: 34px; top: 30%; right: 25%; transform: rotate(35deg); }
        .four-nines-symbols span:nth-child(6) { font-size: 26px; bottom: 55%; right: 8%; transform: rotate(-10deg); }
        .four-nines-symbols span:nth-child(7) { font-size: 38px; top: 5%; left: 30%; transform: rotate(5deg); }
        .four-nines-symbols span:nth-child(8) { font-size: 32px; top: 15%; right: 40%; transform: rotate(-30deg); }

        .proj-visual-four-nines::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 28px,
              rgba(255,255,255,0.02) 28px,
              rgba(255,255,255,0.02) 29px
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 28px,
              rgba(255,255,255,0.02) 28px,
              rgba(255,255,255,0.02) 29px
            );
        }

        @keyframes ninesFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        /* ── MATCH FIVE · Word / Letters ── */
        .proj-visual-match-five {
          background: linear-gradient(135deg, #1a0a2e 0%, #4a148c 40%, #7B1FA2 75%, #9C27B0 100%);
        }
        .match-letters {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .match-letters span {
          position: absolute;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          color: rgba(255,255,255,0.06);
          line-height: 1;
        }
        .match-letters span:nth-child(1)  { font-size: 72px; top: 5%;  left: 5%;  transform: rotate(-12deg); }
        .match-letters span:nth-child(2)  { font-size: 48px; top: 15%; left: 35%; transform: rotate(18deg); }
        .match-letters span:nth-child(3)  { font-size: 80px; top: 8%;  right: 10%; transform: rotate(-5deg); }
        .match-letters span:nth-child(4)  { font-size: 56px; top: 30%; left: 10%; transform: rotate(25deg); }
        .match-letters span:nth-child(5)  { font-size: 64px; top: 25%; left: 55%; transform: rotate(-20deg); }
        .match-letters span:nth-child(6)  { font-size: 44px; top: 40%; right: 15%; transform: rotate(8deg); }
        .match-letters span:nth-child(7)  { font-size: 90px; top: 2%;  left: 60%; transform: rotate(15deg); }
        .match-letters span:nth-child(8)  { font-size: 52px; top: 20%; left: 80%; transform: rotate(-30deg); }
        .match-letters span:nth-child(9)  { font-size: 68px; top: 10%; left: 20%; transform: rotate(22deg); }
        .match-letters span:nth-child(10) { font-size: 40px; top: 35%; left: 42%; transform: rotate(-15deg); }
        .match-letters span:nth-child(11) { font-size: 76px; top: 0%;  left: 75%; transform: rotate(10deg); }
        .match-letters span:nth-child(12) { font-size: 58px; top: 28%; left: 25%; transform: rotate(-28deg); }

        .proj-visual-match-five::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 30%, rgba(156,39,176,0.3) 0%, transparent 70%),
            radial-gradient(ellipse 60% 80% at 80% 60%, rgba(123,31,162,0.25) 0%, transparent 70%);
        }
        /* Tile grid pattern */
        .match-grid {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          background:
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 54px,
              rgba(255,255,255,0.8) 54px,
              rgba(255,255,255,0.8) 56px
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 54px,
              rgba(255,255,255,0.8) 54px,
              rgba(255,255,255,0.8) 56px
            );
        }

        /* ── PLANTGURU · Nature / Growth ── */
        .proj-visual-plantguru {
          background: linear-gradient(160deg, #0d2818 0%, #1b5e20 35%, #2E7D32 65%, #43a047 100%);
        }
        .proj-visual-plantguru::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 50% at 20% 80%, rgba(76,175,80,0.3) 0%, transparent 70%),
            radial-gradient(ellipse 50% 70% at 80% 30%, rgba(46,125,50,0.25) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(129,199,132,0.15) 0%, transparent 60%);
        }
        .plant-leaves {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .plant-leaf {
          position: absolute;
          width: 40px;
          height: 60px;
          border-radius: 0 50% 50% 50%;
          background: rgba(76,175,80,0.12);
          border: 1px solid rgba(76,175,80,0.08);
        }
        .plant-leaf:nth-child(1) { top: 8%;  left: 10%; transform: rotate(-30deg); width: 35px; height: 50px; }
        .plant-leaf:nth-child(2) { top: 15%; left: 65%; transform: rotate(45deg); width: 50px; height: 70px; }
        .plant-leaf:nth-child(3) { top: 5%;  right: 15%; transform: rotate(-60deg); width: 30px; height: 45px; }
        .plant-leaf:nth-child(4) { top: 25%; left: 30%; transform: rotate(15deg); width: 45px; height: 65px; }
        .plant-leaf:nth-child(5) { top: 10%; right: 35%; transform: rotate(-45deg); width: 38px; height: 55px; }
        .plant-leaf:nth-child(6) { top: 30%; left: 50%; transform: rotate(70deg); width: 28px; height: 40px; }
        .plant-leaf:nth-child(7) { top: 3%;  left: 40%; transform: rotate(-20deg); width: 42px; height: 60px; }
        .plant-leaf:nth-child(8) { top: 20%; right: 10%; transform: rotate(30deg); width: 32px; height: 48px; }
        /* Vine lines */
        .plant-vines {
          position: absolute;
          inset: 0;
          opacity: 0.06;
        }
        .plant-vines::before {
          content: '';
          position: absolute;
          left: 20%;
          top: 0;
          width: 2px;
          height: 100%;
          background: linear-gradient(to bottom, transparent, rgba(129,199,132,0.8), transparent);
          transform: skewX(5deg);
        }
        .plant-vines::after {
          content: '';
          position: absolute;
          right: 30%;
          top: 0;
          width: 2px;
          height: 100%;
          background: linear-gradient(to bottom, transparent, rgba(129,199,132,0.6), transparent);
          transform: skewX(-8deg);
        }
        /* Circuit dots for IoT theme */
        .plant-circuits {
          position: absolute;
          inset: 0;
          opacity: 0.05;
          background:
            radial-gradient(circle 2px at 25% 20%, rgba(255,255,255,0.8) 0%, transparent 3px),
            radial-gradient(circle 2px at 60% 35%, rgba(255,255,255,0.8) 0%, transparent 3px),
            radial-gradient(circle 2px at 40% 55%, rgba(255,255,255,0.8) 0%, transparent 3px),
            radial-gradient(circle 2px at 75% 15%, rgba(255,255,255,0.8) 0%, transparent 3px),
            radial-gradient(circle 2px at 15% 45%, rgba(255,255,255,0.8) 0%, transparent 3px),
            radial-gradient(circle 2px at 85% 50%, rgba(255,255,255,0.8) 0%, transparent 3px);
        }

        /* ── FOOTER NAV ── */
        .proj-footer {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 40px 80px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #f3f4f6;
          opacity: 0;
          animation: projFadeUp 0.6s ease forwards;
          animation-delay: 0.7s;
        }
        .proj-footer-link {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #6b7280;
          text-decoration: none;
          cursor: pointer;
          background: none;
          border: none;
          transition: color 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .proj-footer-link:hover { color: #111827; }

        /* ── ANIMATIONS ── */
        @keyframes projFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .proj-flagships { grid-template-columns: 1fr; }
          .proj-secondary { grid-template-columns: 1fr; }
          .proj-card-flagship { height: 360px; }
          .proj-card-secondary { height: 280px; }
          .proj-hero { padding: 140px 24px 40px; }
          .proj-gallery { padding: 20px 24px 60px; }
          .proj-nav { padding: 16px 20px; }
          .proj-footer {
            padding: 40px 24px 60px;
            flex-direction: column;
            gap: 20px;
          }
        }
        @media (max-width: 600px) {
          .proj-card-flagship { height: 320px; }
          .proj-card-secondary { height: 260px; }
          .proj-card-content { padding: 24px; }
          .proj-card-flagship .proj-card-name { font-size: 26px; }
          .proj-card-secondary .proj-card-name { font-size: 20px; }
          .proj-hero-subtitle { font-size: 16px; }
          .four-nines-digits span { font-size: 72px; }
        }
      `}</style>

      {/* ── NAV — hidden during auto-sequence ── */}
      {!autoSequence && (
      <nav className="proj-nav">
        <button className="proj-nav-link" onClick={() => navigateTo('lobby')}>
          ← Lobby
        </button>
        <div className="proj-nav-right">
          <button className="proj-nav-link" onClick={() => navigateTo('about')}>About</button>
          <button className="proj-nav-link active">Projects</button>
        </div>
      </nav>
      )}

      {/* ── HERO ── */}
      <section className="proj-hero">
        <p className="proj-hero-label">Selected Works</p>
        <h1 className="proj-hero-title">Things I've Built</h1>
        <p className="proj-hero-subtitle">
          Games, tools, and experiments — some useful, some just fun.
          All made because I couldn't stop thinking about the idea.
        </p>
      </section>

      {/* ── GALLERY ── */}
      <section className="proj-gallery">
        {/* During auto-sequence with vibe cards showing, render vibecoded cards */}
        {showVibeCards ? (
          <div className="proj-vibe-stack">
            {/* Vibecoded cards appear one by one */}
            {revealedCards >= 1 && (
              <div className="vc-card-reveal" style={{ animation: 'projVibeReveal 0.6s ease forwards' }}>
                {renderInfiniteLevelsCard()}
              </div>
            )}
            {revealedCards >= 2 && (
              <div className="vc-card-reveal" style={{ animation: 'projVibeReveal 0.6s ease forwards' }}>
                {renderFourNinesCard()}
              </div>
            )}
            {revealedCards >= 3 && (
              <div className="vc-card-reveal" style={{ animation: 'projVibeReveal 0.6s ease forwards' }}>
                {renderMatchFiveCard()}
              </div>
            )}
            {revealedCards >= 4 && (
              <div className="vc-card-reveal" style={{ animation: 'projVibeReveal 0.6s ease forwards' }}>
                {renderSurvivorStatsCard()}
              </div>
            )}
            {revealedCards >= 5 && (
              <div className="vc-card-reveal" style={{ animation: 'projVibeReveal 0.6s ease forwards' }}>
                {renderPlantGuruCard()}
              </div>
            )}
          </div>
        ) : (
          <>
        {/* Flagship projects */}
        <div className="proj-flagships">
          {projects.filter(p => p.flagship).map(project => (
            <a
              key={project.name}
              className="proj-card proj-card-flagship"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={`proj-card-visual proj-visual-${project.slug}`}>
                {project.slug === 'infinite-levels' && (
                  <div className="infinite-squares">
                    <span /><span /><span /><span /><span />
                  </div>
                )}
                {project.slug === 'four-nines' && (
                  <>
                    <div className="four-nines-digits">
                      <span>9</span><span>9</span><span>9</span><span>9</span>
                    </div>
                    <div className="four-nines-symbols">
                      <span>+</span><span>−</span><span>×</span><span>÷</span>
                      <span>=</span><span>√</span><span>!</span><span>^</span>
                    </div>
                  </>
                )}
              </div>
              <div className="proj-card-overlay" />
              <div className="proj-card-content">
                <div className="proj-card-color-bar" style={{ background: project.color }} />
                <h2 className="proj-card-name">{project.name}</h2>
                <p className="proj-card-desc">{project.description}</p>
                <span className="proj-card-cta" style={{ background: project.color }}>
                  {project.cta}
                  <span className="proj-card-cta-arrow">→</span>
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Secondary projects */}
        <div className="proj-secondary">
          {projects.filter(p => !p.flagship).map(project => (
            <a
              key={project.name}
              className="proj-card proj-card-secondary"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={`proj-card-visual proj-visual-${project.slug}`}>
                {project.slug === 'survivor-stats' && (
                  <div className="survivor-tribal" />
                )}
                {project.slug === 'match-five' && (
                  <>
                    <div className="match-letters">
                      <span>M</span><span>A</span><span>T</span><span>C</span>
                      <span>H</span><span>F</span><span>I</span><span>V</span>
                      <span>E</span><span>W</span><span>O</span><span>R</span>
                    </div>
                    <div className="match-grid" />
                  </>
                )}
                {project.slug === 'plantguru' && (
                  <>
                    <div className="plant-leaves">
                      <div className="plant-leaf" />
                      <div className="plant-leaf" />
                      <div className="plant-leaf" />
                      <div className="plant-leaf" />
                      <div className="plant-leaf" />
                      <div className="plant-leaf" />
                      <div className="plant-leaf" />
                      <div className="plant-leaf" />
                    </div>
                    <div className="plant-vines" />
                    <div className="plant-circuits" />
                  </>
                )}
              </div>
              <div className="proj-card-overlay" />
              <div className="proj-card-content">
                <div className="proj-card-color-bar" style={{ background: project.color }} />
                <h2 className="proj-card-name">{project.name}</h2>
                <p className="proj-card-desc">{project.description}</p>
                <span className="proj-card-cta" style={{ background: project.color }}>
                  {project.cta}
                  <span className="proj-card-cta-arrow">→</span>
                </span>
              </div>
            </a>
          ))}
        </div>
          </>
        )}
      </section>

      {/* ── FOOTER NAV ── */}
      {!autoSequence && (
      <footer className="proj-footer">
        <button className="proj-footer-link" onClick={() => navigateTo('about')}>
          ← Back to About
        </button>
        <button className="proj-footer-link" onClick={() => navigateTo('lobby')}>
          Lobby →
        </button>
      </footer>
      )}

      <VibeCodingOverlay sequence={vibeSequence} active={vibeActive} />

      {/* Vibecoded card styles */}
      <style>{vibeCardStyles}</style>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// VIBECODED PROJECT CARDS
// Each card was "vibecoded" independently with a totally different aesthetic
// ══════════════════════════════════════════════════════════════════════════════

function renderInfiniteLevelsCard() {
  return (
    <a href="https://hamburgj.github.io/Infinite-Levels/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <div className="vc-infinite-card">
        <div className="vc-inf-recursion">
          <div className="vc-inf-box">
            <div className="vc-inf-box">
              <div className="vc-inf-box">
                <div className="vc-inf-box-inner" />
              </div>
            </div>
          </div>
        </div>
        <div className="vc-inf-stairs">
          {[5,4,3,2,1].map((i) => (
            <div key={i} className="vc-inf-stair" style={{ width: i * 40, height: 20, marginTop: -1, opacity: 0.1 + i * 0.04 }} />
          ))}
        </div>
        <div className="vc-inf-title-wrap">
          <div className="vc-inf-title">Infinite Levels!</div>
        </div>
        <div className="vc-inf-subtitle">level ∞ / ∞</div>
        <div className="vc-inf-desc">
          A recursive descent into mathematical madness. Every level you beat reveals another level.
          There is no end. There is no beginning. There is only <em>∞</em>.
        </div>
        <span className="vc-inf-btn">Descend Forever</span>
      </div>
    </a>
  );
}

function renderFourNinesCard() {
  return (
    <a href="https://hamburgj.github.io/four-nines-game/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <div className="vc-nines-card">
        <div className="vc-nines-screen">
          <div className="vc-nines-header">
            <div className="vc-nines-digits">
              <span className="vc-nines-digit">9</span>
              <span className="vc-nines-digit">9</span>
              <span className="vc-nines-digit">9</span>
              <span className="vc-nines-digit">9</span>
            </div>
            <div className="vc-nines-eq">
              9 + 9 - 9 - 9 = 0<br/>
              9 / 9 + 9 - 9 = 1<br/>
              9 / 9 + 9 / 9 = 2<br/>
              (9 + 9 + 9) / 9 = 3
            </div>
          </div>
          <div className="vc-nines-title">FOUR NINES<span className="vc-nines-underscore">_</span></div>
          <div className="vc-nines-subtitle">daily math terminal v9.9.9.9</div>
          <div className="vc-nines-desc">
            <span className="vc-nines-prompt">&gt;</span> You have exactly four 9s. Combine them with any operation known to mathematics. Hit the target number. Do it daily or lose your streak. <em>(sweating)</em>
          </div>
          <span className="vc-nines-btn">./play --today</span>
        </div>
        <div className="vc-nines-statusbar">
          <span><span className="vc-nines-dot" />CONNECTED</span>
          <span>STREAK: ∞</span>
          <span>9 × 9 × 9 × 9</span>
        </div>
      </div>
    </a>
  );
}

function renderMatchFiveCard() {
  return (
    <a href="https://hamburgj.github.io/match-five/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <div className="vc-match-five">
        <div className="vc-mf-glow-bar" />
        <div className="vc-mf-tiles">
          <span className="vc-mf-tile">M</span>
          <span className="vc-mf-tile">A</span>
          <span className="vc-mf-tile">T</span>
          <span className="vc-mf-tile">C</span>
          <span className="vc-mf-tile">H</span>
          <span className="vc-mf-tile">W</span>
          <span className="vc-mf-tile">O</span>
          <span className="vc-mf-tile">R</span>
          <span className="vc-mf-tile">D</span>
          <span className="vc-mf-tile">S</span>
          <span className="vc-mf-tile">F</span>
          <span className="vc-mf-tile">I</span>
          <span className="vc-mf-tile">V</span>
          <span className="vc-mf-tile">E</span>
        </div>
        <div className="vc-mf-newsprint" />
        <div className="vc-mf-corner vc-mf-corner--tl" />
        <div className="vc-mf-corner vc-mf-corner--tr" />
        <div className="vc-mf-corner vc-mf-corner--bl" />
        <div className="vc-mf-corner vc-mf-corner--br" />
        <span className="vc-mf-clue-num">5 ACROSS · ∞ DOWN</span>
        <div className="vc-mf-content">
          <h2 className="vc-mf-title">Match Five</h2>
          <p className="vc-mf-desc">
            One word. Five meanings. Your brain cells are about to file a restraining order.
            The crossword's unhinged cousin who showed up to the puzzle party uninvited.
          </p>
          <span className="vc-mf-cta">Decode Now →</span>
        </div>
      </div>
    </a>
  );
}

function renderSurvivorStatsCard() {
  return (
    <a href="https://hamburgj.github.io/survivor-stats/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <div className="vc-survivor">
        <div className="vc-sv-embers">
          {Array.from({ length: 12 }).map((_, i) => <span key={i} className="vc-sv-ember" />)}
        </div>
        <div className="vc-sv-torches" />
        <div className="vc-sv-tribal" />
        <div className="vc-sv-smoke" />
        <div className="vc-sv-stats-row">
          <div className="vc-sv-stat">
            <span className="vc-sv-stat-num">47+</span>
            <span className="vc-sv-stat-label">Seasons</span>
          </div>
          <div className="vc-sv-stat">
            <span className="vc-sv-stat-num">800+</span>
            <span className="vc-sv-stat-label">Castaways</span>
          </div>
        </div>
        <div className="vc-sv-vote-card">
          <span className="vc-sv-vote-text">Vote</span>
          <span className="vc-sv-vote-name">Jeff</span>
        </div>
        <div className="vc-sv-content">
          <div className="vc-sv-divider" />
          <span className="vc-sv-subtitle">Tribal Council Analytics</span>
          <h2 className="vc-sv-title">Survivor Stats</h2>
          <p className="vc-sv-desc">
            The tribe has spoken — and it said "give me a database." 47 seasons of blindsides,
            alliances, and immunity idols, crunched into beautiful interactive data.
          </p>
          <span className="vc-sv-cta">Enter Tribal →</span>
        </div>
      </div>
    </a>
  );
}

function renderPlantGuruCard() {
  return (
    <a href="https://plantguru-fydp.github.io/PlantGuru/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <div className="vc-plantguru-card">
        <div className="vc-plantguru-scanlines" />
        <div className="vc-plantguru-vignette" />
        <div className="vc-plantguru-grid" />
        <div className="vc-plantguru-packets">
          <span className="vc-plantguru-packet">0xF4::SOIL_PH=6.8::OK</span>
          <span className="vc-plantguru-packet">TX&gt; moisture_delta=+0.3</span>
          <span className="vc-plantguru-packet">RX&lt; CLOUD::SCHEDULE_ACK</span>
          <span className="vc-plantguru-packet">0xA1::TEMP_C=22.4::NOM</span>
          <span className="vc-plantguru-packet">PREDICT::WATER_IN_36H</span>
        </div>
        <div className="vc-plantguru-dashboard">
          <div className="vc-plantguru-topbar">
            <span className="vc-plantguru-mission">◆ PlantGuru Mission Control</span>
            <span className="vc-plantguru-clock">SYS.UPTIME 847:23:01</span>
          </div>
          <div className="vc-plantguru-titlepanel">
            <h2 className="vc-plantguru-title">Plant<br/>Guru</h2>
            <p className="vc-plantguru-subtitle">
              IoT-powered botanical intelligence. Your plants are being <em>monitored from orbit</em>.
              Cloud-predicted watering. Sensor-verified vibes.
              <span className="vc-blink"> █</span>
            </p>
          </div>
          <div className="vc-plantguru-sensors">
            <div className="vc-plantguru-sensor">
              <span>MOISTURE</span>
              <div className="vc-plantguru-sensor-bar"><div className="vc-plantguru-sensor-bar-fill" style={{ width: '78%' }} /></div>
              <span className="vc-plantguru-sensor-val">78%</span>
            </div>
            <div className="vc-plantguru-sensor">
              <span>SUNLIGHT</span>
              <div className="vc-plantguru-sensor-bar"><div className="vc-plantguru-sensor-bar-fill" style={{ width: '92%' }} /></div>
              <span className="vc-plantguru-sensor-val">92%</span>
            </div>
            <div className="vc-plantguru-sensor">
              <span>TEMP °C</span>
              <div className="vc-plantguru-sensor-bar"><div className="vc-plantguru-sensor-bar-fill" style={{ width: '64%' }} /></div>
              <span className="vc-plantguru-sensor-val">22.4</span>
            </div>
            <div className="vc-plantguru-sensor">
              <span>HUMIDITY</span>
              <div className="vc-plantguru-sensor-bar"><div className="vc-plantguru-sensor-bar-fill" style={{ width: '55%' }} /></div>
              <span className="vc-plantguru-sensor-val">55%</span>
            </div>
            <div className="vc-plantguru-sensor">
              <span>SOIL pH</span>
              <div className="vc-plantguru-sensor-bar"><div className="vc-plantguru-sensor-bar-fill" style={{ width: '70%' }} /></div>
              <span className="vc-plantguru-sensor-val">6.8</span>
            </div>
          </div>
          <div className="vc-plantguru-status">
            <div className="vc-plantguru-status-badge">
              <span className="vc-plantguru-status-dot" />
              PLANT STATUS: THRIVING
            </div>
            <span className="vc-plantguru-cta">
              ACCESS DASHBOARD <span className="vc-plantguru-cta-blink">▸</span>
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VIBECODED CARD STYLES
// Each card has a completely different aesthetic — that's the joke
// ══════════════════════════════════════════════════════════════════════════════

const vibeCardStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap');

  .proj-vibe-stack {
    display: flex;
    flex-direction: column;
    gap: 24px;
    max-width: 700px;
    margin: 0 auto;
  }

  @keyframes projVibeReveal {
    from { opacity: 0; transform: translateY(20px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .vc-card-reveal {
    opacity: 0;
    animation: projVibeReveal 0.6s ease forwards;
  }

  /* ═══════════════════════════════════════
     INFINITE LEVELS — Escher-esque recursive
     ═══════════════════════════════════════ */
  .vc-infinite-card{position:relative;width:100%;min-height:360px;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 30%,#0f3460 60%,#1a1a2e 100%);border:2px solid #5C6BC0;border-radius:0;padding:40px 32px;overflow:hidden;font-family:'Courier New',monospace;color:#e0e0ff;box-sizing:border-box}
  .vc-infinite-card::before{content:'∞';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:400px;color:rgba(92,107,192,0.06);pointer-events:none;animation:vc-inf-spin 20s linear infinite}
  .vc-infinite-card::after{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:repeating-linear-gradient(0deg,transparent,transparent 38px,rgba(92,107,192,0.07) 38px,rgba(92,107,192,0.07) 40px);pointer-events:none}
  @keyframes vc-inf-spin{0%{transform:translate(-50%,-50%) rotate(0deg) scale(1)}50%{transform:translate(-50%,-50%) rotate(180deg) scale(1.1)}100%{transform:translate(-50%,-50%) rotate(360deg) scale(1)}}
  .vc-inf-title-wrap{position:relative;z-index:2;margin-bottom:8px}
  .vc-inf-title{font-size:28px;font-weight:900;letter-spacing:3px;text-transform:uppercase;background:linear-gradient(90deg,#7c4dff,#536dfe,#448aff,#536dfe,#7c4dff);background-size:200% 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:vc-inf-shimmer 4s ease-in-out infinite}
  @keyframes vc-inf-shimmer{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
  .vc-inf-subtitle{font-size:11px;color:#5C6BC0;letter-spacing:6px;text-transform:uppercase;margin-bottom:24px;position:relative;z-index:2}
  .vc-inf-desc{position:relative;z-index:2;font-size:15px;line-height:1.7;color:#b0b0d0;margin-bottom:28px;border-left:3px solid #5C6BC0;padding-left:16px}
  .vc-inf-recursion{position:absolute;right:24px;top:24px;z-index:2}
  .vc-inf-box{border:1.5px solid rgba(92,107,192,0.4);padding:6px;animation:vc-inf-pulse 3s ease-in-out infinite}
  .vc-inf-box:nth-child(1){animation-delay:0s}
  .vc-inf-box:nth-child(2){animation-delay:0.3s}
  .vc-inf-box:nth-child(3){animation-delay:0.6s}
  @keyframes vc-inf-pulse{0%,100%{border-color:rgba(92,107,192,0.2);transform:rotate(0deg)}50%{border-color:rgba(92,107,192,0.7);transform:rotate(3deg)}}
  .vc-inf-box-inner{width:10px;height:10px;background:#5C6BC0;opacity:0.5;animation:vc-inf-pulse 3s ease-in-out infinite;animation-delay:0.9s}
  .vc-inf-btn{position:relative;z-index:2;display:inline-block;padding:12px 32px;background:transparent;border:2px solid #7c4dff;color:#b388ff;font-family:'Courier New',monospace;font-size:14px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;cursor:pointer;transition:all 0.3s ease}
  .vc-inf-btn:hover{background:#7c4dff;color:#fff;box-shadow:0 0 30px rgba(124,77,255,0.5)}
  .vc-inf-stairs{position:absolute;bottom:0;left:0;z-index:1;opacity:0.15}
  .vc-inf-stair{background:#5C6BC0}

  /* ═══════════════════════════════════════
     FOUR NINES — Retro CRT terminal
     ═══════════════════════════════════════ */
  .vc-nines-card{position:relative;width:100%;min-height:360px;background:#1a1a1a;border-radius:0;padding:0;overflow:hidden;font-family:'Courier New',monospace;box-sizing:border-box;border:3px solid #2a2a2a;box-shadow:inset 0 0 60px rgba(0,0,0,0.8)}
  .vc-nines-screen{background:linear-gradient(180deg,#0d1a0d 0%,#0a0f0a 100%);margin:16px;padding:28px 24px;border:2px solid #333;border-radius:4px;position:relative;overflow:hidden;min-height:300px}
  .vc-nines-screen::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:repeating-linear-gradient(0deg,rgba(0,255,0,0.03) 0px,rgba(0,255,0,0.03) 1px,transparent 1px,transparent 3px);pointer-events:none;z-index:1}
  .vc-nines-screen::after{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(ellipse at center,transparent 60%,rgba(0,0,0,0.4) 100%);pointer-events:none;z-index:1}
  .vc-nines-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;position:relative;z-index:2}
  .vc-nines-digits{display:flex;gap:8px}
  .vc-nines-digit{font-size:48px;font-weight:900;color:#ff5722;text-shadow:0 0 10px rgba(255,87,34,0.8),0 0 30px rgba(255,87,34,0.4),0 0 60px rgba(255,87,34,0.2);animation:vc-nines-flicker 3s ease-in-out infinite;line-height:1}
  .vc-nines-digit:nth-child(2){animation-delay:0.5s}
  .vc-nines-digit:nth-child(3){animation-delay:1s}
  .vc-nines-digit:nth-child(4){animation-delay:1.5s}
  @keyframes vc-nines-flicker{0%,100%{opacity:1}90%{opacity:1}92%{opacity:0.8}94%{opacity:1}96%{opacity:0.9}98%{opacity:1}}
  .vc-nines-eq{font-size:12px;color:#4caf50;text-align:right;opacity:0.7;line-height:1.4;font-family:'Courier New',monospace}
  .vc-nines-title{font-size:24px;font-weight:700;color:#4caf50;text-shadow:0 0 8px rgba(76,175,80,0.6);letter-spacing:2px;margin-bottom:6px;position:relative;z-index:2;text-transform:uppercase}
  .vc-nines-underscore{display:inline-block;animation:vc-nines-blink 1s step-end infinite;color:#4caf50}
  @keyframes vc-nines-blink{0%,100%{opacity:1}50%{opacity:0}}
  .vc-nines-subtitle{font-size:11px;color:#666;letter-spacing:3px;text-transform:uppercase;margin-bottom:20px;position:relative;z-index:2}
  .vc-nines-desc{font-size:14px;line-height:1.7;color:#33cc33;position:relative;z-index:2;margin-bottom:24px;opacity:0.85}
  .vc-nines-prompt{color:#666;margin-right:8px}
  .vc-nines-btn{position:relative;z-index:2;display:inline-block;padding:10px 28px;background:#ff5722;border:none;color:#1a1a1a;font-family:'Courier New',monospace;font-size:13px;font-weight:900;letter-spacing:2px;text-transform:uppercase;text-decoration:none;cursor:pointer;transition:all 0.2s}
  .vc-nines-btn:hover{background:#ff7043;box-shadow:0 0 30px rgba(255,87,34,0.7);transform:translateY(-1px)}
  .vc-nines-statusbar{display:flex;justify-content:space-between;background:#111;padding:6px 16px;font-size:10px;color:#555;border-top:1px solid #222;position:absolute;bottom:0;left:0;right:0}
  .vc-nines-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#ff5722;box-shadow:0 0 6px rgba(255,87,34,0.6);margin-right:6px;animation:vc-nines-dot-pulse 2s ease-in-out infinite}
  @keyframes vc-nines-dot-pulse{0%,100%{opacity:1}50%{opacity:0.4}}

  /* ═══════════════════════════════════════
     MATCH FIVE — Neon crossword cyberpunk
     ═══════════════════════════════════════ */
  .vc-match-five{position:relative;width:100%;min-height:380px;background:#0d0520;border-radius:0;overflow:hidden;font-family:'Courier New',monospace;border:3px solid #7B1FA2;box-shadow:0 0 30px rgba(123,31,162,0.4),inset 0 0 60px rgba(123,31,162,0.1)}
  .vc-match-five::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0px,transparent 55px,rgba(156,39,176,0.12) 55px,rgba(156,39,176,0.12) 57px),repeating-linear-gradient(90deg,transparent 0px,transparent 55px,rgba(156,39,176,0.12) 55px,rgba(156,39,176,0.12) 57px);animation:vc-mf-gridPulse 3s ease-in-out infinite}
  @keyframes vc-mf-gridPulse{0%,100%{opacity:0.4}50%{opacity:1}}
  .vc-mf-tiles{position:absolute;inset:0;overflow:hidden}
  .vc-mf-tile{position:absolute;width:44px;height:44px;background:linear-gradient(135deg,#7B1FA2,#9C27B0);border:2px solid #CE93D8;border-radius:6px;display:flex;align-items:center;justify-content:center;font-family:'Courier New',monospace;font-size:22px;font-weight:900;color:#fff;text-shadow:0 0 8px rgba(206,147,216,0.8);box-shadow:0 0 12px rgba(123,31,162,0.5),inset 0 1px 0 rgba(255,255,255,0.2);animation:vc-mf-tileFloat 4s ease-in-out infinite}
  .vc-mf-tile:nth-child(1){top:8%;left:5%;animation-delay:0s;transform:rotate(-8deg)}
  .vc-mf-tile:nth-child(2){top:4%;left:18%;animation-delay:0.3s;transform:rotate(5deg)}
  .vc-mf-tile:nth-child(3){top:12%;left:31%;animation-delay:0.6s;transform:rotate(-3deg)}
  .vc-mf-tile:nth-child(4){top:6%;left:44%;animation-delay:0.9s;transform:rotate(10deg)}
  .vc-mf-tile:nth-child(5){top:10%;left:57%;animation-delay:1.2s;transform:rotate(-12deg)}
  .vc-mf-tile:nth-child(6){top:3%;left:70%;animation-delay:0.15s;transform:rotate(7deg)}
  .vc-mf-tile:nth-child(7){top:8%;left:83%;animation-delay:0.45s;transform:rotate(-5deg)}
  .vc-mf-tile:nth-child(8){top:28%;left:8%;animation-delay:0.75s;transform:rotate(15deg)}
  .vc-mf-tile:nth-child(9){top:25%;left:22%;animation-delay:1.05s;transform:rotate(-10deg)}
  .vc-mf-tile:nth-child(10){top:30%;left:50%;animation-delay:0.5s;transform:rotate(3deg)}
  .vc-mf-tile:nth-child(11){top:26%;left:65%;animation-delay:0.8s;transform:rotate(-7deg)}
  .vc-mf-tile:nth-child(12){top:32%;left:80%;animation-delay:1.1s;transform:rotate(12deg)}
  .vc-mf-tile:nth-child(13){top:22%;left:38%;animation-delay:0.2s;transform:rotate(-15deg)}
  .vc-mf-tile:nth-child(14){top:15%;left:92%;animation-delay:0.65s;transform:rotate(8deg)}
  @keyframes vc-mf-tileFloat{0%,100%{transform:translateY(0);filter:brightness(1)}25%{transform:translateY(-8px);filter:brightness(1.3)}50%{transform:translateY(-4px);filter:brightness(1)}75%{transform:translateY(-10px);filter:brightness(1.2)}}
  .vc-mf-newsprint{position:absolute;inset:0;opacity:0.03;background:repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 3px);pointer-events:none}
  .vc-mf-glow-bar{position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,transparent,#CE93D8,#7B1FA2,#CE93D8,transparent);animation:vc-mf-glowScan 2.5s linear infinite}
  @keyframes vc-mf-glowScan{0%{opacity:0.5}50%{opacity:1}100%{opacity:0.5}}
  .vc-mf-content{position:absolute;bottom:0;left:0;right:0;padding:32px;background:linear-gradient(to top,rgba(13,5,32,0.97) 0%,rgba(13,5,32,0.85) 60%,transparent 100%);z-index:2}
  .vc-mf-title{font-family:'Courier New',monospace;font-size:36px;font-weight:900;color:#CE93D8;text-shadow:0 0 20px rgba(206,147,216,0.6),0 0 40px rgba(123,31,162,0.4);letter-spacing:6px;text-transform:uppercase;margin-bottom:8px;animation:vc-mf-titleGlow 2s ease-in-out infinite alternate}
  @keyframes vc-mf-titleGlow{0%{text-shadow:0 0 20px rgba(206,147,216,0.6),0 0 40px rgba(123,31,162,0.4)}100%{text-shadow:0 0 30px rgba(206,147,216,0.9),0 0 60px rgba(123,31,162,0.6),0 0 80px rgba(156,39,176,0.3)}}
  .vc-mf-desc{font-family:'Georgia',serif;font-size:15px;color:rgba(206,147,216,0.7);font-style:italic;line-height:1.6;margin-bottom:20px;max-width:500px}
  .vc-mf-cta{display:inline-block;padding:12px 28px;background:transparent;border:2px solid #CE93D8;color:#CE93D8;font-family:'Courier New',monospace;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:3px;text-decoration:none;cursor:pointer;transition:all 0.3s ease;position:relative;overflow:hidden}
  .vc-mf-cta::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(206,147,216,0.2),transparent);animation:vc-mf-ctaSweep 2s linear infinite}
  @keyframes vc-mf-ctaSweep{0%{left:-100%}100%{left:100%}}
  .vc-mf-cta:hover{background:#7B1FA2;border-color:#7B1FA2;color:#fff;box-shadow:0 0 25px rgba(123,31,162,0.6);transform:translateY(-2px)}
  .vc-mf-clue-num{position:absolute;top:16px;right:20px;font-family:'Georgia',serif;font-size:11px;color:rgba(206,147,216,0.3);letter-spacing:1px;z-index:2}
  .vc-mf-corner{position:absolute;width:20px;height:20px;border-color:rgba(206,147,216,0.3);border-style:solid}
  .vc-mf-corner--tl{top:8px;left:8px;border-width:2px 0 0 2px}
  .vc-mf-corner--tr{top:8px;right:8px;border-width:2px 2px 0 0}
  .vc-mf-corner--bl{bottom:8px;left:8px;border-width:0 0 2px 2px}
  .vc-mf-corner--br{bottom:8px;right:8px;border-width:0 2px 2px 0}

  /* ═══════════════════════════════════════
     SURVIVOR STATS — Tribal council inferno
     ═══════════════════════════════════════ */
  .vc-survivor{position:relative;width:100%;min-height:380px;background:#0a0400;overflow:hidden;font-family:'Georgia',serif;border:none;border-radius:0}
  .vc-survivor::before{content:'';position:absolute;inset:0;background:linear-gradient(0deg,#0a0400 0%,#1a0800 15%,#3d1200 35%,#8b2500 55%,#E65100 75%,#ff8f00 90%,#ffcc02 100%);background-size:100% 300%;animation:vc-sv-fireRise 4s ease-in-out infinite alternate}
  @keyframes vc-sv-fireRise{0%{background-position:0% 60%}50%{background-position:0% 55%}100%{background-position:0% 65%}}
  .vc-sv-embers{position:absolute;inset:0;overflow:hidden;pointer-events:none}
  .vc-sv-ember{position:absolute;width:3px;height:3px;background:#ffcc02;border-radius:50%;box-shadow:0 0 6px 2px rgba(255,140,0,0.8);animation:vc-sv-emberRise 3s ease-out infinite;opacity:0}
  .vc-sv-ember:nth-child(1){left:10%;animation-delay:0s;animation-duration:3.2s}
  .vc-sv-ember:nth-child(2){left:25%;animation-delay:0.5s;animation-duration:2.8s}
  .vc-sv-ember:nth-child(3){left:40%;animation-delay:1.0s;animation-duration:3.5s}
  .vc-sv-ember:nth-child(4){left:55%;animation-delay:0.3s;animation-duration:2.6s}
  .vc-sv-ember:nth-child(5){left:70%;animation-delay:0.8s;animation-duration:3.0s}
  .vc-sv-ember:nth-child(6){left:85%;animation-delay:1.3s;animation-duration:3.3s}
  .vc-sv-ember:nth-child(7){left:15%;animation-delay:1.8s;animation-duration:2.9s}
  .vc-sv-ember:nth-child(8){left:50%;animation-delay:0.7s;animation-duration:3.1s}
  .vc-sv-ember:nth-child(9){left:78%;animation-delay:1.5s;animation-duration:2.7s}
  .vc-sv-ember:nth-child(10){left:35%;animation-delay:2.0s;animation-duration:3.4s}
  .vc-sv-ember:nth-child(11){left:62%;animation-delay:0.2s;animation-duration:2.5s}
  .vc-sv-ember:nth-child(12){left:92%;animation-delay:1.1s;animation-duration:3.6s}
  @keyframes vc-sv-emberRise{0%{bottom:-5%;opacity:0;transform:translateX(0) scale(1)}10%{opacity:1}60%{opacity:0.8}100%{bottom:105%;opacity:0;transform:translateX(20px) scale(0.3)}}
  .vc-sv-torches{position:absolute;inset:0;pointer-events:none}
  .vc-sv-torches::before{content:'';position:absolute;left:3%;top:10%;width:80px;height:200px;background:radial-gradient(ellipse at center,rgba(255,140,0,0.25) 0%,transparent 70%);animation:vc-sv-torchFlicker 1.5s ease-in-out infinite alternate}
  .vc-sv-torches::after{content:'';position:absolute;right:3%;top:10%;width:80px;height:200px;background:radial-gradient(ellipse at center,rgba(255,140,0,0.25) 0%,transparent 70%);animation:vc-sv-torchFlicker 1.5s ease-in-out infinite alternate-reverse}
  @keyframes vc-sv-torchFlicker{0%{opacity:0.6;transform:scaleY(1)}33%{opacity:1;transform:scaleY(1.05)}66%{opacity:0.75;transform:scaleY(0.97)}100%{opacity:0.9;transform:scaleY(1.02)}}
  .vc-sv-tribal{position:absolute;inset:0;opacity:0.08;background:repeating-linear-gradient(0deg,transparent 0px,transparent 24px,rgba(255,200,100,0.6) 24px,rgba(255,200,100,0.6) 26px),repeating-linear-gradient(60deg,transparent 0px,transparent 30px,rgba(255,150,50,0.4) 30px,rgba(255,150,50,0.4) 32px),repeating-linear-gradient(-60deg,transparent 0px,transparent 30px,rgba(255,150,50,0.3) 30px,rgba(255,150,50,0.3) 32px);pointer-events:none}
  .vc-sv-smoke{position:absolute;top:0;left:0;right:0;height:60%;background:linear-gradient(to bottom,rgba(10,4,0,0.4) 0%,transparent 100%);pointer-events:none;z-index:1}
  .vc-sv-vote-card{position:absolute;top:20px;right:20px;width:90px;height:120px;background:linear-gradient(160deg,#f5e6c8,#e8d5a8,#d4c090);border-radius:2px;box-shadow:2px 3px 12px rgba(0,0,0,0.5);transform:rotate(5deg);display:flex;flex-direction:column;align-items:center;justify-content:center;animation:vc-sv-voteHover 3s ease-in-out infinite;z-index:2}
  .vc-sv-vote-card::before{content:'';position:absolute;inset:4px;border:1px solid rgba(139,37,0,0.2);border-radius:1px}
  .vc-sv-vote-text{font-family:'Georgia',serif;font-size:10px;color:rgba(139,37,0,0.5);text-transform:uppercase;letter-spacing:2px;margin-bottom:4px}
  .vc-sv-vote-name{font-family:'Brush Script MT','Segoe Script',cursive;font-size:22px;color:#3d1200;transform:rotate(-3deg)}
  @keyframes vc-sv-voteHover{0%,100%{transform:rotate(5deg) translateY(0)}50%{transform:rotate(3deg) translateY(-5px)}}
  .vc-sv-stats-row{position:absolute;top:20px;left:20px;display:flex;flex-direction:column;gap:8px;z-index:2}
  .vc-sv-stat{background:rgba(10,4,0,0.7);backdrop-filter:blur(8px);border:1px solid rgba(255,140,0,0.3);border-radius:4px;padding:6px 12px;display:flex;align-items:baseline;gap:6px}
  .vc-sv-stat-num{font-family:'Courier New',monospace;font-size:18px;font-weight:900;color:#ffcc02;text-shadow:0 0 8px rgba(255,204,2,0.5)}
  .vc-sv-stat-label{font-family:'Georgia',serif;font-size:10px;color:rgba(255,200,150,0.6);text-transform:uppercase;letter-spacing:1px}
  .vc-sv-content{position:absolute;bottom:0;left:0;right:0;padding:32px;background:linear-gradient(to top,rgba(10,4,0,0.98) 0%,rgba(10,4,0,0.8) 50%,transparent 100%);z-index:2}
  .vc-sv-subtitle{font-family:'Courier New',monospace;font-size:10px;text-transform:uppercase;letter-spacing:4px;color:rgba(255,140,0,0.6);margin-bottom:6px}
  .vc-sv-title{font-family:'Georgia',serif;font-size:34px;font-weight:700;color:#ffcc02;text-shadow:0 0 20px rgba(255,204,2,0.4),0 2px 4px rgba(0,0,0,0.5);letter-spacing:1px;margin-bottom:8px;line-height:1.1}
  .vc-sv-desc{font-family:'Georgia',serif;font-size:14px;color:rgba(255,200,150,0.75);font-style:italic;line-height:1.6;margin-bottom:20px;max-width:450px}
  .vc-sv-cta{display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#E65100,#ff8f00);color:#fff;font-family:'Georgia',serif;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:2px;text-decoration:none;cursor:pointer;border:none;transition:all 0.3s ease;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))}
  .vc-sv-cta:hover{background:linear-gradient(135deg,#bf360c,#E65100);box-shadow:0 0 30px rgba(230,81,0,0.5);transform:translateY(-2px)}
  .vc-sv-divider{width:60px;height:2px;background:linear-gradient(90deg,transparent,#ff8f00,transparent);margin-bottom:12px;animation:vc-sv-divPulse 2s ease-in-out infinite alternate}
  @keyframes vc-sv-divPulse{0%{opacity:0.5;width:60px}100%{opacity:1;width:80px}}

  /* ═══════════════════════════════════════
     PLANTGURU — Y2K Mission Control
     ═══════════════════════════════════════ */
  .vc-plantguru-card{position:relative;width:100%;height:380px;border-radius:0;overflow:hidden;background:#030a01;border:1px solid #0f3d0c;box-shadow:0 0 30px rgba(46,125,50,0.15),inset 0 0 80px rgba(0,20,0,0.5);cursor:pointer;text-decoration:none;display:block;font-family:'Share Tech Mono',monospace;transition:box-shadow 0.4s ease}
  .vc-plantguru-card:hover{box-shadow:0 0 60px rgba(46,125,50,0.3),0 0 120px rgba(46,125,50,0.1),inset 0 0 80px rgba(0,20,0,0.5)}
  .vc-plantguru-scanlines{position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0px,transparent 2px,rgba(0,255,0,0.015) 2px,rgba(0,255,0,0.015) 4px);pointer-events:none;z-index:10;animation:vc-pg-scanroll 8s linear infinite}
  @keyframes vc-pg-scanroll{from{background-position:0 0}to{background-position:0 100px}}
  .vc-plantguru-vignette{position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 50% 50%,transparent 0%,rgba(0,0,0,0.6) 100%);pointer-events:none;z-index:9}
  .vc-plantguru-card::before{content:'';position:absolute;inset:0;background:rgba(0,255,0,0.01);animation:vc-pg-flicker 0.15s infinite alternate;pointer-events:none;z-index:8}
  @keyframes vc-pg-flicker{0%{opacity:1}50%{opacity:0.97}100%{opacity:1}}
  .vc-plantguru-grid{position:absolute;inset:0;background:linear-gradient(rgba(0,255,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,0,0.03) 1px,transparent 1px);background-size:24px 24px;animation:vc-pg-gridpulse 4s ease-in-out infinite}
  @keyframes vc-pg-gridpulse{0%,100%{opacity:0.4}50%{opacity:0.8}}
  .vc-plantguru-dashboard{position:relative;z-index:5;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto 1fr auto;height:100%;padding:20px;gap:12px}
  .vc-plantguru-topbar{grid-column:1/-1;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(0,255,0,0.15);padding-bottom:10px}
  .vc-plantguru-mission{font-family:'Orbitron',monospace;font-size:10px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:#4caf50;animation:vc-pg-textglow 2s ease-in-out infinite alternate}
  @keyframes vc-pg-textglow{from{text-shadow:0 0 4px rgba(76,175,80,0.5)}to{text-shadow:0 0 12px rgba(76,175,80,0.8),0 0 30px rgba(76,175,80,0.3)}}
  .vc-plantguru-clock{font-size:11px;color:rgba(0,255,0,0.5);letter-spacing:0.1em}
  .vc-plantguru-titlepanel{display:flex;flex-direction:column;justify-content:center;gap:12px}
  .vc-plantguru-title{font-family:'Orbitron',monospace;font-size:clamp(28px,4vw,42px);font-weight:900;color:#4caf50;line-height:1.1;text-shadow:0 0 20px rgba(76,175,80,0.6),0 0 60px rgba(76,175,80,0.2);letter-spacing:0.05em}
  .vc-plantguru-subtitle{font-size:12px;color:rgba(0,255,0,0.6);line-height:1.6;max-width:320px}
  .vc-blink{animation:vc-pg-blink 1s step-end infinite}
  @keyframes vc-pg-blink{0%,100%{opacity:1}50%{opacity:0}}
  .vc-plantguru-sensors{display:flex;flex-direction:column;gap:8px;justify-content:center;border-left:1px solid rgba(0,255,0,0.08);padding-left:16px}
  .vc-plantguru-sensor{display:flex;justify-content:space-between;align-items:center;font-size:11px;color:rgba(0,255,0,0.45);letter-spacing:0.05em}
  .vc-plantguru-sensor-val{font-family:'Orbitron',monospace;font-weight:700;font-size:13px;color:#4caf50;text-shadow:0 0 6px rgba(76,175,80,0.5)}
  .vc-plantguru-sensor-bar{flex:1;height:3px;margin:0 10px;background:rgba(0,255,0,0.08);border-radius:2px;overflow:hidden;position:relative}
  .vc-plantguru-sensor-bar-fill{position:absolute;top:0;left:0;height:100%;background:linear-gradient(90deg,#1b5e20,#4caf50);box-shadow:0 0 6px rgba(76,175,80,0.4);border-radius:2px}
  .vc-plantguru-status{grid-column:1/-1;display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(0,255,0,0.15);padding-top:12px}
  .vc-plantguru-status-badge{display:inline-flex;align-items:center;gap:8px;font-family:'Orbitron',monospace;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#4caf50;padding:6px 14px;border:1px solid rgba(76,175,80,0.3);background:rgba(76,175,80,0.05)}
  .vc-plantguru-status-dot{width:6px;height:6px;border-radius:50%;background:#4caf50;box-shadow:0 0 8px rgba(76,175,80,0.8);animation:vc-pg-pulse 2s ease-in-out infinite}
  @keyframes vc-pg-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.7)}}
  .vc-plantguru-cta{display:inline-flex;align-items:center;gap:8px;font-family:'Share Tech Mono',monospace;font-size:12px;color:#4caf50;padding:8px 20px;border:1px solid rgba(76,175,80,0.4);background:rgba(76,175,80,0.08);text-decoration:none;letter-spacing:0.1em;text-transform:uppercase;transition:all 0.3s ease;cursor:pointer}
  .vc-plantguru-cta:hover{background:rgba(76,175,80,0.2);border-color:#4caf50;box-shadow:0 0 20px rgba(76,175,80,0.3);color:#81c784}
  .vc-plantguru-cta-blink{animation:vc-pg-blink 1.2s step-end infinite}
  .vc-plantguru-packets{position:absolute;inset:0;pointer-events:none;z-index:2;overflow:hidden}
  .vc-plantguru-packet{position:absolute;font-family:'Share Tech Mono',monospace;font-size:9px;color:rgba(0,255,0,0.12);white-space:nowrap;animation:vc-pg-float 12s linear infinite}
  .vc-plantguru-packet:nth-child(1){left:5%;top:20%;animation-delay:0s;animation-duration:14s}
  .vc-plantguru-packet:nth-child(2){left:25%;top:40%;animation-delay:-3s;animation-duration:11s}
  .vc-plantguru-packet:nth-child(3){left:55%;top:15%;animation-delay:-7s;animation-duration:16s}
  .vc-plantguru-packet:nth-child(4){left:75%;top:55%;animation-delay:-2s;animation-duration:13s}
  .vc-plantguru-packet:nth-child(5){left:40%;top:70%;animation-delay:-9s;animation-duration:15s}
  @keyframes vc-pg-float{0%{transform:translateY(0) translateX(0);opacity:0}10%{opacity:0.12}90%{opacity:0.12}100%{transform:translateY(-200px) translateX(30px);opacity:0}}

  /* Responsive */
  @media (max-width: 600px) {
    .vc-plantguru-dashboard{grid-template-columns:1fr}
    .vc-plantguru-sensors{border-left:none;border-top:1px solid rgba(0,255,0,0.08);padding-left:0;padding-top:12px}
    .vc-plantguru-title{font-size:28px}
  }
`;

export default ProjectsRoom;
