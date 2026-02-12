import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SitePhase } from '../../../hooks/useSiteState';
import { projects as projectsData } from '../../../data/projects';
import VibeCodingOverlay from '../../VibeCodingOverlay/VibeCodingOverlay';
import HintTerminal from '../../VibeCodingOverlay/HintTerminal';
import {
  PROJECTS_HINT_LINES,
  PROJECTS_ERROR_JOSH_LINES,
  PROJECTS_TO_LOBBY_COPILOT,
} from '../../VibeCodingOverlay/sequences';
import type { VibeCodingSequence, TerminalLine } from '../../VibeCodingOverlay/VibeCodingOverlay';

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

const ProjectsRoom: React.FC<ProjectsRoomProps> = ({ navigateTo, autoSequence = false, onSequenceComplete }) => {
  const [vibeActive, setVibeActive] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [showError, setShowError] = useState(false);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-sequence: show hint after delay, then auto-trigger
  useEffect(() => {
    if (!autoSequence) return;
    autoTimerRef.current = setTimeout(() => {
      setHintVisible(true);
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
    if (showError || vibeActive) return;
    if (autoTimerRef.current) { clearTimeout(autoTimerRef.current); autoTimerRef.current = null; }
    if (hintTimerRef.current) { clearTimeout(hintTimerRef.current); hintTimerRef.current = null; }
    setHintVisible(false);
    setShowError(true);
    setTimeout(() => setVibeActive(true), 2000);
  }, [showError, vibeActive]);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    if (!autoSequence) return; // Let normal clicks through when not in auto-sequence
    e.preventDefault();
    triggerBug();
  }, [autoSequence, triggerBug]);

  const handleVibeComplete = useCallback(() => {
    setVibeActive(false);
    setShowError(false);
    if (onSequenceComplete) onSequenceComplete();
  }, [onSequenceComplete]);

  const allJoshLines: TerminalLine[] = [...PROJECTS_ERROR_JOSH_LINES];

  const vibeSequence: VibeCodingSequence = {
    joshLines: allJoshLines,
    copilotMessages: PROJECTS_TO_LOBBY_COPILOT,
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
        {/* Flagship projects */}
        <div className="proj-flagships">
          {projects.filter(p => p.flagship).map(project => (
            <a
              key={project.name}
              className="proj-card proj-card-flagship"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCardClick}
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
              onClick={handleCardClick}
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

      {/* Error overlay */}
      {showError && (
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
              Uncaught Error: Navigation outside of app boundary
            </p>
            <p style={{ color: '#888', fontSize: '0.85rem', margin: 0, lineHeight: 1.7 }}>
              at Router.push (Router.tsx:142)<br/>
              at navigateExternal (useNavigation.ts:38)<br/>
              at ProjectCard (ProjectsRoom.tsx:287)<br/>
              at onClick (ProjectsRoom.tsx:312)<br/>
              at HTMLAnchorElement.dispatch (react-dom.production.min.js:44)<br/>
              at HTMLAnchorElement.handleClick (react-dom.production.min.js:44)
            </p>
          </div>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>
            This error occurred during navigation to an external URL.
          </p>
        </div>
      )}

      <HintTerminal lines={PROJECTS_HINT_LINES} visible={hintVisible && !showError && !vibeActive} />

      <VibeCodingOverlay sequence={vibeSequence} active={vibeActive} />
    </div>
  );
};

export default ProjectsRoom;
