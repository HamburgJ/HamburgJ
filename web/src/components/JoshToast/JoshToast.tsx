import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SiteActivity } from '../../hooks/useSiteActivity';
import { getNextJoshToast, JoshToastMessage } from './joshToastMessages';

/* ──────────────────────────────────────────────────────────────────────
   JoshToast — terminal-style toast notification that looks like a
   message from Josh. Matches the "ok i think it's working now.."
   aesthetic from the lobby welcome banner.
   ────────────────────────────────────────────────────────────────────── */

interface JoshToastProps {
  activity: SiteActivity;
  onMessageShown: (messageId: string) => void;
}

const JoshToast: React.FC<JoshToastProps> = ({ activity, onMessageShown }) => {
  const [currentMessage, setCurrentMessage] = useState<JoshToastMessage | null>(null);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [typedText, setTypedText] = useState('');
  const cooldownRef = useRef(false);
  const shownRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      setExiting(false);
      setCurrentMessage(null);
      setTypedText('');
      cooldownRef.current = true;
      setTimeout(() => { cooldownRef.current = false; }, 12000);
    }, 500);
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!currentMessage || !visible) return;
    const text = currentMessage.text;
    let i = 0;
    setTypedText('');

    const tick = () => {
      if (i < text.length) {
        setTypedText(text.slice(0, i + 1));
        i++;
        timerRef.current = setTimeout(tick, 25 + Math.random() * 35);
      }
    };
    timerRef.current = setTimeout(tick, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentMessage, visible]);

  // Check for new messages
  useEffect(() => {
    if (visible || cooldownRef.current) return;

    const msg = getNextJoshToast(activity, shownRef.current);
    if (msg) {
      shownRef.current.add(msg.id);
      setCurrentMessage(msg);
      setVisible(true);
      onMessageShown(msg.id);

      const duration = msg.duration || 7000;
      const timer = setTimeout(dismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [activity.timeOnPage, activity.currentPage, activity.totalTime, visible, onMessageShown, dismiss, activity]);

  if (!visible || !currentMessage) return null;

  return (
    <>
      <style>{`
        @keyframes joshToastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes joshToastOut {
          from { opacity: 1; transform: translateX(-50%) translateY(0); }
          to { opacity: 0; transform: translateX(-50%) translateY(-8px); }
        }
        @keyframes joshCursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
      <div
        onClick={dismiss}
        style={{
          position: 'fixed',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: 480,
          fontFamily: '"SF Mono", "Fira Code", "Consolas", monospace',
          fontSize: '0.82rem',
          color: '#aaa',
          background: 'rgba(30, 30, 30, 0.92)',
          border: '1px solid #333',
          borderRadius: 8,
          padding: '10px 20px',
          zIndex: 9000,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          animation: exiting
            ? 'joshToastOut 0.5s ease forwards'
            : 'joshToastIn 0.5s ease forwards',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        <span style={{ color: '#666' }}>$</span>{' '}
        <span style={{ color: '#aaa' }}>{typedText}</span>
        {typedText.length < currentMessage.text.length && (
          <span style={{
            display: 'inline-block',
            width: 6,
            height: 13,
            background: '#aaa',
            marginLeft: 2,
            verticalAlign: 'text-bottom',
            animation: 'joshCursorBlink 1s step-end infinite',
          }} />
        )}
      </div>
    </>
  );
};

export default JoshToast;
