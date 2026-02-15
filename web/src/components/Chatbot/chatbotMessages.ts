import { SiteActivity } from '../../hooks/useSiteActivity';

/* ──────────────────────────────────────────────────────────────────────
   Chatbot Popup Messages — context-aware messages that appear as
   floating notifications from JoshBot, triggered by site activity.
   ────────────────────────────────────────────────────────────────────── */

export interface ChatbotPopupMessage {
  id: string;
  text: string;
  /** Priority: higher = shown first when multiple match */
  priority: number;
  /** How long to show the message in ms */
  duration?: number;
  /** Only show once per session */
  once?: boolean;
  /** Condition to check */
  condition: (activity: SiteActivity) => boolean;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const CHATBOT_POPUP_MESSAGES: ChatbotPopupMessage[] = [
  // ── TIME-BASED GREETINGS ──────────────────────────────────────────
  {
    id: 'late-night',
    text: pick([
      "it's past midnight. you should be sleeping. (i don't sleep, but that's my problem)",
      "debugging at this hour? respect. also: go to bed.",
      "late night browsing? i've been here since deployment. we're not the same.",
    ]),
    priority: 90,
    once: true,
    condition: (a) => a.hour >= 0 && a.hour < 5 && a.currentPage === 'lobby',
  },
  {
    id: 'early-bird',
    text: "good morning! you're up early. or you never went to sleep. i don't judge.",
    priority: 80,
    once: true,
    condition: (a) => a.hour >= 5 && a.hour < 7 && a.currentPage === 'lobby',
  },
  {
    id: 'lunch-time',
    text: "it's lunchtime! josh is probably eating a hamburger. statistically likely.",
    priority: 40,
    once: true,
    condition: (a) => a.hour >= 11 && a.hour < 13 && a.totalTime > 5,
  },
  {
    id: 'friday-deploy',
    text: "happy friday! josh might be deploying to prod right now. prayers up. 🙏",
    priority: 70,
    once: true,
    condition: (a) => a.dayOfWeek === 5 && a.currentPage === 'lobby',
  },
  {
    id: 'weekend',
    text: pick([
      "browsing portfolios on a weekend? recruiter mode activated.",
      "it's the weekend! josh is probably building another side project right now.",
    ]),
    priority: 50,
    once: true,
    condition: (a) => (a.dayOfWeek === 0 || a.dayOfWeek === 6) && a.currentPage === 'lobby',
  },

  // ── RETURN VISITOR ────────────────────────────────────────────────
  {
    id: 'return-visitor-2',
    text: "oh hey, you're back! missed me? i've been running in an empty browser tab.",
    priority: 95,
    once: true,
    condition: (a) => a.isReturnVisitor && a.lifetimeVisits === 2 && a.currentPage === 'lobby',
  },
  {
    id: 'return-visitor-3',
    text: "third visit! at this point we're basically friends. should i add you to my buddy list?",
    priority: 95,
    once: true,
    condition: (a) => a.isReturnVisitor && a.lifetimeVisits === 3 && a.currentPage === 'lobby',
  },
  {
    id: 'return-visitor-many',
    text: pick([
      `you've been here ${Math.floor(Math.random() * 5) + 5} times. i'm starting to think you actually like this website.`,
      "at this point you've visited more than josh's mom has. that's saying something.",
    ]),
    priority: 95,
    once: true,
    condition: (a) => a.isReturnVisitor && a.lifetimeVisits > 3 && a.currentPage === 'lobby',
  },

  // ── PAGE-SPECIFIC ─────────────────────────────────────────────────
  {
    id: 'about-welcome',
    text: "welcome to the about page! fun fact: that comparison table is 100% legally binding.*",
    priority: 60,
    once: true,
    condition: (a) => a.currentPage === 'about' && a.timeOnPage === 3,
  },
  {
    id: 'about-lingering',
    text: "you've been staring at josh's resume for a while. everything ok? need a tissue?",
    priority: 50,
    once: true,
    condition: (a) => a.currentPage === 'about' && a.timeOnPage > 30,
  },
  {
    id: 'projects-welcome',
    text: "each of these cards was designed by a different AI subagent. it shows. in a good way. mostly.",
    priority: 60,
    once: true,
    condition: (a) => a.currentPage === 'projects' && a.timeOnPage === 3,
  },
  {
    id: 'projects-lingering',
    text: "still browsing projects? the Four Nines one is addictive. don't say i didn't warn you.",
    priority: 40,
    once: true,
    condition: (a) => a.currentPage === 'projects' && a.timeOnPage > 45,
  },
  {
    id: 'lobby-idle',
    text: pick([
      "you've been in the lobby for a while. try clicking something! i promise it won't bite.",
      "psst. the chatbot icon in the corner? that's me. come say hi.",
      "don't just stand there — explore! the sticky note and folder are clickable.",
    ]),
    priority: 30,
    once: true,
    condition: (a) => a.currentPage === 'lobby' && a.timeOnPage > 20 && a.navCount <= 1,
  },

  // ── BEHAVIOR-BASED ────────────────────────────────────────────────
  {
    id: 'speed-runner',
    text: "whoa, you're speedrunning this portfolio. slow down! smell the CSS.",
    priority: 70,
    once: true,
    condition: (a) => a.navCount >= 4 && a.totalTime < 30,
  },
  {
    id: 'explorer',
    text: "you've visited every main page! thorough. josh would be impressed. (he is.)",
    priority: 75,
    once: true,
    condition: (a) => a.uniquePages.has('about') && a.uniquePages.has('projects') && a.uniquePages.has('lobby'),
  },
  {
    id: 'chatbot-avoided',
    text: "you haven't opened the chatbot yet! i'm in here! it's dark!",
    priority: 55,
    once: true,
    condition: (a) => !a.chatbotOpened && a.totalTime > 60 && a.currentPage === 'lobby',
  },
  {
    id: 'back-from-hidden',
    text: "you found a hidden page! there are more. i'm not telling you where though.",
    priority: 80,
    once: true,
    condition: (a) => (a.uniquePages.has('void') || a.uniquePages.has('debug') || a.uniquePages.has('hamburger')) && a.currentPage === 'lobby',
  },

  // ── MOBILE SPECIFIC ───────────────────────────────────────────────
  {
    id: 'mobile-user',
    text: "browsing on mobile? brave. this site was built on a 27-inch monitor and it shows.",
    priority: 65,
    once: true,
    condition: (a) => a.isMobile && a.totalTime > 10,
  },

  // ── MILESTONE MESSAGES ────────────────────────────────────────────
  {
    id: 'five-minutes',
    text: "you've been here 5 minutes! that's longer than most people spend on their own portfolio.",
    priority: 45,
    once: true,
    condition: (a) => a.totalTime >= 300,
  },
  {
    id: 'ten-minutes',
    text: "10 minutes on a portfolio site. you're either very interested or very lost. either way, welcome.",
    priority: 50,
    once: true,
    condition: (a) => a.totalTime >= 600,
  },
  {
    id: 'twenty-minutes',
    text: "20 minutes?! at this point you basically work here. want a desk?",
    priority: 55,
    once: true,
    condition: (a) => a.totalTime >= 1200,
  },

  // ── ROTATING IDLE MESSAGES (can repeat) ───────────────────────────
  {
    id: 'siri-hint',
    text: "psst. try holding down the chat button for a sec. trust me.",
    priority: 35,
    once: true,
    condition: (a) => !a.siriMode && a.totalTime > 120 && a.chatbotOpened && a.navCount >= 3,
  },
  {
    id: 'idle-tip-1',
    text: "pro tip: try scrolling allll the way down on the lobby page. you won't regret it. (you might.)",
    priority: 15,
    duration: 6000,
    condition: (a) => a.currentPage === 'lobby' && a.timeOnPage > 15 && !a.reachedUnderworld && a.totalTime % 45 < 2,
  },
  {
    id: 'idle-tip-2',
    text: "fun fact: this chatbot runs on exactly zero machine learning. just vibes and if-statements.",
    priority: 15,
    duration: 6000,
    condition: (a) => a.totalTime > 30 && a.totalTime % 60 < 2 && a.currentPage === 'lobby',
  },
  {
    id: 'idle-fact-1',
    text: "did you know? josh once mass-renamed 200 variables at 1am because they didn't match a naming convention he made up.",
    priority: 10,
    duration: 7000,
    condition: (a) => a.totalTime > 90 && a.totalTime % 90 < 2,
  },
];

/**
 * Given the current site activity, return the best matching popup message
 * that hasn't been shown yet (for once-only messages).
 */
export function getNextPopupMessage(
  activity: SiteActivity
): ChatbotPopupMessage | null {
  const candidates = CHATBOT_POPUP_MESSAGES
    .filter(msg => {
      // Skip if once-only and already shown
      if (msg.once && activity.shownMessages.has(msg.id)) return false;
      // Check condition
      try { return msg.condition(activity); } catch { return false; }
    })
    .sort((a, b) => b.priority - a.priority);

  return candidates[0] || null;
}
