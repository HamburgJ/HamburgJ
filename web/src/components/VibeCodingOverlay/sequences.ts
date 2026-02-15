import { TerminalLine, CopilotMessage } from '../VibeCodingOverlay/VibeCodingOverlay';

// ══════════════════════════════════════════════════════════════════════════════
// ABOUT ROOM — Bug trigger: "Add to Cart" button (no CartProvider exists)
// Josh wonders what happens if he presses it, then reacts when it crashes.
// ══════════════════════════════════════════════════════════════════════════════

export const ABOUT_HINT_LINES: string[] = [
  "that 'add to cart' button looks clickable...",
];

export const ABOUT_ERROR_JOSH_LINES: TerminalLine[] = [
  { type: 'comment', text: 'oh no.' },
];

export const ABOUT_ERROR_TERMINAL_LINES: TerminalLine[] = [
  { type: 'comment', text: 'right... no cart provider. classic.' },
];

export const ABOUT_TO_LOBBY_COPILOT: CopilotMessage[] = [
  {
    role: 'user',
    text: 'scrap it. give me like a homepage or something. idk add a chatbot',
  },
  {
    role: 'assistant',
    text: 'Got it. Building you a lobby with rooms, a chatbot, and a few creative liberties.',
    fileEdit: {
      fileName: 'src/components/Lobby.tsx',
      lines: [
        '+ const Lobby: React.FC = () => (',
        '+   <div className="homepage-or-something">',
        '+     <RoomGrid>',
        '+       <Room to="about" />',
        '+       <Room to="projects" />',
        '+     </RoomGrid>',
        '+     <ChatBot />  {/* idk */}',
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
  { type: 'comment', text: 'hold on...' },
  { type: 'comment', text: 'what does this button do' },
];

export const ABOUT_AUTO_ERROR_LINES: TerminalLine[] = [
  { type: 'error', text: "TypeError: Cannot read properties of undefined (reading 'checkout')" },
  { type: 'error', text: '  at CartProvider.addItem (src/components/Cart.tsx:42:18)' },
  { type: 'comment', text: '...there is no cart provider. why would there be a cart provider.' },
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
