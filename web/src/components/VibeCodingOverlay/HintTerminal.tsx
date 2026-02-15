import React, { useState, useEffect, useRef } from 'react';

/**
 * A compact "hint" terminal that slides up from the bottom of the screen
 * when the user hasn't interacted with the bug-trigger element.
 * Looks like a small VS Code terminal with Josh's gray comment lines.
 */

interface HintTerminalProps {
  /** Lines Josh types as hints */
  lines: string[];
  /** Whether the hint is visible */
  visible: boolean;
}

const MONO_STACK = '"Cascadia Code", Consolas, "Courier New", monospace';
const FONT_STACK = 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const TerminalIconHint: React.FC = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="#cccccc" aria-hidden="true">
    <path d="M6 9l3-3-3-3-.7.7L7.6 6 5.3 8.3zm4 1H7v1h3z" />
    <path d="M1 2.5A1.5 1.5 0 012.5 1h11A1.5 1.5 0 0115 2.5v11a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 011 13.5zm1.5-.5a.5.5 0 00-.5.5v11a.5.5 0 00.5.5h11a.5.5 0 00.5-.5v-11a.5.5 0 00-.5-.5z" />
  </svg>
);

const HintTerminal: React.FC<HintTerminalProps> = ({ lines, visible }) => {
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentTyping, setCurrentTyping] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Reset when visibility changes
  useEffect(() => {
    if (!visible) {
      setTypedLines([]);
      setCurrentTyping('');
      setLineIndex(0);
      setCharIndex(0);
      setStarted(false);
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      return;
    }

    // Start typing after slide-up animation completes
    const t = setTimeout(() => setStarted(true), 600);
    timersRef.current.push(t);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [visible]);

  // Typing effect
  useEffect(() => {
    if (!visible || !started || lineIndex >= lines.length) return;

    const currentLine = lines[lineIndex];

    if (charIndex < currentLine.length) {
      const t = setTimeout(() => {
        setCurrentTyping(currentLine.slice(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      }, 30 + Math.random() * 60);
      timersRef.current.push(t);
    } else {
      // Line complete — pause, then move to next
      const t = setTimeout(() => {
        setTypedLines(prev => [...prev, currentLine]);
        setCurrentTyping('');
        setLineIndex(prev => prev + 1);
        setCharIndex(0);
      }, 600);
      timersRef.current.push(t);
    }
  }, [visible, started, lineIndex, charIndex, lines]);

  if (!visible) return null;

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '110px',
        zIndex: 9998,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'htSlideUp 0.4s cubic-bezier(0, 0, 0.2, 1) forwards',
      }}>
        {/* Blue accent */}
        <div style={{ height: '2px', background: '#007acc', flexShrink: 0 }} />

        {/* Title bar */}
        <div style={{
          background: '#252526',
          display: 'flex',
          alignItems: 'center',
          height: '28px',
          flexShrink: 0,
          borderBottom: '1px solid #1e1e1e',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0 12px',
            height: '100%',
            background: '#1e1e1e',
            color: '#cccccc',
            fontSize: '11px',
            fontFamily: FONT_STACK,
            borderTop: '1px solid #007acc',
            borderRight: '1px solid #252526',
          }}>
            <TerminalIconHint />
            <span>josh@portfolio</span>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', paddingRight: '4px' }}>
            {['\u2013', '\u25A1', '\u00D7'].map((ch, idx) => (
              <span key={idx} style={{
                color: '#666', fontSize: '14px', padding: '0 6px',
                height: '28px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontFamily: FONT_STACK,
              }}>{ch}</span>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{
          flex: 1,
          background: '#1e1e1e',
          color: '#a0a0a0',
          fontFamily: MONO_STACK,
          fontSize: '13px',
          padding: '8px 16px',
          lineHeight: 1.5,
          overflowY: 'auto',
        }}>
          {typedLines.map((line, i) => (
            <p key={i} style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5, minHeight: '20px' }}>
              <span style={{ color: '#a0a0a0' }}>{line}</span>
            </p>
          ))}
          {started && lineIndex < lines.length && currentTyping && (
            <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5, minHeight: '20px' }}>
              <span style={{ color: '#a0a0a0' }}>{currentTyping}</span>
              <span style={{
                display: 'inline-block', width: '7px', height: '14px',
                background: '#cccccc', marginLeft: '2px', verticalAlign: 'text-bottom',
                animation: 'htBlink 1s step-end infinite',
              }} />
            </p>
          )}
        </div>
      </div>
      <style>{`
        @keyframes htSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes htBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default HintTerminal;
