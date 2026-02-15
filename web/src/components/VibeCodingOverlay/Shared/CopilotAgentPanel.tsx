import React, { useRef, useEffect } from 'react';
import { CopilotSparkle, PencilIcon, SHARED_KEYFRAMES } from './Icons';
import { FileEditBlock, ActionIndicator, FileEditData } from './AgentParts';

const FONT_STACK = 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export interface AgentMessage {
  role: 'user' | 'assistant';
  text: string;
  fileEdit?: FileEditData;
}

interface CopilotAgentPanelProps {
  visible: boolean;
  messages: AgentMessage[];
  streamingMessage: AgentMessage | null;
  streamingText: string;
  showStreamingFileEdit: boolean;
  isThinking: boolean;
  inputBuffer: string;
  width?: string;
  style?: React.CSSProperties;
  onClose?: () => void;
}

export const CopilotAgentPanel: React.FC<CopilotAgentPanelProps> = ({
  visible,
  messages,
  streamingMessage,
  streamingText,
  showStreamingFileEdit,
  isThinking,
  inputBuffer,
  width = '360px',
  style,
  onClose
}) => {
  const msgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (msgRef.current) {
      msgRef.current.scrollTop = msgRef.current.scrollHeight;
    }
  }, [messages, isThinking, streamingText, inputBuffer]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width,
      height: '100vh',
      background: '#1e1e1e',
      borderLeft: '1px solid #333',
      zIndex: 10001,
      display: 'flex',
      flexDirection: 'column',
      transform: visible ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
      fontFamily: FONT_STACK,
      boxShadow: visible ? '-4px 0 16px rgba(0,0,0,0.3)' : 'none',
      ...style
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
            Copilot
          </span>
        </div>
        <button type="button" onClick={onClose} style={{
          background: 'none', border: 'none', color: '#999',
          fontSize: '16px', cursor: 'default', padding: '2px 6px',
        }}>&times;</button>
      </div>

      {/* Agent activity log */}
      <div ref={msgRef} style={{
        flex: 1, overflowY: 'auto', padding: '12px 16px',
        display: 'flex', flexDirection: 'column', gap: '2px',
      }}>
        {messages.map((msg, i) => {
          if (msg.role === 'user') {
            // User prompt — shown as a task block
            return (
              <div key={i} style={{
                padding: '10px 12px',
                background: '#1a1a2e',
                border: '1px solid #2a2a3e',
                borderRadius: '6px',
                marginBottom: '10px',
                animation: 'vcFadeIn 0.25s ease-out',
              }}>
                <div style={{
                  color: '#ccc',
                  fontSize: '13px',
                  lineHeight: 1.5,
                }}>{msg.text}</div>
              </div>
            );
          }
          // Assistant — flat agent-style output with inline actions
          return (
            <div key={i} style={{
              marginBottom: '8px',
              animation: 'vcFadeIn 0.25s ease-out',
            }}>
              <div style={{
                color: '#d4d4d4',
                fontSize: '13px',
                lineHeight: 1.6,
                padding: '2px 0',
              }}>{msg.text}</div>
              {msg.fileEdit && <FileEditBlock fileEdit={msg.fileEdit} done={true} />}
            </div>
          );
        })}

        {/* Currently streaming assistant message */}
        {streamingMessage && (
          <div style={{
            marginBottom: '8px',
            animation: 'vcFadeIn 0.25s ease-out',
          }}>
            <div style={{
              color: '#d4d4d4',
              fontSize: '13px',
              lineHeight: 1.6,
              padding: '2px 0',
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
            </div>
            {showStreamingFileEdit && streamingMessage.fileEdit && (
              <div style={{ animation: 'vcFadeIn 0.3s ease-out' }}>
                <FileEditBlock fileEdit={streamingMessage.fileEdit} done={false} />
              </div>
            )}
          </div>
        )}

        {/* Thinking indicator */}
        {isThinking && (
          <div style={{ animation: 'vcFadeIn 0.25s ease-out' }}>
            <ActionIndicator label="Thinking..." spinning={true} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div style={{
        borderTop: '1px solid #333',
        padding: '8px 14px',
        background: '#252526',
        flexShrink: 0,
      }}>
        <div style={{
          background: '#2d2d2d',
          border: '1px solid #3c3c3c',
          borderRadius: '6px',
          padding: '8px 12px',
          fontSize: '13px',
          fontFamily: FONT_STACK,
          minHeight: '20px',
          color: inputBuffer ? '#e0e0e0' : '#555',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <PencilIcon />
          <span style={{ flex: 1 }}>
            {inputBuffer || 'Ask Copilot to do something...'}
            {inputBuffer && (
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
          </span>
        </div>
      </div>
      
      <style>{SHARED_KEYFRAMES}</style>
    </div>
  );
};
