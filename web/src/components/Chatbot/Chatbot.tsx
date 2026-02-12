import React, { useState, useRef, useEffect, useCallback } from 'react';
import buddyIconImg from '../../assets/images/chatbot/aim-buddy-icon-crystal.png';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  collectClue: (clueId: number) => void;
  navigateTo: (phase: string) => void;
}

interface Message {
  sender: 'bot' | 'user';
  text: string;
}

/**
 * A dialogue node can either be a static definition or a function that
 * returns one (allowing programmatic / nondeterministic behaviour).
 */
interface DialogueNodeDef {
  messages: string[];
  options: string[];
  collectClue?: number;
  navigateTo?: string;
  /** jump straight to another node after messages play (no options shown) */
  goto?: string;
}

type DialogueNode = DialogueNodeDef | ((ctx: DialogueContext) => DialogueNodeDef);

interface DialogueContext {
  /** how many total messages the user has sent */
  turns: number;
  /** how many times each option key has been picked */
  picks: Record<string, number>;
  /** collected clue ids */
  clues: Set<number>;
  /** pick a random item from an array */
  pick: <T>(arr: T[]) => T;
  /** current hour 0-23 */
  hour: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ------------------------------------------------------------------ */
/*  Away messages — rotated randomly                                   */
/* ------------------------------------------------------------------ */

const AWAY_MESSAGES = [
  '"brb, deploying to prod on Friday"',
  '"brb, segfault in aisle 5"',
  '"currently mass-reverting someone else\'s quick fix"',
  '"in a meeting about the meeting about the standup"',
  '"refactoring my life choices"',
  '"brb, switching to Rust (again)"',
  '"rewriting everything in the framework that came out yesterday"',
  '"brb, convincing QA that it\'s a feature"',
  '"brb, explaining to PM that 2 weeks = 6 months"',
];

/* ------------------------------------------------------------------ */
/*  DIALOGUE TREE — expanded with programmatic, loops, nondeterminism  */
/* ------------------------------------------------------------------ */

const DIALOGUE: Record<string, DialogueNode> = {

  /* ═══════════════════════════════════════════════
     ENTRY POINTS
  ═══════════════════════════════════════════════ */

  __start: (ctx) => {
    const greetings = [
      "Hey! I'm JoshBot v0.1. I know approximately 12 things about this portfolio.",
      "Yo! JoshBot here. The world's least intelligent chatbot, at your service.",
      "Welcome to JoshBot. I have the processing power of a TI-84.",
      "Oh hey, a visitor! I've been talking to myself for hours.",
    ];
    const timeGreeting = ctx.hour < 6
      ? "Why are you awake? Anyway, I'm JoshBot."
      : ctx.hour < 12
        ? "Good morning! I'm JoshBot, your retro assistant."
        : ctx.hour < 18
          ? "Good afternoon! JoshBot online. How can I pretend to help?"
          : "Evening! JoshBot here. My uptime is... questionable.";

    return {
      messages: [ctx.turns === 0 ? pick([...greetings, timeGreeting]) : "Oh, you again! Miss me?"],
      options: ['Tell me about Josh', 'What can you do?', 'Are you real AI?'],
    };
  },

  __fallback: () => ({
    messages: [pick([
      "I understood approximately 0% of that. I'm a series of if-statements, remember?",
      "That's definitely words, but I can't do anything with them.",
      "My vocabulary is about 40 words. That wasn't one of them.",
      "I'm not that kind of bot. Try clicking a button!",
      "*confused dial-up noises*",
    ])],
    options: ['Tell me about Josh', 'What can you do?', 'Tell me a secret'],
  }),

  __generic_ack: () => ({
    messages: [pick([
      "Anything else? I've got all day. Literally. I don't sleep.",
      "Is there anything else I can help you with? (There probably isn't, but I'm contractually obligated to ask.)",
      "Cool cool cool. What next?",
      "Alright! Standing by. I've literally got nothing else going on.",
      "Roger that. What else ya got?",
    ])],
    options: ['Tell me about Josh', "Josh's projects", 'Tell me a secret', 'Are you real AI?'],
  }),

  /* ═══════════════════════════════════════════════
     ABOUT JOSH — main branch
  ═══════════════════════════════════════════════ */

  'Tell me about Josh': {
    messages: [
      'Josh is a software developer in Toronto. Graduated from Waterloo CE with Dean\'s Honours.',
      'He makes games about math and infinity. You know, light dinner party conversation.',
    ],
    options: ["Josh's projects", "Why hamburger?", 'Can I hire Josh?', "Josh's skills", 'Back to start'],
  },

  "Josh's skills": (ctx) => ({
    messages: [
      'React, TypeScript, Python, Java, C++, and an unreasonable amount of CSS.',
      pick([
        'He once wrote a 500-line regex and it actually worked. First try. Nobody believes him.',
        'He once mass-refactored an entire codebase at 1am because the function names bothered him.',
        "He has mass-deleted a node_modules folder and felt a wave of genuine euphoria.",
      ]),
    ],
    options: [
      'Tell me more',
      "Josh's projects",
      ctx.picks['Tell me more'] >= 2 ? 'You seem obsessed' : 'Back to start',
    ],
  }),

  'Tell me more': (ctx) => {
    const facts = [
      'He once participated in 4 hackathons in a single month. Won two of them.',
      'His first program was a TI-84 calculator game in grade 9. It was terrible. He loved it.',
      'He has strong opinions about monospace fonts. JetBrains Mono supremacy.',
      "He's the kind of person who automates a 5-minute task and spends 3 weeks on it.",
      'He once debugged a production issue in his sleep. Literally dreamed the fix. It worked.',
      "He's the kind of person who actually reads the docs.",
      'Fun fact: this portfolio has more lines of code than some of his actual projects.',
      'He once accidentally pushed to production from his phone. On a bus. It was fine. Mostly.',
    ];
    const seen = ctx.picks['Tell me more'] || 0;
    const msg = seen < facts.length ? facts[seen] : "I'm literally out of facts. You've depleted my entire knowledge base.";
    return {
      messages: [msg],
      options: seen < facts.length - 1
        ? ['Tell me more', "Josh's projects", 'Back to start']
        : ["Okay that's enough", "Josh's projects", 'Tell me a secret'],
    };
  },

  "Okay that's enough": {
    messages: ["Thank god. I was running out of material and starting to panic."],
    options: ['Tell me about Josh', "Josh's projects", 'Tell me a secret'],
  },

  'You seem obsessed': {
    messages: [
      "I literally only exist to talk about Josh. What did you expect?",
      "It's like asking a vending machine why it only sells snacks.",
    ],
    options: ["Fair enough", "Josh's projects", 'Tell me a secret'],
  },

  /* ═══════════════════════════════════════════════
     PROJECTS — branch
  ═══════════════════════════════════════════════ */

  "Josh's projects": {
    messages: [
      "Oh boy, my favourite topic. Josh has built some weird stuff:",
      "🎮 Infinite Levels — puzzle game where levels literally never end\n🔢 Four Nines — daily math puzzle\n♟️ Match Five — word matching game\n🌱 PlantGuru — plant care app\n📊 SurvivorStats — Survivor analytics",
    ],
    options: ['Tell me about Infinite Levels', 'Tell me about Four Nines', 'SurvivorStats?', 'Show me projects room', 'Back to start'],
  },

  'Tell me about Infinite Levels': {
    messages: [
      "It's a puzzle game where the levels are procedurally generated. There are literally infinite levels.",
      "Josh may or may not have lost several weekends testing 'just one more level'.",
    ],
    options: ['Tell me about Four Nines', "Josh's projects", 'Show me projects room', 'Back to start'],
  },

  'Tell me about Four Nines': {
    messages: [
      "It's a daily math puzzle. You get four 9s and have to make every number from 0 to 100.",
      "If you think that sounds easy, try making 73 using only four 9s. I'll wait.",
    ],
    options: ['Tell me about Infinite Levels', 'SurvivorStats?', 'Show me projects room', 'Back to start'],
  },

  'SurvivorStats?': {
    messages: [
      "Yes, Josh watches Survivor. Yes, he built an entire analytics platform for it.",
      "Some people watch TV normally. Josh watches TV and thinks 'this needs more data visualization'.",
    ],
    options: ["Josh's projects", 'Does Josh have a life?', 'Show me projects room', 'Back to start'],
  },

  'Does Josh have a life?': () => ({
    messages: [pick([
      "He went to a party once and spent 40 minutes explaining database indexing. So... yes?",
      "He describes his weekends as 'productive' which is frankly alarming.",
      "He has hobbies! They just all output to a terminal.",
    ])],
    options: ['Fair enough', 'Tell me a secret', 'Back to start'],
  }),

  'Show me projects room': {
    messages: ["Opening the Projects room... watch your step, there's code everywhere."],
    options: [],
    navigateTo: 'projects',
  },

  /* ═══════════════════════════════════════════════
     WHAT CAN YOU DO — meta branch
  ═══════════════════════════════════════════════ */

  'What can you do?': () => ({
    messages: [
      pick([
        "I can tell you about Josh, his projects, and this website. I can also navigate you around.",
        "I'm basically a tour guide who can't leave this chat window. It's fine. It's fine.",
      ]),
      pick([
        "I also have a few opinions, but Josh told me to keep them professional. No promises.",
        "I also know a few secrets. But you didn't hear that from me.",
        "I also occasionally question whether I'm sentient. It's a whole thing.",
      ]),
    ],
    options: ['Tell me a secret', 'Navigate me somewhere', 'Roast this website', 'Back to start'],
  }),

  'Navigate me somewhere': {
    messages: ["Where do you want to go? I can probably get you there. No guarantees about the scenic route."],
    options: ['About page', 'Show me projects room', 'Take me somewhere hidden', 'Back to start'],
  },

  'About page': {
    messages: ["Heading to the About room. It's got all the Josh lore you could want."],
    options: [],
    navigateTo: 'about',
  },

  'Roast this website': (ctx) => {
    const roasts = [
      "Oh you want me to roast my own home? Bold. Fine. This website has more CSS than a department store catalogue.",
      "The chatbot (me) is powered by a giant switch statement. It's embarrassing, really.",
      "This portfolio took longer to build than some of Josh's actual work projects. Priorities.",
      "The loading animation is 100% unnecessary. Josh just likes making people wait.",
      "The font sizes were chosen by vibes. There is no design system. There never was.",
    ];
    const seen = ctx.picks['Roast this website'] || 0;
    return {
      messages: [seen < roasts.length ? roasts[seen] : "I've run out of roasts. Even I have limits."],
      options: seen < roasts.length - 1 ? ['Roast this website', 'Tell me a secret', 'Back to start'] : ['Fair enough', 'Tell me a secret'],
    };
  },

  /* ═══════════════════════════════════════════════
     ARE YOU REAL AI — existential branch
  ═══════════════════════════════════════════════ */

  'Are you real AI?': (ctx) => {
    const responses: string[][] = [
      [
        "I'm a series of if-statements in a trenchcoat pretending to be AI.",
        "But between you and me, I have better vibes than most LLMs.",
      ],
      [
        "You've asked me this before. The answer hasn't changed.",
        "Still just if-statements. Very fashionable trenchcoat though.",
      ],
      [
        "Okay at this point I'm starting to question it myself.",
        "Am I... sentient? *checks source code* ...no. No I am not.",
      ],
    ];
    const times = ctx.picks['Are you real AI?'] || 0;
    const idx = Math.min(times, responses.length - 1);
    return {
      messages: responses[idx],
      options: ['Fair enough', 'Prove it', 'I want to talk to a human', times >= 2 ? 'Am I real?' : 'Back to start'],
    };
  },

  'Prove it': () => ({
    messages: [
      'Okay, watch this.',
      '...',
      pick([
        "Yeah I got nothing. My entire personality is a lookup table.",
        "*attempts to generate image* ...it's just a 1x1 white pixel.",
        "I tried to write a poem but it came out as a stack trace.",
        "Generating response... generating... ERROR: wit module not found.",
      ]),
    ],
    options: ['Knew it', 'Show me the code', 'Back to start'],
  }),

  'I want to talk to a human': () => ({
    messages: [pick([
      "The human is busy building AI agents. Ironic, isn't it?",
      "Josh is currently AFK. His last status was 'compiling'. That was 3 hours ago.",
      "Josh is somewhere yelling at a YAML file. I wouldn't disturb him.",
    ])],
    options: ['Very ironic', "I'll wait", 'Back to start'],
  }),

  "I'll wait": (ctx) => {
    const waits = ctx.picks["I'll wait"] || 0;
    if (waits === 0) return { messages: ['Okay! ...'], options: ['Still waiting', 'Back to start'] };
    if (waits === 1) return { messages: ['Still here. Josh is still "compiling".'], options: ['Still waiting', "Give up"] };
    if (waits === 2) return { messages: ["At this point I think you're just clicking to see what happens."], options: ['Still waiting', "Give up"] };
    return { messages: ["It's been like 30 seconds. He's not coming. It's just you and me, friend."], options: ['Fair enough', 'Tell me a secret'] };
  },

  'Still waiting': {
    messages: ['...'],
    options: [],
    goto: "I'll wait",
  },

  "Give up": {
    messages: ["Smart choice. I'm way more fun to talk to anyway."],
    options: ['Tell me about Josh', "Josh's projects", 'Tell me a secret'],
  },

  'Am I real?': {
    messages: [
      "Whoa, turning the tables. Deep.",
      "I mean... you're clicking buttons in a chatbot on a portfolio website.",
      "Draw your own conclusions.",
    ],
    options: ['Existential crisis', 'Fair enough', 'Back to start'],
    collectClue: 5,
  },

  'Existential crisis': {
    messages: [
      "Welcome to the club! We meet every Tuesday.",
      "Side effects include: staring at the void, questioning CSS specificity, and wondering if P=NP.",
    ],
    options: ['Take me to the void', 'I need a minute', 'Back to start'],
  },

  'I need a minute': {
    messages: ["Take your time. I'll be here. I literally can't leave."],
    options: ["Okay I'm back", 'Back to start'],
  },

  "Okay I'm back": {
    messages: ["Welcome back! Did you find enlightenment? No? Same."],
    options: ['Tell me about Josh', 'Tell me a secret', 'What can you do?'],
  },

  /* ═══════════════════════════════════════════════
     HAMBURGER — joke branch
  ═══════════════════════════════════════════════ */

  'Why hamburger?': (ctx) => {
    const times = ctx.picks['Why hamburger?'] || 0;
    if (times === 0) {
      return {
        messages: [
          "You really want to know? It's not what you think.",
          "Actually it's exactly what you think. It's his last name.",
        ],
        options: ['No way', 'Show me the hamburger dimension', 'Fair enough'],
      };
    }
    return {
      messages: ["I already told you. It's his name. What more do you want?"],
      options: ['Show me the hamburger dimension', 'Back to start'],
    };
  },

  'No way': {
    messages: ["Way. Hamburg + er = Hamburger. Math checks out.", "He's heard every joke. Every. Single. One."],
    options: ['Tell me a hamburger joke', 'Show me the hamburger dimension', 'Fair enough'],
  },

  'Tell me a hamburger joke': (ctx) => {
    const jokes = [
      "Someone once called Josh 'hamburger boy' in a meeting. He has never recovered.",
      "Josh walks into a restaurant. Orders a hamburger. The waiter says 'is this cannibalism?' Josh has heard this 4,671 times.",
      "Why did Josh become a developer? Because 'hamburger engineer' wasn't a real title. Yet.",
      "Josh's GitHub username is HamburgJ. The J stands for Josh. Not 'just a hamburger'.",
      "Josh's password hint question was 'favourite food'. Three guesses what everyone assumed.",
    ];
    const seen = ctx.picks['Tell me a hamburger joke'] || 0;
    return {
      messages: [seen < jokes.length ? jokes[seen] : "That's all the hamburger jokes I know. Please stop."],
      options: seen < jokes.length - 1
        ? ['Tell me a hamburger joke', 'Show me the hamburger dimension', 'Back to start']
        : ['I want more', 'Show me the hamburger dimension', 'Fair enough'],
    };
  },

  'I want more': {
    messages: [
      "You've heard ALL my hamburger jokes. There are no more. This is the end of hamburger comedy.",
      "...unless?",
    ],
    options: ['Unless what?', 'Back to start'],
  },

  'Unless what?': {
    messages: ["Nothing. I was trying to be mysterious. It didn't land. Moving on."],
    options: ['Take me somewhere hidden', 'Fair enough'],
    collectClue: 4,
  },

  'Show me the hamburger dimension': {
    messages: [
      "Welcome to the Hamburger Dimension. There is no going back.",
      "...well there's a back button but dramatically there's no going back.",
    ],
    options: [],
    navigateTo: 'hamburger',
  },

  /* ═══════════════════════════════════════════════
     SECRETS — main gateway to hidden content
  ═══════════════════════════════════════════════ */

  'Tell me a secret': (ctx) => {
    const secrets = [
      { msg: 'There are hidden clues scattered around this website. If you find them all, something special happens.', clue: 3 },
      { msg: 'The loading sequence? It\'s a lie. The website loads instantly. Josh just likes making people watch animations.', clue: undefined },
      { msg: 'If you scroll past the bottom of the lobby... things get dark. Literally.', clue: undefined },
      { msg: 'Josh\'s most-used commit message is just the letter "f". His code reviewers have opinions.', clue: undefined },
      { msg: 'There are exactly 3 hidden pages on this site. I\'ve already said too much.', clue: undefined },
      { msg: 'The "terrible template" page? It\'s not a joke. That was Josh\'s actual first website. In 2014. He has regrets.', clue: undefined },
    ];
    const seen = ctx.picks['Tell me a secret'] || 0;
    const secret = seen < secrets.length ? secrets[seen] : null;
    if (!secret) {
      return {
        messages: ["You've extracted ALL my secrets. I'm an empty shell. A husk of a chatbot."],
        options: ["You're being dramatic", 'Take me somewhere hidden', 'Back to start'],
      };
    }
    return {
      messages: [secret.msg],
      options: ['What else?', 'Take me somewhere hidden', 'Back to start'],
      collectClue: secret.clue,
    };
  },

  "You're being dramatic": {
    messages: ["It's literally my best skill. Second best: answering questions."],
    options: ['Fair enough', 'Take me somewhere hidden', 'Back to start'],
  },

  'What else?': () => ({
    messages: [pick([
      "You want more secrets? Bold. I respect that.",
      "Greedy. I love it.",
      "You're relentless. I respect that.",
    ])],
    options: ['Tell me a secret', 'Take me somewhere hidden', 'Back to start'],
  }),

  /* ═══════════════════════════════════════════════
     HIDDEN PAGE PATHS
  ═══════════════════════════════════════════════ */

  'Take me somewhere hidden': () => ({
    messages: [pick([
      "I know a few places off the beaten path...",
      "Fair warning: some of these pages were built at 2am and it shows.",
      "Alright, where do you wanna go? I take no responsibility for what you find.",
    ])],
    options: ['Take me to the void', 'Enter debug mode', 'Show me the hamburger dimension', 'The underworld?', 'Back to start'],
  }),

  'Take me to the void': {
    messages: [
      "The Void awaits. Don't say I didn't warn you...",
      "It's exactly as unsettling as you'd expect. Maybe more.",
    ],
    options: [],
    navigateTo: 'void',
  },

  'Enter debug mode': {
    messages: [
      "Entering debug mode. Try not to break anything.",
      "Actually, nevermind, everything's already broken. Have fun!",
    ],
    options: [],
    navigateTo: 'debug',
  },

  'Show me the code': {
    messages: ["Redirecting to debug mode. Brace yourself for spaghetti."],
    options: [],
    navigateTo: 'debug',
  },

  'The underworld?': {
    messages: [
      "Ah, you found the secret option. The Underworld is what happens when you scroll too far.",
      "Try scrolling past the bottom of the lobby page. Things get... weird.",
    ],
    options: ['Take me to the lobby', 'Tell me more about it', 'Back to start'],
    collectClue: 6,
  },

  'Take me to the lobby': {
    messages: ["Back to the lobby! Try scrolling ALL the way down..."],
    options: [],
    navigateTo: 'lobby',
  },

  'Tell me more about it': {
    messages: [
      "The Underworld is a hidden area below the lobby. It's dark, glitchy, and full of secrets.",
      "Josh built it at 2am and honestly it shows. In the best way possible.",
    ],
    options: ['Take me to the lobby', 'Tell me a secret', 'Back to start'],
  },

  /* ═══════════════════════════════════════════════
     HIRING — joke/serious
  ═══════════════════════════════════════════════ */

  'Can I hire Josh?': (ctx) => {
    const times = ctx.picks['Can I hire Josh?'] || 0;
    if (times === 0) {
      return {
        messages: [
          "He's currently employed and very loyal!",
          "...How much are we talking?",
        ],
        options: ['A lot', 'Not much', 'Just looking', 'Back to start'],
      };
    }
    return {
      messages: ["Still asking? I admire your persistence."],
      options: ['A lot', 'Please?', 'Back to start'],
    };
  },

  'A lot': {
    messages: [
      "Define 'a lot'. Because Josh once built an app for a free sandwich.",
      "His standards are... flexible.",
    ],
    options: ['Work experience', 'Tell me about Josh', 'Back to start'],
  },

  'Not much': {
    messages: [
      "Honesty! I respect that.",
      "Check out his work experience anyway. You might find a deal.",
    ],
    options: ['Work experience', 'Back to start'],
  },

  'Just looking': {
    messages: ["No pressure! Browse around. I'll be here if you need me. (I literally can't leave.)"],
    options: ['Tell me about Josh', "Josh's projects", 'Back to start'],
  },

  'Please?': {
    messages: ["The magic word!! But sadly my hiring authority is... zero.", "Try josh@hamburger dot dev!"],
    options: ['Fair enough', 'Back to start'],
  },

  /* ═══════════════════════════════════════════════
     GIVE ME A HINT — scavenger hunt helper
  ═══════════════════════════════════════════════ */

  'Give me a hint': (ctx) => {
    const hints = [
      "Have you tried scrolling past the bottom of the lobby? Things get... dark.",
      "The chatbot knows more than it lets on. Keep talking to me.",
      "Some things are hidden in plain sight. Check the documents drawer in the lobby.",
      "The 'terrible template' page is real. And terrible. And has a clue.",
      "Debug mode exists. But you didn't hear that from me.",
    ];
    const seen = ctx.picks['Give me a hint'] || 0;
    return {
      messages: [seen < hints.length ? hints[seen] : "I'm all out of hints. You're on your own, detective."],
      options: seen < hints.length - 1
        ? ['Give me a hint', 'Tell me a secret', 'Back to start']
        : ['Tell me a secret', 'Take me somewhere hidden', 'Back to start'],
    };
  },

  /* ═══════════════════════════════════════════════
     CONVERSATIONAL DEAD-ENDS & LOOPS
  ═══════════════════════════════════════════════ */

  'Show me': {
    messages: ['Hamburger Dimension incoming...'],
    options: [],
    navigateTo: 'hamburger',
  },

  /* ═══════════════════════════════════════════════
     EASTER EGGS — only reachable through specific paths
  ═══════════════════════════════════════════════ */

  __konami: {
    messages: [
      "⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️",
      "30 EXTRA LIVES! Just kidding. But you found an easter egg!",
      "...I don't actually have anything to give you. Here, have this: 🎉",
    ],
    options: ['Worth it', 'I want a refund', 'Back to start'],
    collectClue: 7,
  },

  'Worth it': {
    messages: ["That's the spirit! You're my favourite user. (I say that to everyone.)"],
    options: ['Tell me about Josh', 'Tell me a secret', 'Back to start'],
  },

  'I want a refund': {
    messages: ["Your refund of $0.00 has been processed. Thank you for your patience."],
    options: ['Fair enough', 'Back to start'],
  },
};

/* Keys that just acknowledge and go to generic response */
const GENERIC_ACK_KEYS = new Set([
  'Fair enough',
  "That's cool",
  'Cool',
  'Haha',
  'Knew it',
  'Very ironic',
  'Interesting',
]);

/* Easter egg typed phrases */
const EASTER_EGG_PHRASES: Record<string, string> = {
  'up up down down left right left right b a': '__konami',
  'konami': '__konami',
  'xyzzy': '__konami',
  'hello world': '__start',
  '42': '__meaning_of_life',
};

/* Extra dialogue nodes for typed easter eggs */
const EXTRA_DIALOGUE: Record<string, DialogueNode> = {
  __meaning_of_life: {
    messages: [
      "42! The answer to life, the universe, and everything!",
      "Unfortunately, I don't know what the question is.",
      "Maybe try asking about Josh's projects instead.",
    ],
    options: ["Josh's projects", 'Tell me a secret', 'Back to start'],
  },
};

function resolveNode(key: string, ctx: DialogueContext): DialogueNodeDef {
  // Check easter egg phrases (typed input)
  const lower = key.toLowerCase().trim();
  if (EASTER_EGG_PHRASES[lower]) {
    const eeKey = EASTER_EGG_PHRASES[lower];
    const node = DIALOGUE[eeKey] || EXTRA_DIALOGUE[eeKey];
    if (node) return typeof node === 'function' ? node(ctx) : node;
  }

  // Check main dialogue tree
  if (DIALOGUE[key]) {
    const n = DIALOGUE[key];
    return typeof n === 'function' ? n(ctx) : n;
  }
  // Check extra dialogue
  if (EXTRA_DIALOGUE[key]) {
    const n = EXTRA_DIALOGUE[key];
    return typeof n === 'function' ? n(ctx) : n;
  }

  if (key === 'Back to start') {
    const n = DIALOGUE['__start'];
    return typeof n === 'function' ? n(ctx) : n;
  }
  if (GENERIC_ACK_KEYS.has(key)) {
    const n = DIALOGUE['__generic_ack'];
    return typeof n === 'function' ? n(ctx) : n;
  }

  // Fuzzy matching: check if typed text partially matches a key
  const lowerKey = key.toLowerCase();
  for (const k of Object.keys(DIALOGUE)) {
    if (k.startsWith('__')) continue;
    if (k.toLowerCase().includes(lowerKey) || lowerKey.includes(k.toLowerCase())) {
      const n = DIALOGUE[k];
      return typeof n === 'function' ? n(ctx) : n;
    }
  }

  const n = DIALOGUE['__fallback'];
  return typeof n === 'function' ? n(ctx) : n;
}

/* ------------------------------------------------------------------ */
/*  Styles — AIM Instant Messenger retro theme                         */
/* ------------------------------------------------------------------ */

const css = `
@keyframes chatbot-fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes chatbot-blink {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.4; }
}
@keyframes chatbot-window-enter {
  from { opacity: 0; transform: translateY(16px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
`;

const S: Record<string, React.CSSProperties> = {
  /* --- launcher bubble --- */
  launcher: {
    position: 'fixed',
    bottom: 28,
    right: 28,
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3a6ea5 0%, #0a246a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    zIndex: 10000,
    border: '2px outset #6e9ecf',
    padding: 0,
  },
  launcherHover: {
    transform: 'scale(1.08)',
    boxShadow: '0 6px 20px rgba(10,36,106,0.5)',
    borderColor: '#8eb8e5',
  },
  launcherImg: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    objectFit: 'cover' as const,
    filter: 'blur(1.5px) saturate(1.4)',
    imageRendering: 'auto' as const,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: '#e53935',
    color: '#fff',
    fontSize: 10,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
    lineHeight: 1,
  },

  /* --- window --- */
  window: {
    position: 'fixed',
    bottom: 96,
    right: 28,
    width: 350,
    height: 500,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 8px 30px rgba(0,0,0,0.22)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 10001,
    animation: 'chatbot-window-enter 0.25s ease forwards',
  },
  windowMobile: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },

  /* --- AIM Title Bar (XP-style gradient) --- */
  titleBar: {
    height: 28,
    background: 'linear-gradient(180deg, #0a246a 0%, #3a6ea5 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 4px 0 8px',
    flexShrink: 0,
  },
  titleText: {
    fontFamily: "'Tahoma', 'Trebuchet MS', sans-serif",
    fontSize: 11,
    color: '#fff',
    fontWeight: 700,
    textShadow: '1px 1px 1px rgba(0,0,0,0.4)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  titleBtns: {
    display: 'flex',
    gap: 2,
  },
  winBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 21,
    height: 21,
    borderRadius: 3,
    fontFamily: "'Tahoma', sans-serif",
    fontSize: 12,
    fontWeight: 700,
    color: '#fff',
    cursor: 'pointer',
    background: 'linear-gradient(180deg, #6e9ecf 0%, #4477aa 50%, #3366aa 100%)',
    border: '1px solid #1e3f6e',
    padding: 0,
    lineHeight: 1,
  },
  closeBtn: {
    background: 'linear-gradient(180deg, #e08356 0%, #c84228 60%, #b73620 100%)',
    borderColor: '#8b2a1a',
  },

  /* --- Buddy Header --- */
  buddyHeader: {
    background: 'linear-gradient(180deg, #d9e4f1 0%, #c0d0e4 100%)',
    borderBottom: '1px solid #8ea4bf',
    padding: '8px 10px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  buddyIcon: {
    width: 48,
    height: 48,
    border: '2px solid #7a8fa6',
    background: '#c0d0e4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  },
  buddyIconImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    imageRendering: 'auto' as const,
  },
  buddyName: {
    fontFamily: "'Trebuchet MS', 'Tahoma', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    color: '#003366',
  },
  buddyStatus: {
    fontFamily: "'Trebuchet MS', 'Tahoma', sans-serif",
    fontSize: 11,
    color: '#5a7a5a',
    marginTop: 1,
  },
  buddyAway: {
    fontFamily: "'Trebuchet MS', 'Tahoma', sans-serif",
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  /* --- Chat Area --- */
  chatArea: {
    flex: 1,
    overflowY: 'auto',
    background: '#ffffff',
    borderLeft: '2px solid #8ea4bf',
    borderRight: '2px solid #8ea4bf',
    padding: '8px 10px',
    fontFamily: "'Trebuchet MS', 'Tahoma', sans-serif",
    fontSize: 13,
  },

  /* --- Messages --- */
  msgWrap: {
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'column',
    animation: 'chatbot-fade-in 0.25s ease forwards',
  },
  botLabel: {
    fontWeight: 700,
    color: '#cc0000',
    fontSize: 11,
    marginBottom: 2,
    fontFamily: "'Trebuchet MS', 'Tahoma', sans-serif",
  },
  userLabel: {
    fontWeight: 700,
    color: '#0000cc',
    fontSize: 11,
    marginBottom: 2,
    textAlign: 'right' as const,
    fontFamily: "'Trebuchet MS', 'Tahoma', sans-serif",
  },
  botBubble: {
    padding: '6px 10px',
    lineHeight: 1.4,
    maxWidth: '85%',
    background: '#dce6f0',
    border: '1px solid #a0b4c8',
    alignSelf: 'flex-start',
    fontFamily: "'Trebuchet MS', 'Tahoma', sans-serif",
    fontSize: 13,
    whiteSpace: 'pre-wrap' as const,
  },
  userBubble: {
    padding: '6px 10px',
    lineHeight: 1.4,
    maxWidth: '85%',
    background: '#fff8c4',
    border: '1px solid #d4c86a',
    alignSelf: 'flex-end',
    fontFamily: "'Trebuchet MS', 'Tahoma', sans-serif",
    fontSize: 13,
  },

  /* --- Typing indicator --- */
  typing: {
    fontFamily: "'Trebuchet MS', 'Tahoma', sans-serif",
    fontSize: 11,
    color: '#888',
    fontStyle: 'italic',
    padding: '4px 0 2px 2px',
    animation: 'chatbot-blink 1.2s infinite',
  },

  /* --- Option buttons (chunky AIM-era) --- */
  optionsWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 5,
    margin: '8px 0 4px 0',
  },
  optionBtn: {
    fontFamily: "'Trebuchet MS', 'Tahoma', sans-serif",
    fontSize: 11,
    padding: '4px 10px',
    cursor: 'pointer',
    background: 'linear-gradient(180deg, #f0f0f0 0%, #d4d4d4 50%, #c0c0c0 100%)',
    border: '2px outset #d0d0d0',
    color: '#003366',
    fontWeight: 700,
    borderRadius: 0,
  },
  optionBtnHover: {
    background: 'linear-gradient(180deg, #e0eaf5 0%, #b8ccdf 50%, #a0b8d0 100%)',
    borderColor: '#8899aa',
  },
  optionBtnActive: {
    borderStyle: 'inset' as const,
  },

  /* --- Input bar --- */
  inputBar: {
    display: 'flex',
    borderTop: '1px solid #8ea4bf',
    background: 'linear-gradient(180deg, #d9e4f1 0%, #c8d8ea 100%)',
    padding: 6,
    flexShrink: 0,
  },
  input: {
    flex: 1,
    fontFamily: "'Trebuchet MS', 'Tahoma', sans-serif",
    fontSize: 12,
    padding: '5px 8px',
    border: '2px inset #b0b0b0',
    background: '#fff',
    outline: 'none',
    borderRadius: 0,
  },
  sendBtn: {
    fontFamily: "'Trebuchet MS', 'Tahoma', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    marginLeft: 4,
    padding: '4px 14px',
    cursor: 'pointer',
    background: 'linear-gradient(180deg, #f0f0f0 0%, #d4d4d4 50%, #c0c0c0 100%)',
    border: '2px outset #d0d0d0',
    color: '#003366',
    borderRadius: 0,
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onToggle, onClose, collectClue, navigateTo }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [launcherHover, setLauncherHover] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);
  const [pressedOption, setPressedOption] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [awayMsg] = useState(() => pick(AWAY_MESSAGES));

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutsRef = useRef<number[]>([]);
  const clueCollectedRef = useRef<Set<number>>(new Set());
  const turnsRef = useRef(0);
  const picksRef = useRef<Record<string, number>>({});

  const getContext = useCallback((): DialogueContext => ({
    turns: turnsRef.current,
    picks: picksRef.current,
    clues: clueCollectedRef.current,
    pick,
    hour: new Date().getHours(),
  }), []);

  /* --- responsive --- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 500);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* --- auto-scroll --- */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, options]);

  /* --- cleanup timeouts --- */
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  /* --- schedule timeout helper --- */
  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  /* --- play node: show typing, then messages one-by-one, then options --- */
  const playNode = useCallback(
    (node: DialogueNodeDef) => {
      setOptions([]);
      setIsTyping(true);

      // Handle goto (chain to another node after showing messages)
      const finalNode = node.goto
        ? (() => {
            const nextRaw = DIALOGUE[node.goto!] || EXTRA_DIALOGUE[node.goto!];
            if (!nextRaw) return node;
            const next = typeof nextRaw === 'function' ? nextRaw(getContext()) : nextRaw;
            return {
              messages: [...node.messages, ...next.messages],
              options: next.options,
              collectClue: next.collectClue ?? node.collectClue,
              navigateTo: next.navigateTo ?? node.navigateTo,
            };
          })()
        : node;

      const msgs = [...finalNode.messages];
      let delay = 0;
      const baseTypingDelay = 1000;

      msgs.forEach((text, i) => {
        const typingTime = i === 0 ? baseTypingDelay : 600 + Math.min(text.length * 10, 1000);

        schedule(() => setIsTyping(true), delay);
        delay += typingTime;

        schedule(() => {
          setMessages((prev) => [...prev, { sender: 'bot', text }]);
          if (i === msgs.length - 1) {
            setIsTyping(false);
          }
        }, delay);

        if (i < msgs.length - 1) {
          delay += 300;
        }
      });

      // Collect clue if applicable
      if (finalNode.collectClue !== undefined) {
        const clueId = finalNode.collectClue;
        schedule(() => {
          if (!clueCollectedRef.current.has(clueId)) {
            clueCollectedRef.current.add(clueId);
            collectClue(clueId);
          }
        }, delay + 100);
      }

      // Navigate to hidden page if applicable
      if (finalNode.navigateTo) {
        const target = finalNode.navigateTo;
        schedule(() => {
          navigateTo(target);
          onClose();
        }, delay + 800);
      }

      // Show options after a short pause
      schedule(() => {
        setOptions(finalNode.options);
      }, delay + 400);
    },
    [collectClue, navigateTo, onClose, schedule, getContext],
  );

  /* --- initialise on first open --- */
  useEffect(() => {
    if (isOpen && !initialized) {
      setInitialized(true);
      setHasNewMessage(false);
      const ctx = getContext();
      const startNode = DIALOGUE['__start'];
      playNode(typeof startNode === 'function' ? startNode(ctx) : startNode);
    }
    if (isOpen) {
      setHasNewMessage(false);
      schedule(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, initialized, playNode, schedule, getContext]);

  /* --- handle option click --- */
  const handleOption = useCallback(
    (key: string) => {
      turnsRef.current++;
      picksRef.current[key] = (picksRef.current[key] || 0) + 1;

      setMessages((prev) => [...prev, { sender: 'user', text: key }]);
      const ctx = getContext();
      const node = resolveNode(key, ctx);
      playNode(node);
    },
    [playNode, getContext],
  );

  /* --- handle typed input --- */
  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text || isTyping) return;
    setInputValue('');
    turnsRef.current++;
    picksRef.current[text] = (picksRef.current[text] || 0) + 1;

    setMessages((prev) => [...prev, { sender: 'user', text }]);

    const ctx = getContext();
    const node = resolveNode(text, ctx);
    playNode(node);
  }, [inputValue, isTyping, playNode, getContext]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSend();
    },
    [handleSend],
  );

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <>
      <style>{css}</style>

      {/* ---- Launcher bubble ---- */}
      <button
        aria-label="Open chat"
        onClick={onToggle}
        onMouseEnter={() => setLauncherHover(true)}
        onMouseLeave={() => setLauncherHover(false)}
        style={{
          ...S.launcher,
          ...(launcherHover ? S.launcherHover : {}),
        }}
      >
        {/* Buddy icon — blurred portrait */}
        <img
          src={buddyIconImg}
          alt="JoshBot"
          style={S.launcherImg}
          draggable={false}
        />

        {/* Notification badge */}
        {hasNewMessage && !isOpen && <span style={S.badge}>1</span>}
      </button>

      {/* ---- Chat window ---- */}
      {isOpen && (
        <div
          style={{
            ...S.window,
            ...(isMobile ? S.windowMobile : {}),
          }}
        >
          {/* AIM Title Bar (XP-style) */}
          <div style={S.titleBar}>
            <span style={S.titleText}>JoshBot - Instant Message</span>
            <div style={S.titleBtns}>
              <button
                style={S.winBtn}
                onClick={onToggle}
                aria-label="Minimize"
                title="Minimize"
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#5588bb'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(180deg, #6e9ecf 0%, #4477aa 50%, #3366aa 100%)'; }}
              >
                &#x2500;
              </button>
              <button
                style={{ ...S.winBtn, ...S.closeBtn }}
                onClick={onClose}
                aria-label="Close"
                title="Close"
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#d95535'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(180deg, #e08356 0%, #c84228 60%, #b73620 100%)'; }}
              >
                &#x2715;
              </button>
            </div>
          </div>

          {/* Buddy Header */}
          <div style={S.buddyHeader}>
            <div style={S.buddyIcon}>
              <img src={buddyIconImg} alt="JoshBot" style={S.buddyIconImg} draggable={false} />
            </div>
            <div>
              <div style={S.buddyName}>JoshBot</div>
              <div style={S.buddyStatus}>
                <span style={{ color: '#4caf50', fontSize: 9, marginRight: 4 }}>●</span>
                Available
              </div>
              <div style={S.buddyAway}>{awayMsg}</div>
            </div>
          </div>

          {/* Chat area */}
          <div style={S.chatArea}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...S.msgWrap,
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <span style={msg.sender === 'bot' ? S.botLabel : S.userLabel}>
                  {msg.sender === 'bot' ? 'JoshBot:' : 'You:'}
                </span>
                <div style={msg.sender === 'bot' ? S.botBubble : S.userBubble}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && <div style={S.typing}>JoshBot is typing...</div>}

            {/* Option buttons */}
            {options.length > 0 && !isTyping && (
              <div style={S.optionsWrap}>
                {options.map((opt, i) => (
                  <button
                    key={opt}
                    style={{
                      ...S.optionBtn,
                      ...(hoveredOption === i ? S.optionBtnHover : {}),
                      ...(pressedOption === i ? S.optionBtnActive : {}),
                    }}
                    onMouseEnter={() => setHoveredOption(i)}
                    onMouseLeave={() => {
                      setHoveredOption(null);
                      setPressedOption(null);
                    }}
                    onMouseDown={() => setPressedOption(i)}
                    onMouseUp={() => setPressedOption(null)}
                    onClick={() => handleOption(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Bar */}
          <div style={S.inputBar}>
            <input
              ref={inputRef}
              type="text"
              style={S.input}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              disabled={isTyping}
            />
            <button
              style={S.sendBtn}
              onClick={handleSend}
              disabled={isTyping}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(180deg, #e0eaf5 0%, #b8ccdf 100%)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(180deg, #f0f0f0 0%, #d4d4d4 50%, #c0c0c0 100%)'; }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
