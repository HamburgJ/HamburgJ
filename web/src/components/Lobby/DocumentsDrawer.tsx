import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import StarBattle from './StarBattle';

/**
 * DocumentsDrawer — A hidden easter egg in the lobby.
 * Looks like a tiny filing cabinet in the corner. Clicking it opens a fake
 * OS‑style file explorer with absurd "files" the user can interact with.
 */

// ── File definitions ───────────────────────────────────────────────────────

interface VirtualFile {
  name: string;
  icon: string; // emoji
  type: 'rickroll' | 'text' | 'browser' | 'photos' | 'virus' | 'system32' | 'game' | 'starbattle';
  content?: string;
}

const FILES: VirtualFile[] = [
  {
    name: 'definitely_not_passwords.txt',
    icon: '🔒',
    type: 'rickroll',
  },
  {
    name: 'todo.txt',
    icon: '📝',
    type: 'text',
    content: `TODO LIST\n=========\n\n[x] wake up\n[x] update this if someone is looking\n[ ] finish portfolio website\n[ ] finish OTHER portfolio website\n[ ] learn kubernetes (been on list since 2021)\n[ ] reply to that email from 6 months ago\n[ ] water the plants (RIP)\n[ ] figure out what "synergy" means\n[x] add easter eggs to portfolio\n[ ] add easter eggs to the easter eggs\n[ ] open source ligma\n[ ] invent new sorting algorithm\n    (current idea: BogoSort but with AI)\n[x] eat a hamburger (personal brand synergy)\n[ ] delete this file before someone finds it\n[ ] seriously delete this file\n[ ] WHY IS THIS FILE STILL HERE`,
  },
  {
    name: 'free_bitcoin.exe',
    icon: '💰',
    type: 'virus',
  },
  {
    name: 'System32/',
    icon: '📁',
    type: 'system32',
  },
  {
    name: 'my_browser.exe',
    icon: '🌐',
    type: 'browser',
  },
  {
    name: 'vacation_photos/',
    icon: '🏖️',
    type: 'photos',
  },
  {
    name: 'GAME.exe',
    icon: '🎮',
    type: 'game',
  },
  {
    name: 'burger_battle.exe',
    icon: '🍔',
    type: 'starbattle',
  },
];

// ── Sub-views ──────────────────────────────────────────────────────────────

const TextViewer: React.FC<{ file: VirtualFile; onBack: () => void }> = ({ file, onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '6px 10px', borderBottom: '1px solid #3c3c3c', background: '#252526',
    }}>
      <button onClick={onBack} style={{ ...btnBase, fontSize: '0.75rem' }}>← Back</button>
      <span style={{ fontWeight: 600, fontSize: '0.8rem', color: '#ccc' }}>{file.name}</span>
    </div>
    <pre style={{
      flex: 1, margin: 0, padding: 12, fontSize: '0.72rem', lineHeight: 1.5,
      fontFamily: "'Courier Prime', 'Courier New', monospace",
      overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
      background: '#1e1e1e', color: '#d4d4d4',
    }}>
      {file.content}
    </pre>
  </div>
);

const PhotosViewer: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  // Hamburger stock photos from placeholder services
  const photos = [
    { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Hamburger_%28black_bg%29.jpg/800px-Hamburger_%28black_bg%29.jpg', caption: 'Beautiful sunset in Bali' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RedDot_Burger.jpg/800px-RedDot_Burger.jpg', caption: 'The Eiffel Tower' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/NCI_Visuals_Food_Hamburger.jpg/800px-NCI_Visuals_Food_Hamburger.jpg', caption: 'Grand Canyon' },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 10px', borderBottom: '1px solid #e0e0e0', background: '#f8f8f8',
      }}>
        <button onClick={onBack} style={{ ...btnBase, fontSize: '0.75rem' }}>← Back</button>
        <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>📸 vacation_photos/</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {photos.map((p, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <img
              src={p.src}
              alt={p.caption}
              style={{ width: '100%', maxWidth: 280, borderRadius: 8, border: '1px solid #eee' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <p style={{ fontSize: '0.7rem', color: '#888', marginTop: 4, fontStyle: 'italic' }}>{p.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const VirusPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [count, setCount] = useState(0);
  const [popups, setPopups] = useState([{ id: 0, x: 0, y: 0 }]);

  const addPopup = useCallback((closingId: number) => {
    setCount(c => c + 1);
    setPopups(prev => [
      ...prev.filter(p => p.id !== closingId),
      { id: Date.now(), x: Math.random() * 160 - 80, y: Math.random() * 120 - 60 },
      { id: Date.now() + 1, x: Math.random() * 160 - 80, y: Math.random() * 120 - 60 },
    ]);
  }, []);

  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,180,0.85)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      zIndex: 10, overflow: 'hidden',
    }}>
      {/* BSOD-style background text */}
      <div style={{ color: '#fff', fontFamily: 'monospace', fontSize: '0.7rem', textAlign: 'center', padding: 20 }}>
        <p style={{ fontSize: '1.2rem', marginBottom: 8 }}>:(</p>
        <p>Your PC ran into a problem.</p>
        <p style={{ margin: '8px 0' }}>VIRUS_DETECTED_TOTALLY_REAL</p>
        <p style={{ fontSize: '0.6rem', opacity: 0.7 }}>
          {count > 3 ? 'Ok you can stop clicking now' : 'If you\'d like to know more, you can\'t.'}
        </p>
        {count > 5 && <p style={{ fontSize: '0.6rem', marginTop: 8 }}>Seriously. Stop.</p>}
        {count > 8 && <p style={{ fontSize: '0.6rem' }}>Fine. I'll let you leave.</p>}
      </div>
      {/* Error dialogs that multiply */}
      {popups.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          top: `calc(50% + ${p.y}px - 40px)`,
          left: `calc(50% + ${p.x}px - 80px)`,
          width: 160, background: '#fff', border: '2px solid #c00',
          borderRadius: 4, boxShadow: '2px 2px 8px rgba(0,0,0,0.4)',
          fontFamily: 'sans-serif', fontSize: '0.65rem', overflow: 'hidden',
        }}>
          <div style={{ background: '#c00', color: '#fff', padding: '2px 6px', fontSize: '0.6rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>⚠ Error</span>
          </div>
          <div style={{ padding: '8px 6px', textAlign: 'center' }}>
            <p>VIRUS DETECTED!</p>
            <button onClick={() => addPopup(p.id)} style={{
              marginTop: 6, padding: '3px 16px', fontSize: '0.6rem',
              border: '1px solid #999', borderRadius: 3, cursor: 'pointer',
              background: '#f0f0f0',
            }}>
              OK
            </button>
          </div>
        </div>
      ))}
      {count > 8 && (
        <button onClick={onClose} style={{
          position: 'absolute', bottom: 20,
          padding: '6px 20px', background: '#fff', border: '2px solid #444',
          borderRadius: 4, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
        }}>
          Actually close
        </button>
      )}
      {count <= 8 && (
        <button onClick={onClose} style={{
          position: 'absolute', bottom: 12, right: 12, fontSize: '0.5rem',
          color: 'rgba(255,255,255,0.2)', background: 'none', border: 'none', cursor: 'pointer',
        }}>
          [esc]
        </button>
      )}
    </div>
  );
};

const System32Dialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [stage, setStage] = useState<'confirm' | 'deleting' | 'bsod'>('confirm');
  const [progress, setProgress] = useState(0);
  const [bsodPercent, setBsodPercent] = useState(0);
  const [showContinue, setShowContinue] = useState(false);

  // Deletion progress bar
  useEffect(() => {
    if (stage === 'deleting') {
      const iv = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(iv);
            setStage('bsod');
            return 100;
          }
          return p + Math.random() * 8;
        });
      }, 150);
      return () => clearInterval(iv);
    }
  }, [stage]);

  // BSOD percentage counter (0→100 over ~7 seconds) and "click to continue"
  useEffect(() => {
    if (stage !== 'bsod') return;
    setBsodPercent(0);
    setShowContinue(false);

    const iv = setInterval(() => {
      setBsodPercent(p => {
        const next = p + Math.random() * 3 + 0.5;
        if (next >= 100) {
          clearInterval(iv);
          return 100;
        }
        return next;
      });
    }, 200);

    const timer = setTimeout(() => {
      setShowContinue(true);
    }, 7500);

    return () => {
      clearInterval(iv);
      clearTimeout(timer);
    };
  }, [stage]);

  // Confirmation & deletion dialog (inside the Finder window)
  if (stage === 'confirm' || stage === 'deleting') {
    return (
      <div style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
      }}>
        <div style={{
          background: '#f0f0f0', border: '2px solid #666', borderRadius: 6,
          width: 280, fontFamily: 'sans-serif', fontSize: '0.75rem', overflow: 'hidden',
          boxShadow: '4px 4px 16px rgba(0,0,0,0.3)',
        }}>
          <div style={{ background: '#0078d4', color: '#fff', padding: '4px 8px', fontSize: '0.7rem' }}>
            ⚠ Windows Security
          </div>
          <div style={{ padding: 16, textAlign: 'center' }}>
            {stage === 'confirm' && (
              <>
                <p style={{ marginBottom: 12 }}>
                  Are you sure you want to delete <strong>C:\Windows\System32</strong>?
                </p>
                <p style={{ fontSize: '0.65rem', color: '#666', marginBottom: 16 }}>
                  This action cannot be undone. Your computer will become a very expensive paperweight.
                </p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <button onClick={() => setStage('deleting')} style={{
                    padding: '4px 16px', background: '#c00', color: '#fff', border: 'none',
                    borderRadius: 3, cursor: 'pointer', fontSize: '0.7rem',
                  }}>
                    Delete it
                  </button>
                  <button onClick={onClose} style={{
                    padding: '4px 16px', background: '#e0e0e0', border: '1px solid #999',
                    borderRadius: 3, cursor: 'pointer', fontSize: '0.7rem',
                  }}>
                    I value my computer
                  </button>
                </div>
              </>
            )}
            {stage === 'deleting' && (
              <>
                <p style={{ marginBottom: 8 }}>Deleting System32...</p>
                <div style={{
                  width: '100%', height: 16, background: '#ddd', borderRadius: 8, overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', background: '#c00', borderRadius: 8,
                    width: `${Math.min(progress, 100)}%`, transition: 'width 0.15s',
                  }} />
                </div>
                <p style={{ fontSize: '0.6rem', color: '#999', marginTop: 6 }}>
                  {progress < 30 ? 'Removing core services...' :
                    progress < 60 ? 'Deleting boot sector...' :
                    progress < 85 ? 'Formatting happiness...' :
                    'Almost there...'}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // BSOD — full-screen portal on document.body
  return ReactDOM.createPortal(
    <div
      onClick={showContinue ? onClose : undefined}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#0078D7',
        color: '#fff',
        fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '10vh 12vw',
        cursor: showContinue ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      {/* Sad face */}
      <div style={{ fontSize: 'clamp(80px, 15vw, 140px)', fontWeight: 100, lineHeight: 1, marginBottom: '2vh' }}>
        :(
      </div>

      {/* Main message */}
      <div style={{ fontSize: 'clamp(16px, 2.5vw, 28px)', fontWeight: 300, marginBottom: '2vh', maxWidth: 700 }}>
        Your PC ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.
      </div>

      {/* Percentage */}
      <div style={{ fontSize: 'clamp(14px, 2vw, 22px)', fontWeight: 300, marginBottom: '5vh' }}>
        {Math.min(Math.floor(bsodPercent), 100)}% complete
      </div>

      {/* QR code + stop code section */}
      <div style={{ display: 'flex', gap: '2vw', alignItems: 'flex-start' }}>
        {/* Fake QR code */}
        <div style={{
          width: 'clamp(60px, 10vw, 100px)',
          height: 'clamp(60px, 10vw, 100px)',
          background: '#fff',
          borderRadius: 4,
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gridTemplateRows: 'repeat(7, 1fr)',
          gap: 1,
          padding: 4,
          flexShrink: 0,
        }}>
          {Array.from({ length: 49 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: [0,1,2,4,5,6,7,13,14,20,21,27,28,34,35,41,42,43,44,46,47,48,
                  8,10,12,16,18,22,24,26,30,32,36,38,40].includes(i)
                  ? '#000' : '#fff',
                borderRadius: 1,
              }}
            />
          ))}
        </div>

        <div style={{ fontSize: 'clamp(9px, 1.2vw, 13px)', fontWeight: 300, lineHeight: 1.8 }}>
          <div>For more information about this issue and possible fixes,</div>
          <div>visit https://www.windows.com/stopcode</div>
          <div style={{ marginTop: '1.5vh' }}>
            If you call a support person, give them this info:
          </div>
          <div>Stop code: PORTFOLIO_EXCEPTION</div>
        </div>
      </div>

      {/* Click to continue — fades in after 7s */}
      <div style={{
        position: 'absolute',
        bottom: '6vh',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 'clamp(11px, 1.4vw, 16px)',
        fontWeight: 300,
        opacity: showContinue ? 1 : 0,
        transition: 'opacity 1.5s ease-in',
        pointerEvents: 'none',
      }}>
        Click anywhere to continue
      </div>
    </div>,
    document.body
  );
};

const BrowserView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    {/* Fake browser chrome */}
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '4px 8px', background: '#252526', borderBottom: '1px solid #3c3c3c',
    }}>
      <button onClick={onBack} style={{ ...btnBase, fontSize: '0.7rem' }}>← Back</button>
      <div style={{
        flex: 1, background: '#1e1e1e', border: '1px solid #3c3c3c', borderRadius: 12,
        padding: '2px 10px', fontSize: '0.65rem', color: '#999',
        fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', gap: 4,
      }}>
        <span style={{ color: '#0a0' }}>🔒</span>
        hamburgj.github.io
      </div>
    </div>
    <div style={{ flex: 1, position: 'relative' }}>
      <iframe
        src={window.location.href}
        title="Inception Browser"
        style={{
          width: '100%', height: '100%', border: 'none',
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }}
        sandbox="allow-scripts allow-same-origin"
      />
      <div style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '4px 12px',
        borderRadius: 12, fontSize: '0.6rem', fontFamily: 'sans-serif', whiteSpace: 'nowrap',
      }}>
        🤯 It's the same website. Inside the website. We need to go deeper.
      </div>
    </div>
  </div>
);

// ── Mini game: Catch the Hamburger ─────────────────────────────────────────

const MiniGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const rafRef = useRef(0);
  const stateRef = useRef({
    playerX: 120,
    obstacles: [] as { x: number; y: number; type: 'burger' | 'bomb' }[],
    frame: 0,
    score: 0,
    speed: 2,
    alive: true,
  });

  const startGame = useCallback(() => {
    const s = stateRef.current;
    s.playerX = 120;
    s.obstacles = [];
    s.frame = 0;
    s.score = 0;
    s.speed = 2;
    s.alive = true;
    setScore(0);
    setGameOver(false);
    setStarted(true);
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;

    const loop = () => {
      const s = stateRef.current;
      if (!s.alive) return;
      s.frame++;

      // spawn
      if (s.frame % Math.max(20, 40 - Math.floor(s.score / 3)) === 0) {
        s.obstacles.push({
          x: Math.random() * (W - 20),
          y: -20,
          type: Math.random() > 0.3 ? 'burger' : 'bomb',
        });
      }

      // move
      s.obstacles.forEach(o => { o.y += s.speed; });
      s.speed = 2 + s.score * 0.15;

      // collisions
      s.obstacles = s.obstacles.filter(o => {
        if (o.y > H) return false;
        const hit = Math.abs(o.x - s.playerX) < 22 && Math.abs(o.y - (H - 24)) < 22;
        if (hit) {
          if (o.type === 'bomb') {
            s.alive = false;
            setGameOver(true);
          } else {
            s.score++;
            setScore(s.score);
          }
          return false;
        }
        return true;
      });

      // draw
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, W, H);

      // player
      ctx.font = '20px serif';
      ctx.fillText('🍔', s.playerX - 10, H - 10);

      // obstacles
      s.obstacles.forEach(o => {
        ctx.font = '18px serif';
        ctx.fillText(o.type === 'burger' ? '🍔' : '💣', o.x - 9, o.y + 9);
      });

      // score
      ctx.fillStyle = '#fff';
      ctx.font = '11px monospace';
      ctx.fillText(`Score: ${s.score}`, 6, 14);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [started, gameOver]);

  useEffect(() => {
    if (!started) return;
    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') s.playerX = Math.max(10, s.playerX - 18);
      if (e.key === 'ArrowRight' || e.key === 'd') s.playerX = Math.min(canvas.width - 10, s.playerX + 18);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [started]);

  // Touch controls
  const handleCanvasTouch = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    stateRef.current.playerX = Math.max(10, Math.min(canvas.width - 10, clientX - rect.left));
  }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#111' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '4px 8px', background: '#222', borderBottom: '1px solid #333',
      }}>
        <button onClick={onBack} style={{ ...btnBase, fontSize: '0.7rem', color: '#aaa', background: '#333', border: '1px solid #555' }}>← Back</button>
        <span style={{ fontWeight: 600, fontSize: '0.75rem', color: '#0f0', fontFamily: 'monospace' }}>GAME.exe</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 8 }}>
        {!started ? (
          <div style={{ textAlign: 'center', color: '#ccc', fontFamily: 'monospace' }}>
            <p style={{ fontSize: '1.4rem', marginBottom: 8 }}>🍔</p>
            <p style={{ fontSize: '0.85rem', marginBottom: 4, color: '#0f0' }}>CATCH THE HAMBURGER</p>
            <p style={{ fontSize: '0.6rem', color: '#888', marginBottom: 12 }}>
              Arrow keys or tap to move. Catch 🍔, avoid 💣
            </p>
            <button onClick={startGame} style={{
              padding: '6px 24px', background: '#0f0', color: '#111', border: 'none',
              borderRadius: 4, cursor: 'pointer', fontFamily: 'monospace', fontWeight: 700,
            }}>
              START
            </button>
          </div>
        ) : (
          <>
            <canvas
              ref={canvasRef}
              width={260}
              height={320}
              style={{ border: '1px solid #333', borderRadius: 4, cursor: 'pointer', touchAction: 'none' }}
              onMouseMove={handleCanvasTouch}
              onTouchMove={handleCanvasTouch}
            />
            {gameOver && (
              <div style={{ textAlign: 'center', marginTop: 10, color: '#ccc', fontFamily: 'monospace' }}>
                <p style={{ color: '#f44', fontSize: '0.85rem' }}>GAME OVER</p>
                <p style={{ fontSize: '0.7rem', margin: '4px 0' }}>
                  {score < 5 ? 'You caught a measly' : score < 15 ? 'Not bad!' : score < 30 ? 'Impressive!' : 'LEGENDARY!!'} {score} burger{score !== 1 ? 's' : ''}
                </p>
                <button onClick={startGame} style={{
                  marginTop: 6, padding: '4px 20px', background: '#0f0', color: '#111',
                  border: 'none', borderRadius: 4, cursor: 'pointer', fontFamily: 'monospace', fontWeight: 700,
                }}>
                  RETRY
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ── Shared styles ──────────────────────────────────────────────────────────

const btnBase: React.CSSProperties = {
  background: '#333',
  border: '1px solid #555',
  borderRadius: 3,
  cursor: 'pointer',
  padding: '2px 8px',
  fontFamily: 'inherit',
  color: '#ccc',
};

// ── Main component ─────────────────────────────────────────────────────────

const DocumentsDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [activeFile, setActiveFile] = useState<VirtualFile | null>(null);
  const [showVirus, setShowVirus] = useState(false);
  const [showSystem32, setShowSystem32] = useState(false);
  const [windowPos, setWindowPos] = useState({ x: 40, y: 60 });
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Reset sub-views when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setActiveFile(null);
      setShowVirus(false);
      setShowSystem32(false);
    }
  }, [isOpen]);

  const handleFileClick = (file: VirtualFile) => {
    switch (file.type) {
      case 'text':
        setActiveFile(file);
        break;
      case 'rickroll':
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
        break;
      case 'virus':
        setShowVirus(true);
        break;
      case 'system32':
        setShowSystem32(true);
        break;
      case 'browser':
        setActiveFile(file);
        break;
      case 'photos':
        setActiveFile(file);
        break;
      case 'game':
        setActiveFile(file);
        break;
      case 'starbattle':
        setActiveFile(file);
        break;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    dragOffset.current = { x: e.clientX - windowPos.x, y: e.clientY - windowPos.y };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setWindowPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    };
    const handleMouseUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const renderFileContent = () => {
    if (!activeFile) return null;
    const goBack = () => setActiveFile(null);
    if (activeFile.type === 'text') return <TextViewer file={activeFile} onBack={goBack} />;
    if (activeFile.type === 'browser') return <BrowserView onBack={goBack} />;
    if (activeFile.type === 'photos') return <PhotosViewer onBack={goBack} />;
    if (activeFile.type === 'game') return <MiniGame onBack={goBack} />;
    if (activeFile.type === 'starbattle') return <StarBattle onBack={goBack} />;
    return null;
  };

  return (
    <>
      <style>{`
        .docs-window {
          position: fixed;
          z-index: 9000;
          background: #1e1e1e;
          border: 1px solid #3c3c3c;
          border-radius: 8px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 2px 12px rgba(0,0,0,0.3);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
          font-size: 0.8rem;
        }
        .docs-titlebar {
          display: flex;
          align-items: center;
          padding: 0 8px 0 12px;
          height: 36px;
          background: #323233;
          border-bottom: 1px solid #252526;
          cursor: grab;
          user-select: none;
          gap: 8px;
        }
        .docs-titlebar:active { cursor: grabbing; }
        .docs-title {
          flex: 1;
          font-size: 12px;
          font-weight: 400;
          color: #cccccc;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .docs-close-btn {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          border-radius: 4px;
          transition: background 0.15s, color 0.15s;
          font-size: 16px;
          line-height: 1;
        }
        .docs-close-btn:hover {
          background: #c42b1c;
          color: #fff;
        }
        .docs-sidebar {
          width: 44px;
          background: #252526;
          border-right: 1px solid #3c3c3c;
          padding: 8px 0;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .docs-sidebar-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          color: #666;
          cursor: default;
          font-size: 16px;
          transition: color 0.15s;
          border-left: 2px solid transparent;
        }
        .docs-sidebar-icon.active {
          color: #cccccc;
          border-left-color: #007acc;
        }
        .docs-tree-header {
          padding: 8px 12px 6px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #888;
          border-bottom: 1px solid #3c3c3c;
        }
        .docs-file-grid {
          flex: 1;
          padding: 8px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 4px;
          align-content: start;
          overflow-y: auto;
        }
        .docs-file-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 10px 6px;
          border-radius: 4px;
          cursor: pointer;
          border: none;
          background: none;
          font-family: inherit;
          transition: background 0.15s;
        }
        .docs-file-item:hover {
          background: rgba(255,255,255,0.06);
        }
        .docs-file-item:active {
          background: rgba(0,120,212,0.15);
        }
        .docs-file-icon {
          font-size: 1.8rem;
          line-height: 1;
        }
        .docs-file-name {
          font-size: 0.6rem;
          color: #ccc;
          text-align: center;
          word-break: break-all;
          line-height: 1.25;
          max-width: 80px;
        }
        @media (max-width: 600px) {
          .docs-window {
            width: calc(100vw - 20px) !important;
            height: calc(100vh - 100px) !important;
            left: 10px !important;
            top: 50px !important;
          }
        }
      `}</style>

      {/* File explorer window */}
      {isOpen && (
        <div
          className="docs-window"
          style={{
            left: windowPos.x,
            top: windowPos.y,
            width: 540,
            height: 520,
          }}
        >
          {/* Title bar (draggable, VS Code style) */}
          <div className="docs-titlebar" onMouseDown={handleMouseDown}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="#cccccc" aria-hidden="true">
              <path d="M1.5 1h5l1 2H14.5a.5.5 0 01.5.5v10a.5.5 0 01-.5.5h-13a.5.5 0 01-.5-.5v-12a.5.5 0 01.5-.5z" />
            </svg>
            <span className="docs-title">
              {activeFile ? activeFile.name : 'josh_documents'}
            </span>
            <button className="docs-close-btn" onClick={onClose} aria-label="Close">
              ×
            </button>
          </div>

          {/* Content area */}
          {activeFile ? (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              {renderFileContent()}
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              {/* Activity Bar */}
              <div className="docs-sidebar">
                <div className="docs-sidebar-icon active" title="Explorer">
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M1.5 1h5l1 2H14.5a.5.5 0 01.5.5v10a.5.5 0 01-.5.5h-13a.5.5 0 01-.5-.5v-12a.5.5 0 01.5-.5z" />
                  </svg>
                </div>
                <div className="docs-sidebar-icon" title="Search">
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M11.742 10.344a6.5 6.5 0 10-1.397 1.398h-.001l3.85 3.85a1 1 0 001.415-1.414l-3.867-3.834zM12 6.5a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z" />
                  </svg>
                </div>
                <div className="docs-sidebar-icon" title="Settings">
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M8 4.754a3.246 3.246 0 100 6.492 3.246 3.246 0 000-6.492zM5.754 8a2.246 2.246 0 114.492 0 2.246 2.246 0 01-4.492 0z" />
                    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0a1.846 1.846 0 01-2.757.986c-1.532-1.08-3.494.882-2.414 2.414a1.846 1.846 0 01-.986 2.757c-1.79.527-1.79 3.065 0 3.592a1.846 1.846 0 01.986 2.757c-1.08 1.532.882 3.494 2.414 2.414a1.846 1.846 0 012.757.986c.527 1.79 3.065 1.79 3.592 0a1.846 1.846 0 012.757-.986c1.532 1.08 3.494-.882 2.414-2.414a1.846 1.846 0 01.986-2.757c1.79-.527 1.79-3.065 0-3.592a1.846 1.846 0 01-.986-2.757c1.08-1.532-.882-3.494-2.414-2.414a1.846 1.846 0 01-2.757-.986z" />
                  </svg>
                </div>
              </div>

              {/* File grid area */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="docs-tree-header">josh_documents</div>
                <div className="docs-file-grid">
                  {FILES.map((file, i) => (
                    <button
                      key={i}
                      className="docs-file-item"
                      onClick={() => handleFileClick(file)}
                      onDoubleClick={() => handleFileClick(file)}
                    >
                      <span className="docs-file-icon">{file.icon}</span>
                      <span className="docs-file-name">{file.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Virus overlay */}
          {showVirus && <VirusPopup onClose={() => setShowVirus(false)} />}

          {/* System32 dialog */}
          {showSystem32 && <System32Dialog onClose={() => setShowSystem32(false)} />}

          {/* Status bar */}
          {!activeFile && (
            <div style={{
              padding: '4px 12px', borderTop: '1px solid #3c3c3c', background: '#007acc',
              fontSize: '0.55rem', color: '#fff', display: 'flex', justifyContent: 'space-between',
            }}>
              <span>{FILES.length} items</span>
              <span>4.2 GB available</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DocumentsDrawer;
