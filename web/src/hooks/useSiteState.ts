import { useState, useCallback, useEffect } from 'react';

export type SitePhase = 
  | 'loading'          // Act 1: The loading sequence
  | 'terrible'         // Act 1: The terrible template flash
  | 'reveal'           // Act 1: Template collapses, first room appears
  | 'intro'            // Act 2: Name reveal / intro room
  | 'lobby'            // Act 2: Main menu / lobby
  | 'about'            // Act 2: About Me room (includes work + education)
  | 'projects'         // Act 2: Projects room
  | 'underworld'       // Act 3: The infinite scroll
  | 'void'             // Hidden: The Void (accessed via chatbot)
  | 'debug'            // Hidden: Debug Mode (accessed via chatbot)
  | 'hamburger';       // Hidden: The Hamburger Dimension (accessed via chatbot)

export interface SiteState {
  phase: SitePhase;
  previousPhase: SitePhase | null;
  isFirstVisit: boolean;
  visitCount: number;
  scavengerHuntProgress: number[];
  hasSeenIntro: boolean;
  chatbotOpen: boolean;
}

const STORAGE_KEY = 'jh-portfolio-state';

function loadPersistedState(): Partial<SiteState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        visitCount: (parsed.visitCount || 0) + 1,
        isFirstVisit: false,
        hasSeenIntro: parsed.hasSeenIntro || false,
        scavengerHuntProgress: parsed.scavengerHuntProgress || [],
      };
    }
  } catch {}
  return {
    visitCount: 1,
    isFirstVisit: true,
    hasSeenIntro: false,
    scavengerHuntProgress: [],
  };
}

function persistState(state: SiteState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      visitCount: state.visitCount,
      hasSeenIntro: state.hasSeenIntro,
      scavengerHuntProgress: state.scavengerHuntProgress,
    }));
  } catch {}
}

export function useSiteState() {
  const [state, setState] = useState<SiteState>(() => {
    const persisted = loadPersistedState();
    return {
      // All visitors start at 'loading'; return visitors get a skip button in LoadingSequence
      phase: 'loading' as SitePhase,
      previousPhase: null,
      isFirstVisit: persisted.isFirstVisit ?? true,
      visitCount: persisted.visitCount ?? 1,
      scavengerHuntProgress: persisted.scavengerHuntProgress ?? [],
      hasSeenIntro: persisted.hasSeenIntro ?? false,
      chatbotOpen: false,
    };
  });

  useEffect(() => {
    persistState(state);
  }, [state.hasSeenIntro, state.scavengerHuntProgress, state.visitCount]);

  const setPhase = useCallback((phase: SitePhase) => {
    setState(prev => ({
      ...prev,
      previousPhase: prev.phase,
      phase,
      hasSeenIntro: phase === 'lobby' ? true : prev.hasSeenIntro,
    }));
  }, []);

  const toggleChatbot = useCallback(() => {
    setState(prev => ({ ...prev, chatbotOpen: !prev.chatbotOpen }));
  }, []);

  const setChatbotOpen = useCallback((open: boolean) => {
    setState(prev => ({ ...prev, chatbotOpen: open }));
  }, []);

  const collectClue = useCallback((clueId: number) => {
    setState(prev => {
      if (prev.scavengerHuntProgress.includes(clueId)) return prev;
      return {
        ...prev,
        scavengerHuntProgress: [...prev.scavengerHuntProgress, clueId],
      };
    });
  }, []);

  const skipToLobby = useCallback(() => {
    setState(prev => ({
      ...prev,
      previousPhase: prev.phase,
      phase: 'lobby',
      hasSeenIntro: true,
    }));
  }, []);

  return {
    state,
    setPhase,
    toggleChatbot,
    setChatbotOpen,
    collectClue,
    skipToLobby,
  };
}
