import { useState, useCallback, useRef, useEffect } from 'react';
import { FileEditData } from './AgentParts';

export interface AgentMessage {
  role: 'user' | 'assistant';
  text: string;
  fileEdit?: FileEditData;
}

interface UseAgentSequencerProps {
  onSequenceComplete?: () => void;
  onStepComplete?: (index: number) => void;
}

export function useAgentSequencer({ onSequenceComplete, onStepComplete }: UseAgentSequencerProps = {}) {
  const [copilotMessages, setCopilotMessages] = useState<AgentMessage[]>([]);
  const [inputTypingBuffer, setInputTypingBuffer] = useState('');
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [currentStreamingMsg, setCurrentStreamingMsg] = useState<AgentMessage | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const [showStreamingFileEdit, setShowStreamingFileEdit] = useState(false);
  
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const reset = useCallback(() => {
    setCopilotMessages([]);
    setInputTypingBuffer('');
    setShowTypingIndicator(false);
    setCurrentStreamingMsg(null);
    setStreamingText('');
    setShowStreamingFileEdit(false);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const playMessages = useCallback((msgs: AgentMessage[], startIndex: number = 0, onAllDone?: () => void) => {
    const runSequence = (index: number) => {
      if (index >= msgs.length) {
        if (onAllDone) onAllDone();
        else if (onSequenceComplete) onSequenceComplete();
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
              if (onStepComplete) onStepComplete(index);
              const t2 = setTimeout(() => runSequence(index + 1), 500);
              timersRef.current.push(t2);
            }, 350);
            timersRef.current.push(t);
          }
        };
       
        // Initial pause before typing starts
        const t = setTimeout(typeChar, 300);
        timersRef.current.push(t);

      } else {
        // Assistant: Show thinking indicator
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
              const finishStep = () => {
                  setCopilotMessages(prev => [...prev, msg]);
                  setStreamingText('');
                  setCurrentStreamingMsg(null);
                  setShowStreamingFileEdit(false);
                  if (onStepComplete) onStepComplete(index);
                  const tNext = setTimeout(() => runSequence(index + 1), 600);
                  timersRef.current.push(tNext);
              };

              if (msg.fileEdit) {
                // Show file edit after brief pause
                const t2 = setTimeout(() => {
                  setShowStreamingFileEdit(true);
                  // Wait for user to see file edit, then finalize
                  const t3 = setTimeout(finishStep, 1200);
                  timersRef.current.push(t3);
                }, 400);
                timersRef.current.push(t2);
              } else {
                // No file edit — finalize after pause
                const t2 = setTimeout(finishStep, 400);
                timersRef.current.push(t2);
              }
            }
          };
          streamWord();
        }, dotDelay);
        timersRef.current.push(t);
      }
    };

    runSequence(startIndex);
  }, [onSequenceComplete, onStepComplete]);

  return {
    copilotMessages,
    inputTypingBuffer,
    showTypingIndicator,
    currentStreamingMsg,
    streamingText,
    showStreamingFileEdit,
    playMessages,
    reset,
    setCopilotMessages // Exposed for occasional direct manipulation if needed
  };
}
