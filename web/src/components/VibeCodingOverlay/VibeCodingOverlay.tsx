import React, { useState, useEffect, useRef, useCallback } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

export interface FileEdit {
  fileName: string;
  lines: string[];
}

export interface CopilotMessage {
  role: 'user' | 'assistant';
  text: string;
  fileEdit?: FileEdit;
}

export interface TerminalLine {
  type: 'prompt-cmd' | 'output' | 'error' | 'blank' | 'comment';
  text: string;
}

export interface VibeCodingSequence {
  /** Terminal lines Josh types before copilot opens */
  joshLines: TerminalLine[];
  /** Copilot conversation */
  copilotMessages: CopilotMessage[];
  /** Callback when the whole sequence finishes */
  onComplete: () => void;
  /** Optional: show an error overlay before/during the sequence */
  errorOverlay?: React.ReactNode;
  /** Whether to show the error overlay */
  showError?: boolean;
}

interface VibeCodingOverlayProps {
  sequence: VibeCodingSequence;
  /** Whether the overlay is active */
  active: boolean;
  /** Optional: embed terminal at bottom of scrollable content instead of fixed */
  embedded?: boolean;
}

// ── Inline SVGs (minimal, neutral) ───────────────────────────────────────────

export const CopilotSparkle: React.FC<{ size?: number; id?: string }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" fill="#888" />
  </svg>
);

const TerminalIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="#cccccc" aria-hidden="true">
    <path d="M6 9l3-3-3-3-.7.7L7.6 6 5.3 8.3zm4 1H7v1h3z" />
    <path d="M1 2.5A1.5 1.5 0 012.5 1h11A1.5 1.5 0 0115 2.5v11a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 011 13.5zm1.5-.5a.5.5 0 00-.5.5v11a.5.5 0 00.5.5h11a.5.5 0 00.5-.5v-11a.5.5 0 00-.5-.5z" />
  </svg>
);

// ── Constants ────────────────────────────────────────────────────────────────

const FONT_STACK = 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const MONO_STACK = '"Cascadia Code", Consolas, "Courier New", monospace';

// ── Component ────────────────────────────────────────────────────────────────

const VibeCodingOverlay: React.FC<VibeCodingOverlayProps> = ({
  sequence,
  active,
  embedded = false,
}) => {
  // Terminal state
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [typingBuffer, setTypingBuffer] = useState('');
  const [typingLineType, setTypingLineType] = useState<TerminalLine['type']>('comment');
  const [isTyping, setIsTyping] = useState(false);

  // Copilot panel state
  const [showCopilotPanel, setShowCopilotPanel] = useState(false);
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([]);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);

  // Input typing & response streaming
  const [inputTypingBuffer, setInputTypingBuffer] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [currentStreamingMsg, setCurrentStreamingMsg] = useState<CopilotMessage | null>(null);
  const [showStreamingFileEdit, setShowStreamingFileEdit] = useState(false);

  // Lifecycle
  const [joshDone, setJoshDone] = useState(false);
  const [closing, setClosing] = useState(false);

  const terminalRef = useRef<HTMLDivElement>(null);
  const copilotMsgRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Reset on new sequence
  useEffect(() => {
    if (!active) {
      setTerminalLines([]);
      setTypingBuffer('');
      setIsTyping(false);
      setShowCopilotPanel(false);
      setCopilotMessages([]);
      setShowTypingIndicator(false);
      setInputTypingBuffer('');
      setStreamingText('');
      setCurrentStreamingMsg(null);
      setShowStreamingFileEdit(false);
      setJoshDone(false);
      setClosing(false);
      completedRef.current = false;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    }
  }, [active]);

  // Auto-scroll
  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [terminalLines, typingBuffer]);

  useEffect(() => {
    if (copilotMsgRef.current) copilotMsgRef.current.scrollTop = copilotMsgRef.current.scrollHeight;
  }, [copilotMessages, showTypingIndicator, streamingText, inputTypingBuffer]);

  // ── Terminal typing helper ─────────────────────────────────────────────

  const typeTerminalLine = useCallback(
    (line: TerminalLine, onDone: () => void, instant = false) => {
      if (line.type === 'blank') {
        setTerminalLines(prev => [...prev, line]);
        onDone();
        return;
      }
      if (instant || line.type === 'output' || line.type === 'error') {
        setTerminalLines(prev => [...prev, line]);
        onDone();
        return;
      }
      setIsTyping(true);
      setTypingBuffer('');
      setTypingLineType(line.type);
      let i = 0;
      const tick = () => {
        if (i < line.text.length) {
          setTypingBuffer(line.text.slice(0, i + 1));
          i++;
          const delay = line.type === 'prompt-cmd' ? 20 + Math.random() * 40 : 30 + Math.random() * 60;
          const t = setTimeout(tick, delay);
          timersRef.current.push(t);
        } else {
          setIsTyping(false);
          setTerminalLines(prev => [...prev, line]);
          setTypingBuffer('');
          onDone();
        }
      };
      tick();
    },
    [],
  );

  const typeJoshLines = useCallback(
    (lines: TerminalLine[], index: number, onAllDone: () => void) => {
      if (index >= lines.length) {
        onAllDone();
        return;
      }
      const line = lines[index];
      const isInstant = line.type === 'output' || line.type === 'error' || line.type === 'blank';
      const pauseBefore = index === 0 ? 400 : isInstant ? 80 : 300 + Math.random() * 500;
      const t = setTimeout(() => {
        typeTerminalLine(line, () => typeJoshLines(lines, index + 1, onAllDone), isInstant);
      }, pauseBefore);
      timersRef.current.push(t);
    },
    [typeTerminalLine],
  );

  // ── Exit animation ─────────────────────────────────────────────────────

  const startClosing = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setClosing(true);
    setShowCopilotPanel(false);
    const t = setTimeout(() => {
      sequence.onComplete();
    }, 700);
    timersRef.current.push(t);
  }, [sequence]);

  // ── Copilot message sequencer (typing + streaming) ─────────────────────

  const playCopilotMessages = useCallback(
    (msgs: CopilotMessage[], index: number) => {
      if (index >= msgs.length) {
        const t = setTimeout(startClosing, 1800);
        timersRef.current.push(t);
        return;
      }
      const msg = msgs[index];

      if (msg.role === 'user') {
        // Type message in input area character by character
        let i = 0;
        const typeChar = () => {
          if (i < msg.text.length) {
            setInputTypingBuffer(msg.text.slice(0, i + 1));
            i++;
            const delay = 22 + Math.random() * 38;
            const t = setTimeout(typeChar, delay);
            timersRef.current.push(t);
          } else {
            // Pause then "send"
            const t = setTimeout(() => {
              setCopilotMessages(prev => [...prev, msg]);
              setInputTypingBuffer('');
              const t2 = setTimeout(() => playCopilotMessages(msgs, index + 1), 500);
              timersRef.current.push(t2);
            }, 350);
            timersRef.current.push(t);
          }
        };
        const t = setTimeout(typeChar, 300);
        timersRef.current.push(t);
      } else {
        // Show thinking dots
        setShowTypingIndicator(true);
        const dotDelay = 700 + Math.random() * 500;
        const t = setTimeout(() => {
          setShowTypingIndicator(false);

          // Stream text word by word
          setCurrentStreamingMsg(msg);
          setShowStreamingFileEdit(false);
          setStreamingText('');
          let charIdx = 0;
          const fullText = msg.text;

          const streamWord = () => {
            if (charIdx < fullText.length) {
              // Find end of next word
              let end = fullText.indexOf(' ', charIdx + 1);
              if (end === -1) end = fullText.length;
              else end += 1;
              setStreamingText(fullText.slice(0, end));
              charIdx = end;
              const delay = 30 + Math.random() * 40;
              const t2 = setTimeout(streamWord, delay);
              timersRef.current.push(t2);
            } else {
              // Text done streaming
              if (msg.fileEdit) {
                // Show file edit after brief pause
                const t2 = setTimeout(() => {
                  setShowStreamingFileEdit(true);
                  // Wait for user to see file edit, then finalize
                  const t3 = setTimeout(() => {
                    setCopilotMessages(prev => [...prev, msg]);
                    setStreamingText('');
                    setCurrentStreamingMsg(null);
                    setShowStreamingFileEdit(false);
                    const t4 = setTimeout(() => playCopilotMessages(msgs, index + 1), 600);
                    timersRef.current.push(t4);
                  }, 1200);
                  timersRef.current.push(t3);
                }, 400);
                timersRef.current.push(t2);
              } else {
                // No file edit — finalize after pause
                const t2 = setTimeout(() => {
                  setCopilotMessages(prev => [...prev, msg]);
                  setStreamingText('');
                  setCurrentStreamingMsg(null);
                  const t3 = setTimeout(() => playCopilotMessages(msgs, index + 1), 600);
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
    },
    [startClosing],
  );

  // ── Trigger sequence ───────────────────────────────────────────────────

  useEffect(() => {
    if (!active || joshDone) return;
    typeJoshLines(sequence.joshLines, 0, () => {
      setJoshDone(true);
      setShowCopilotPanel(true);
      const t = setTimeout(() => playCopilotMessages(sequence.copilotMessages, 0), 450);
      timersRef.current.push(t);
    });
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // ── Render helpers ─────────────────────────────────────────────────────

  const renderPrompt = () => (
    <span style={{ color: '#4ec9b0' }}>PS C:\Users\josh\portfolio{'>'} </span>
  );

  const renderTerminalLine = (line: TerminalLine, i: number) => {
    const lineStyle: React.CSSProperties = { margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5, minHeight: '20px' };
    if (line.type === 'blank') return <p key={i} style={lineStyle}>&nbsp;</p>;
    if (line.type === 'prompt-cmd') {
      return <p key={i} style={lineStyle}>{renderPrompt()}<span style={{ color: '#cccccc' }}>{line.text}</span></p>;
    }
    if (line.type === 'error') {
      return <p key={i} style={lineStyle}><span style={{ color: '#f44747' }}>{line.text}</span></p>;
    }
    if (line.type === 'output') {
      return <p key={i} style={lineStyle}><span style={{ color: '#cccccc' }}>{line.text}</span></p>;
    }
    return <p key={i} style={lineStyle}><span style={{ color: '#808080' }}>{line.text}</span></p>;
  };

  const renderFileEdit = (fileEdit: FileEdit) => (
    <div style={{
      background: '#1a1a1a',
      borderRadius: '6px',
      border: '1px solid #333',
      overflow: 'hidden',
      marginTop: '8px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 10px',
        background: '#252526',
        borderBottom: '1px solid #333',
        fontSize: '11px',
        color: '#999',
        fontFamily: MONO_STACK,
      }}>
        <span>{fileEdit.fileName}</span>
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
      <div style={{
        padding: '4px 0',
        fontFamily: MONO_STACK,
        fontSize: '11px',
        lineHeight: 1.7,
      }}>
        {fileEdit.lines.map((line, j) => {
          const isAdd = line.startsWith('+');
          const isRemove = line.startsWith('-');
          return (
            <div key={j} style={{
              display: 'flex',
              alignItems: 'stretch',
              background: isAdd
                ? 'rgba(78, 201, 176, 0.06)'
                : isRemove
                  ? 'rgba(244, 71, 71, 0.06)'
                  : 'transparent',
              paddingLeft: '10px',
            }}>
              <span style={{
                width: '20px',
                textAlign: 'center' as const,
                color: isAdd ? '#4ec9b0' : isRemove ? '#f44747' : 'transparent',
                userSelect: 'none' as const,
                flexShrink: 0,
                fontWeight: 700,
              }}>{isAdd ? '+' : isRemove ? '\u2212' : ' '}</span>
              <span style={{
                color: isAdd ? '#4ec9b0' : isRemove ? '#f44747' : '#606060',
                opacity: isRemove ? 0.5 : 1,
                textDecoration: isRemove ? 'line-through' : 'none',
                paddingRight: '12px',
                whiteSpace: 'pre' as const,
              }}>{isAdd || isRemove ? line.slice(2) : line}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (!active && !closing) return null;

  // ── Terminal content ───────────────────────────────────────────────────

  const terminalContent = (
    <>
      {/* Blue accent separator */}
      <div style={{ height: '2px', background: '#007acc', flexShrink: 0 }} />

      {/* Title bar */}
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
            fontFamily: FONT_STACK,
            borderTop: '1px solid #007acc',
            borderRight: '1px solid #252526',
          }}>
            <TerminalIcon />
            <span>TERMINAL</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', paddingRight: '4px' }}>
          {['\u2013', '\u25A1', '\u00D7'].map((ch, idx) => (
            <span key={idx} style={{
              color: '#999', fontSize: '16px', padding: '0 8px',
              height: '35px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontFamily: FONT_STACK,
            }}>{ch}</span>
          ))}
        </div>
      </div>

      {/* Terminal body */}
      <div ref={terminalRef} style={{
        flex: 1,
        background: '#1e1e1e',
        color: '#cccccc',
        fontFamily: MONO_STACK,
        fontSize: '13px',
        padding: '8px 16px',
        overflowY: 'auto',
        lineHeight: 1.5,
      }}>
        {terminalLines.map((line, i) => renderTerminalLine(line, i))}

        {isTyping && typingBuffer && (
          <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5, minHeight: '20px' }}>
            {typingLineType === 'prompt-cmd' && renderPrompt()}
            <span style={{
              color: typingLineType === 'prompt-cmd' ? '#cccccc'
                : typingLineType === 'error' ? '#f44747' : '#808080',
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
    </>
  );

  // ── Copilot chat panel (minimal dark) ──────────────────────────────────

  const copilotPanel = (
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
      flexDirection: 'column',
      transform: showCopilotPanel ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
      fontFamily: FONT_STACK,
      boxShadow: showCopilotPanel ? '-4px 0 16px rgba(0,0,0,0.3)' : 'none',
    }}>
      {/* Header */}
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
          <CopilotSparkle size={16} />
          <span style={{ color: '#cccccc', fontSize: '13px', fontWeight: 600 }}>
            Copilot Chat
          </span>
        </div>
        <button type="button" style={{
          background: 'none', border: 'none', color: '#999',
          fontSize: '16px', cursor: 'default', padding: '2px 6px',
        }}>&times;</button>
      </div>

      {/* Messages */}
      <div ref={copilotMsgRef} style={{
        flex: 1, overflowY: 'auto', padding: '14px',
        display: 'flex', flexDirection: 'column', gap: '12px',
      }}>
        {copilotMessages.map((msg, i) => {
          if (msg.role === 'user') {
            return (
              <div key={i} style={{
                display: 'flex', justifyContent: 'flex-end',
                animation: 'vcMsgIn 0.25s ease-out',
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
              display: 'flex', flexDirection: 'column',
              alignItems: 'flex-start',
              animation: 'vcMsgIn 0.25s ease-out',
            }}>
              <div style={{
                fontSize: '11px', fontWeight: 600, color: '#888',
                marginBottom: '4px', marginLeft: '2px',
              }}>Copilot</div>
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
                {msg.fileEdit && renderFileEdit(msg.fileEdit)}
              </div>
            </div>
          );
        })}

        {/* Currently streaming assistant message */}
        {currentStreamingMsg && (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'flex-start',
            animation: 'vcMsgIn 0.25s ease-out',
          }}>
            <div style={{
              fontSize: '11px', fontWeight: 600, color: '#888',
              marginBottom: '4px', marginLeft: '2px',
            }}>Copilot</div>
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
                display: 'inline-block',
                width: '2px',
                height: '14px',
                background: '#d4d4d4',
                marginLeft: '2px',
                verticalAlign: 'text-bottom',
                animation: 'vcBlink 1s step-end infinite',
              }} />
              {showStreamingFileEdit && currentStreamingMsg.fileEdit && (
                <div style={{ animation: 'vcMsgIn 0.3s ease-out' }}>
                  {renderFileEdit(currentStreamingMsg.fileEdit)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Typing indicator (three dots) */}
        {showTypingIndicator && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '8px 4px',
            animation: 'vcMsgIn 0.25s ease-out',
          }}>
            {[0, 1, 2].map(di => (
              <span key={di} style={{
                width: '6px', height: '6px',
                background: '#666', borderRadius: '50%',
                animation: `vcDotPulse 1.4s ease-in-out ${di * 0.2}s infinite`,
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Input area */}
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
          fontFamily: FONT_STACK,
          minHeight: '20px',
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
              animation: 'vcBlink 1s step-end infinite',
            }} />
          )}
        </div>
      </div>
    </div>
  );

  // ── Error overlay ────────────────────────────────────────────────────────

  const errorOverlayEl = sequence.showError && sequence.errorOverlay ? (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(0, 0, 0, 0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    }}>
      {sequence.errorOverlay}
    </div>
  ) : null;

  return (
    <>
      {errorOverlayEl}

      {/* Terminal panel */}
      <div style={{
        position: embedded ? 'relative' : 'fixed',
        bottom: embedded ? undefined : 0,
        left: 0,
        right: showCopilotPanel ? '360px' : 0,
        height: embedded ? '40vh' : '40vh',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'right 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        animation: closing
          ? 'vcSlideDown 0.6s cubic-bezier(0.4, 0, 1, 1) forwards'
          : 'vcSlideUp 0.5s cubic-bezier(0, 0, 0.2, 1) forwards',
      }}>
        {terminalContent}
      </div>

      {/* Copilot panel */}
      {copilotPanel}

      {/* Keyframes */}
      <style>{`
        @keyframes vcBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes vcDotPulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes vcSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes vcSlideDown {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(100%); opacity: 0; }
        }
        @keyframes vcMsgIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default VibeCodingOverlay;
export type { VibeCodingOverlayProps };
