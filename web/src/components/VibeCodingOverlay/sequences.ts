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
  { type: 'comment', text: 'oh, of course. no cart provider. classic.' },
];

export const ABOUT_TO_LOBBY_COPILOT: CopilotMessage[] = [
  {
    role: 'user',
    text: "ok forget the cart, the whole page is a mess. just make me a lobby — a clean hub that links to about and projects. throw in a chatbot too, give it AIM buddy energy.",
  },
  {
    role: 'assistant',
    text: "On it — I'll build a clean lobby with door-style navigation to each room. And for the chatbot I'll give it a retro AIM window with a snarky personality.",
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

// Legacy alias
export const ABOUT_TO_PROJECTS_COPILOT = ABOUT_TO_LOBBY_COPILOT;

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
// Legacy exports for backward compatibility
// ══════════════════════════════════════════════════════════════════════════════

export const PROJECTS_INTRO_JOSH_LINES: TerminalLine[] = [];
export const PROJECTS_HINT_LINES: string[] = [];
export const PROJECTS_ERROR_JOSH_LINES: TerminalLine[] = [];
export const PROJECTS_TO_LOBBY_COPILOT: CopilotMessage[] = ABOUT_TO_LOBBY_COPILOT;

export interface ProjectVibeStep {
  joshReaction: TerminalLine[];
  copilotMessages: CopilotMessage[];
}
export const PROJECT_VIBE_STEPS: ProjectVibeStep[] = [];
