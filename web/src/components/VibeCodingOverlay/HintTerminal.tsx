import React, { useEffect, useState, useRef } from 'react';
import { TerminalPanel } from './Shared/TerminalPanel';
import { useTerminalTyper } from './Shared/useTerminalTyper';

interface HintTerminalProps {
  lines: string[];
  visible: boolean;
}

const HintTerminal: React.FC<HintTerminalProps> = ({ lines, visible }) => {
  const { 
    terminalLines, 
    typingBuffer, 
    isTyping, 
    typingLineType, 
    typeLine, 
    clearLines 
  } = useTerminalTyper();

  const [hasStarted, setHasStarted] = useState(false);
  const queueRef = useRef<string[]>([]);
  const processingRef = useRef(false);

  // Reset when visibility changes
  useEffect(() => {
    if (!visible) {
      clearLines();
      setHasStarted(false);
      processingRef.current = false;
      queueRef.current = [];
    } else {
      // 600ms start delay matching original animation
      const t = setTimeout(() => {
        setHasStarted(true);
        queueRef.current = [...lines];
        processQueue();
      }, 600);
      return () => clearTimeout(t);
    }
  }, [visible, lines, clearLines]);

  const processQueue = () => {
    if (processingRef.current || queueRef.current.length === 0) return;
    
    processingRef.current = true;
    const nextText = queueRef.current.shift()!;
    
    typeLine(
      { type: 'comment', text: nextText },
      () => {
        processingRef.current = false;
        // Small pause between lines
        setTimeout(processQueue, 300); 
      }
    );
  };

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
        animation: 'htSlideUp 0.4s cubic-bezier(0, 0, 0.2, 1) forwards',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
      }}>
        <TerminalPanel
          title="josh@portfolio: hints"
          lines={terminalLines}
          typingBuffer={typingBuffer}
          showTypingCursor={isTyping} 
          typingLineType={typingLineType}
          height="100%"
        />
      </div>
      <style>{`
        @keyframes htSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default HintTerminal;
