import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TerminalPanel } from './Shared/TerminalPanel';
import { CopilotAgentPanel } from './Shared/CopilotAgentPanel';
import { useTerminalTyper, TerminalLine } from './Shared/useTerminalTyper';
import { useAgentSequencer, AgentMessage } from './Shared/useAgentSequencer';
import { FileEditData } from './Shared/AgentParts';

// ── Types ────────────────────────────────────────────────────────────────────

export type { TerminalLine };

export interface FileEdit extends FileEditData {}

export interface CopilotMessage extends AgentMessage {}

export interface VibeStep {
  /** Terminal comment Josh makes before this step's copilot exchange */
  joshReaction: TerminalLine[];
  /** The copilot exchange for this step */
  copilotMessages: CopilotMessage[];
}

export interface VibeCodingSequence {
  /** Terminal lines Josh types before copilot opens */
  joshLines: TerminalLine[];
  /** Copilot conversation (used if steps is not provided) */
  copilotMessages: CopilotMessage[];
  /** Optional: multi-step copilot exchanges (plays sequentially after joshLines) */
  steps?: VibeStep[];
  /** Called after each step completes (step index passed) */
  onStepComplete?: (stepIndex: number) => void;
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

// ── Component ────────────────────────────────────────────────────────────────

const VibeCodingOverlay: React.FC<VibeCodingOverlayProps> = ({
  sequence,
  active,
  embedded = false,
}) => {
  // Use shared hooks
  const {
    terminalLines,
    typingBuffer,
    typingLineType,
    isTyping,
    typeLines,
    clearLines,
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

  // Local state for panel visibility & coordination
  const [showCopilotPanel, setShowCopilotPanel] = useState(false);
  const [joshDone, setJoshDone] = useState(false);
  const [closing, setClosing] = useState(false);
  
  const completedRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Reset on new sequence
  useEffect(() => {
    if (!active) {
      clearLines();
      resetAgent();
      setShowCopilotPanel(false);
      setJoshDone(false);
      setClosing(false);
      completedRef.current = false;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    }
  }, [active, clearLines, resetAgent]);

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

  // ── Multi-step sequencer ───────────────────────────────────────────────

  const playSteps = useCallback(
    (steps: VibeStep[], index: number) => {
      if (index >= steps.length) {
        // All steps done — close
        const t = setTimeout(startClosing, 1800);
        timersRef.current.push(t);
        return;
      }
      const step = steps[index];

      const afterReaction = () => {
        // Play this step's copilot messages
        playMessages(step.copilotMessages, 0, () => {
          // Step complete — notify and move to next
          if (sequence.onStepComplete) sequence.onStepComplete(index);
          const t = setTimeout(() => playSteps(steps, index + 1), 800);
          timersRef.current.push(t);
        });
      };

      // Type josh's reaction lines first (if any)
      if (step.joshReaction.length > 0) {
        typeLines(step.joshReaction, 0, afterReaction);
      } else {
        afterReaction();
      }
    },
    [startClosing, typeLines, playMessages, sequence],
  );

  // ── Trigger sequence ───────────────────────────────────────────────────

  useEffect(() => {
    if (!active || joshDone) return;
    
    // Start with Josh's initial lines
    typeLines(sequence.joshLines, 0, () => {
      setJoshDone(true);
      setShowCopilotPanel(true);

      if (sequence.steps && sequence.steps.length > 0) {
        // Multi-step mode
        const t = setTimeout(() => playSteps(sequence.steps!, 0), 450);
        timersRef.current.push(t);
      } else {
        // Single sequence mode (legacy)
        const t = setTimeout(() => 
          playMessages(sequence.copilotMessages, 0, () => {
             const t2 = setTimeout(startClosing, 1800);
             timersRef.current.push(t2);
          }), 
          450
        );
        timersRef.current.push(t);
      }
    });
    
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // ── Render helpers ─────────────────────────────────────────────────────

  if (!active && !closing) return null;

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
      <TerminalPanel
        className={closing ? 'vcSlideDown' : 'vcSlideUp'}
        style={{
          position: embedded ? 'relative' : 'fixed',
          bottom: embedded ? undefined : 0,
          left: 0,
          right: showCopilotPanel ? '360px' : 0,
          height: embedded ? '40vh' : '40vh',
          zIndex: 10000,
          transition: 'right 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
          animation: closing
            ? 'vcSlideDown 0.6s cubic-bezier(0.4, 0, 1, 1) forwards'
            : 'vcSlideUp 0.5s cubic-bezier(0, 0, 0.2, 1) forwards',
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
    </>
  );
};

export default VibeCodingOverlay;
export type { VibeCodingOverlayProps };
