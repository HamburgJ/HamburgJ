import { TerminalLine, CopilotMessage } from '../VibeCodingOverlay/VibeCodingOverlay';

// ══════════════════════════════════════════════════════════════════════════════
// ABOUT ROOM — Bug trigger: "Add to Cart" button (no CartProvider exists)
// Josh wonders what happens if he presses it, then reacts when it crashes.
// ══════════════════════════════════════════════════════════════════════════════

export const ABOUT_HINT_LINES: string[] = [
  "that 'add to cart' button looks clickable...",
];

export const ABOUT_ERROR_JOSH_LINES: TerminalLine[] = [
  { type: 'comment', text: 'hmm, I wonder what happens if I press "add to cart"...' },
];

export const ABOUT_ERROR_TERMINAL_LINES: TerminalLine[] = [
  { type: 'error', text: "TypeError: Cannot read properties of undefined (reading 'checkout')" },
  { type: 'error', text: '  at CartProvider.addItem (src/components/Cart.tsx:42:18)' },
  { type: 'comment', text: 'oh, of course' },
];

export const ABOUT_TO_PROJECTS_COPILOT: CopilotMessage[] = [
  {
    role: 'user',
    text: "the cart crashes. forget it — build me a projects page. showcase the games and tools.",
  },
  {
    role: 'assistant',
    text: "Flagship cards with CSS backgrounds, secondary grid for the rest. Each project gets a live link.",
    fileEdit: {
      fileName: 'src/components/ProjectsRoom.tsx',
      lines: [
        '+ const ProjectsRoom: React.FC = () => (',
        '+   <ProjectGallery>',
        '+     <FlagshipGrid>',
        '+       {flagships.map(p => <ProjectCard key={p.slug} size="hero" {...p} />)}',
        '+     </FlagshipGrid>',
        '+   </ProjectGallery>',
        '+ );',
      ],
    },
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// ABOUT ROOM — Auto-intervention: Josh jumps in if user doesn't click
// ══════════════════════════════════════════════════════════════════════════════

export const ABOUT_AUTO_JOSH_LINES: TerminalLine[] = [
  { type: 'comment', text: "actually wait, let me try something..." },
  { type: 'comment', text: 'I wonder what happens if I press "add to cart"...' },
];

export const ABOUT_AUTO_ERROR_LINES: TerminalLine[] = [
  { type: 'error', text: "TypeError: Cannot read properties of undefined (reading 'checkout')" },
  { type: 'error', text: '  at CartProvider.addItem (src/components/Cart.tsx:42:18)' },
  { type: 'comment', text: 'oh, of course. no cart provider. classic.' },
];

// ══════════════════════════════════════════════════════════════════════════════
// PROJECTS ROOM — Each project gets vibecoded one-by-one in Copilot
// Josh explains each project, Copilot generates a unique card, Josh reacts.
// After all cards are done, Josh decides to keep them and add a lobby.
// ══════════════════════════════════════════════════════════════════════════════

export const PROJECTS_INTRO_JOSH_LINES: TerminalLine[] = [
  { type: 'comment', text: "ok so I've got a few projects to show off" },
  { type: 'comment', text: "let me vibe out a card for each one..." },
];

// ── PROJECT 1: Infinite Levels ──────────────────────────────────────────────

export const INFINITE_LEVELS_COPILOT: CopilotMessage[] = [
  {
    role: 'user',
    text: "make a project card for my puzzle game 'Infinite Levels'. it's about infinity and math puzzles. make it look escher-esque with recursive vibes, deep indigo/purple palette",
  },
  {
    role: 'assistant',
    text: "Recursive nested boxes, Escher-inspired staircase, and a shimmering infinity gradient title. The whole thing pulses like it's contemplating the void. 🌀",
    fileEdit: {
      fileName: 'src/components/InfiniteLevelsCard.tsx',
      lines: [
        '+ <div className="vc-infinite-card">',
        '+   <div className="vc-inf-recursion">',
        '+     <div className="vc-inf-box">',
        '+       <div className="vc-inf-box">',
        '+         <div className="vc-inf-box-inner" />',
        '+       </div>',
        '+     </div>',
        '+   </div>',
        '+   <div className="vc-inf-title">Infinite Levels!</div>',
        '+   <a className="vc-inf-btn">Descend Forever</a>',
        '+ </div>',
      ],
    },
  },
];

// ── PROJECT 2: Four Nines ───────────────────────────────────────────────────

export const FOUR_NINES_COPILOT: CopilotMessage[] = [
  {
    role: 'user',
    text: "make a card for 'Four Nines' - daily math game where you use four 9s to make numbers. retro green-screen terminal, orange LED-style glowing 9s, green terminal text",
  },
  {
    role: 'assistant',
    text: "Full retro CRT terminal with scanlines, flickering LED digits, and a blinking cursor. Status bar at the bottom sells the terminal aesthetic. 🖥️",
    fileEdit: {
      fileName: 'src/components/FourNinesCard.tsx',
      lines: [
        '+ <div className="vc-nines-card">',
        '+   <div className="vc-nines-screen">',
        '+     <div className="vc-nines-digits">',
        '+       <span>9</span><span>9</span><span>9</span><span>9</span>',
        '+     </div>',
        '+     <div className="vc-nines-title">FOUR NINES_</div>',
        '+     <a className="vc-nines-btn">./play --today</a>',
        '+   </div>',
        '+ </div>',
      ],
    },
  },
];

// ── PROJECT 3: Match Five ───────────────────────────────────────────────────

export const MATCH_FIVE_COPILOT: CopilotMessage[] = [
  {
    role: 'user',
    text: "ok next — Match Five. word game, match words to their meanings. neon crossword meets Wordle. purple everything. floating letter tiles. cyberpunk newspaper vibes.",
  },
  {
    role: 'assistant',
    text: "Neon crossword-cyberpunk mashup. Floating letter tiles on a pulsing grid, corner brackets like a classified document, glow-scanning header. All purple.",
    fileEdit: {
      fileName: 'src/components/MatchFiveCard.tsx',
      lines: [
        '+ <div className="vc-match-five">',
        '+   <div className="vc-mf-glow-bar" />',
        '+   <div className="vc-mf-tiles">',
        '+     {letters.map(l => <span className="vc-mf-tile">{l}</span>)}',
        '+   </div>',
        '+   <h2 className="vc-mf-title">Match Five</h2>',
        '+   <a className="vc-mf-cta">Decode Now →</a>',
        '+ </div>',
      ],
    },
  },
];

// ── PROJECT 4: Survivor Stats ───────────────────────────────────────────────

export const SURVIVOR_STATS_COPILOT: CopilotMessage[] = [
  {
    role: 'user',
    text: "now Survivor Stats. data viz for the TV show Survivor — stats across 47 seasons. make it look like tribal council. FIRE. torches. a parchment voting card. dramatic energy.",
  },
  {
    role: 'assistant',
    text: "Tribal council meets data dashboard. Fire gradient with rising ember particles, torch glow, a parchment voting card, stat badges. 🔥",
    fileEdit: {
      fileName: 'src/components/SurvivorStatsCard.tsx',
      lines: [
        '+ <div className="vc-survivor">',
        '+   <div className="vc-sv-embers" />',
        '+   <div className="vc-sv-vote-card">Vote: Jeff</div>',
        '+   <h2 className="vc-sv-title">Survivor Stats</h2>',
        '+   <a className="vc-sv-cta">Enter Tribal →</a>',
        '+ </div>',
      ],
    },
  },
];

// ── PROJECT 5: PlantGuru ────────────────────────────────────────────────────

export const PLANTGURU_COPILOT: CopilotMessage[] = [
  {
    role: 'user',
    text: "ok last one. plantguru — IoT plant monitoring from my capstone. sensors, cloud predictions. make it look like retro NASA mission control but for plants. green terminal, sensor readouts, CRT scanlines",
  },
  {
    role: 'assistant',
    text: "Y2K botanical mission control. CRT phosphor glow, animated scanlines, live sensor bars, floating data packets, ASCII plant art. Plant Status: THRIVING. 🌱",
    fileEdit: {
      fileName: 'src/components/PlantGuruCard.tsx',
      lines: [
        '+ <div className="vc-plantguru-card">',
        '+   <div className="vc-plantguru-scanlines" />',
        '+   <div className="vc-plantguru-dashboard">',
        '+     <span>◆ PlantGuru Mission Control</span>',
        '+     <h2>PlantGuru</h2>',
        '+     <div className="vc-plantguru-sensors" />',
        '+     <span>PLANT STATUS: THRIVING</span>',
        '+   </div>',
        '+ </div>',
      ],
    },
  },
];

// ── WRAP-UP: Josh decides to keep everything and add a lobby ────────────────

export const WRAPUP_COPILOT: CopilotMessage[] = [
  {
    role: 'user',
    text: "you know what, i kinda like it. all of them. every card looks completely different and i don't even care. keep em all. now add a lobby to tie everything together — a hub with doors to each section. throw in a chatbot too, give it AIM buddy energy.",
  },
  {
    role: 'assistant',
    text: "Lobby with door-style navigation to each room. Chatbot gets a retro AIM window and a snarky personality.",
    fileEdit: {
      fileName: 'src/components/Lobby.tsx',
      lines: [
        '+ const Lobby: React.FC = () => (',
        '+   <LobbyLayout>',
        '+     <WelcomeHeader />',
        '+     <RoomGrid>',
        '+       <RoomDoor to="about" label="About" />',
        '+       <RoomDoor to="projects" label="Projects" />',
        '+     </RoomGrid>',
        '+     <ChatBot personality="snarky-aim-buddy" />',
        '+   </LobbyLayout>',
        '+ );',
      ],
    },
  },
];

// ── Grouped sequences for the ProjectsRoom multi-step flow ─────────────────

export interface ProjectVibeStep {
  /** Terminal comment Josh makes between copilot exchanges */
  joshReaction: TerminalLine[];
  /** The copilot exchange for this project */
  copilotMessages: CopilotMessage[];
}

export const PROJECT_VIBE_STEPS: ProjectVibeStep[] = [
  {
    joshReaction: [],
    copilotMessages: INFINITE_LEVELS_COPILOT,
  },
  {
    joshReaction: [
      { type: 'comment', text: 'okay the nested boxes thing is actually sick. next one—' },
    ],
    copilotMessages: FOUR_NINES_COPILOT,
  },
  {
    joshReaction: [
      { type: 'comment', text: 'the scanlines go hard. ok next—' },
    ],
    copilotMessages: MATCH_FIVE_COPILOT,
  },
  {
    joshReaction: [
      { type: 'comment', text: 'ok the floating tiles are actually sick. ship it. next—' },
    ],
    copilotMessages: SURVIVOR_STATS_COPILOT,
  },
  {
    joshReaction: [
      { type: 'comment', text: "the embers rising up are *chef's kiss*. one more—" },
    ],
    copilotMessages: PLANTGURU_COPILOT,
  },
  {
    joshReaction: [
      { type: 'comment', text: '...ok that actually goes hard. a nasa dashboard for a houseplant' },
    ],
    copilotMessages: WRAPUP_COPILOT,
  },
];

// Legacy exports for backward compatibility
export const PROJECTS_HINT_LINES: string[] = [];

export const PROJECTS_ERROR_JOSH_LINES: TerminalLine[] = PROJECTS_INTRO_JOSH_LINES;

export const PROJECTS_TO_LOBBY_COPILOT: CopilotMessage[] = WRAPUP_COPILOT;
