import React, { useState, useEffect, useRef, useCallback } from 'react';

interface LoadingSequenceProps {
  isFirstVisit: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

// ── Inline SVGs ──────────────────────────────────────────────────────────────

const OctocatSVG: React.FC<{ size?: number; color?: string }> = ({
  size = 32,
  color = '#fff',
}) => (
  <svg
    height={size}
    viewBox="0 0 16 16"
    width={size}
    fill={color}
    aria-hidden="true"
  >
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

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

const CopilotSparkle: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z"
      fill="#888"
    />
  </svg>
);

const TerminalIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="#cccccc" aria-hidden="true">
    <path d="M6 9l3-3-3-3-.7.7L7.6 6 5.3 8.3zm4 1H7v1h3z" />
    <path d="M1 2.5A1.5 1.5 0 012.5 1h11A1.5 1.5 0 0115 2.5v11a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 011 13.5zm1.5-.5a.5.5 0 00-.5.5v11a.5.5 0 00.5.5h11a.5.5 0 00.5-.5v-11a.5.5 0 00-.5-.5z" />
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
    background: 'rgba(255,255,255,0.95)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    padding: '30px',
  },
  errorText: {
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#dc2626',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '4px',
    padding: '12px 16px',
    textAlign: 'left' as const,
    wordBreak: 'break-all' as const,
    width: '100%',
    maxWidth: '400px',
  },
  notifyText: {
    fontSize: '12px',
    color: '#777',
    marginTop: '14px',
  },

  // ── VS Code Terminal ─────────────────────────────────────────────────────

  terminalWrapper: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: '40vh',
    zIndex: 10000,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  terminalSeparator: {
    height: '2px',
    background: '#007acc',
    flexShrink: 0,
  },
  terminalTitleBar: {
    background: '#252526',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0',
    flexShrink: 0,
    borderBottom: '1px solid #1e1e1e',
    height: '35px',
  },
  terminalTabs: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
  terminalTab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '0 12px',
    height: '100%',
    background: '#1e1e1e',
    color: '#cccccc',
    fontSize: '12px',
    fontFamily: FONT_STACK,
    borderTop: '1px solid #007acc',
    borderRight: '1px solid #252526',
    cursor: 'default',
  },
  terminalWindowControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    paddingRight: '4px',
  },
  terminalWindowBtn: {
    background: 'none',
    border: 'none',
    color: '#999',
    fontSize: '16px',
    padding: '0 8px',
    cursor: 'default',
    height: '35px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: FONT_STACK,
  },
  terminalBody: {
    flex: 1,
    background: '#1e1e1e',
    color: '#cccccc',
    fontFamily: MONO_STACK,
    fontSize: '13px',
    padding: '8px 16px',
    overflowY: 'auto' as const,
    lineHeight: 1.5,
  },
  terminalLine: {
    margin: '0',
    whiteSpace: 'pre-wrap' as const,
    lineHeight: 1.5,
    minHeight: '20px',
  },
  prompt: {
    color: '#4ec9b0',
  },
  errorColor: {
    color: '#f44747',
  },
  dimColor: {
    color: '#808080',
  },
  textColor: {
    color: '#cccccc',
  },

  // ── Copilot Chat Panel ───────────────────────────────────────────────────

  copilotPanel: {
    position: 'fixed' as const,
    top: 0,
    right: 0,
    width: '360px',
    height: '100vh',
    background: '#1e1e1e',
    borderLeft: '1px solid #333',
    zIndex: 10001,
    display: 'flex',
    flexDirection: 'column' as const,
    transform: 'translateX(100%)',
    transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
    fontFamily: FONT_STACK,
  },
  copilotPanelVisible: {
    transform: 'translateX(0)',
  },
  copilotHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    borderBottom: '1px solid #333',
    flexShrink: 0,
    background: '#252526',
  },
  copilotHeaderTitle: {
    color: '#cccccc',
    fontSize: '13px',
    fontWeight: 600,
    flex: 1,
  },
  copilotCloseBtn: {
    background: 'none',
    border: 'none',
    color: '#999',
    fontSize: '16px',
    cursor: 'default',
    padding: '2px 6px',
  },
  copilotMessages: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '14px',
  },
  copilotMessageUser: {
    alignSelf: 'flex-end' as const,
    background: '#264f78',
    color: '#e0e0e0',
    borderRadius: '12px 12px 4px 12px',
    padding: '8px 12px',
    fontSize: '13px',
    maxWidth: '85%',
    lineHeight: 1.45,
  },
  copilotMessageAssistant: {
    alignSelf: 'flex-start' as const,
    background: '#2d2d2d',
    color: '#d4d4d4',
    borderRadius: '12px 12px 12px 4px',
    padding: '10px 12px',
    fontSize: '13px',
    maxWidth: '85%',
    lineHeight: 1.5,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  copilotAssistantHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '2px',
  },
  copilotAssistantName: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#888',
  },
  fileEditContainer: {
    background: '#1a1a1a',
    borderRadius: '6px',
    border: '1px solid #333',
    overflow: 'hidden',
    marginTop: '6px',
  },
  fileEditHeader: {
    background: '#252526',
    padding: '4px 10px',
    fontSize: '11px',
    color: '#999',
    borderBottom: '1px solid #333',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  fileEditBody: {
    padding: '8px 12px',
    fontFamily: MONO_STACK,
    fontSize: '11px',
    lineHeight: 1.6,
  },
  fileEditLineAdd: {
    color: '#4ec9b0',
  },
  fileEditLineRemove: {
    color: '#f44747',
    textDecoration: 'line-through' as const,
    opacity: 0.7,
  },
  fileEditLineNeutral: {
    color: '#808080',
  },
  typingIndicator: {
    display: 'flex',
    gap: '4px',
    padding: '8px 12px',
    alignItems: 'center',
    alignSelf: 'flex-start' as const,
  },
  typingDot: {
    width: '6px',
    height: '6px',
    background: '#666',
    borderRadius: '50%',
  },
  copilotInputBar: {
    borderTop: '1px solid #333',
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#252526',
    flexShrink: 0,
  },
  copilotInput: {
    flex: 1,
    background: '#3c3c3c',
    border: '1px solid #555',
    borderRadius: '6px',
    padding: '8px 10px',
    color: '#888',
    fontSize: '13px',
    fontFamily: FONT_STACK,
    cursor: 'default',
  },

  // ── Skip button ──────────────────────────────────────────────────────────

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

interface TermLine {
  type: 'prompt-cmd' | 'output' | 'error' | 'blank' | 'comment';
  text: string;
}

const JOSH_LINES: TermLine[] = [
  { type: 'prompt-cmd', text: 'npm run build' },
  { type: 'blank', text: '' },
  { type: 'error', text: 'ERROR in src/components/Portfolio.jsx' },
  { type: 'error', text: '  Module not found: ./config/portfolio-data' },
  { type: 'blank', text: '' },
  { type: 'output', text: 'Build failed with 1 error.' },
  { type: 'blank', text: '' },
  { type: 'comment', text: 'hmm ok let me check...' },
  { type: 'prompt-cmd', text: 'cat src/config/portfolio-data.js' },
  { type: 'error', text: 'cat: src/config/portfolio-data.js: No such file or directory' },
  { type: 'blank', text: '' },
  { type: 'comment', text: 'wait what' },
  { type: 'comment', text: 'ok let me just restart the dev server...' },
  { type: 'prompt-cmd', text: 'npm start' },
];

const JOSH_LINES_2: TermLine[] = [
  { type: 'comment', text: 'oh.' },
  { type: 'comment', text: 'oh no.' },
  { type: 'comment', text: "that's worse" },
  { type: 'blank', text: '' },
  { type: 'comment', text: 'ok fine.' },
  { type: 'prompt-cmd', text: '@copilot can you fix the portfolio renderer?' },
];

interface CopilotMsg {
  role: 'user' | 'assistant';
  text: string;
  fileEdit?: {
    fileName: string;
    lines: string[];
  };
}

const COPILOT_MESSAGES: CopilotMsg[] = [
  {
    role: 'user',
    text: '@copilot can you fix the portfolio renderer?',
  },
  {
    role: 'assistant',
    text: "Looking at the error... your portfolio is importing from a config file that doesn't exist. Let me fix it.",
  },
  {
    role: 'assistant',
    text: "Found the issue. I'll scaffold a complete portfolio with inline data.",
    fileEdit: {
      fileName: 'src/components/Portfolio.jsx',
      lines: [
        '- import { data } from \'./config/portfolio-data\';',
        '+ import React from \'react\';',
        '+ ',
        '+ const portfolio = {',
        '+   name: "Joshua Hamburger",',
        '+   skills: ["React", "TypeScript", "Node.js"],',
        '+   theme: "modern-gradient"',
        '+ };',
      ],
    },
  },
  {
    role: 'assistant',
    text: 'Adding hero section, animated skill bars, and testimonials carousel...',
  },
  {
    role: 'assistant',
    text: '\u2705 Done! Deployed to GitHub Pages.',
  },
];

// ── Phase enum ───────────────────────────────────────────────────────────────

type Phase =
  | 'progress'        // 0-3 s  smooth bar
  | 'slow'            // 3-6 s  choppy bar
  | 'error'           // 6-8 s  error overlay
  | 'notify'          // 8-9 s  + notify text
  | 'josh'            // 9 s    terminal typing (first batch)
  | 'joshFix'         // Josh tries npm start
  | 'errorBoundary'   // Fake React error boundary appears
  | 'josh2'           // Josh lines 2 in terminal
  | 'copilot'         // Copilot Chat panel
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
  const [terminalLines, setTerminalLines] = useState<TermLine[]>([]);
  const [typingBuffer, setTypingBuffer] = useState('');
  const [typingLineType, setTypingLineType] = useState<TermLine['type']>('comment');
  const [isTyping, setIsTyping] = useState(false);
  const [showErrorBoundary, setShowErrorBoundary] = useState(false);
  const [showCopilotPanel, setShowCopilotPanel] = useState(false);
  const [copilotMessages, setCopilotMessages] = useState<CopilotMsg[]>([]);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [inputTypingBuffer, setInputTypingBuffer] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [currentStreamingMsg, setCurrentStreamingMsg] = useState<CopilotMsg | null>(null);
  const [showStreamingFileEdit, setShowStreamingFileEdit] = useState(false);

  const terminalRef = useRef<HTMLDivElement>(null);
  const copilotMsgRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines, typingBuffer]);

  // Auto-scroll copilot messages
  useEffect(() => {
    if (copilotMsgRef.current) {
      copilotMsgRef.current.scrollTop = copilotMsgRef.current.scrollHeight;
    }
  }, [copilotMessages, showTypingIndicator, streamingText, inputTypingBuffer]);

  // ── Terminal typing helper ───────────────────────────────────────────────

  const typeTerminalLine = useCallback(
    (line: TermLine, onDone: () => void, instant = false) => {
      if (line.type === 'blank') {
        setTerminalLines((prev) => [...prev, line]);
        onDone();
        return;
      }

      if (instant || line.type === 'output' || line.type === 'error') {
        setTerminalLines((prev) => [...prev, line]);
        onDone();
        return;
      }

      // Typed character-by-character for commands and comments
      setIsTyping(true);
      setTypingBuffer('');
      setTypingLineType(line.type);
      let i = 0;

      const tick = () => {
        if (i < line.text.length) {
          setTypingBuffer(line.text.slice(0, i + 1));
          i++;
          const delay = line.type === 'prompt-cmd'
            ? 20 + Math.random() * 40
            : 30 + Math.random() * 60;
          setTimeout(tick, delay);
        } else {
          setIsTyping(false);
          setTerminalLines((prev) => [...prev, line]);
          setTypingBuffer('');
          onDone();
        }
      };

      tick();
    },
    [],
  );

  // ── Josh lines sequencer ─────────────────────────────────────────────────

  const typeJoshLines = useCallback(
    (lines: TermLine[], index: number, onAllDone: () => void) => {
      if (index >= lines.length) {
        onAllDone();
        return;
      }

      const line = lines[index];
      const isInstant =
        line.type === 'output' || line.type === 'error' || line.type === 'blank';
      const pauseBefore = index === 0
        ? 400
        : isInstant
          ? 80
          : 300 + Math.random() * 500;

      setTimeout(() => {
        typeTerminalLine(line, () => {
          typeJoshLines(lines, index + 1, onAllDone);
        }, isInstant);
      }, pauseBefore);
    },
    [typeTerminalLine],
  );

  // ── Copilot message sequencer (typing + streaming) ──────────────────────

  const playCopilotMessages = useCallback(
    (index: number) => {
      if (index >= COPILOT_MESSAGES.length) {
        // All messages done — wait then fire onComplete
        setTimeout(() => {
          if (!completedRef.current) {
            completedRef.current = true;
            setPhase('done');
            onComplete();
          }
        }, 1800);
        return;
      }

      const msg = COPILOT_MESSAGES[index];

      if (msg.role === 'user') {
        // Type message in input area character by character
        let i = 0;
        const typeChar = () => {
          if (i < msg.text.length) {
            setInputTypingBuffer(msg.text.slice(0, i + 1));
            i++;
            setTimeout(typeChar, 22 + Math.random() * 38);
          } else {
            // Pause then "send"
            setTimeout(() => {
              setCopilotMessages((prev) => [...prev, msg]);
              setInputTypingBuffer('');
              setTimeout(() => playCopilotMessages(index + 1), 500);
            }, 350);
          }
        };
        setTimeout(typeChar, 300);
      } else {
        // Show thinking dots
        setShowTypingIndicator(true);
        const dotDelay = 700 + Math.random() * 500;
        setTimeout(() => {
          setShowTypingIndicator(false);

          // Stream text word by word
          setCurrentStreamingMsg(msg);
          setShowStreamingFileEdit(false);
          setStreamingText('');
          let charIdx = 0;
          const fullText = msg.text;

          const streamWord = () => {
            if (charIdx < fullText.length) {
              let end = fullText.indexOf(' ', charIdx + 1);
              if (end === -1) end = fullText.length;
              else end += 1;
              setStreamingText(fullText.slice(0, end));
              charIdx = end;
              setTimeout(streamWord, 30 + Math.random() * 40);
            } else {
              // Text done streaming
              if (msg.fileEdit) {
                setTimeout(() => {
                  setShowStreamingFileEdit(true);
                  setTimeout(() => {
                    setCopilotMessages((prev) => [...prev, msg]);
                    setStreamingText('');
                    setCurrentStreamingMsg(null);
                    setShowStreamingFileEdit(false);
                    setTimeout(() => playCopilotMessages(index + 1), 600);
                  }, 1200);
                }, 400);
              } else {
                setTimeout(() => {
                  setCopilotMessages((prev) => [...prev, msg]);
                  setStreamingText('');
                  setCurrentStreamingMsg(null);
                  setTimeout(() => playCopilotMessages(index + 1), 600);
                }, 400);
              }
            }
          };
          streamWord();
        }, dotDelay);
      }
    },
    [onComplete],
  );

  // ── Master timeline ──────────────────────────────────────────────────────

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('slow'), 3000);
    const t2 = setTimeout(() => {
      setPhase('error');
      setShowError(true);
    }, 6000);
    const t3 = setTimeout(() => {
      setPhase('notify');
      setShowNotify(true);
    }, 8000);
    const t4 = setTimeout(() => setPhase('josh'), 9000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  // ── Progress bar animation ───────────────────────────────────────────────

  useEffect(() => {
    if (phase === 'progress') {
      const start = performance.now();
      let raf: number;
      const animate = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(elapsed / 3000, 1);
        setProgress(t * 65);
        if (t < 1) raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(raf);
    }

    if (phase === 'slow') {
      const targets = [67, 72, 78, 83, 89, 91, 92, 92, 92];
      let i = 0;
      const step = () => {
        if (i < targets.length) {
          setProgress(targets[i]);
          i++;
          const delay = 200 + Math.random() * 500;
          setTimeout(step, delay);
        }
      };
      step();
    }
  }, [phase]);

  // ── Josh typing trigger ──────────────────────────────────────────────────

  useEffect(() => {
    if (phase === 'josh') {
      typeJoshLines(JOSH_LINES, 0, () => setPhase('joshFix'));
    }
  }, [phase, typeJoshLines]);

  // ── joshFix → errorBoundary ──────────────────────────────────────────────

  useEffect(() => {
    if (phase === 'joshFix') {
      const t = setTimeout(() => {
        setShowErrorBoundary(true);
        setPhase('errorBoundary');
      }, 800);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // ── errorBoundary → josh lines 2 ────────────────────────────────────────

  useEffect(() => {
    if (phase === 'errorBoundary') {
      const t = setTimeout(() => {
        setPhase('josh2');
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // ── Josh lines 2 ────────────────────────────────────────────────────────

  useEffect(() => {
    if (phase === 'josh2') {
      typeJoshLines(JOSH_LINES_2, 0, () => setPhase('copilot'));
    }
  }, [phase, typeJoshLines]);

  // ── Copilot panel trigger ────────────────────────────────────────────────

  useEffect(() => {
    if (phase === 'copilot') {
      setShowCopilotPanel(true);
      // Start messages after slide-in animation
      const t = setTimeout(() => {
        playCopilotMessages(0);
      }, 450);
      return () => clearTimeout(t);
    }
  }, [phase, playCopilotMessages]);

  // ── Render helpers ───────────────────────────────────────────────────────

  const showTerminal =
    phase === 'josh' || phase === 'joshFix' || phase === 'errorBoundary' ||
    phase === 'josh2' || phase === 'copilot' || phase === 'done';

  const renderPrompt = () => (
    <span style={styles.prompt}>PS C:\Users\josh\portfolio{'>'} </span>
  );

  const renderTerminalLine = (line: TermLine, i: number) => {
    if (line.type === 'blank') {
      return <p key={i} style={styles.terminalLine}>&nbsp;</p>;
    }
    if (line.type === 'prompt-cmd') {
      return (
        <p key={i} style={styles.terminalLine}>
          {renderPrompt()}
          <span style={styles.textColor}>{line.text}</span>
        </p>
      );
    }
    if (line.type === 'error') {
      return (
        <p key={i} style={styles.terminalLine}>
          <span style={styles.errorColor}>{line.text}</span>
        </p>
      );
    }
    if (line.type === 'output') {
      return (
        <p key={i} style={styles.terminalLine}>
          <span style={styles.textColor}>{line.text}</span>
        </p>
      );
    }
    // comment (Josh's aside)
    return (
      <p key={i} style={styles.terminalLine}>
        <span style={styles.dimColor}>{line.text}</span>
      </p>
    );
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={styles.root}>
      {/* GitHub-style header */}
      <div style={styles.header}>
        <OctocatSVG size={24} />
        <span style={styles.headerText}>
          GitHub Pages / hamburgj.github.io
        </span>
      </div>

      {/* Main card area */}
      <div style={styles.main}>
        <div style={styles.card}>
          <div style={styles.shieldWrap}>
            <LoadingGearSVG />
          </div>
          <p style={styles.siteUrl}>hamburgj.github.io</p>
          <h1 style={styles.heading}>
            Preparing site assets
          </h1>

          <div style={styles.progressTrack}>
            <div
              style={{ ...styles.progressBar, width: `${progress}%` }}
            />
          </div>

          <p style={styles.subtext}>
            hamburgj.github.io is loading resources and preparing
            the experience.
          </p>
          <p style={styles.autoText}>
            This process is automatic. The site will be ready shortly.
          </p>
          <p style={styles.rayId}>
            Powered by GitHub Pages &middot; Build ID:
            8f2a3c1d9e6b4a07
          </p>

          {/* Error overlay */}
          {showError && (
            <div style={styles.errorOverlay}>
              <div style={styles.errorText}>
                ERR_PORTFOLIO_RENDER_FAILED: Cannot read property
                'personality' of undefined
              </div>
              {showNotify && (
                <p style={styles.notifyText}>Notifying site owner...</p>
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

      {/* ── Fake React Error Boundary overlay ───────────────────────────── */}
      {showErrorBoundary && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
        >
          <button
            type="button"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '28px',
              cursor: 'default',
              padding: '4px 8px',
              opacity: 0.7,
              lineHeight: 1,
            }}
          >
            &times;
          </button>

          <div
            style={{
              background: '#fff',
              borderRadius: '4px',
              maxWidth: '860px',
              width: '90%',
              maxHeight: '75vh',
              overflow: 'auto',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div
              style={{
                background: '#e83b46',
                color: '#fff',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: 700,
                borderRadius: '4px 4px 0 0',
                letterSpacing: '0.01em',
              }}
            >
              Unhandled Runtime Error
            </div>

            <div style={{ padding: '24px 20px' }}>
              <p
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#1a1a1a',
                  margin: '0 0 6px',
                  lineHeight: 1.4,
                }}
              >
                TypeError: Cannot read properties of undefined (reading
                &apos;map&apos;)
              </p>

              <p
                style={{
                  fontSize: '13px',
                  color: '#666',
                  margin: '0 0 20px',
                }}
              >
                This error occurred during rendering and was not recovered.
              </p>

              <details open style={{ marginBottom: '16px' }}>
                <summary
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#333',
                    cursor: 'default',
                    marginBottom: '8px',
                  }}
                >
                  Call Stack
                </summary>
                <div
                  style={{
                    fontFamily:
                      '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
                    fontSize: '12px',
                    lineHeight: 2,
                    color: '#333',
                    background: '#f6f8fa',
                    border: '1px solid #e1e4e8',
                    borderRadius: '4px',
                    padding: '16px',
                    overflowX: 'auto',
                  }}
                >
                  <div style={{ color: '#e83b46', fontWeight: 600 }}>
                    TypeError: Cannot read properties of undefined (reading
                    &apos;map&apos;)
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <div>
                      at Portfolio (
                      <span style={{ color: '#0969da', textDecoration: 'underline' }}>
                        ./src/components/Portfolio.jsx:42:15
                      </span>
                      )
                    </div>
                    <div>
                      at PortfolioGrid (
                      <span style={{ color: '#0969da', textDecoration: 'underline' }}>
                        ./src/components/PortfolioGrid.tsx:18:9
                      </span>
                      )
                    </div>
                    <div>at div</div>
                    <div>
                      at MainContent (
                      <span style={{ color: '#0969da', textDecoration: 'underline' }}>
                        ./src/components/MainContent.tsx:27:5
                      </span>
                      )
                    </div>
                    <div>
                      at ErrorBoundary (
                      <span style={{ color: '#0969da', textDecoration: 'underline' }}>
                        ./src/components/ErrorBoundary.tsx:8:3
                      </span>
                      )
                    </div>
                    <div>
                      at App (
                      <span style={{ color: '#0969da', textDecoration: 'underline' }}>
                        ./src/App.tsx:18:5
                      </span>
                      )
                    </div>
                    <div>
                      at ThemeProvider (
                      <span style={{ color: '#0969da', textDecoration: 'underline' }}>
                        ./node_modules/styled-components/dist/styled-components.js:31:12
                      </span>
                      )
                    </div>
                    <div>
                      at Router (
                      <span style={{ color: '#0969da', textDecoration: 'underline' }}>
                        ./node_modules/react-router-dom/index.js:5:3
                      </span>
                      )
                    </div>
                  </div>
                </div>
              </details>

              <p
                style={{
                  fontSize: '12px',
                  color: '#999',
                  margin: 0,
                  borderTop: '1px solid #e1e4e8',
                  paddingTop: '12px',
                }}
              >
                This screen is visible only in development. It will not appear
                if the app crashes in production.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── VS Code Terminal Panel ──────────────────────────────────────── */}
      {showTerminal && (
        <div style={styles.terminalWrapper}>
          {/* Blue accent separator */}
          <div style={styles.terminalSeparator} />

          {/* Title bar with tab + window controls */}
          <div style={styles.terminalTitleBar}>
            <div style={styles.terminalTabs}>
              <div style={styles.terminalTab}>
                <TerminalIcon />
                <span>TERMINAL</span>
              </div>
            </div>
            <div style={styles.terminalWindowControls}>
              <span style={styles.terminalWindowBtn}>&#x2013;</span>
              <span style={styles.terminalWindowBtn}>&#x25A1;</span>
              <span style={styles.terminalWindowBtn}>&times;</span>
            </div>
          </div>

          {/* Terminal body */}
          <div style={styles.terminalBody} ref={terminalRef}>
            {terminalLines.map((line, i) => renderTerminalLine(line, i))}

            {/* Currently typing line */}
            {isTyping && typingBuffer && (
              <p style={styles.terminalLine}>
                {typingLineType === 'prompt-cmd' && renderPrompt()}
                <span
                  style={
                    typingLineType === 'prompt-cmd'
                      ? styles.textColor
                      : typingLineType === 'error'
                        ? styles.errorColor
                        : styles.dimColor
                  }
                >
                  {typingBuffer}
                </span>
                <span
                  style={{
                    display: 'inline-block',
                    width: '7px',
                    height: '14px',
                    background: '#cccccc',
                    marginLeft: '2px',
                    verticalAlign: 'text-bottom',
                    animation: 'blink 1s step-end infinite',
                  }}
                />
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Copilot Chat Panel (slides in from right) ───────────────────── */}
      <div
        style={{
          ...styles.copilotPanel,
          ...(showCopilotPanel ? styles.copilotPanelVisible : {}),
        }}
      >
        {/* Header */}
        <div style={styles.copilotHeader}>
          <CopilotSparkle size={16} />
          <span style={styles.copilotHeaderTitle}>Copilot Chat</span>
          <button type="button" style={styles.copilotCloseBtn}>&times;</button>
        </div>

        {/* Messages */}
        <div style={styles.copilotMessages} ref={copilotMsgRef}>
          {copilotMessages.map((msg, i) => {
            if (msg.role === 'user') {
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'flex-end', animation: 'msgIn 0.25s ease-out' }}>
                  <div style={styles.copilotMessageUser}>
                    {msg.text}
                  </div>
                </div>
              );
            }
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-start', animation: 'msgIn 0.25s ease-out' }}>
                <div style={styles.copilotAssistantHeader}>
                  <span style={styles.copilotAssistantName}>Copilot</span>
                </div>
                <div style={styles.copilotMessageAssistant}>
                  <span>{msg.text}</span>
                  {msg.fileEdit && (
                    <div style={styles.fileEditContainer}>
                      <div style={styles.fileEditHeader}>
                        <span>{msg.fileEdit.fileName}</span>
                        <span style={{
                          marginLeft: 'auto',
                          fontSize: '9px',
                          color: '#4ec9b0',
                          background: 'rgba(78, 201, 176, 0.1)',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          fontFamily: MONO_STACK,
                          textTransform: 'uppercase' as const,
                          fontWeight: 600,
                        }}>Modified</span>
                      </div>
                      <div style={styles.fileEditBody}>
                        {msg.fileEdit.lines.map((line, j) => (
                          <div key={j} style={
                            line.startsWith('+') ? styles.fileEditLineAdd
                            : line.startsWith('-') ? styles.fileEditLineRemove
                            : styles.fileEditLineNeutral
                          }>
                            {line}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Currently streaming assistant message */}
          {currentStreamingMsg && (
            <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-start', animation: 'msgIn 0.25s ease-out' }}>
              <div style={styles.copilotAssistantHeader}>
                <span style={styles.copilotAssistantName}>Copilot</span>
              </div>
              <div style={styles.copilotMessageAssistant}>
                <span>
                  {streamingText}
                  <span style={{
                    display: 'inline-block',
                    width: '2px',
                    height: '14px',
                    background: '#d4d4d4',
                    marginLeft: '2px',
                    verticalAlign: 'text-bottom',
                    animation: 'blink 1s step-end infinite',
                  }} />
                </span>
                {showStreamingFileEdit && currentStreamingMsg.fileEdit && (
                  <div style={{ ...styles.fileEditContainer, animation: 'msgIn 0.3s ease-out' }}>
                    <div style={styles.fileEditHeader}>
                      <span>{currentStreamingMsg.fileEdit.fileName}</span>
                      <span style={{
                        marginLeft: 'auto',
                        fontSize: '9px',
                        color: '#4ec9b0',
                        background: 'rgba(78, 201, 176, 0.1)',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontFamily: MONO_STACK,
                        textTransform: 'uppercase' as const,
                        fontWeight: 600,
                      }}>Modified</span>
                    </div>
                    <div style={styles.fileEditBody}>
                      {currentStreamingMsg.fileEdit.lines.map((line, j) => (
                        <div key={j} style={
                          line.startsWith('+') ? styles.fileEditLineAdd
                          : line.startsWith('-') ? styles.fileEditLineRemove
                          : styles.fileEditLineNeutral
                        }>
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Typing indicator (three pulsing dots) */}
          {showTypingIndicator && (
            <div style={styles.typingIndicator}>
              <span style={{ ...styles.typingDot, animation: 'dotPulse 1.4s ease-in-out 0s infinite' }} />
              <span style={{ ...styles.typingDot, animation: 'dotPulse 1.4s ease-in-out 0.2s infinite' }} />
              <span style={{ ...styles.typingDot, animation: 'dotPulse 1.4s ease-in-out 0.4s infinite' }} />
            </div>
          )}
        </div>

        {/* Input bar with typing animation */}
        <div style={styles.copilotInputBar}>
          <div style={{
            ...styles.copilotInput,
            color: inputTypingBuffer ? '#e0e0e0' : '#666',
          }}>
            {inputTypingBuffer || 'Ask Copilot...'}
            {inputTypingBuffer && (
              <span style={{
                display: 'inline-block',
                width: '2px',
                height: '14px',
                background: '#e0e0e0',
                marginLeft: '1px',
                verticalAlign: 'text-bottom',
                animation: 'blink 1s step-end infinite',
              }} />
            )}
          </div>
        </div>
      </div>

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
          Skip
        </button>
      )}

      {/* Keyframe animations */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSequence;
