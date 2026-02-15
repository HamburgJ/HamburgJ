import { useState, useCallback, useRef, useEffect } from 'react';

export interface TerminalLine {
  type: 'prompt-cmd' | 'output' | 'error' | 'blank' | 'comment';
  text: string;
}

export function useTerminalTyper() {
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [typingBuffer, setTypingBuffer] = useState('');
  const [typingLineType, setTypingLineType] = useState<TerminalLine['type']>('comment');
  const [isTyping, setIsTyping] = useState(false);
  
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearLines = useCallback(() => {
    setTerminalLines([]);
    setTypingBuffer('');
    setIsTyping(false);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const typeLine = useCallback(
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

  const typeLines = useCallback(
    (lines: TerminalLine[], index: number, onAllDone: () => void) => {
      if (index >= lines.length) {
        onAllDone();
        return;
      }
      const line = lines[index];
      const isInstant = line.type === 'output' || line.type === 'error' || line.type === 'blank';
      const pauseBefore = index === 0 ? 400 : isInstant ? 80 : 300 + Math.random() * 500;
      
      const t = setTimeout(() => {
        typeLine(line, () => typeLines(lines, index + 1, onAllDone), isInstant);
      }, pauseBefore);
      timersRef.current.push(t);
    },
    [typeLine],
  );

  useEffect(() => {
    return () => {
        timersRef.current.forEach(clearTimeout);
    };
  }, []);

  return {
    terminalLines,
    typingBuffer,
    typingLineType,
    isTyping,
    typeLines,
    clearLines,
    setTerminalLines // Exposed for manual updates if needed
  };
}
