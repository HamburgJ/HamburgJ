import React, { useCallback, useState, useEffect } from 'react';
import { useSiteState, SitePhase } from './hooks/useSiteState';
import { useSiteActivity } from './hooks/useSiteActivity';
import LoadingSequence from './components/LoadingSequence/LoadingSequence';
import TerribleTemplate from './components/TerribleTemplate/TerribleTemplate';
import Lobby from './components/Lobby/Lobby';
import AboutRoom from './components/Rooms/AboutRoom/AboutRoom';
import ProjectsRoom from './components/Rooms/ProjectsRoom/ProjectsRoom';
import Chatbot from './components/Chatbot/Chatbot';
import SiriChatbot from './components/Chatbot/SiriChatbot';
import ChatbotPopup from './components/Chatbot/ChatbotPopup';
import VoidPage from './components/HiddenPages/VoidPage';
import DebugPage from './components/HiddenPages/DebugPage';
import HamburgerPage from './components/HiddenPages/HamburgerPage';
import './index.css';

const App: React.FC = () => {
  const {
    state,
    setPhase,
    toggleChatbot,
    setChatbotOpen,
    collectClue,
    skipToLobby,
  } = useSiteState();

  const { activity, trackPageVisit, trackAction, markMessageShown, toggleSiriMode } = useSiteActivity();

  const [transitioning, setTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState('');

  // Track page visits when phase changes
  useEffect(() => {
    trackPageVisit(state.phase);
  }, [state.phase, trackPageVisit]);

  // Track chatbot opens
  useEffect(() => {
    if (state.chatbotOpen) {
      trackAction('chatbot_opened');
    }
  }, [state.chatbotOpen, trackAction]);

  const navigateTo = useCallback((phase: SitePhase) => {
    const type = phase === 'about' ? 'saas'
      : phase === 'terrible' ? 'glitch'
      : phase === 'projects' ? 'fade'
      : 'fade';

    setTransitionType(type);
    setTransitioning(true);

    setTimeout(() => {
      setPhase(phase);
      window.scrollTo(0, 0);
      setTimeout(() => setTransitioning(false), 400);
    }, 400);
  }, [setPhase]);

  const renderPhase = () => {
    switch (state.phase) {
      case 'loading':
        return (
          <LoadingSequence
            isFirstVisit={state.isFirstVisit}
            onComplete={() => setPhase('terrible')}
            onSkip={skipToLobby}
          />
        );

      case 'terrible':
        return (
          <TerribleTemplate
            onComplete={() => setPhase(state.previousPhase === 'lobby' ? 'lobby' : 'about')}
          />
        );

      case 'intro':
      case 'reveal':
        return (
          <div style={{
            minHeight: '100vh',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 1.5s ease forwards',
          }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: 800,
              letterSpacing: '-2px',
              color: '#1a1a1a',
              textAlign: 'center',
              opacity: 0,
              animation: 'fadeUp 1s ease 0.5s forwards',
            }}>
              Joshua Hamburger
            </h1>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
              color: '#666',
              marginTop: '16px',
              textAlign: 'center',
              opacity: 0,
              animation: 'fadeUp 1s ease 1.2s forwards',
            }}>
              Injecting the human condition into unwitting robots.
            </p>
            <button
              onClick={() => navigateTo('lobby')}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                fontWeight: 500,
                color: '#999',
                marginTop: '60px',
                padding: '12px 32px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                background: 'transparent',
                cursor: 'pointer',
                opacity: 0,
                animation: 'fadeUp 0.8s ease 2s forwards',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#999';
                e.currentTarget.style.color = '#333';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.color = '#999';
              }}
            >
              Enter
            </button>
            <style>{`
              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
              @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
          </div>
        );

      case 'lobby':
        return (
          <Lobby
            navigateTo={navigateTo}
          />
        );

      case 'about':
        return (
          <AboutRoom
            navigateTo={navigateTo}
          />
        );

      case 'projects':
        return (
          <ProjectsRoom
            navigateTo={navigateTo}
          />
        );

      case 'void':
        return (
          <VoidPage
            navigateTo={navigateTo}
          />
        );

      case 'debug':
        return (
          <DebugPage
            navigateTo={navigateTo}
          />
        );

      case 'hamburger':
        return (
          <HamburgerPage
            navigateTo={navigateTo}
          />
        );

      default:
        return null;
    }
  };

  // Phases where chatbot & popups should be available
  const chatbotPhases: SitePhase[] = ['lobby', 'about', 'projects', 'void', 'debug', 'hamburger'];
  const showChatbot = chatbotPhases.includes(state.phase);

  return (
    <>
      {renderPhase()}
      
      {/* Chatbot — available on main pages, switches between JoshBot and Siri */}
      {showChatbot && (
        activity.siriMode ? (
          <SiriChatbot
            isOpen={state.chatbotOpen}
            onToggle={toggleChatbot}
            onClose={() => setChatbotOpen(false)}
            collectClue={collectClue}
            navigateTo={navigateTo as (phase: string) => void}
            onSiriMode={toggleSiriMode}
          />
        ) : (
          <Chatbot
            isOpen={state.chatbotOpen}
            onToggle={toggleChatbot}
            onClose={() => setChatbotOpen(false)}
            collectClue={collectClue}
            navigateTo={navigateTo as (phase: string) => void}
            onSiriMode={toggleSiriMode}
          />
        )
      )}

      {/* Chatbot popup notifications — context-aware messages */}
      {showChatbot && (
        <ChatbotPopup
          activity={activity}
          onMessageShown={markMessageShown}
          siriMode={activity.siriMode}
        />
      )}

      {/* Room transition overlay */}
      {transitioning && (
        <div className={`transition-overlay transition-${transitionType}`} />
      )}

      <style>{`
        .transition-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          pointer-events: none;
        }
        .transition-fade {
          background: #ffffff;
          animation: transitionFade 800ms ease forwards;
        }
        @keyframes transitionFade {
          0%   { opacity: 0; }
          40%  { opacity: 1; }
          60%  { opacity: 1; }
          100% { opacity: 0; }
        }
        .transition-glitch {
          background: #111;
          animation: transitionGlitch 700ms steps(1) forwards;
        }
        @keyframes transitionGlitch {
          0%    { opacity: 1; transform: translate(0, 0); }
          10%   { opacity: 0; transform: translate(-4px, 2px); }
          20%   { opacity: 1; transform: translate(3px, -3px); }
          30%   { opacity: 0; transform: translate(0, 0); }
          40%   { opacity: 1; transform: translate(-2px, 4px); }
          50%   { opacity: 0; transform: translate(5px, -1px); }
          60%   { opacity: 1; transform: translate(-3px, 0); }
          70%   { opacity: 0; transform: translate(0, 3px); }
          80%   { opacity: 1; transform: translate(2px, -2px); }
          90%   { opacity: 0; transform: translate(-1px, 1px); }
          100%  { opacity: 0; transform: translate(0, 0); }
        }
      `}</style>
    </>
  );
};

export default App; 