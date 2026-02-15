import { useState, useCallback, useEffect, useRef } from 'react';

/* ──────────────────────────────────────────────────────────────────────
   useSiteActivity — tracks everything the visitor does so the chatbot
   and Josh toast system can react intelligently.
   ────────────────────────────────────────────────────────────────────── */

export interface SiteActivity {
  /** Pages the user has visited (in order, with dupes) */
  pagesVisited: string[];
  /** Unique set of pages visited */
  uniquePages: Set<string>;
  /** Current page */
  currentPage: string;
  /** How many seconds on the current page */
  timeOnPage: number;
  /** Total seconds on site this session */
  totalTime: number;
  /** Number of total page navigations */
  navCount: number;
  /** Whether the chatbot has been opened */
  chatbotOpened: boolean;
  /** Whether the user clicked "Add to Cart" */
  clickedAddToCart: boolean;
  /** Whether the user scrolled to underworld */
  reachedUnderworld: boolean;
  /** Whether the user opened the documents drawer */
  openedDocumentsDrawer: boolean;
  /** How many times user has visited the site (persisted) */
  lifetimeVisits: number;
  /** Whether this is a return visitor */
  isReturnVisitor: boolean;
  /** Hour of the day 0-23 */
  hour: number;
  /** Day of week 0-6 (Sun-Sat) */
  dayOfWeek: number;
  /** Whether user is on mobile */
  isMobile: boolean;
  /** Whether Siri mode is active */
  siriMode: boolean;
  /** Messages that have been shown (by id) */
  shownMessages: Set<string>;
}

const ACTIVITY_STORAGE_KEY = 'jh-site-activity';

function loadPersistedActivity(): Partial<SiteActivity> {
  try {
    const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        lifetimeVisits: (parsed.lifetimeVisits || 0) + 1,
        isReturnVisitor: true,
        shownMessages: new Set(parsed.shownMessages || []),
        siriMode: parsed.siriMode || false,
      };
    }
  } catch {}
  return {
    lifetimeVisits: 1,
    isReturnVisitor: false,
    shownMessages: new Set(),
    siriMode: false,
  };
}

function persistActivity(activity: SiteActivity) {
  try {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify({
      lifetimeVisits: activity.lifetimeVisits,
      shownMessages: Array.from(activity.shownMessages),
      siriMode: activity.siriMode,
    }));
  } catch {}
}

export function useSiteActivity() {
  const persisted = useRef(loadPersistedActivity());
  
  const [activity, setActivity] = useState<SiteActivity>(() => ({
    pagesVisited: [],
    uniquePages: new Set(),
    currentPage: 'loading',
    timeOnPage: 0,
    totalTime: 0,
    navCount: 0,
    chatbotOpened: false,
    clickedAddToCart: false,
    reachedUnderworld: false,
    openedDocumentsDrawer: false,
    lifetimeVisits: persisted.current.lifetimeVisits ?? 1,
    isReturnVisitor: persisted.current.isReturnVisitor ?? false,
    hour: new Date().getHours(),
    dayOfWeek: new Date().getDay(),
    isMobile: window.innerWidth < 600,
    siriMode: persisted.current.siriMode ?? false,
    shownMessages: persisted.current.shownMessages ?? new Set(),
  }));

  // Timer for time tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setActivity(prev => ({
        ...prev,
        timeOnPage: prev.timeOnPage + 1,
        totalTime: prev.totalTime + 1,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Persist on changes
  useEffect(() => {
    persistActivity(activity);
  }, [activity.shownMessages.size, activity.siriMode, activity.lifetimeVisits]);

  const trackPageVisit = useCallback((page: string) => {
    setActivity(prev => ({
      ...prev,
      currentPage: page,
      pagesVisited: [...prev.pagesVisited, page],
      uniquePages: new Set(Array.from(prev.uniquePages).concat(page)),
      navCount: prev.navCount + 1,
      timeOnPage: 0,
    }));
  }, []);

  const trackAction = useCallback((action: string) => {
    setActivity(prev => {
      const updates: Partial<SiteActivity> = {};
      if (action === 'chatbot_opened') updates.chatbotOpened = true;
      if (action === 'add_to_cart') updates.clickedAddToCart = true;
      if (action === 'underworld') updates.reachedUnderworld = true;
      if (action === 'documents_drawer') updates.openedDocumentsDrawer = true;
      return { ...prev, ...updates };
    });
  }, []);

  const markMessageShown = useCallback((messageId: string) => {
    setActivity(prev => {
      const next = new Set(prev.shownMessages);
      next.add(messageId);
      return { ...prev, shownMessages: next };
    });
  }, []);

  const toggleSiriMode = useCallback(() => {
    setActivity(prev => ({ ...prev, siriMode: !prev.siriMode }));
  }, []);

  return {
    activity,
    trackPageVisit,
    trackAction,
    markMessageShown,
    toggleSiriMode,
  };
}
