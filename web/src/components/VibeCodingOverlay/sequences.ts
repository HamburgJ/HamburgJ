import { TerminalLine, CopilotMessage } from '../VibeCodingOverlay/VibeCodingOverlay';

// ══════════════════════════════════════════════════════════════════════════════
// ABOUT ROOM — Bug trigger: "Add to Cart" button (no CartProvider exists)
// ══════════════════════════════════════════════════════════════════════════════

export const ABOUT_HINT_LINES: string[] = [
  "that 'add to cart' button looks clickable...",
];

export const ABOUT_ERROR_JOSH_LINES: TerminalLine[] = [
  { type: 'comment', text: 'there is no cart. there was never a cart.' },
];

export const ABOUT_ERROR_TERMINAL_LINES: TerminalLine[] = [
  { type: 'error', text: "TypeError: Cannot read properties of undefined (reading 'checkout')" },
  { type: 'error', text: '  at CartProvider.addItem (src/components/Cart.tsx:42:18)' },
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
// PROJECTS ROOM — Bug trigger: Clicking a project card link (router crash)
// ══════════════════════════════════════════════════════════════════════════════

export const PROJECTS_HINT_LINES: string[] = [
  'try clicking one of those project links...',
];

export const PROJECTS_ERROR_JOSH_LINES: TerminalLine[] = [
  { type: 'error', text: 'Uncaught Error: Navigation outside of app boundary' },
  { type: 'error', text: '  at Router.push (src/router.tsx:24:11)' },
  { type: 'comment', text: 'this whole thing needs a home page' },
];

export const PROJECTS_TO_LOBBY_COPILOT: CopilotMessage[] = [
  {
    role: 'user',
    text: "router crash. this needs a lobby — a hub that ties everything together. also a chatbot. AIM buddy vibes.",
  },
  {
    role: 'assistant',
    text: 'Lobby with door-style navigation to each room. Chatbot gets a retro AIM window and a snarky personality.',
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
