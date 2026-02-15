import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import StarBattle from './StarBattle';
import { projects, Project } from '../../data/projects';

/**
 * DocumentsDrawer
 * A dark-themed "retro OS" style file explorer.
 */

// ── File definitions ───────────────────────────────────────────────────────

interface VirtualFile {
  name: string;
  icon: string;
  type: 'rickroll' | 'text' | 'browser' | 'photos' | 'virus' | 'system32' | 'starbattle' | 'folder' | 'project';
  content?: string;
  children?: VirtualFile[];
  projectData?: Project;
  date?: string;
  size?: string;
}

const PROJECT_ICON_MAP: Record<string, string> = {
  'Survivor Stats': '📊',
  'Infinite Levels!': '♾️',
  'Four Nines': '🔢',
  'Match Five': '🔤',
  'PlantGuru': '🌱',
};

const PROJECT_FILES: VirtualFile[] = projects.map(p => ({
  name: p.name,
  icon: PROJECT_ICON_MAP[p.name] || '📦',
  type: 'project',
  projectData: p,
  date: 'Today',
  size: '1.2 MB'
}));

const FILES: VirtualFile[] = [
  {
    name: 'Projects',
    icon: '📂',
    type: 'folder',
    children: PROJECT_FILES,
    date: 'Yesterday',
    size: '<DIR>'
  },
  {
    name: 'passwords.txt',
    icon: '🔒',
    type: 'rickroll',
    date: '10/24/2004',
    size: '1 KB'
  },
  {
    name: 'todo.txt',
    icon: '📝',
    type: 'text',
    content: `TODO LIST\n=========\n\n[x] wake up\n[x] redesign interface\n[ ] finish portfolio website\n[ ] learn kubernetes\n[ ] water the plants\n[ ] figure out "cloud"\n[ ] eat a hamburger\n[ ] delete this file`,
    date: '02/15/2026',
    size: '2 KB'
  },
  {
    name: 'free_btc.exe',
    icon: '💰',
    type: 'virus',
    date: 'Unknown',
    size: '999 GB'
  },
  {
    name: 'System32',
    icon: '⚙️',
    type: 'system32',
    date: '01/01/1970',
    size: '<DIR>'
  },
  {
    name: 'Internet',
    icon: '🌐',
    type: 'browser',
    date: 'Now',
    size: '0 KB'
  },
  {
    name: 'My Photos',
    icon: '📷',
    type: 'photos',
    date: 'Summer 04',
    size: '<DIR>'
  },
  {
    name: 'Burger Battle',
    icon: '🍔',
    type: 'starbattle',
    date: 'Today',
    size: '12 MB'
  },
];

// ── Shared Styles & Assets ─────────────────────────────────────────────────

const ACCENT_COLORS = ['#FF4081', '#FF6D00', '#00E676', '#2979FF', '#00BCD4'];

// ── Sub-views ──────────────────────────────────────────────────────────────

const StandardWindowLayout: React.FC<{ 
  title: string; 
  onBack: () => void; 
  children: React.ReactNode; 
  accent: string;
}> = ({ title, onBack, children, accent }) => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#1e1e1e' }}>
    {/* Toolbar */}
    <div style={{ 
      background: '#2a2a2a', borderBottom: '1px solid #444', padding: '6px',
      display: 'flex', gap: '8px', alignItems: 'center'
    }}>
      <button onClick={onBack} style={{ 
        display: 'flex', alignItems: 'center', gap: '4px',
        border: '1px solid #555', borderRadius: '3px', background: 'linear-gradient(#3a3a3a, #2a2a2a)',
        padding: '2px 8px', cursor: 'pointer', fontFamily: 'inherit', color: '#ccc'
      }}>
        <span style={{color: '#aaa'}}>⬅</span> Back
      </button>
      <div style={{ height: '20px', width: '1px', background: '#555', margin: '0 4px' }} />
      <span style={{ fontSize: '0.8rem', color: '#888' }}>Address:</span>
      <div style={{ 
        background: '#111', border: '1px solid #555', padding: '2px 6px', flex: 1,
        fontSize: '0.8rem', color: '#ccc', boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.3)'
      }}>
        Computer\{title}
      </div>
    </div>
    
    {/* Content */}
    <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
      {children}
    </div>
  </div>
);

const TextViewer: React.FC<{ file: VirtualFile; onBack: () => void; accent: string }> = ({ file, onBack, accent }) => (
  <StandardWindowLayout title={file.name} onBack={onBack} accent={accent}>
    <textarea 
      readOnly
      value={file.content} 
      style={{
        width: '100%', height: '100%', border: 'none', padding: '20px',
        fontFamily: "'Courier New', monospace", fontSize: '0.9rem', resize: 'none',
        outline: 'none', color: '#0f0', background: '#111'
      }}
    />
  </StandardWindowLayout>
);

const PhotosViewer: React.FC<{ onBack: () => void; accent: string }> = ({ onBack, accent }) => {
  const photos = [
    { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Hamburger_%28black_bg%29.jpg/800px-Hamburger_%28black_bg%29.jpg', caption: 'Sunset in Bali' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RedDot_Burger.jpg/800px-RedDot_Burger.jpg', caption: 'Paris Trip' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/NCI_Visuals_Food_Hamburger.jpg/800px-NCI_Visuals_Food_Hamburger.jpg', caption: 'Family Reunion' },
  ];
  return (
    <StandardWindowLayout title="My Photos" onBack={onBack} accent={accent}>
      <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px', background: '#1e1e1e' }}>
        {photos.map((p, i) => (
          <div key={i} style={{ 
            background: '#2a2a2a', border: '1px solid #444', padding: '8px', 
            boxShadow: '2px 2px 5px rgba(0,0,0,0.3)', transform: `rotate(${Math.random() * 4 - 2}deg)`
          }}>
            <div style={{ height: '100px', background: '#333', overflow: 'hidden', marginBottom: '8px' }}>
              <img src={p.src} alt={p.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                   onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#ccc' }}>{p.caption}</p>
          </div>
        ))}
      </div>
    </StandardWindowLayout>
  );
};

const ProjectViewer: React.FC<{ file: VirtualFile; onBack: () => void; accent: string }> = ({ file, onBack, accent }) => {
  const p = file.projectData;
  if (!p) return <div>Error</div>;
  return (
    <StandardWindowLayout title={p.name} onBack={onBack} accent={accent}>
      <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#eee' }}>{p.name}</h1>
        <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '20px' }}>Version 1.0 • Shareware</div>
        <div style={{ height: '2px', background: accent, width: '50px', marginBottom: '20px' }} />
        <p style={{ lineHeight: 1.6, color: '#bbb', marginBottom: '30px' }}>{p.description}</p>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          {p.liveUrl && (
            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" style={{
              background: accent, color: '#fff', textDecoration: 'none', padding: '8px 16px', borderRadius: '4px',
              fontWeight: 'bold', boxShadow: '2px 2px 0 rgba(0,0,0,0.4)'
            }}>
              Launch Application
            </a>
          )}
          {p.repoUrl && (
            <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" style={{
              background: '#333', color: '#ccc', textDecoration: 'none', padding: '8px 16px', borderRadius: '4px',
              border: '1px solid #555'
            }}>
              Source Code
            </a>
          )}
        </div>
      </div>
    </StandardWindowLayout>
  );
};

const VirusPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      width: '300px', background: '#2a2a2a', border: '2px solid #555',
      borderRightColor: '#222', borderBottomColor: '#222',
      boxShadow: '4px 4px 10px rgba(0,0,0,0.6)', zIndex: 100
    }}>
      <div style={{ 
        background: 'linear-gradient(to right, #c0392b, #e74c3c)', padding: '4px 8px', 
        color: '#fff', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' 
      }}>
        <span>System Alert</span>
        <button onClick={onClose} style={{ background: '#d44',border:'1px solid #fff', color:'#fff', width:'18px', height:'18px', lineHeight:1, cursor:'pointer' }}>x</button>
      </div>
      <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', color: '#ccc' }}>
        <div style={{ fontSize: '2rem' }}>🚫</div>
        <div>
          <p style={{ marginBottom: '8px', fontSize: '0.85rem' }}>A fatal exception 0E has occurred at 0028:C00068F8 in VXD VMM(01).</p>
          <p style={{ fontSize: '0.85rem' }}>This is not a real virus. Do not panic.</p>
        </div>
      </div>
      <div style={{ padding: '10px', display: 'flex', justifyContent: 'center' }}>
        <button onClick={onClose} style={{ padding: '4px 20px', background: '#444', color: '#ccc', border: '1px solid #666', cursor: 'pointer' }}>OK</button>
      </div>
    </div>
  );
};

const System32DeleteModal: React.FC<{ onCancel: () => void; onDelete: () => void }> = ({ onCancel, onDelete }) => {
  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      width: '340px', background: '#2a2a2a', border: '2px solid #555',
      boxShadow: '4px 4px 10px rgba(0,0,0,0.6)', zIndex: 100
    }}>
      <div style={{ 
        background: 'linear-gradient(to right, #c0392b, #e74c3c)', padding: '4px 8px', 
        color: '#fff', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' 
      }}>
        <span>⚠️ Confirm Delete</span>
        <button onClick={onCancel} style={{ background: '#d44',border:'1px solid #fff', color:'#fff', width:'18px', height:'18px', lineHeight:1, cursor:'pointer' }}>x</button>
      </div>
      <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', color: '#ccc' }}>
        <div style={{ fontSize: '2.5rem' }}>⚠️</div>
        <div>
          <p style={{ marginBottom: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>Are you sure you want to delete System32?</p>
          <p style={{ fontSize: '0.8rem', color: '#999' }}>This action will permanently destroy your operating system. This cannot be undone.</p>
        </div>
      </div>
      <div style={{ padding: '10px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <button onClick={onDelete} style={{ padding: '4px 20px', background: '#c0392b', color: '#fff', border: '1px solid #e74c3c', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
        <button onClick={onCancel} style={{ padding: '4px 20px', background: '#444', color: '#ccc', border: '1px solid #666', cursor: 'pointer' }}>Cancel</button>
      </div>
    </div>
  );
};

const BSOD: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [showCursor, setShowCursor] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => setShowCursor(c => !c), 500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999,
      background: '#0000AA', color: '#fff', fontFamily: "'Courier New', monospace",
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      padding: '40px'
    }}>
      <div style={{ maxWidth: '600px', textAlign: 'center' }}>
        <div style={{ background: '#aaa', color: '#0000AA', display: 'inline-block', padding: '2px 12px', fontWeight: 'bold', marginBottom: '24px', fontSize: '1.1rem' }}>
          Josh OS
        </div>
        <p style={{ marginBottom: '16px', lineHeight: 1.6 }}>
          A fatal exception has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36.
        </p>
        <p style={{ marginBottom: '16px', lineHeight: 1.6 }}>
          The current application will be terminated.
        </p>
        <p style={{ marginBottom: '16px', lineHeight: 1.6 }}>
          SYSTEM32 has been deleted. All your files are gone. Everything is ruined. We hope you're happy.
        </p>
        <p style={{ marginBottom: '24px', lineHeight: 1.6 }}>
          *&nbsp;&nbsp;Press any key to restart your computer.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*<br/>
          *&nbsp;&nbsp;You will lose any unsaved information in all applications.&nbsp;*
        </p>
        <p>
          Press any key to continue {showCursor ? '█' : ' '}
        </p>
      </div>
    </div>
  );
};

const BrowserViewer: React.FC<{ onBack: () => void; accent: string }> = ({ onBack, accent }) => (
  <StandardWindowLayout title="Internet Explorer" onBack={onBack} accent={accent}>
    <iframe
      src={window.location.href}
      title="Internet Explorer"
      style={{ width: '100%', height: '100%', border: 'none' }}
      sandbox="allow-same-origin allow-scripts allow-popups"
    />
  </StandardWindowLayout>
);

const MenuDropdown: React.FC<{ items: { label: string; action: () => void }[]; onClose: () => void }> = ({ items, onClose }) => (
  <div
    style={{
      position: 'absolute', top: '100%', left: 0, background: '#2a2a2a', border: '1px solid #555',
      boxShadow: '2px 4px 10px rgba(0,0,0,0.5)', zIndex: 200, minWidth: '180px', padding: '2px 0'
    }}
    onMouseLeave={onClose}
  >
    {items.map((item, i) => (
      <div
        key={i}
        onClick={() => { item.action(); onClose(); }}
        style={{
          padding: '5px 16px', fontSize: '0.8rem', color: '#ccc', cursor: 'pointer',
          borderBottom: i < items.length - 1 ? '1px solid #333' : 'none'
        }}
        onMouseEnter={e => { (e.target as HTMLElement).style.background = '#444'; }}
        onMouseLeave={e => { (e.target as HTMLElement).style.background = 'transparent'; }}
      >
        {item.label}
      </div>
    ))}
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────

const DocumentsDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [activeFile, setActiveFile] = useState<VirtualFile | null>(null);
  const [pathStack, setPathStack] = useState<VirtualFile[]>([]);
  const [showVirus, setShowVirus] = useState(false);
  const [showSystem32Delete, setShowSystem32Delete] = useState(false);
  const [showBSOD, setShowBSOD] = useState(false);
  const [accentColor, setAccentColor] = useState('#FF4081');
  const [hoveredFile, setHoveredFile] = useState<VirtualFile | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Drag state
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAccentColor(ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)]);
      setPos({
        x: Math.round(window.innerWidth / 2 - 350),
        y: Math.round(window.innerHeight / 2 - 250),
      });
    } else {
      setActiveFile(null);
      setPathStack([]);
      setShowVirus(false);
      setShowSystem32Delete(false);
      setHoveredFile(null);
      setOpenMenu(null);
    }
  }, [isOpen]);

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setDragging(true);
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  }, [pos]);

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    };
    const handleMouseUp = () => setDragging(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  const currentFiles = pathStack.length === 0 ? FILES : pathStack[pathStack.length - 1].children || [];
  const activeFolderTitle = pathStack.length === 0 ? 'My Documents' : pathStack[pathStack.length - 1].name;

  const handleFileClick = (file: VirtualFile) => {
    if (file.type === 'folder') {
      setPathStack(prev => [...prev, file]);
    } else if (file.type === 'rickroll') {
      window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
    } else if (file.type === 'virus') {
      setShowVirus(true);
    } else if (file.type === 'system32') {
      setShowSystem32Delete(true);
    } else {
      setActiveFile(file);
    }
  };

  const handleUpDir = () => {
    if (pathStack.length > 0) {
      setPathStack(prev => prev.slice(0, prev.length - 1));
    }
  };

  // Menu definitions — every item does something real
  const menuItems: Record<string, { label: string; action: () => void }[]> = {
    File: [
      { label: '📂 Open Projects Folder', action: () => { const pf = FILES.find(f => f.name === 'Projects'); if (pf) setPathStack([pf]); setActiveFile(null); } },
      { label: '📝 Open todo.txt', action: () => { const tf = FILES.find(f => f.name === 'todo.txt'); if (tf) setActiveFile(tf); } },
      { label: '✖ Close Window', action: onClose },
    ],
    Edit: [
      { label: '🔄 Reset View', action: () => { setActiveFile(null); setPathStack([]); } },
      { label: '📋 Copy Path to Clipboard', action: () => { navigator.clipboard?.writeText(`C:\\Documents and Settings\\Josh\\${activeFolderTitle}`); } },
    ],
    View: [
      { label: '🏠 Go to Root', action: () => { setActiveFile(null); setPathStack([]); } },
      { label: '⬆ Go Up', action: handleUpDir },
      { label: '📷 View Photos', action: () => { const pf = FILES.find(f => f.name === 'My Photos'); if (pf) setActiveFile(pf); } },
    ],
    Favorites: [
      { label: '🔗 LinkedIn', action: () => window.open('https://www.linkedin.com/in/joshua-hamburger-0807342b8/', '_blank') },
      { label: '🐙 GitHub', action: () => window.open('https://github.com/HamburgJ', '_blank') },
      { label: '🍔 Play Burger Battle', action: () => { const bb = FILES.find(f => f.name === 'Burger Battle'); if (bb) setActiveFile(bb); } },
    ],
    Tools: [
      { label: '🌐 Open Internet', action: () => { const br = FILES.find(f => f.name === 'Internet'); if (br) setActiveFile(br); } },
      { label: '⚙️ Delete System32', action: () => setShowSystem32Delete(true) },
      { label: '💰 Run free_btc.exe', action: () => setShowVirus(true) },
    ],
    Help: [
      { label: '❓ About Josh OS', action: () => { setActiveFile({ name: 'About Josh OS', icon: '💿', type: 'text', content: 'Josh OS v2.0\n===========\n\nA totally real operating system by Josh Hamburger.\n\nBuilt with: React, TypeScript, vibes\nLicense: Do whatever you want\n\nTip: Try deleting System32 for a fun surprise.\n\n© 2026 Josh Hamburger. All rights reserved (not really).', date: 'Today', size: '1 KB' } as VirtualFile); } },
      { label: '🔒 View passwords.txt', action: () => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank') },
    ],
  };

  const renderContent = () => {
    if (activeFile) {
      if (activeFile.type === 'text') return <TextViewer file={activeFile} onBack={() => setActiveFile(null)} accent={accentColor} />;
      if (activeFile.type === 'photos') return <PhotosViewer onBack={() => setActiveFile(null)} accent={accentColor} />;
      if (activeFile.type === 'project') return <ProjectViewer file={activeFile} onBack={() => setActiveFile(null)} accent={accentColor} />;
      if (activeFile.type === 'browser') return <BrowserViewer onBack={() => setActiveFile(null)} accent={accentColor} />;
      if (activeFile.type === 'starbattle') return (
        <div style={{ height: '100%', overflow: 'auto' }}>
          <StarBattle onBack={() => setActiveFile(null)} />
        </div>
      );
      return <StandardWindowLayout title={activeFile.name} onBack={() => setActiveFile(null)} accent={accentColor}> <div style={{padding:20, color: '#ccc'}}>File content unavailable.</div> </StandardWindowLayout>;
    }

    // Default Folder View
    return (
      <div style={{ display: 'flex', height: '100%', background: '#1e1e1e' }}>
        {/* Left Sidebar — Hover Preview + Folder Info */}
        <div style={{ width: '180px', background: '#161616', borderRight: '1px solid #333', padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Hover preview area */}
          <div style={{ padding: '16px 12px', borderBottom: '1px solid #333', textAlign: 'center', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {hoveredFile ? (
              <>
                <div style={{ fontSize: '2.5rem', marginBottom: '6px' }}>{hoveredFile.icon}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#ddd', wordBreak: 'break-word', lineHeight: 1.3 }}>{hoveredFile.name}</div>
                <div style={{ fontSize: '0.65rem', color: '#777', marginTop: '4px' }}>{hoveredFile.size} — {hoveredFile.date}</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '2rem', marginBottom: '6px', opacity: 0.3 }}>📁</div>
                <div style={{ fontSize: '0.75rem', color: '#555' }}>{activeFolderTitle}</div>
                <div style={{ fontSize: '0.65rem', color: '#444', marginTop: '2px' }}>{currentFiles.length} items</div>
              </>
            )}
          </div>

          {/* Folder info */}
          <div style={{ padding: '12px', fontSize: '0.7rem', color: '#777' }}>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ color: '#999', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</div>
              <div style={{ color: '#aaa', wordBreak: 'break-all' }}>C:\Josh\{activeFolderTitle}</div>
            </div>
            <div>
              <div style={{ color: '#999', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Disk Space</div>
              <div style={{ background: '#333', borderRadius: '2px', height: '6px', overflow: 'hidden', marginTop: '4px' }}>
                <div style={{ background: accentColor, height: '100%', width: '42%' }} />
              </div>
              <div style={{ color: '#aaa', marginTop: '2px' }}>4.2 GB free of 10 GB</div>
            </div>
          </div>

          {/* Quick links */}
          <div style={{ borderTop: '1px solid #333', padding: '12px', fontSize: '0.7rem', marginTop: 'auto' }}>
            <div style={{ color: '#999', fontWeight: 'bold', marginBottom: '6px', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Links</div>
            <a href="https://www.linkedin.com/in/joshua-hamburger-0807342b8/" target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', color: accentColor, textDecoration: 'none', marginBottom: '4px', cursor: 'pointer' }}>
              🔗 LinkedIn
            </a>
            <a href="https://github.com/HamburgJ" target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', color: accentColor, textDecoration: 'none', cursor: 'pointer' }}>
              🐙 GitHub
            </a>
          </div>
        </div>

        {/* Right Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Address Bar */}
          <div style={{ borderBottom: '1px solid #333', padding: '6px 12px', background: '#222', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#888' }}>Address</span>
            <div style={{ flex: 1, border: '1px solid #444', background: '#111', fontSize: '0.8rem', padding: '2px 4px', color: '#ccc' }}>
              C:\Documents and Settings\Josh\{activeFolderTitle}
            </div>
            <div style={{ width: '20px', height: '20px', background: accentColor, borderRadius: '2px', display: 'flex', alignItems:'center', justifyContent: 'center', color: 'white', fontSize: '10px' }}>➜</div>
          </div>
          
          {/* Grid */}
          <div style={{ flex: 1, padding: '15px', background: '#1e1e1e', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gridAutoRows: 'min-content', gap: '15px', alignContent: 'start', overflowY: 'auto' }}>
            {pathStack.length > 0 && (
              <div 
                onClick={handleUpDir}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: '4px' }}
              >
                <div style={{ fontSize: '2.5rem', opacity: 0.7 }}>⤴️</div>
                <div style={{ fontSize: '0.8rem', textAlign: 'center', color: '#aaa' }}>Up</div>
              </div>
            )}
            
            {currentFiles.map((file, i) => (
              <div
                key={i}
                onClick={() => handleFileClick(file)}
                onMouseEnter={() => setHoveredFile(file)}
                onMouseLeave={() => setHoveredFile(null)}
                className="xp-icon-hover"
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  cursor: 'pointer', padding: '4px', borderRadius: '2px',
                  border: '1px solid transparent'
                }}
              >
                <div style={{ fontSize: '2.5rem', filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))' }}>{file.icon}</div>
                <div style={{ fontSize: '0.8rem', textAlign: 'center', color: '#ccc', wordBreak: 'break-word', lineHeight: 1.2 }}>{file.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cooper+Hewitt:wght@500;700&family=Fraunces:opsz,wght@9..144,300;9..144,600&display=swap');
      
      .xp-window-frame {
        font-family: 'Fraunces', serif;
        position: fixed;
        width: 700px;
        height: 500px;
        background: #1e1e1e;
        border: 1px solid #555;
        border-radius: 8px 8px 3px 3px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.7);
        display: flex;
        flex-direction: column;
        z-index: 9000;
        overflow: hidden;
      }
      
      .xp-titlebar {
        background: linear-gradient(to bottom, #333 0%, #252525 100%);
        height: 32px;
        border-bottom: 1px solid #444;
        display: flex;
        align-items: center;
        padding: 0 8px;
        justify-content: space-between;
        cursor: grab;
        user-select: none;
      }
      
      .xp-titlebar:active {
        cursor: grabbing;
      }

      .xp-title-text {
        font-weight: 700;
        color: #ccc;
        text-shadow: 1px 1px 0px #000;
        font-size: 0.95rem;
        margin-left: 6px;
      }

      .xp-menubar {
        display: flex;
        padding: 2px 8px;
        gap: 12px;
        border-bottom: 1px solid #333;
        background: #2a2a2a;
        font-size: 0.8rem;
        color: #aaa;
      }
      .xp-menubar span { cursor: pointer; padding: 1px 4px; }
      .xp-menubar span:hover { background: #444; color: white; }

      .xp-icon-hover:hover {
        background: rgba(255,255,255,0.08) !important;
        border-color: rgba(255,255,255,0.15) !important;
      }
      
      @media (max-width: 768px) {
        .xp-window-frame { width: 95vw; height: 80vh; }
      }
    `}</style>
    
    <div 
      className="xp-window-frame" 
      ref={frameRef}
      style={{ left: pos.x, top: pos.y }}
    >
      <div className="xp-titlebar" onMouseDown={handleMouseDown}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '1rem' }}>💿</span>
          <span className="xp-title-text">Josh OS - {activeFolderTitle}</span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }} onMouseDown={e => e.stopPropagation()}>
          <div style={{ width:'20px', height:'20px', background:'#444', border:'1px solid #555', borderRadius:'3px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', color:'#aaa' }}>_</div>
          <div style={{ width:'20px', height:'20px', background:'#444', border:'1px solid #555', borderRadius:'3px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', color:'#aaa' }}>□</div>
          <div 
             onClick={onClose}
             style={{ width:'20px', height:'20px', background:'#c0392b', border:'1px solid #a93226', borderRadius:'3px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', color:'#fff', cursor:'pointer' }}
          >
            X
          </div>
        </div>
      </div>
      
      <div className="xp-menubar">
        {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map(menu => (
          <span
            key={menu}
            style={{ position: 'relative' }}
            onClick={() => setOpenMenu(openMenu === menu ? null : menu)}
          >
            {menu}
            {openMenu === menu && menuItems[menu] && (
              <MenuDropdown items={menuItems[menu]} onClose={() => setOpenMenu(null)} />
            )}
          </span>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '1px', background: '#1e1e1e', border: '1px solid #333', margin: '2px' }}>
        {renderContent()}
      </div>
      
      {showVirus && <VirusPopup onClose={() => setShowVirus(false)} />}
      {showSystem32Delete && (
        <System32DeleteModal
          onCancel={() => setShowSystem32Delete(false)}
          onDelete={() => { setShowSystem32Delete(false); setShowBSOD(true); }}
        />
      )}
    </div>
    {showBSOD && <BSOD onClose={() => { setShowBSOD(false); onClose(); }} />}
    </>
  );
};

export default DocumentsDrawer;
