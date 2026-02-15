import React, { useState, useEffect, useRef } from 'react';
import RebuildDeploy from './RebuildDeploy';
import { useTerminalTyper, TerminalLine } from '../VibeCodingOverlay/Shared/useTerminalTyper';
import { useAgentSequencer, AgentMessage } from '../VibeCodingOverlay/Shared/useAgentSequencer';
import { TerminalPanel } from '../VibeCodingOverlay/Shared/TerminalPanel';
import { CopilotAgentPanel } from '../VibeCodingOverlay/Shared/CopilotAgentPanel';
import { OctocatSVG, SHARED_KEYFRAMES } from '../VibeCodingOverlay/Shared/Icons';
import { ErrorBoundaryOverlay } from '../VibeCodingOverlay/Shared/ErrorBoundaryOverlay';

interface LoadingSequenceProps {
  isFirstVisit: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

// ── Inline SVGs ──────────────────────────────────────────────────────────────

const LoadingGearSVG: React.FC = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="24" cy="24" r="18" fill="#3b82f6" opacity="0.15" />
    <circle cx="24" cy="24" r="18" stroke="#3b82f6" strokeWidth="2" fill="none" />
    <path
      d="M24 12v4M24 32v4M12 24h4M32 24h4M15.5 15.5l2.8 2.8M29.7 29.7l2.8 2.8M15.5 32.5l2.8-2.8M29.7 18.3l2.8-2.8"
      stroke="#3b82f6"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="24" cy="24" r="5" stroke="#3b82f6" strokeWidth="2" fill="none" />
  </svg>
);

// ── Styles ───────────────────────────────────────────────────────────────────

const FONT_STACK =
  'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const MONO_STACK =
  '"Cascadia Code", Consolas, "Courier New", monospace';

const styles: Record<string, React.CSSProperties> = {
  root: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: '#f0f0f0',
    fontFamily: FONT_STACK,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  header: {
    background: '#24292e',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  headerText: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: 1,
  },
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  card: {
    background: '#fff',
    border: '1px solid #d5d8db',
    borderRadius: '4px',
    padding: '40px 50px',
    maxWidth: '480px',
    width: '100%',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    textAlign: 'center' as const,
    position: 'relative' as const,
  },
  shieldWrap: {
    marginBottom: '20px',
  },
  siteUrl: {
    fontSize: '13px',
    color: '#999',
    margin: '0 0 12px',
  },
  heading: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1a1a1a',
    margin: '0 0 24px',
  },
  progressTrack: {
    height: '4px',
    background: '#e8e8e8',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '24px',
  },
  progressBar: {
    height: '100%',
    background: '#3b82f6',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },
  subtext: {
    fontSize: '13px',
    color: '#777',
    margin: '0 0 6px',
  },
  autoText: {
    fontSize: '11px',
    color: '#aaa',
    margin: '0 0 20px',
  },
  rayId: {
    fontSize: '11px',
    color: '#bbb',
    borderTop: '1px solid #eee',
    paddingTop: '16px',
    margin: 0,
  },
  footer: {
    background: '#fafbfc',
    borderTop: '1px solid #e1e4e8',
    padding: '14px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '12px',
    color: '#586069',
  },
  errorOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: '#fff',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderRadius: '4px',
    padding: '30px 36px',
  },
  errorStatusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
    width: '100%',
  },
  errorStatusIcon: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: '#cb2431',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 700 as const,
    flexShrink: 0,
  },
  errorStatusText: {
    fontSize: '14px',
    fontWeight: 600 as const,
    color: '#24292e',
  },
  errorStatusTime: {
    fontSize: '12px',
    color: '#586069',
    marginLeft: 'auto' as const,
  },
  errorLogBox: {
    width: '100%',
    background: '#24292e',
    borderRadius: '6px',
    overflow: 'hidden' as const,
    marginBottom: '14px',
    border: '1px solid #1b1f23',
  },
  errorLogHeader: {
    padding: '8px 12px',
    background: '#1b1f23',
    fontSize: '12px',
    fontWeight: 600 as const,
    color: '#e1e4e8',
    fontFamily: MONO_STACK,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  errorLogBody: {
    padding: '12px 16px',
    fontFamily: MONO_STACK,
    fontSize: '12px',
    lineHeight: 1.6,
    color: '#e1e4e8',
    whiteSpace: 'pre-wrap' as const,
  },
  errorLogLine: {
    margin: '0',
    padding: '1px 0',
  },
  errorLogError: {
    color: '#f97583',
  },
  errorLogDim: {
    color: '#6a737d',
  },
  notifyText: {
    fontSize: '12px',
    color: '#586069',
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  // Skip button
  skipButton: {
    position: 'fixed' as const,
    bottom: '16px',
    right: '16px',
    background: 'rgba(0,0,0,0.5)',
    color: '#ccc',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '4px',
    padding: '6px 14px',
    fontSize: '12px',
    fontFamily: FONT_STACK,
    cursor: 'pointer',
    zIndex: 10002,
    transition: 'opacity 0.2s',
  },
};

// ── Script Data ──────────────────────────────────────────────────────────────

const JOSH_LINES: TerminalLine[] = [
  { type: 'prompt-cmd', text: 'npm run build' },
  { type: 'blank', text: '' },
  { type: 'error', text: 'ERROR in src/components/Portfolio.jsx' },
  { type: 'error', text: "  Module not found: Can't resolve './config/portfolio-data'" },
  { type: 'blank', text: '' },
  { type: 'output', text: 'Build failed with 1 error.' },
  { type: 'blank', text: '' },
  { type: 'comment', text: 'wait what? it was working yesterday...' },
  { type: 'prompt-cmd', text: 'ls src/config/' },
  { type: 'error', text: 'ls: src/config/: No such file or directory' },
  { type: 'blank', text: '' },
  { type: 'comment', text: 'the whole folder is gone??' },
  { type: 'comment', text: 'ok let me just start the dev server and see what happens...' },
  { type: 'prompt-cmd', text: 'npm start' },
  { type: 'output', text: 'Starting development server...' },
  { type: 'output', text: 'Compiled with errors.' },
];

const JOSH_LINES_2: TerminalLine[] = [
  { type: 'comment', text: 'oh.' },
  { type: 'comment', text: 'oh no.' },
  { type: 'comment', text: "that's worse" },
  { type: 'blank', text: '' },
  { type: 'comment', text: 'ok you know what. copilot.' },
];

const COPILOT_MESSAGES: AgentMessage[] = [
  {
    role: 'user',
    text: 'fix it',
  },
  {
    role: 'assistant',
    text: 'I can fix this. I can also see 14 other problems. Let me fix all of them.',
  },
  {
    role: 'assistant',
    text: "Rebuilding your portfolio from scratch. Don't worry about it.",
    fileEdit: {
      fileName: 'src/components/Portfolio.jsx',
      lines: [
        '- import { data } from \'./config/portfolio-data\';',
        '+ import React from \'react\';',
        '+ ',
        '+ const portfolio = {',
        '+   name: "Joshua Hamburger",',
        '+   skills: ["React", "TypeScript", "Node.js"],',
        '+   theme: "saas-pricing-page",',
        '+   chatbot: true,',
        '+ };',
      ],
    },
  },
  {
    role: 'assistant',
    text: "Also adding a comparison table, an 'Add to Cart' button, and... a chatbot? Sure, why not.",
  },
  {
    role: 'assistant',
    text: '\u2705 Done! I also refactored your project structure, rewrote your README, and updated all your dependencies. You\'re welcome.',
  },
];

// ── Phase enum ───────────────────────────────────────────────────────────────

type Phase =
  | 'progress'
  | 'slow'
  | 'error'
  | 'notify'
  | 'josh'
  | 'joshFix'         
  | 'errorBoundary'
  | 'josh2'
  | 'copilot'
  | 'rebuild'
  | 'done';

// ── Component ────────────────────────────────────────────────────────────────

const LoadingSequence: React.FC<LoadingSequenceProps> = ({
  isFirstVisit,
  onComplete,
  onSkip,
}) => {
  const [phase, setPhase] = useState<Phase>('progress');
  const [progress, setProgress] = useState(0);
  const [showError, setShowError] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [showErrorBoundary, setShowErrorBoundary] = useState(false);
  const [showCopilotPanel, setShowCopilotPanel] = useState(false);
  
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const completedRef = useRef(false);

  // Shared Hooks
  const {
    terminalLines,
    typingBuffer,
    typingLineType,
    isTyping,
    typeLines,
    clearLines: clearTerminal,
  } = useTerminalTyper();

  const {
    copilotMessages,
    inputTypingBuffer,
    showTypingIndicator,
    currentStreamingMsg,
    streamingText,
    showStreamingFileEdit,
    playMessages,
    reset: resetAgent,
  } = useAgentSequencer();

  // ── Sequence Logic ─────────────────────────────────────────────────────────

  // 1. Initial mounting & progress bar
  useEffect(() => {
    // 0s: start
    const t1 = setTimeout(() => {
      setProgress(30);
    }, 100);

    const t2 = setTimeout(() => {
      setProgress(65);
    }, 1500);

    // 3s: slow phase
    const t3 = setTimeout(() => {
        setPhase('slow');
      setProgress(85);
    }, 3000);

    // 6s: error phase
    const t4 = setTimeout(() => {
      setPhase('error');
      setShowError(true);
      setProgress(90);
    }, 6000);

    // 8s: notify ("checking browser...")
    const t5 = setTimeout(() => {
      setPhase('notify');
      setShowNotify(true);
    }, 8000);

    // 9s: terminal appears (start Josh lines)
    const t6 = setTimeout(() => {
      setPhase('josh');
    }, 9000);

    timersRef.current.push(t1, t2, t3, t4, t5, t6);

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  // 2. Josh typing phase 1
  useEffect(() => {
    if (phase !== 'josh') return;

    // Type the first batch
    typeLines(JOSH_LINES, 0, () => {
        setPhase('errorBoundary');
    });

  }, [phase, typeLines]);

  // 3. Error Boundary phase
  useEffect(() => {
      if (phase !== 'errorBoundary') return;

      const t1 = setTimeout(() => {
          setShowErrorBoundary(true);
      }, 500);
      
      const t2 = setTimeout(() => {
          setPhase('josh2');
      }, 3500); // 3s of staring at error

      timersRef.current.push(t1, t2);
  }, [phase]);

  // 4. Josh typing phase 2
  useEffect(() => {
      if (phase !== 'josh2') return;

      typeLines(JOSH_LINES_2, 0, () => {
          setPhase('copilot');
      });
  }, [phase, typeLines]);

  // 5. Copilot phase
  useEffect(() => {
      if (phase !== 'copilot') return;
      
      setShowCopilotPanel(true);
      const t = setTimeout(() => {
          playMessages(COPILOT_MESSAGES, 0, () => {
              const t2 = setTimeout(() => {
                  setPhase('rebuild');
              }, 1800);
              timersRef.current.push(t2);
          });
      }, 450);
      timersRef.current.push(t);
  }, [phase, playMessages]);
  
  // Clean up hooks on unmount
  useEffect(() => {
    return () => {
        clearTerminal();
        resetAgent();
    };
  }, [clearTerminal, resetAgent]);


  // ── Render Helpers ─────────────────────────────────────────────────────────

  if (phase === 'rebuild') {
      return <RebuildDeploy onComplete={onComplete} />;
  }

  const showTerminal = phase === 'josh' || phase === 'errorBoundary' || phase === 'josh2' || phase === 'copilot';

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={styles.header}>
        <OctocatSVG size={24} />
        <span style={styles.headerText}>
          GitHub Pages / hamburgj.github.io
        </span>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <div style={styles.card}>
          <p style={styles.siteUrl}>hamburgj.github.io</p>
          <h1 style={{ ...styles.heading, ...(showError ? { color: '#dc2626' } : {}) }}>
            {showError ? 'Deploy failed' : 'Deploying to GitHub Pages'}
          </h1>

          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressBar,
                width: `${progress}%`,
                ...(showError ? { background: '#dc2626' } : {}),
              }}
            />
          </div>

          <p style={styles.subtext}>
            Building from branch <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>main</span> &middot; commit <span style={{ fontFamily: 'monospace' }}>8f2a3c1</span>
          </p>
          <p style={styles.autoText}>
            Deployment is running. The site will be available shortly.
          </p>
          <p style={styles.rayId}>
            github.com/HamburgJ &middot; GitHub Actions
          </p>

          {/* Error overlay — GitHub Actions style */}
          {showError && (
            <div style={styles.errorOverlay}>
              <div style={styles.errorStatusRow}>
                <div style={styles.errorStatusIcon}>✕</div>
                <span style={styles.errorStatusText}>build and deploy</span>
                <span style={styles.errorStatusTime}>failed in 47s</span>
              </div>
              <div style={styles.errorLogBox}>
                <div style={styles.errorLogHeader}>
                  <span>▸</span>
                  <span>Build with Node.js</span>
                </div>
                <div style={styles.errorLogBody}>
                  <p style={{ ...styles.errorLogLine, ...styles.errorLogDim }}>Run npm run build</p>
                  <p style={styles.errorLogLine}>&gt; portfolio@1.0.0 build</p>
                  <p style={styles.errorLogLine}>&gt; react-scripts build</p>
                  <p style={styles.errorLogLine}>&nbsp;</p>
                  <p style={{ ...styles.errorLogLine, ...styles.errorLogError }}>ERROR in src/components/Portfolio.jsx</p>
                  <p style={{ ...styles.errorLogLine, ...styles.errorLogError }}>  Module not found: Can't resolve './config/portfolio-data'</p>
                  <p style={styles.errorLogLine}>&nbsp;</p>
                  <p style={{ ...styles.errorLogLine, ...styles.errorLogError }}>Process completed with exit code 1.</p>
                </div>
              </div>
              {showNotify && (
                <p style={styles.notifyText}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f9826c', display: 'inline-block' }} />
                  Notifying site owner…
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <OctocatSVG size={16} color="#586069" />
        <span>
          This site is deployed via GitHub Pages &middot; &copy; 2026 GitHub,
          Inc.
        </span>
      </div>

      {/* Fake React Error Boundary overlay */}
      <ErrorBoundaryOverlay visible={showErrorBoundary} />

      {/* Terminal Overlay */}
      <TerminalPanel
        className={!showTerminal ? 'vcSlideDown' : 'vcSlideUp'}
        style={{
            position: 'fixed',
            bottom: showTerminal ? 0 : -400,
            left: 0,
            right: showCopilotPanel ? '360px' : 0,
            height: '40vh',
            zIndex: 10010,
            transition: 'right 0.35s cubic-bezier(0.22, 1, 0.36, 1), bottom 0.5s ease',
        }}
      >
        <div style={{
          flex: 1,
          padding: '8px 16px 24px',
          overflowY: 'auto' as const,
          fontFamily: MONO_STACK,
          fontSize: '13px',
          lineHeight: 1.5,
          color: '#cccccc',
        }}>
          {terminalLines.map((line, i) => {
            const lineStyle: React.CSSProperties = { margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5, minHeight: '20px' };
            if (line.type === 'blank') return <p key={i} style={lineStyle}>&nbsp;</p>;
            if (line.type === 'prompt-cmd') {
              return (
                <p key={i} style={lineStyle}>
                  <span style={{ color: '#4ec9b0' }}>PS C:\Users\josh\portfolio{'>'} </span>
                  <span style={{ color: '#cccccc' }}>{line.text}</span>
                </p>
              );
            }
            if (line.type === 'error') {
              return <p key={i} style={lineStyle}><span style={{ color: '#f44747' }}>{line.text}</span></p>;
            }
            if (line.type === 'output') {
              return <p key={i} style={lineStyle}><span style={{ color: '#cccccc' }}>{line.text}</span></p>;
            }
            return <p key={i} style={lineStyle}><span style={{ color: '#a0a0a0' }}>{line.text}</span></p>;
          })}

          {/* Currently typing line */}
          {isTyping && typingBuffer && (
            <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5, minHeight: '20px' }}>
              {typingLineType === 'prompt-cmd' && (
                <span style={{ color: '#4ec9b0' }}>PS C:\Users\josh\portfolio{'>'} </span>
              )}
              <span style={{
                color: typingLineType === 'prompt-cmd' ? '#cccccc'
                  : typingLineType === 'error' ? '#f44747'
                  : typingLineType === 'output' ? '#cccccc'
                  : '#a0a0a0'
              }}>
                {typingBuffer}
              </span>
              <span style={{
                display: 'inline-block', width: '7px', height: '14px',
                background: '#cccccc', marginLeft: '2px', verticalAlign: 'text-bottom',
                animation: 'vcBlink 1s step-end infinite',
              }} />
            </p>
          )}
        </div>
      </TerminalPanel>

      {/* Copilot Chat Panel */}
      <CopilotAgentPanel
        visible={showCopilotPanel}
        messages={copilotMessages}
        streamingMessage={currentStreamingMsg}
        streamingText={streamingText}
        showStreamingFileEdit={showStreamingFileEdit}
        isThinking={showTypingIndicator}
        inputBuffer={inputTypingBuffer}
      />

      {/* Skip button for return visitors */}
      {!isFirstVisit && phase !== 'done' && (
        <button
          type="button"
          style={styles.skipButton}
          onClick={onSkip}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = '0.7';
          }}
        >
          Skip Intro
        </button>
      )}

      {/* Shared keyframes (slide, blink, fade, etc.) */}
      <style>{SHARED_KEYFRAMES}</style>
    </div>
  );
};

export default LoadingSequence;
