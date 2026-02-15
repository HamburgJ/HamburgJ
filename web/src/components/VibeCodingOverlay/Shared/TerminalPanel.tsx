import React, { useRef, useEffect } from 'react';
import { TerminalIcon, SHARED_KEYFRAMES } from './Icons';
import { TerminalLine } from './useTerminalTyper';

const FONT_STACK = 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const MONO_STACK = '"Cascadia Code", Consolas, "Courier New", monospace';

interface TerminalPanelProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string; // For keyframe animations
  title?: string;
  height?: string | number;
  
  // Optional: Pass these to let TerminalPanel render the content automatically
  lines?: TerminalLine[];
  typingBuffer?: string;
  isTyping?: boolean; // alias for showTypingCursor
  showTypingCursor?: boolean;
  typingLineType?: TerminalLine['type'];
}

export const TerminalPanel: React.FC<TerminalPanelProps> = ({ 
  children, 
  style, 
  className,
  title = "TERMINAL",
  height,
  lines,
  typingBuffer,
  isTyping,
  showTypingCursor,
  typingLineType
}) => {
  const showCursor = showTypingCursor ?? isTyping;
  const bodyRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines, typingBuffer, children]);

  const renderContent = () => {
    if (children) return children;
    
    if (!lines) return null;

    const renderPrompt = () => (
      <span style={{ color: '#4ec9b0' }}>~/portfolio $ </span>
    );

    return (
      <div style={{ padding: '8px 16px 24px' }}>
        {lines.map((line, i) => {
          const lineStyle: React.CSSProperties = { margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5, minHeight: '20px', fontFamily: MONO_STACK, fontSize: '13px' };
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
          // comment
          return <p key={i} style={lineStyle}><span style={{ color: '#a0a0a0' }}>{line.text}</span></p>;
        })}

        {/* Current Typing Buffer */}
        {typingBuffer && (
           <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5, minHeight: '20px', fontFamily: MONO_STACK, fontSize: '13px' }}>
             {/* Render prompt if typing a command */}
             {typingLineType === 'prompt-cmd' && renderPrompt()}

             <span style={{
               color: typingLineType === 'prompt-cmd' ? '#cccccc'
                 : typingLineType === 'error' ? '#f44747'
                 : typingLineType === 'output' ? '#cccccc' 
                 : '#a0a0a0'
             }}>
               {typingBuffer}
             </span>
             
             {showCursor && (
               <span style={{
                 display: 'inline-block', width: '7px', height: '14px',
                 background: '#cccccc', marginLeft: '2px', verticalAlign: 'text-bottom',
                 animation: 'vcBlink 1s step-end infinite',
               }} />
             )}
           </p>
        )}
      </div>
    );
  };

  return (
    <div className={className} style={{
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: '#1e1e1e', 
      height: height,
      ...style
    }}>
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
            cursor: 'default'
          }}>
            <TerminalIcon />
            <span>{title}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', paddingRight: '4px' }}>
          {['\u2013', '\u25A1', '\u00D7'].map((ch, idx) => (
            <span key={idx} style={{
              color: '#999', fontSize: '16px', padding: '0 8px',
              height: '35px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontFamily: FONT_STACK,
              cursor: 'default'
            }}>{ch}</span>
          ))}
        </div>
      </div>

      {/* Terminal body */}
      <div ref={bodyRef} style={{
        flex: 1,
        background: '#1e1e1e',
        color: '#cccccc',
        overflowY: 'auto',
        position: 'relative',
      }}>
        {renderContent()}
      </div>

      {/* Shared keyframes for blink, slide, spin, fade */}
      <style>{SHARED_KEYFRAMES}</style>
    </div>
  );
};
