import React, { useEffect, useRef, useState, useCallback } from 'react';
import RebuildDeploy from '../LoadingSequence/RebuildDeploy';
import { useTerminalTyper, TerminalLine } from '../VibeCodingOverlay/Shared/useTerminalTyper';
import { useAgentSequencer, AgentMessage } from '../VibeCodingOverlay/Shared/useAgentSequencer';
import { TerminalPanel } from '../VibeCodingOverlay/Shared/TerminalPanel';
import { CopilotAgentPanel } from '../VibeCodingOverlay/Shared/CopilotAgentPanel';

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

const TERMINAL_LINES: TerminalLine[] = [
  { type: 'prompt-cmd', text: 'no no no no no' },
  { type: 'prompt-cmd', text: 'what did you do' },
  { type: 'prompt-cmd', text: "that's absolutely terrible" },
  { type: 'prompt-cmd', text: 'ok let me try this again' },
];

const COPILOT_MSGS: AgentMessage[] = [
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
/* vc* keyframes provided by shared TerminalPanel/CopilotAgentPanel */
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
  const [crumbleStarted, setCrumbleStarted] = useState(false);
  const [showCopilotPanel, setShowCopilotPanel] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

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
    
    typeLines(TERMINAL_LINES, 0, () => {
        // Once typing is done, switch phase
        const t = setTimeout(() => {
            setPhase('copilot-reprompt');
        }, 600);
        timersRef.current.push(t);
    });
  }, [phase, typeLines]);

  // Copilot reprompt phase
  useEffect(() => {
    if (phase !== 'copilot-reprompt') return;
    setShowCopilotPanel(true);
    
    const t = setTimeout(() => {
        playMessages(COPILOT_MSGS, 0, () => {
            // Sequence done
             setTimeout(() => {
                setPhase('crumbling');
                setCrumbleStarted(true);
              }, 1800);
        });
    }, 450);
    timersRef.current.push(t);
  }, [phase, playMessages]);

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


  // Clean up hooks on unmount (optional, but good practice)
  useEffect(() => {
      return () => {
          clearTerminal();
          resetAgent();
      }
  }, [clearTerminal, resetAgent]);

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
      <TerminalPanel
        className={!showJosh ? "vcSlideDown" : "vcSlideUp"}
        style={{
            position: 'fixed',
            bottom: showJosh ? 0 : -400,
            left: 0,
            right: showCopilotPanel ? '380px' : 0,
            height: '40vh',
            zIndex: 10000,
            transition: 'right 0.35s cubic-bezier(0.22, 1, 0.36, 1), bottom 0.5s ease',
        }}
        lines={terminalLines}
        typingBuffer={typingBuffer}
        isTyping={isTyping}
        typingLineType={typingLineType}
      />

      {/* Copilot panel */}
      <CopilotAgentPanel
        visible={showCopilotPanel}
        messages={copilotMessages}
        streamingMessage={currentStreamingMsg}
        streamingText={streamingText}
        showStreamingFileEdit={showStreamingFileEdit}
        isThinking={showTypingIndicator}
        inputBuffer={inputTypingBuffer}
      />

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
