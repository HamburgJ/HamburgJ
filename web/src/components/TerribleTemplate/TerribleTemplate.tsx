import React, { useEffect, useRef, useState, useCallback } from 'react';
import RebuildDeploy from '../LoadingSequence/RebuildDeploy';

interface TerribleTemplateProps {
  onComplete: () => void;
}

type Phase =
  | 'showing'
  | 'josh-typing'
  | 'copilot-reprompt'
  | 'crumbling'
  | 'fade-out'
  | 'rebuild'
  | 'done';

interface TTCopilotMsg {
  role: 'user' | 'assistant';
  text: string;
  fileEdit?: {
    fileName: string;
    lines: string[];
  };
}

const JOSH_LINES = [
  'no no no no no',
  'what did you do',
  "that's absolutely terrible",
  'ok let me try this again',
];

const COPILOT_MSGS_TT: TTCopilotMsg[] = [
  {
    role: 'user',
    text: 'ok try again. make it like... professional or whatever',
  },
  {
    role: 'assistant',
    text: "Professional. Got it. I'm thinking clean comparison table, urgency badges, clear call-to-action. Full product page energy.",
  },
  {
    role: 'assistant',
    text: 'Comparison charts, urgency badges, the works. Trust me on this one.',
    fileEdit: {
      fileName: 'src/components/AboutPage.tsx',
      lines: [
        '- import { FireDivider, SparkleCanvas }',
        '- fontFamily: "Comic Sans MS"',
        '+ const AboutPage: React.FC = () => (',
        '+   <ProductPage layout="saas">',
        '+     <ComparisonTable columns={["Other Dev", "This Guy"]} />',
        '+     <PricingBadge text="BEST VALUE" />',
        '+     <AddToCartButton price="FREE" />',
        '+   </ProductPage>',
        '+ );',
      ],
    },
  },
  {
    role: 'assistant',
    text: '\u2705 Done. Building now...',
  },
];

const CopilotSparkleTT: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" fill="#888" />
  </svg>
);

const TerminalIconTT: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="#cccccc" aria-hidden="true">
    <path d="M6 9l3-3-3-3-.7.7L7.6 6 5.3 8.3zm4 1H7v1h3z" />
    <path d="M1 2.5A1.5 1.5 0 012.5 1h11A1.5 1.5 0 0115 2.5v11a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 011 13.5zm1.5-.5a.5.5 0 00-.5.5v11a.5.5 0 00.5.5h11a.5.5 0 00.5-.5v-11a.5.5 0 00-.5-.5z" />
  </svg>
);

const FONT_STACK_TT = 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const MONO_STACK_TT = '"Cascadia Code", Consolas, "Courier New", monospace';

const keyframesCSS = `
@keyframes tt-marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
@keyframes tt-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
@keyframes tt-rainbow-text {
  0% { color: #ff0000; }
  16% { color: #ff8800; }
  33% { color: #ffff00; }
  50% { color: #00ff00; }
  66% { color: #0088ff; }
  83% { color: #8800ff; }
  100% { color: #ff0000; }
}
@keyframes tt-glow-pulse {
  0%, 100% { text-shadow: 0 0 10px #ff0, 0 0 20px #ff0, 0 0 40px #f0f, 0 0 80px #f0f; }
  50% { text-shadow: 0 0 20px #0ff, 0 0 40px #0ff, 0 0 60px #ff0, 0 0 100px #ff0; }
}
@keyframes tt-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}
@keyframes tt-rotate-pulse {
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(3deg) scale(1.05); }
  50% { transform: rotate(0deg) scale(1.1); }
  75% { transform: rotate(-3deg) scale(1.05); }
  100% { transform: rotate(0deg) scale(1); }
}
@keyframes tt-fire {
  0% { background-position: 0% 100%; }
  50% { background-position: 100% 80%; }
  100% { background-position: 0% 100%; }
}
@keyframes tt-skill-fill {
  from { width: 0%; }
}
@keyframes tt-cursor-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
@keyframes tt-dot-pulse {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1.1); }
}
@keyframes tt-msg-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes tt-fade-white {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes tt-star-twinkle {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}
@keyframes tt-hazard-scroll {
  0% { background-position: 0 0; }
  100% { background-position: 40px 0; }
}
@keyframes tt-neon-flicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { text-shadow: 0 0 7px #0ff, 0 0 10px #0ff, 0 0 21px #0ff, 0 0 42px #0ff; }
  20%, 24%, 55% { text-shadow: none; }
}
`;

const FireDivider: React.FC = () => (
  <div
    style={{
      width: '100%',
      height: 30,
      background: 'linear-gradient(90deg, #ff4500, #ff8c00, #ffd700, #ff4500, #ff0000, #ff8c00, #ffd700)',
      backgroundSize: '400% 100%',
      animation: 'tt-fire 1.5s ease-in-out infinite',
      borderTop: '2px solid #ff0000',
      borderBottom: '2px solid #ff0000',
      boxShadow: '0 0 15px rgba(255,69,0,0.7), 0 0 30px rgba(255,140,0,0.4)',
    }}
  />
);

const TerribleTemplate: React.FC<TerribleTemplateProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<Phase>('showing');
  const [joshLineIndex, setJoshLineIndex] = useState(0);
  const [joshCharIndex, setJoshCharIndex] = useState(0);
  const [crumbleStarted, setCrumbleStarted] = useState(false);
  const [showCopilotPanel, setShowCopilotPanel] = useState(false);
  const [copilotMessages, setCopilotMessages] = useState<TTCopilotMsg[]>([]);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [inputTypingBuffer, setInputTypingBuffer] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [currentStreamingMsg, setCurrentStreamingMsg] = useState<TTCopilotMsg | null>(null);
  const [showStreamingFileEdit, setShowStreamingFileEdit] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const copilotMsgRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Sparkle canvas
  const setupSparkles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Sparkle {
      x: number;
      y: number;
      size: number;
      speed: number;
      phase: number;
      color: string;
    }
    const sparkles: Sparkle[] = [];
    const colors = ['#fff', '#ff0', '#0ff', '#f0f', '#0f0', '#ffd700'];
    for (let i = 0; i < 60; i++) {
      sparkles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 0.5,
        phase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparkles.forEach((s) => {
        const alpha = Math.abs(Math.sin(time * 0.003 * s.speed + s.phase));
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.color;
        // draw a 4-point star
        ctx.beginPath();
        const spikes = 4;
        const outerR = s.size * 2;
        const innerR = s.size * 0.5;
        for (let i = 0; i < spikes * 2; i++) {
          const r = i % 2 === 0 ? outerR : innerR;
          const angle = (i * Math.PI) / spikes - Math.PI / 2;
          const px = s.x + Math.cos(angle) * r;
          const py = s.y + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
      animFrameRef.current = requestAnimationFrame(draw);
    };
    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Setup sparkles on mount
  useEffect(() => {
    const cleanup = setupSparkles();
    return () => {
      cleanup?.();
    };
  }, [setupSparkles]);

  // Copilot message sequencer
  const playCopilotMessages = useCallback((index: number) => {
    if (index >= COPILOT_MSGS_TT.length) {
      setTimeout(() => {
        setPhase('crumbling');
        setCrumbleStarted(true);
      }, 1800);
      return;
    }
    const msg = COPILOT_MSGS_TT[index];
    if (msg.role === 'user') {
      // Type in input area char by char
      let i = 0;
      const typeChar = () => {
        if (i < msg.text.length) {
          setInputTypingBuffer(msg.text.slice(0, i + 1));
          i++;
          const t = setTimeout(typeChar, 22 + Math.random() * 38);
          timersRef.current.push(t);
        } else {
          const t = setTimeout(() => {
            setCopilotMessages(prev => [...prev, msg]);
            setInputTypingBuffer('');
            const t2 = setTimeout(() => playCopilotMessages(index + 1), 500);
            timersRef.current.push(t2);
          }, 350);
          timersRef.current.push(t);
        }
      };
      const t = setTimeout(typeChar, 300);
      timersRef.current.push(t);
    } else {
      setShowTypingIndicator(true);
      const dotDelay = 700 + Math.random() * 500;
      const t = setTimeout(() => {
        setShowTypingIndicator(false);
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
            const t2 = setTimeout(streamWord, 30 + Math.random() * 40);
            timersRef.current.push(t2);
          } else {
            if (msg.fileEdit) {
              const t2 = setTimeout(() => {
                setShowStreamingFileEdit(true);
                const t3 = setTimeout(() => {
                  setCopilotMessages(prev => [...prev, msg]);
                  setStreamingText('');
                  setCurrentStreamingMsg(null);
                  setShowStreamingFileEdit(false);
                  const t4 = setTimeout(() => playCopilotMessages(index + 1), 600);
                  timersRef.current.push(t4);
                }, 1200);
                timersRef.current.push(t3);
              }, 400);
              timersRef.current.push(t2);
            } else {
              const t2 = setTimeout(() => {
                setCopilotMessages(prev => [...prev, msg]);
                setStreamingText('');
                setCurrentStreamingMsg(null);
                const t3 = setTimeout(() => playCopilotMessages(index + 1), 600);
                timersRef.current.push(t3);
              }, 400);
              timersRef.current.push(t2);
            }
          }
        };
        streamWord();
      }, dotDelay);
      timersRef.current.push(t);
    }
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [joshLineIndex, joshCharIndex]);

  // Auto-scroll copilot messages
  useEffect(() => {
    if (copilotMsgRef.current) {
      copilotMsgRef.current.scrollTop = copilotMsgRef.current.scrollHeight;
    }
  }, [copilotMessages, showTypingIndicator, streamingText, inputTypingBuffer]);

  // Phase state machine
  useEffect(() => {
    // After 7s of showing, start josh typing
    const t1 = setTimeout(() => {
      setPhase('josh-typing');
    }, 7000);
    timersRef.current.push(t1);

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  // Josh typing effect
  useEffect(() => {
    if (phase !== 'josh-typing') return;

    const currentLine = JOSH_LINES[joshLineIndex];
    if (joshLineIndex >= JOSH_LINES.length) {
      // All lines typed, open copilot
      const t = setTimeout(() => {
        setPhase('copilot-reprompt');
      }, 600);
      timersRef.current.push(t);
      return;
    }

    if (joshCharIndex < currentLine.length) {
      const t = setTimeout(() => {
        setJoshCharIndex((prev) => prev + 1);
      }, 50 + Math.random() * 40);
      timersRef.current.push(t);
    } else {
      // Line done, pause then next line
      const t = setTimeout(() => {
        setJoshLineIndex((prev) => prev + 1);
        setJoshCharIndex(0);
      }, 800);
      timersRef.current.push(t);
    }
  }, [phase, joshLineIndex, joshCharIndex]);

  // Copilot reprompt phase
  useEffect(() => {
    if (phase !== 'copilot-reprompt') return;
    setShowCopilotPanel(true);
    const t = setTimeout(() => playCopilotMessages(0), 450);
    timersRef.current.push(t);
  }, [phase, playCopilotMessages]);

  // Crumble + fade + complete
  useEffect(() => {
    if (phase !== 'crumbling') return;

    const t1 = setTimeout(() => {
      setPhase('fade-out');
    }, 2000);

    const t2 = setTimeout(() => {
      setPhase('rebuild');
    }, 3200);

    timersRef.current.push(t1, t2);
  }, [phase, onComplete]);

  // Build crumble transforms per-element
  const getCrumbleStyle = (index: number): React.CSSProperties => {
    if (!crumbleStarted) return {};
    const delay = index * 0.12;
    const direction = index % 2 === 0 ? 1 : -1;
    return {
      transition: `transform 1.5s cubic-bezier(0.55, 0, 1, 0.45) ${delay}s, opacity 1s ease ${delay + 0.3}s`,
      transform: `translateY(${600 + index * 80}px) rotate(${direction * (15 + index * 5)}deg)`,
      opacity: 0,
    };
  };

  const showJosh = phase === 'josh-typing' || phase === 'copilot-reprompt' || phase === 'crumbling';

  // Rebuild phase: show the quick successful deploy screen
  if (phase === 'rebuild') {
    return <RebuildDeploy onComplete={onComplete} />;
  }

  return (
    <>
      <style>{keyframesCSS}</style>

      {/* Sparkle canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />

      {/* Fade to white overlay */}
      {phase === 'fade-out' && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#fff',
            zIndex: 10000,
            animation: 'tt-fade-white 1.2s ease-in forwards',
          }}
        />
      )}

      {phase === 'done' && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#fff',
            zIndex: 10000,
          }}
        />
      )}

      {/* VS Code Terminal Panel */}
      {showJosh && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: showCopilotPanel ? '360px' : 0,
          height: '40vh',
          zIndex: 9998,
          display: 'flex',
          flexDirection: 'column' as const,
          overflow: 'hidden',
          transition: 'right 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        }}>
          <div style={{ height: '2px', background: '#007acc', flexShrink: 0 }} />
          <div style={{
            background: '#252526',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '35px',
            flexShrink: 0,
            borderBottom: '1px solid #1e1e1e',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0 12px',
                height: '100%',
                background: '#1e1e1e',
                color: '#cccccc',
                fontSize: '12px',
                fontFamily: FONT_STACK_TT,
                borderTop: '1px solid #007acc',
                borderRight: '1px solid #252526',
              }}>
                <TerminalIconTT />
                <span>josh@portfolio</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', paddingRight: '4px' }}>
              {['\u2013', '\u25A1', '\u00D7'].map((ch, idx) => (
                <span key={idx} style={{
                  background: 'none',
                  border: 'none',
                  color: '#999',
                  fontSize: '16px',
                  padding: '0 8px',
                  height: '35px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: FONT_STACK_TT,
                }}>{ch}</span>
              ))}
            </div>
          </div>
          <div ref={terminalRef} style={{
            flex: 1,
            background: '#1e1e1e',
            color: '#cccccc',
            fontFamily: MONO_STACK_TT,
            fontSize: '13px',
            padding: '8px 16px',
            overflowY: 'auto' as const,
            lineHeight: 1.5,
          }}>
            {JOSH_LINES.slice(0, Math.min(joshLineIndex + 1, JOSH_LINES.length)).map((line, i) => {
              const displayText = i < joshLineIndex ? line : line.substring(0, joshCharIndex);
              return (
                <p key={i} style={{ margin: 0, whiteSpace: 'pre-wrap' as const, lineHeight: 1.5, minHeight: '20px' }}>
                  <span style={{ color: '#a0a0a0' }}>{displayText}</span>
                  {i === joshLineIndex && phase === 'josh-typing' && (
                    <span style={{
                      display: 'inline-block',
                      width: '7px',
                      height: '14px',
                      background: '#cccccc',
                      marginLeft: '2px',
                      verticalAlign: 'text-bottom',
                      animation: 'tt-cursor-blink 1s step-end infinite',
                    }} />
                  )}
                </p>
              );
            })}
          </div>
        </div>
      )}

      {/* Copilot Chat Panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '360px',
        height: '100vh',
        background: '#1e1e1e',
        borderLeft: '1px solid #333',
        zIndex: 10001,
        display: 'flex',
        flexDirection: 'column' as const,
        transform: showCopilotPanel ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        fontFamily: FONT_STACK_TT,
        boxShadow: showCopilotPanel ? '-4px 0 16px rgba(0,0,0,0.3)' : 'none',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: '1px solid #333',
          flexShrink: 0,
          background: '#252526',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CopilotSparkleTT size={16} />
            <span style={{ color: '#cccccc', fontSize: '13px', fontWeight: 600 }}>Copilot Chat</span>
          </div>
          <button type="button" style={{
            background: 'none', border: 'none', color: '#999', fontSize: '16px', cursor: 'default', padding: '2px 6px',
          }}>&times;</button>
        </div>
        <div ref={copilotMsgRef} style={{
          flex: 1,
          overflowY: 'auto' as const,
          padding: '14px',
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '12px',
        }}>
          {copilotMessages.map((msg, i) => {
            if (msg.role === 'user') {
              return (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'flex-end',
                  animation: 'tt-msg-in 0.25s ease-out',
                }}>
                  <div style={{
                    background: '#264f78',
                    color: '#e0e0e0',
                    borderRadius: '12px 12px 4px 12px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    maxWidth: '85%',
                    lineHeight: 1.5,
                  }}>{msg.text}</div>
                </div>
              );
            }
            return (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column' as const,
                alignItems: 'flex-start',
                animation: 'tt-msg-in 0.25s ease-out',
              }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#888', marginBottom: '4px', marginLeft: '2px' }}>Copilot</div>
                <div style={{
                  background: '#2d2d2d',
                  color: '#d4d4d4',
                  borderRadius: '12px 12px 12px 4px',
                  padding: '10px 12px',
                  fontSize: '13px',
                  maxWidth: '85%',
                  lineHeight: 1.5,
                }}>
                  {msg.text}
                  {msg.fileEdit && (
                    <div style={{
                      background: '#1a1a1a',
                      borderRadius: '6px',
                      border: '1px solid #333',
                      overflow: 'hidden',
                      marginTop: '8px',
                    }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '6px 10px',
                        background: '#252526',
                        borderBottom: '1px solid #333',
                        fontSize: '11px',
                        color: '#999',
                        fontFamily: MONO_STACK_TT,
                      }}>
                        <span>{msg.fileEdit.fileName}</span>
                        <span style={{
                          marginLeft: 'auto', fontSize: '9px', color: '#4ec9b0',
                          background: 'rgba(78,201,176,0.1)', padding: '2px 6px',
                          borderRadius: '3px', fontFamily: MONO_STACK_TT,
                          textTransform: 'uppercase' as const, fontWeight: 600,
                        }}>Modified</span>
                      </div>
                      <div style={{
                        padding: '8px 12px',
                        fontFamily: MONO_STACK_TT,
                        fontSize: '11px',
                        lineHeight: 1.6,
                      }}>
                        {msg.fileEdit.lines.map((line, j) => (
                          <div key={j} style={{
                            color: line.startsWith('+') ? '#4ec9b0'
                              : line.startsWith('-') ? '#f44747' : '#808080',
                            ...(line.startsWith('-') ? { textDecoration: 'line-through', opacity: 0.7 } : {}),
                          }}>{line}</div>
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
            <div style={{
              display: 'flex', flexDirection: 'column' as const,
              alignItems: 'flex-start',
              animation: 'tt-msg-in 0.25s ease-out',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#888', marginBottom: '4px', marginLeft: '2px' }}>Copilot</div>
              <div style={{
                background: '#2d2d2d',
                color: '#d4d4d4',
                borderRadius: '12px 12px 12px 4px',
                padding: '10px 12px',
                fontSize: '13px',
                maxWidth: '85%',
                lineHeight: 1.5,
              }}>
                {streamingText}
                <span style={{
                  display: 'inline-block', width: '2px', height: '14px',
                  background: '#d4d4d4', marginLeft: '2px', verticalAlign: 'text-bottom',
                  animation: 'tt-cursor-blink 1s step-end infinite',
                }} />
                {showStreamingFileEdit && currentStreamingMsg.fileEdit && (
                  <div style={{
                    background: '#1a1a1a',
                    borderRadius: '6px',
                    border: '1px solid #333',
                    overflow: 'hidden',
                    marginTop: '8px',
                    animation: 'tt-msg-in 0.3s ease-out',
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '6px 10px',
                      background: '#252526',
                      borderBottom: '1px solid #333',
                      fontSize: '11px',
                      color: '#999',
                      fontFamily: MONO_STACK_TT,
                    }}>
                      <span>{currentStreamingMsg.fileEdit.fileName}</span>
                      <span style={{
                        marginLeft: 'auto', fontSize: '9px', color: '#4ec9b0',
                        background: 'rgba(78,201,176,0.1)', padding: '2px 6px',
                        borderRadius: '3px', fontFamily: MONO_STACK_TT,
                        textTransform: 'uppercase' as const, fontWeight: 600,
                      }}>Modified</span>
                    </div>
                    <div style={{
                      padding: '8px 12px',
                      fontFamily: MONO_STACK_TT,
                      fontSize: '11px',
                      lineHeight: 1.6,
                    }}>
                      {currentStreamingMsg.fileEdit.lines.map((line, j) => (
                        <div key={j} style={{
                          color: line.startsWith('+') ? '#4ec9b0'
                            : line.startsWith('-') ? '#f44747' : '#808080',
                          ...(line.startsWith('-') ? { textDecoration: 'line-through', opacity: 0.7 } : {}),
                        }}>{line}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {showTypingIndicator && (
            <div style={{ display: 'flex', gap: '4px', padding: '8px 4px', alignItems: 'center', animation: 'tt-msg-in 0.25s ease-out' }}>
              <span style={{ width: '6px', height: '6px', background: '#666', borderRadius: '50%', animation: 'tt-dot-pulse 1.4s ease-in-out 0s infinite' }} />
              <span style={{ width: '6px', height: '6px', background: '#666', borderRadius: '50%', animation: 'tt-dot-pulse 1.4s ease-in-out 0.2s infinite' }} />
              <span style={{ width: '6px', height: '6px', background: '#666', borderRadius: '50%', animation: 'tt-dot-pulse 1.4s ease-in-out 0.4s infinite' }} />
            </div>
          )}
        </div>
        <div style={{
          borderTop: '1px solid #333',
          padding: '10px 14px',
          background: '#252526',
          flexShrink: 0,
        }}>
          <div style={{
            background: '#3c3c3c',
            border: '1px solid #555',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '13px',
            fontFamily: FONT_STACK_TT,
            minHeight: '20px',
            color: inputTypingBuffer ? '#e0e0e0' : '#666',
          }}>
            {inputTypingBuffer || 'Ask Copilot...'}
            {inputTypingBuffer && (
              <span style={{
                display: 'inline-block', width: '2px', height: '14px',
                background: '#e0e0e0', marginLeft: '1px', verticalAlign: 'text-bottom',
                animation: 'tt-cursor-blink 1s step-end infinite',
              }} />
            )}
          </div>
        </div>
      </div>

      {/* Main terrible template */}
      <div
        ref={containerRef}
        style={{
          backgroundColor: '#ff00ff',
          minHeight: '100vh',
          fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Marquee bar */}
        <div
          style={{
            ...getCrumbleStyle(0),
            background: 'linear-gradient(90deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff, #ff0000)',
            padding: '8px 0',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            borderBottom: '3px solid #000',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              animation: 'tt-marquee 8s linear infinite',
              fontSize: 22,
              fontWeight: 'bold',
              color: '#fff',
              textShadow: '2px 2px 0 #000',
            }}
          >
            ★ Welcome to my portfolio ★ I am passionate about code ★ Hire me
            please ★ 10x developer ★ Welcome to my portfolio ★ I am passionate
            about code ★ Hire me please ★ 10x developer ★
          </div>
        </div>

        {/* Under Construction banner */}
        <div
          style={{
            ...getCrumbleStyle(1),
            background: 'repeating-linear-gradient(45deg, #000, #000 10px, #ffcc00 10px, #ffcc00 20px)',
            backgroundSize: '28.28px 28.28px',
            animation: 'tt-hazard-scroll 0.8s linear infinite',
            padding: '14px',
            textAlign: 'center',
            borderTop: '3px solid #000',
            borderBottom: '3px solid #000',
          }}
        >
          <span
            style={{
              backgroundColor: '#ff0000',
              color: '#ffff00',
              fontFamily: '"Impact", "Arial Black", sans-serif',
              fontSize: 28,
              fontWeight: 'bold',
              padding: '6px 20px',
              border: '3px solid #ffff00',
              animation: 'tt-blink 0.6s step-end infinite',
              textTransform: 'uppercase',
              letterSpacing: 4,
            }}
          >
            🚧 UNDER CONSTRUCTION 🚧
          </span>
        </div>

        <FireDivider />

        {/* 2-column grid layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}>
          {/* Hero section — spans full width */}
          <div
            style={{
              ...getCrumbleStyle(2),
              gridColumn: '1 / -1',
              background: 'linear-gradient(135deg, #ff69b4, #ff00ff, #ff1493)',
              padding: '40px 20px',
              textAlign: 'center',
              borderBottom: '3px solid #ff4500',
            }}
          >
            <h1
              style={{
                fontSize: 54,
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'tt-glow-pulse 2s ease-in-out infinite',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: 6,
                filter: 'drop-shadow(0 0 10px rgba(255,255,0,0.8))',
              }}
            >
              PASSIONATE DEVELOPER
            </h1>
            <h2
              style={{
                fontSize: 36,
                color: '#00ff00',
                textShadow: '3px 3px 0 #ff0000, -1px -1px 0 #0000ff',
                fontFamily: '"Comic Sans MS", cursive',
                marginTop: 12,
              }}
            >
              Hi! I'm Joshua 👋🤓💻
            </h2>
            <p
              style={{
                color: '#ffff00',
                fontSize: 16,
                textShadow: '1px 1px 0 #000',
                fontStyle: 'italic',
                margin: 0,
              }}
            >
              "Code is my passion. Coffee is my fuel. Synergy is my middle name."
            </p>
          </div>

          {/* About section — left column */}
          <div
            style={{
              ...getCrumbleStyle(3),
              background: 'linear-gradient(180deg, #00cc00, #009900, #006600)',
              padding: '30px 24px',
              textAlign: 'center',
              borderRight: '3px solid #ff4500',
              borderBottom: '3px solid #ff4500',
            }}
          >
            <h2
              style={{
                fontSize: 32,
                color: '#ff0000',
                textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
                fontFamily: '"Georgia", "Times New Roman", serif',
                textDecoration: 'underline wavy #ffff00',
                marginTop: 0,
              }}
            >
              ✨ About Me ✨
            </h2>
            <p
              style={{
                color: '#ffffff',
                fontSize: 15,
                margin: '12px auto',
                textShadow: '2px 2px 4px #ff0000',
                lineHeight: 1.7,
              }}
            >
              I started coding at age 3 by hacking into NASA's mainframe. By 5, I
              had rebuilt Facebook from scratch (but better). I am a full-stack,
              cloud-native, AI-powered, blockchain-enabled, quantum-ready 10x
              developer who thrives in fast-paced environments and is passionate
              about leveraging cutting-edge synergies to deliver world-class
              solutions that move the needle and disrupt paradigms.
            </p>
            <p
              style={{
                color: '#ffff00',
                fontSize: 14,
                fontStyle: 'italic',
                textShadow: '1px 1px 2px #000',
              }}
            >
              Fun fact: I once debugged a production issue in my sleep. Literally.
            </p>
          </div>

          {/* Skills section — right column */}
          <div
            style={{
              ...getCrumbleStyle(4),
              background: 'linear-gradient(180deg, #1a0033, #000066, #330066)',
              padding: '30px 24px',
              borderBottom: '3px solid #ff4500',
            }}
          >
            <h2
              style={{
                fontSize: 30,
                color: '#0ff',
                textAlign: 'center',
                textShadow: '0 0 10px #0ff, 0 0 20px #0ff, 0 0 40px #0ff',
                animation: 'tt-neon-flicker 3s infinite',
                fontFamily: '"Impact", sans-serif',
                letterSpacing: 6,
                textTransform: 'uppercase',
                marginTop: 0,
              }}
            >
              ⚡ My Epic Skills ⚡
            </h2>
            {[
              { name: 'React', pct: 90, color: '#00ff88' },
              { name: 'CSS', pct: 85, color: '#ff00ff' },
              { name: 'Teamwork', pct: 95, color: '#ffff00' },
              { name: 'Passion', pct: 110, color: '#ff4444' },
            ].map((skill, i) => (
              <div
                key={skill.name}
                style={{
                  margin: '14px auto',
                  maxWidth: 400,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 'bold',
                    marginBottom: 4,
                    textShadow: '0 0 5px ' + skill.color,
                  }}
                >
                  <span>{skill.name}</span>
                  <span>{skill.pct}%</span>
                </div>
                <div
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 4,
                    height: 20,
                    border: '1px solid ' + skill.color,
                    overflow: skill.pct <= 100 ? 'hidden' : 'visible',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: `${skill.pct}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)`,
                      borderRadius: skill.pct <= 100 ? 4 : '4px 0 0 4px',
                      animation: 'tt-skill-fill 1.5s ease-out forwards',
                      animationDelay: `${i * 0.3}s`,
                      boxShadow: `0 0 10px ${skill.color}, 0 0 20px ${skill.color}88`,
                      position: skill.pct > 100 ? 'absolute' : 'relative',
                      top: 0,
                      left: 0,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial — left column */}
          <div
            style={{
              ...getCrumbleStyle(5),
              background: 'linear-gradient(135deg, #ff6699, #cc3366)',
              padding: '30px 20px',
              textAlign: 'center',
              borderRight: '3px solid #ff4500',
              borderBottom: '3px solid #ff4500',
            }}
          >
            <h2
              style={{
                color: '#fff',
                fontSize: 28,
                fontFamily: '"Georgia", serif',
                textShadow: '2px 2px 0 #000',
                marginTop: 0,
              }}
            >
              💬 What People Say
            </h2>
            <div
              style={{
                margin: '16px auto',
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: 12,
                padding: 20,
                border: '3px dashed #ffff00',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 6 }}>⭐⭐⭐⭐⭐</div>
              <p
                style={{
                  color: '#fff',
                  fontSize: 20,
                  fontStyle: 'italic',
                  margin: '8px 0',
                  textShadow: '1px 1px 0 #000',
                }}
              >
                "Very proud"
              </p>
              <p
                style={{
                  color: '#ffff00',
                  fontSize: 15,
                  fontWeight: 'bold',
                }}
              >
                — Mom
              </p>
            </div>
          </div>

          {/* CTA — right column */}
          <div
            style={{
              ...getCrumbleStyle(6),
              background: 'linear-gradient(180deg, #0000cc, #0000ff, #0033ff)',
              padding: '30px 20px',
              textAlign: 'center',
              borderBottom: '3px solid #ff4500',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <h2
              style={{
                color: '#ffff00',
                fontSize: 42,
                fontWeight: 'bold',
                animation: 'tt-pulse 1.5s ease-in-out infinite',
                textShadow:
                  '3px 3px 0 #ff0000, 0 0 20px #ffff00, 0 0 40px #ffff00',
                fontFamily: '"Impact", sans-serif',
                textTransform: 'uppercase',
                marginTop: 0,
              }}
            >
              Let's Connect! 🤝
            </h2>
            <p
              style={{
                color: '#fff',
                fontSize: 16,
                textShadow: '1px 1px 0 #000',
              }}
            >
              I reply to all emails within 0.3 seconds*
            </p>
            <p
              style={{
                color: '#888',
                fontSize: 10,
                marginTop: 4,
              }}
            >
              *response time not guaranteed
            </p>

            {/* Resume button */}
            <button
              style={{
                marginTop: 16,
                padding: '14px 36px',
                fontSize: 20,
                fontWeight: 'bold',
                color: '#fff',
                background:
                  'linear-gradient(90deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff, #ff0000)',
                backgroundSize: '300% 100%',
                border: '3px solid #fff',
                borderRadius: 12,
                cursor: 'pointer',
                animation: 'tt-rotate-pulse 2s ease-in-out infinite',
                boxShadow:
                  '0 0 15px #ff0, 0 0 30px #f0f, 0 0 45px #0ff',
                textTransform: 'uppercase',
                letterSpacing: 3,
                fontFamily: '"Impact", sans-serif',
              }}
            >
              📄 Download My Resume 📄
            </button>
          </div>

          {/* Visitor counter — spans full width */}
          <div
            style={{
              ...getCrumbleStyle(7),
              gridColumn: '1 / -1',
              backgroundColor: '#000',
              padding: '16px',
              textAlign: 'center',
              borderBottom: '3px solid #ff4500',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                border: '2px solid #00ff00',
                padding: '8px 20px',
                fontFamily: '"Courier New", Courier, monospace',
                color: '#00ff00',
                fontSize: 16,
                backgroundColor: '#001100',
                boxShadow: '0 0 10px rgba(0,255,0,0.3)',
              }}
            >
              You are visitor #000,427
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            ...getCrumbleStyle(8),
            background: 'linear-gradient(180deg, #333, #111)',
            padding: '20px 20px',
            textAlign: 'center',
            color: '#aaa',
            fontSize: 14,
            borderTop: '3px solid #ff00ff',
          }}
        >
          <p style={{ margin: 0 }}>
            Built with ❤️ and questionable design choices
          </p>
          <p style={{ margin: '8px 0 0', fontSize: 11, color: '#666' }}>
            © 2026 Joshua | All Rights Reserved | Powered by Passion™
          </p>
        </div>
      </div>

      {/* Chrome badge - fixed */}
      <div
        style={{
          position: 'fixed',
          bottom: showJosh ? 'calc(40vh + 12px)' : 12,
          right: 12,
          backgroundColor: '#c0c0c0',
          border: '2px outset #fff',
          padding: '6px 12px',
          fontFamily: '"MS Sans Serif", "Courier New", monospace',
          fontSize: 10,
          color: '#000',
          zIndex: 9990,
          boxShadow: '2px 2px 0 #888',
          transition: 'bottom 0.3s ease',
        }}
      >
        Best viewed in Chrome 1024x768
      </div>
    </>
  );
};

export default TerribleTemplate;
