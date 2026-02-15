import React, { useState, useRef, useEffect, useCallback } from 'react';

/* ──────────────────────────────────────────────────────────────────────
   SiriChatbot — retro Mac-inspired chatbot. Minimalistic, clean,
   Apple-aesthetic. Named "Siri". She's helpful but in a very
   Apple-minimalist way.
   ────────────────────────────────────────────────────────────────────── */

interface SiriChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  collectClue: (clueId: number) => void;
  navigateTo: (phase: string) => void;
  onSiriMode?: () => void;
}

interface Message {
  sender: 'bot' | 'user';
  text: string;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ── SIRI DIALOGUE ─────────────────────────────────────────────────── */

interface SiriNode {
  messages: string[];
  options: string[];
  navigateTo?: string;
  collectClue?: number;
}

type SiriNodeDef = SiriNode | (() => SiriNode);

const SIRI_DIALOGUE: Record<string, SiriNodeDef> = {
  __start: () => ({
    messages: [pick([
      "Hi. I'm Siri. Not that Siri. A different one.",
      "Hello. Welcome to Joshua's portfolio.",
      "Hey there. How can I help today?",
    ])],
    options: ['About Josh', 'Projects', 'Navigate', 'Who are you?'],
  }),

  'About Josh': {
    messages: [
      "Josh. Software developer. Waterloo CE. Dean's Honours.",
      "He builds things. Mostly games about math.",
    ],
    options: ['Skills', 'Experience', 'Projects', 'Go back'],
  },

  'Skills': {
    messages: ["React. TypeScript. Python. Java. C++. The usual."],
    options: ['Projects', 'Experience', 'Go back'],
  },

  'Experience': {
    messages: [
      "Expertise AI. Descartes Systems. CharityCAN. CASI. Quilt.AI.",
      "He stays busy.",
    ],
    options: ['About Josh', 'Projects', 'Go back'],
  },

  'Projects': {
    messages: [
      "Five projects. All different. All his.",
      "Infinite Levels. Four Nines. Match Five. Survivor Stats. PlantGuru.",
    ],
    options: ['Show me', 'Tell me more', 'Go back'],
  },

  'Show me': {
    messages: ["Opening projects."],
    options: [],
    navigateTo: 'projects',
  },

  'Tell me more': () => ({
    messages: [pick([
      "Infinite Levels: puzzle game. No end. Literally.",
      "Four Nines: daily math. Four 9s. Hit the target.",
      "Match Five: words. Meanings. Clean design.",
      "Survivor Stats: 47 seasons of data. He watches Survivor.",
      "PlantGuru: IoT plant care. His capstone project.",
    ])],
    options: ['Tell me more', 'Show me', 'Go back'],
  }),

  'Navigate': {
    messages: ["Where to?"],
    options: ['About page', 'Projects page', 'Lobby', 'Somewhere hidden'],
  },

  'About page': {
    messages: ["Going to About."],
    options: [],
    navigateTo: 'about',
  },

  'Projects page': {
    messages: ["Going to Projects."],
    options: [],
    navigateTo: 'projects',
  },

  'Lobby': {
    messages: ["Back to the lobby."],
    options: [],
    navigateTo: 'lobby',
  },

  'Somewhere hidden': {
    messages: ["There are hidden pages. I'll let you find them."],
    options: ['The Void', 'Debug Mode', 'Go back'],
    collectClue: 3,
  },

  'The Void': {
    messages: ["Entering the void. Enjoy."],
    options: [],
    navigateTo: 'void',
  },

  'Debug Mode': {
    messages: ["Debug mode. Careful."],
    options: [],
    navigateTo: 'debug',
  },

  'Who are you?': () => ({
    messages: [pick([
      "I'm Siri. The portfolio version. Less corporate.",
      "A minimalist chatbot. I keep things simple.",
      "Think of me as the Apple version of JoshBot. Fewer features. Better font.",
    ])],
    options: ['About Josh', 'Projects', 'That explains the aesthetic'],
  }),

  "That explains the aesthetic": {
    messages: ["Less is more. Mostly less."],
    options: ['About Josh', 'Projects', 'Navigate'],
  },

  'Go back': () => ({
    messages: [pick(["Sure.", "Okay.", "Back we go."])],
    options: ['About Josh', 'Projects', 'Navigate', 'Who are you?'],
  }),

  __fallback: () => ({
    messages: [pick([
      "I didn't quite catch that.",
      "Try tapping one of the options.",
      "I'm not sure how to help with that.",
    ])],
    options: ['About Josh', 'Projects', 'Navigate'],
  }),
};

function resolveSiriNode(key: string): SiriNode {
  const node = SIRI_DIALOGUE[key] || SIRI_DIALOGUE.__fallback;
  return typeof node === 'function' ? node() : node;
}

/* ── COMPONENT ─────────────────────────────────────────────────────── */

const SiriChatbot: React.FC<SiriChatbotProps> = ({ isOpen, onToggle, onClose, collectClue, navigateTo, onSiriMode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [launcherHover, setLauncherHover] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [aimBurst, setAimBurst] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutsRef = useRef<number[]>([]);
  const holdStartRef = useRef(0);
  const holdRafRef = useRef<number | null>(null);
  const holdTriggeredRef = useRef(false);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  /* --- long-press to switch back to JoshBot --- */
  const HOLD_DURATION = 1500;

  const startHold = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    holdStartRef.current = Date.now();
    holdTriggeredRef.current = false;

    const animate = () => {
      const elapsed = Date.now() - holdStartRef.current;
      const progress = Math.min(elapsed / HOLD_DURATION, 1);
      setHoldProgress(progress);

      if (progress >= 1 && !holdTriggeredRef.current) {
        holdTriggeredRef.current = true;
        setAimBurst(true);
        setTimeout(() => {
          onSiriMode?.();
        }, 600);
        return;
      }

      if (progress < 1) {
        holdRafRef.current = requestAnimationFrame(animate);
      }
    };

    holdRafRef.current = requestAnimationFrame(animate);
  }, [onSiriMode]);

  const endHold = useCallback(() => {
    if (holdRafRef.current) cancelAnimationFrame(holdRafRef.current);
    const elapsed = Date.now() - holdStartRef.current;

    if (!holdTriggeredRef.current && elapsed < 250) {
      onToggle();
    }

    setHoldProgress(0);
    holdStartRef.current = 0;
  }, [onToggle]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, options]);

  useEffect(() => {
    return () => { timeoutsRef.current.forEach(clearTimeout); };
  }, []);

  const playNode = useCallback(
    (node: SiriNode) => {
      setOptions([]);
      setIsTyping(true);

      let delay = 0;
      node.messages.forEach((text, i) => {
        delay += i === 0 ? 600 : 400 + text.length * 8;
        schedule(() => {
          setMessages(prev => [...prev, { sender: 'bot', text }]);
          if (i === node.messages.length - 1) setIsTyping(false);
        }, delay);
      });

      if (node.collectClue !== undefined) {
        schedule(() => collectClue(node.collectClue!), delay + 100);
      }

      if (node.navigateTo) {
        const target = node.navigateTo;
        schedule(() => { navigateTo(target); onClose(); }, delay + 600);
      }

      schedule(() => setOptions(node.options), delay + 300);
    },
    [collectClue, navigateTo, onClose, schedule],
  );

  useEffect(() => {
    if (isOpen && !initialized) {
      setInitialized(true);
      setHasNewMessage(false);
      playNode(resolveSiriNode('__start'));
    }
    if (isOpen) {
      setHasNewMessage(false);
      schedule(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, initialized, playNode, schedule]);

  const handleOption = useCallback((key: string) => {
    setMessages(prev => [...prev, { sender: 'user', text: key }]);
    playNode(resolveSiriNode(key));
  }, [playNode]);

  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text || isTyping) return;
    setInputValue('');
    setMessages(prev => [...prev, { sender: 'user', text }]);

    // Fuzzy match
    const lower = text.toLowerCase();
    for (const k of Object.keys(SIRI_DIALOGUE)) {
      if (k.startsWith('__')) continue;
      if (k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase())) {
        playNode(resolveSiriNode(k));
        return;
      }
    }
    playNode(resolveSiriNode('__fallback'));
  }, [inputValue, isTyping, playNode]);

  return (
    <>
      <style>{`
        @keyframes siriWindowIn {
          from { opacity: 0; transform: translateY(10px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes siriFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes siriPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes siriOrb {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes aim-glow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes aim-activate-burst {
          0%   { transform: scale(1); opacity: 0.8; }
          50%  { transform: scale(2.2); opacity: 0.4; }
          100% { transform: scale(3); opacity: 0; }
        }
      `}</style>

      {/* Launcher */}
      <button
        aria-label="Open Siri"
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={(e) => { endHold(); setLauncherHover(false); }}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        onMouseEnter={() => setLauncherHover(true)}
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: launcherHover
            ? 'linear-gradient(135deg, #5AC8FA, #007AFF, #AF52DE, #FF2D55)'
            : 'linear-gradient(135deg, #5AC8FA, #007AFF, #AF52DE)',
          backgroundSize: '200% 200%',
          animation: 'siriOrb 4s ease infinite',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: holdProgress > 0.2
            ? `0 4px 16px rgba(0,122,255,0.2), 0 0 ${holdProgress * 25}px rgba(58,110,165,${holdProgress * 0.7})`
            : launcherHover
              ? '0 6px 24px rgba(0,122,255,0.35)'
              : '0 4px 16px rgba(0,122,255,0.2)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          transform: holdProgress > 0.2
            ? `scale(${1 + holdProgress * 0.12})`
            : launcherHover ? 'scale(1.06)' : 'scale(1)',
          zIndex: 10000,
          border: 'none',
          padding: 0,
          overflow: 'visible',
        }}
      >
        {/* AIM glow ring — appears when holding to switch back */}
        {holdProgress > 0.2 && (
          <div style={{
            position: 'absolute',
            inset: -6,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #3a6ea5, #6e9ecf, #0a246a, #4477aa, #3a6ea5)',
            opacity: Math.min((holdProgress - 0.2) / 0.8, 1) * 0.85,
            filter: `blur(${4 + holdProgress * 4}px)`,
            animation: 'aim-glow-spin 1.5s linear infinite',
            zIndex: -1,
          }} />
        )}

        {/* AIM burst on activation */}
        {aimBurst && (
          <div style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #3a6ea5, #6e9ecf, #0a246a, #3a6ea5)',
            animation: 'aim-activate-burst 0.6s ease-out forwards',
            zIndex: -1,
          }} />
        )}

        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
          ...(holdProgress > 0.5 ? {
            opacity: 1 - (holdProgress - 0.5) * 1.2,
          } : {}),
        }}>
          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" fill="none" />
          <path d="M12 7v4l3 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {hasNewMessage && !isOpen && holdProgress === 0 && (
          <span style={{
            position: 'absolute', top: -2, right: -2,
            width: 14, height: 14, borderRadius: '50%',
            background: '#FF3B30', border: '2px solid #fff',
          }} />
        )}
      </button>

      {/* Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: 92,
          right: 28,
          width: 340,
          height: 460,
          borderRadius: 16,
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          boxShadow: '0 12px 48px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10001,
          animation: 'siriWindowIn 0.3s ease forwards',
        }}>
          {/* Title bar */}
          <div style={{
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: 'linear-gradient(135deg, #5AC8FA, #007AFF, #AF52DE)',
                backgroundSize: '200% 200%',
                animation: 'siriOrb 4s ease infinite',
              }} />
              <span style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
                fontSize: 14,
                fontWeight: 600,
                color: '#1d1d1f',
              }}>Siri</span>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#86868b', fontSize: 18, padding: '4px 8px',
                borderRadius: 8,
                fontFamily: '-apple-system, sans-serif',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
            >✕</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
          }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 10,
                  animation: 'siriFadeIn 0.25s ease forwards',
                }}
              >
                <div style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.sender === 'user'
                    ? 'linear-gradient(135deg, #007AFF, #5856D6)'
                    : '#f2f2f7',
                  color: msg.sender === 'user' ? '#fff' : '#1d1d1f',
                  fontSize: 14,
                  lineHeight: 1.4,
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{
                fontSize: 13,
                color: '#86868b',
                padding: '4px 0',
                animation: 'siriPulse 1.2s infinite',
              }}>
                Siri is thinking...
              </div>
            )}

            {options.length > 0 && !isTyping && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                marginTop: 8,
              }}>
                {options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleOption(opt)}
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                      fontSize: 13,
                      fontWeight: 500,
                      padding: '7px 14px',
                      borderRadius: 20,
                      border: '1px solid rgba(0,0,0,0.1)',
                      background: '#fff',
                      color: '#007AFF',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#007AFF';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.style.color = '#007AFF';
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div style={{
            display: 'flex',
            padding: '10px 14px',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            gap: 8,
          }}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Ask Siri..."
              disabled={isTyping}
              style={{
                flex: 1,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                fontSize: 14,
                padding: '8px 14px',
                borderRadius: 20,
                border: '1px solid rgba(0,0,0,0.1)',
                background: '#f5f5f7',
                outline: 'none',
                color: '#1d1d1f',
              }}
            />
            <button
              onClick={handleSend}
              disabled={isTyping}
              style={{
                fontFamily: '-apple-system, sans-serif',
                fontSize: 14,
                fontWeight: 600,
                color: '#007AFF',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0 4px',
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SiriChatbot;
