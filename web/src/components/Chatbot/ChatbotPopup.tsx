import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SiteActivity } from '../../hooks/useSiteActivity';
import { getNextPopupMessage, ChatbotPopupMessage } from './chatbotMessages';
import buddyIconImg from '../../assets/images/chatbot/aim-buddy-icon-crystal.png';

/* ──────────────────────────────────────────────────────────────────────
   ChatbotPopup — floating notification from JoshBot that appears
   based on site activity. Styled like an AIM toast notification.
   ────────────────────────────────────────────────────────────────────── */

interface ChatbotPopupProps {
  activity: SiteActivity;
  onMessageShown: (messageId: string) => void;
  siriMode?: boolean;
}

const ChatbotPopup: React.FC<ChatbotPopupProps> = ({ activity, onMessageShown, siriMode = false }) => {
  const [currentMessage, setCurrentMessage] = useState<ChatbotPopupMessage | null>(null);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const cooldownRef = useRef(false);
  const lastCheckRef = useRef(0);
  // Track the page where a message was dismissed — suppress further popups on that page
  const dismissedOnPageRef = useRef<string | null>(null);

  const dismiss = useCallback(() => {
    dismissedOnPageRef.current = activity.currentPage;
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      setExiting(false);
      setCurrentMessage(null);
      cooldownRef.current = true;
      setTimeout(() => { cooldownRef.current = false; }, 15000);
    }, 400);
  }, [activity.currentPage]);

  // Reset dismissed-on-page when the user navigates to a new page
  useEffect(() => {
    dismissedOnPageRef.current = null;
  }, [activity.currentPage]);

  // Check for new messages every 2 seconds
  useEffect(() => {
    if (visible || cooldownRef.current) return;
    // Don't show another popup if the user dismissed one on this page
    if (dismissedOnPageRef.current === activity.currentPage) return;

    const now = Date.now();
    if (now - lastCheckRef.current < 2000) return;
    lastCheckRef.current = now;

    const msg = getNextPopupMessage(activity);
    if (msg) {
      setCurrentMessage(msg);
      setVisible(true);
      onMessageShown(msg.id);

      // Auto-dismiss after duration
      const duration = msg.duration || 8000;
      const timer = setTimeout(dismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [activity, visible, onMessageShown, dismiss]);

  if (!visible || !currentMessage) return null;

  if (siriMode) {
    return (
      <>
        <style>{`
          @keyframes siriPopupIn {
            from { opacity: 0; transform: translateY(10px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes siriPopupOut {
            from { opacity: 1; transform: translateY(0) scale(1); }
            to { opacity: 0; transform: translateY(-10px) scale(0.95); }
          }
        `}</style>
        <div
          onClick={dismiss}
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            maxWidth: 320,
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 16,
            padding: '14px 18px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
            zIndex: 9999,
            cursor: 'pointer',
            animation: exiting ? 'siriPopupOut 0.4s ease forwards' : 'siriPopupIn 0.4s ease forwards',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            border: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #5AC8FA, #007AFF, #AF52DE)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: '#fff', fontWeight: 700,
          }}>S</div>
          <div>
            <div style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
              fontSize: 11, fontWeight: 600, color: '#86868b', marginBottom: 3,
              letterSpacing: '0.02em',
            }}>Siri</div>
            <div style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
              fontSize: 13, color: '#1d1d1f', lineHeight: 1.4,
            }}>{currentMessage.text}</div>
          </div>
        </div>
      </>
    );
  }

  // Default AIM-style popup
  return (
    <>
      <style>{`
        @keyframes aimPopupIn {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes aimPopupOut {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(30px); }
        }
      `}</style>
      <div
        onClick={dismiss}
        style={{
          position: 'fixed',
          bottom: 96,
          right: 28,
          maxWidth: 300,
          background: 'linear-gradient(180deg, #d9e4f1 0%, #c0d0e4 100%)',
          border: '2px outset #8ea4bf',
          borderRadius: 0,
          overflow: 'hidden',
          boxShadow: '2px 4px 12px rgba(0,0,0,0.25)',
          zIndex: 9999,
          cursor: 'pointer',
          animation: exiting ? 'aimPopupOut 0.4s ease forwards' : 'aimPopupIn 0.4s ease forwards',
        }}
      >
        {/* AIM-style title bar */}
        <div style={{
          height: 20,
          background: 'linear-gradient(180deg, #0a246a 0%, #3a6ea5 100%)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 6px',
          gap: 6,
        }}>
          <span style={{
            fontFamily: "'Tahoma', sans-serif",
            fontSize: 9,
            color: '#fff',
            fontWeight: 700,
            textShadow: '1px 1px 1px rgba(0,0,0,0.4)',
          }}>JoshBot — New Message!</span>
        </div>
        {/* Body */}
        <div style={{
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
        }}>
          <img
            src={buddyIconImg}
            alt="JoshBot"
            style={{
              width: 32, height: 32, borderRadius: 0, flexShrink: 0,
              border: '1px solid #7a8fa6',
              filter: 'blur(1px) saturate(1.3)',
            }}
            draggable={false}
          />
          <div style={{
            fontFamily: "'Trebuchet MS', 'Tahoma', sans-serif",
            fontSize: 12,
            color: '#222',
            lineHeight: 1.45,
          }}>{currentMessage.text}</div>
        </div>
      </div>
    </>
  );
};

export default ChatbotPopup;
