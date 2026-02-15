import React, { useState, useEffect, useRef } from 'react';
import { SitePhase } from '../../hooks/useSiteState';

interface DebugPageProps {
  navigateTo: (phase: SitePhase) => void;
}

const FAKE_CODE = [
  'import { Reality } from "@universe/core";',
  'import { Developer } from "./hamburger";',
  'import { Portfolio, Website } from "./components";',
  '',
  '// WARNING: This code is 47% spaghetti',
  '// The other 53% is also spaghetti but with parmesan',
  '',
  'const portfolio = new Portfolio({',
  '  developer: "Joshua Hamburger",',
  '  theme: "existential-dread-with-rounded-corners",',
  '  framework: "React", // chosen by mass hypnosis',
  '  bugs: Infinity,',
  '  features: bugs + 1,',
  '});',
  '',
  'class ChatbotAI {',
  '  private mood: "sassy" | "helpful" | "broken" = "sassy";',
  '  private knowledge: Map<string, string> = new Map();',
  '',
  '  constructor() {',
  '    this.knowledge.set("meaning_of_life", "hamburgers");',
  '    this.knowledge.set("best_framework", "the one that works");',
  '    this.knowledge.set("tabs_vs_spaces", "yes");',
  '  }',
  '',
  '  async respond(input: string): Promise<string> {',
  '    if (this.mood === "broken") {',
  '      return "I am having an existential crisis. Please try again later.";',
  '    }',
  '    // 30% chance of being helpful',
  '    if (Math.random() > 0.7) {',
  '      this.mood = "helpful";',
  '      return this.actuallyHelpfulResponse(input);',
  '    }',
  '    return this.sassyResponse(input);',
  '  }',
  '}',
  '',
  '// TODO: Fix the thing that does the other thing',
  '// TODO: Remember what the thing is',
  '// TODO: Add more TODOs',
  '',
  'function renderPortfolio() {',
  '  try {',
  '    return <Website looks="professional" actually="chaos" />;',
  '  } catch (e) {',
  '    // This is fine. Everything is fine.',
  '    console.log("🔥 This is fine.");',
  '    return <Website looks="on-fire" />;',
  '  }',
  '}',
  '',
  'export const DEVELOPER_STATS = {',
  '  coffeeConsumed: "∞ cups",',
  '  bugsFixed: 1247,',
  '  bugsCreated: 1248, // net negative, impressive',
  '  stackOverflowVisits: "yes",',
  '  timesGoogledCSS: 9999,',
  '  darkModePreference: "always",',
  '  favoriteError: "undefined is not a function",',
  '  copilotDependency: "severe",',
  '  actuallyPrettyGood: also_true,',
  '};',
  '',
  '// If you\'re reading this, you found a secret.',
  '// There is no prize. Just the satisfaction.',
  '// And this hamburger: 🍔',
  '',
  'Reality.render(portfolio, {',
  '  target: document.getElementById("the-void"),',
  '  mode: "chaotic-good",',
  '  onError: (e) => {',
  '    // Pretend nothing happened',
  '    console.log("Everything is under control.");',
  '    console.log("narrator: it was not under control.");',
  '  },',
  '});',
  '',
  '// END OF FILE',
  '// (just kidding, the file goes on forever)',
  '// (like this portfolio)',
  '// (please hire me)',
];

const DebugPage: React.FC<DebugPageProps> = ({ navigateTo }) => {
  const [lines, setLines] = useState<{ text: string; opacity: number }[]>([]);
  const [lineIndex, setLineIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLineIndex(prev => {
        const next = prev + 1;
        const codeIndex = next % FAKE_CODE.length;
        setLines(old => [
          ...old.slice(-60), // Keep last 60 lines to avoid memory issues
          { text: FAKE_CODE[codeIndex], opacity: 1 }
        ]);
        return next;
      });
    }, 180);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0a0a0a',
      fontFamily: "'Courier New', Courier, monospace",
      overflow: 'hidden',
    }}>
      {/* Matrix rain background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(0,255,65,0.03) 0%, transparent 50%, rgba(0,255,65,0.02) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Scanline effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, transparent 1px, transparent 3px)',
        pointerEvents: 'none',
        zIndex: 10,
      }} />

      {/* Header */}
      <div style={{
        position: 'relative',
        zIndex: 20,
        padding: '16px 24px',
        borderBottom: '1px solid #00ff4122',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <span style={{ color: '#00ff41', fontSize: '13px', fontWeight: 'bold' }}>
            [DEBUG MODE]
          </span>
          <span style={{ color: '#00ff4166', fontSize: '11px', marginLeft: '12px' }}>
            portfolio.source.tsx — LIVE
          </span>
        </div>
        <button
          onClick={() => navigateTo('lobby')}
          style={{
            background: 'none',
            border: '1px solid #00ff4144',
            color: '#00ff4188',
            fontFamily: "'Courier New', monospace",
            fontSize: '12px',
            padding: '4px 12px',
            cursor: 'pointer',
            borderRadius: '2px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#00ff41';
            e.currentTarget.style.color = '#00ff41';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#00ff4144';
            e.currentTarget.style.color = '#00ff4188';
          }}
        >
          [X] EXIT
        </button>
      </div>

      {/* Code scroll area */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          zIndex: 5,
          padding: '20px 24px',
          height: 'calc(100vh - 60px)',
          overflow: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {lines.map((line, i) => {
          const lineNum = (i + 1).toString().padStart(4, ' ');
          // Syntax highlighting
          let color = '#00ff41cc';
          if (line.text.startsWith('//') || line.text.startsWith('  //')) {
            color = '#00ff4166';
          } else if (line.text.includes('import ') || line.text.includes('export ') || line.text.includes('const ') || line.text.includes('class ') || line.text.includes('function ')) {
            color = '#00ffaa';
          } else if (line.text.includes('"') || line.text.includes("'")) {
            color = '#41ff90';
          }

          return (
            <div key={i} style={{
              fontSize: '13px',
              lineHeight: '1.7',
              whiteSpace: 'pre',
              opacity: line.opacity,
              animation: 'debugFadeIn 0.3s ease',
            }}>
              <span style={{ color: '#00ff4133', marginRight: '16px', userSelect: 'none' }}>
                {lineNum}
              </span>
              <span style={{ color }}>
                {line.text}
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes debugFadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default DebugPage;
