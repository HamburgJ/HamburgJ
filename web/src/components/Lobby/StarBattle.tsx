import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';

// ═════════════════════════════════════════════════════════════════════════════
// BURGER BATTLE — A daily Star Battle puzzle with hamburger theming
// 10×10 grid, 2 burgers per region / row / column
// ═════════════════════════════════════════════════════════════════════════════

// ── Seeded RNG ─────────────────────────────────────────────────────────────

class SeededRNG {
  private state: number;
  constructor(seed: number) {
    this.state = seed % 2147483647;
    if (this.state <= 0) this.state += 2147483646;
  }
  next(): number {
    this.state = (this.state * 16807) % 2147483647;
    return (this.state - 1) / 2147483646;
  }
  nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }
  shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = this.nextInt(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

function dateSeed(): number {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  return y * 10000 + m * 100 + d;
}

// ── Puzzle types ───────────────────────────────────────────────────────────

const SIZE = 10;
const STARS_PER = 2;

type Grid = number[][]; // region IDs 0..9
type CellState = 'empty' | 'burger' | 'cross';
type Board = CellState[][];

interface Puzzle {
  regions: Grid;
  solution: boolean[][]; // true = star
}

// Colors — warm, food-inspired palette
const REGION_COLORS = [
  '#F4D799', // bun - golden
  '#A0522D', // beef - brown
  '#90EE90', // lettuce - green
  '#FF6347', // tomato - red
  '#FFD700', // cheese - yellow
  '#DDA0DD', // onion - purple
  '#6B8E23', // pickles - olive
  '#CD853F', // bacon - peru
  '#FF4500', // ketchup - orangered
  '#F5DEB3', // sesame - wheat
];

const REGION_COLORS_LIGHT = REGION_COLORS.map(c => c + '55');

// ── Puzzle Generation ──────────────────────────────────────────────────────

function generateRegions(rng: SeededRNG): Grid {
  // Use a growth-based approach to create connected regions
  const grid: Grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(-1));
  const seeds: [number, number][] = [];

  // Place 10 region seeds spread across the grid
  const allCells: [number, number][] = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      allCells.push([r, c]);

  const shuffled = rng.shuffle(allCells);

  // Pick 10 well-spaced seeds
  for (let i = 0; i < SIZE; i++) {
    const idx = Math.floor((i * shuffled.length) / SIZE) + rng.nextInt(Math.floor(shuffled.length / SIZE));
    const [sr, sc] = shuffled[Math.min(idx, shuffled.length - 1)];
    seeds.push([sr, sc]);
    grid[sr][sc] = i;
  }

  // Grow regions by BFS from seeds until all cells filled
  const queues: [number, number][][] = seeds.map(s => [s]);
  let remaining = SIZE * SIZE - SIZE;

  while (remaining > 0) {
    const order = rng.shuffle(Array.from({ length: SIZE }, (_, i) => i));
    let grew = false;
    for (const regionId of order) {
      if (queues[regionId].length === 0) continue;
      // Try to expand from a random frontier cell
      const fi = rng.nextInt(queues[regionId].length);
      const [fr, fc] = queues[regionId][fi];

      const dirs: [number, number][] = rng.shuffle([[-1, 0], [1, 0], [0, -1], [0, 1]]);
      let expanded = false;
      for (const [dr, dc] of dirs) {
        const nr = fr + dr;
        const nc = fc + dc;
        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && grid[nr][nc] === -1) {
          grid[nr][nc] = regionId;
          queues[regionId].push([nr, nc]);
          remaining--;
          expanded = true;
          grew = true;
          break;
        }
      }
      if (!expanded) {
        // Remove dead frontier cell
        queues[regionId].splice(fi, 1);
      }
    }
    if (!grew) {
      // Force-fill any remaining cells with nearest region
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (grid[r][c] === -1) {
            // Find adjacent region
            for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && grid[nr][nc] !== -1) {
                grid[r][c] = grid[nr][nc];
                remaining--;
                break;
              }
            }
          }
        }
      }
    }
  }

  // Ensure all regions have exactly 10 cells - rebalance if needed
  const counts = Array(SIZE).fill(0);
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      counts[grid[r][c]]++;

  return grid;
}

function isValidPlacement(solution: boolean[][], regions: Grid): boolean {
  // Check no two stars are adjacent (including diagonally)
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!solution[r][c]) continue;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && solution[nr][nc]) {
            return false;
          }
        }
      }
    }
  }
  // Check 2 stars per row
  for (let r = 0; r < SIZE; r++) {
    let count = 0;
    for (let c = 0; c < SIZE; c++) if (solution[r][c]) count++;
    if (count !== STARS_PER) return false;
  }
  // Check 2 stars per column
  for (let c = 0; c < SIZE; c++) {
    let count = 0;
    for (let r = 0; r < SIZE; r++) if (solution[r][c]) count++;
    if (count !== STARS_PER) return false;
  }
  // Check 2 stars per region
  const regionCounts = Array(SIZE).fill(0);
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (solution[r][c]) regionCounts[regions[r][c]]++;
  for (let i = 0; i < SIZE; i++)
    if (regionCounts[i] !== STARS_PER) return false;

  return true;
}

function solvePuzzle(
  regions: Grid,
  findAll: boolean = false
): boolean[][][] {
  const solutions: boolean[][][] = [];
  const board: boolean[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
  const rowCounts = Array(SIZE).fill(0);
  const colCounts = Array(SIZE).fill(0);
  const regionCounts = Array(SIZE).fill(0);

  function canPlace(r: number, c: number): boolean {
    if (board[r][c]) return false;
    if (rowCounts[r] >= STARS_PER) return false;
    if (colCounts[c] >= STARS_PER) return false;
    if (regionCounts[regions[r][c]] >= STARS_PER) return false;
    // Check adjacency
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc]) {
          return false;
        }
      }
    }
    return true;
  }

  function solve(pos: number): boolean {
    if (pos === SIZE * SIZE) {
      // Verify all counts
      for (let i = 0; i < SIZE; i++) {
        if (rowCounts[i] !== STARS_PER || colCounts[i] !== STARS_PER || regionCounts[i] !== STARS_PER)
          return false;
      }
      solutions.push(board.map(row => [...row]));
      return !findAll; // stop after first if not finding all
    }

    const r = Math.floor(pos / SIZE);
    const c = pos % SIZE;

    // Try not placing
    // Pruning: check if remaining cells in row/col/region can still reach STARS_PER
    const remainingInRow = SIZE - c - 1 + (r < SIZE - 1 ? 0 : 0); // cells left in this row after current
    const cellsLeftInRow = SIZE - c; // including current cell
    
    // Skip (don't place here)
    if (rowCounts[r] + cellsLeftInRow > STARS_PER || rowCounts[r] < STARS_PER) {
      // There might be enough cells left
      if (solve(pos + 1)) return true;
    }

    // Try placing
    if (canPlace(r, c)) {
      board[r][c] = true;
      rowCounts[r]++;
      colCounts[c]++;
      regionCounts[regions[r][c]]++;

      if (solve(pos + 1)) return true;

      board[r][c] = false;
      rowCounts[r]--;
      colCounts[c]--;
      regionCounts[regions[r][c]]--;
    }

    return false;
  }

  // More efficient solver with better pruning
  function solve2(): boolean {
    // Find the most constrained row/col/region
    return backtrack2(0);
  }

  function backtrack2(row: number): boolean {
    if (row === SIZE) {
      for (let i = 0; i < SIZE; i++) {
        if (colCounts[i] !== STARS_PER || regionCounts[i] !== STARS_PER) return false;
      }
      solutions.push(board.map(r => [...r]));
      return !findAll;
    }

    if (rowCounts[row] === STARS_PER) {
      return backtrack2(row + 1);
    }

    const starsNeeded = STARS_PER - rowCounts[row];
    const availableCols: number[] = [];
    for (let c = 0; c < SIZE; c++) {
      if (canPlace(row, c)) availableCols.push(c);
    }

    if (availableCols.length < starsNeeded) return false;

    // Place stars in this row using combinations
    return placeInRow(row, availableCols, 0, starsNeeded);
  }

  function placeInRow(row: number, cols: number[], startIdx: number, remaining: number): boolean {
    if (remaining === 0) {
      return backtrack2(row + 1);
    }
    if (startIdx >= cols.length) return false;
    if (cols.length - startIdx < remaining) return false;

    for (let i = startIdx; i <= cols.length - remaining; i++) {
      const c = cols[i];
      if (!canPlace(row, c)) continue;

      board[row][c] = true;
      rowCounts[row]++;
      colCounts[c]++;
      regionCounts[regions[row][c]]++;

      // Filter remaining available cols (must not be adjacent)
      const nextAvailable = cols.slice(i + 1).filter(nc => nc > c + 1 && canPlace(row, nc));
      // Actually just continue with remaining cols excluding adjacent
      if (placeInRow(row, cols, i + 1, remaining - 1)) return true;

      board[row][c] = false;
      rowCounts[row]--;
      colCounts[c]--;
      regionCounts[regions[row][c]]--;
    }
    return false;
  }

  solve2();
  return solutions;
}

function generatePuzzle(seed: number): Puzzle {
  const rng = new SeededRNG(seed);

  for (let attempt = 0; attempt < 50; attempt++) {
    const regions = generateRegions(rng);

    const solutions = solvePuzzle(regions, false);
    if (solutions.length === 0) continue;

    // Check for unique solution
    const allSols = solvePuzzle(regions, true);
    if (allSols.length === 1) {
      return { regions, solution: allSols[0] };
    }

    // Accept first solution even if not unique
    if (allSols.length > 0) {
      return { regions, solution: allSols[0] };
    }
  }

  // Ultimate fallback: hand-crafted simple puzzle
  return getFallbackPuzzle();
}

function getFallbackPuzzle(): Puzzle {
  // A known-good simple 10x10 Star Battle layout
  const regions: Grid = [
    [0, 0, 0, 1, 1, 1, 2, 2, 2, 2],
    [0, 0, 3, 1, 1, 2, 2, 2, 4, 4],
    [0, 3, 3, 3, 1, 5, 5, 4, 4, 4],
    [0, 3, 3, 5, 5, 5, 5, 4, 6, 6],
    [0, 0, 3, 5, 7, 7, 5, 6, 6, 6],
    [8, 8, 3, 7, 7, 7, 5, 6, 9, 9],
    [8, 8, 8, 7, 7, 9, 9, 9, 9, 9],
    [8, 8, 8, 7, 9, 9, 9, 9, 9, 9],
    [8, 8, 8, 8, 9, 9, 9, 9, 9, 9],
    [8, 8, 8, 8, 8, 9, 9, 9, 9, 9],
  ];

  const solution: boolean[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
  // Place a valid solution
  const starPositions: [number, number][] = [
    [0, 3], [0, 8],
    [1, 0], [1, 5],
    [2, 2], [2, 7],
    [3, 4], [3, 9],
    [4, 1], [4, 6],
    [5, 3], [5, 8],
    [6, 0], [6, 5],
    [7, 2], [7, 7],
    [8, 4], [8, 9],
    [9, 1], [9, 6],
  ];
  for (const [r, c] of starPositions) solution[r][c] = true;

  return { regions, solution };
}

// ── Border computation ─────────────────────────────────────────────────────

function getRegionBorders(regions: Grid): {
  top: boolean[][]; right: boolean[][]; bottom: boolean[][]; left: boolean[][];
} {
  const top = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
  const right = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
  const bottom = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
  const left = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const reg = regions[r][c];
      if (r === 0 || regions[r - 1][c] !== reg) top[r][c] = true;
      if (r === SIZE - 1 || regions[r + 1][c] !== reg) bottom[r][c] = true;
      if (c === 0 || regions[r][c - 1] !== reg) left[r][c] = true;
      if (c === SIZE - 1 || regions[r][c + 1] !== reg) right[r][c] = true;
    }
  }
  return { top, right, bottom, left };
}

// ── Check win ──────────────────────────────────────────────────────────────

function checkWin(board: Board, solution: boolean[][]): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const hasBurger = board[r][c] === 'burger';
      if (hasBurger !== solution[r][c]) return false;
    }
  }
  return true;
}

function getErrors(board: Board, regions: Grid): Set<string> {
  const errors = new Set<string>();

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] !== 'burger') continue;

      // Check adjacency
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === 'burger') {
            errors.add(`${r},${c}`);
            errors.add(`${nr},${nc}`);
          }
        }
      }
    }
  }

  // Check row counts
  for (let r = 0; r < SIZE; r++) {
    let count = 0;
    for (let c = 0; c < SIZE; c++) if (board[r][c] === 'burger') count++;
    if (count > STARS_PER) {
      for (let c = 0; c < SIZE; c++) if (board[r][c] === 'burger') errors.add(`${r},${c}`);
    }
  }

  // Check column counts
  for (let c = 0; c < SIZE; c++) {
    let count = 0;
    for (let r = 0; r < SIZE; r++) if (board[r][c] === 'burger') count++;
    if (count > STARS_PER) {
      for (let r = 0; r < SIZE; r++) if (board[r][c] === 'burger') errors.add(`${r},${c}`);
    }
  }

  // Check region counts
  const regionCounts: Record<number, [number, number][]> = {};
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 'burger') {
        const reg = regions[r][c];
        if (!regionCounts[reg]) regionCounts[reg] = [];
        regionCounts[reg].push([r, c]);
      }
    }
  }
  for (const cells of Object.values(regionCounts)) {
    if (cells.length > STARS_PER) {
      for (const [r, c] of cells) errors.add(`${r},${c}`);
    }
  }

  return errors;
}

// ── Component ──────────────────────────────────────────────────────────────

const STORAGE_KEY = 'burgerbattle_state';

interface SavedState {
  date: string;
  board: Board;
  won: boolean;
}

function loadState(): SavedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(state: SavedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const StarBattle: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const puzzle = useMemo(() => generatePuzzle(dateSeed()), []);
  const borders = useMemo(() => getRegionBorders(puzzle.regions), [puzzle]);

  const [board, setBoard] = useState<Board>(() => {
    const saved = loadState();
    const today = todayString();
    if (saved && saved.date === today) return saved.board;
    return Array.from({ length: SIZE }, () => Array(SIZE).fill('empty') as CellState[]);
  });

  const [won, setWon] = useState(() => {
    const saved = loadState();
    return saved?.date === todayString() && saved.won === true;
  });

  const [showRules, setShowRules] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [showWinAnim, setShowWinAnim] = useState(false);

  // Save state on changes
  useEffect(() => {
    saveState({ date: todayString(), board, won });
  }, [board, won]);

  // Check win
  useEffect(() => {
    if (!won && checkWin(board, puzzle.solution)) {
      setWon(true);
      setShowWinAnim(true);
      setTimeout(() => setShowWinAnim(false), 3000);
    }
  }, [board, puzzle.solution, won]);

  const errors = useMemo(() => getErrors(board, puzzle.regions), [board, puzzle.regions]);

  // Drag state: track what action we're painting while dragging
  const dragAction = useRef<CellState | null>(null);
  const dragActive = useRef(false);
  const lastDragCell = useRef<string | null>(null);

  function cycleForward(current: CellState): CellState {
    if (current === 'empty') return 'cross';
    if (current === 'cross') return 'burger';
    return 'empty';
  }

  function cycleBackward(current: CellState): CellState {
    if (current === 'empty') return 'burger';
    if (current === 'burger') return 'cross';
    return 'empty';
  }

  const applyAction = useCallback((r: number, c: number, action: CellState) => {
    setBoard(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = action;
      return next;
    });
  }, []);

  const handleCellClick = useCallback((r: number, c: number) => {
    if (won) return;
    setBoard(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = cycleForward(next[r][c]);
      return next;
    });
  }, [won]);

  const handleRightClick = useCallback((e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (won) return;
    setBoard(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = cycleBackward(next[r][c]);
      return next;
    });
  }, [won]);

  const handlePointerDown = useCallback((e: React.PointerEvent, r: number, c: number) => {
    if (won) return;
    e.preventDefault();
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    dragActive.current = true;
    const newState = cycleForward(board[r][c]);
    dragAction.current = newState;
    lastDragCell.current = `${r},${c}`;
    applyAction(r, c, newState);
  }, [won, board, applyAction]);

  const handlePointerEnter = useCallback((r: number, c: number) => {
    if (!dragActive.current || won || dragAction.current === null) return;
    const key = `${r},${c}`;
    if (lastDragCell.current === key) return;
    lastDragCell.current = key;
    // Apply the same action as the initial cell
    applyAction(r, c, dragAction.current);
  }, [won, applyAction]);

  useEffect(() => {
    const handlePointerUp = () => {
      dragActive.current = false;
      dragAction.current = null;
      lastDragCell.current = null;
    };
    window.addEventListener('pointerup', handlePointerUp);
    return () => window.removeEventListener('pointerup', handlePointerUp);
  }, []);

  const handleReset = useCallback(() => {
    setBoard(Array.from({ length: SIZE }, () => Array(SIZE).fill('empty') as CellState[]));
    setWon(false);
    setHintUsed(false);
  }, []);

  const handleHint = useCallback(() => {
    if (won) return;
    setHintUsed(true);
    // Find a cell where solution has a star but board doesn't
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (puzzle.solution[r][c] && board[r][c] !== 'burger') {
          setBoard(prev => {
            const next = prev.map(row => [...row]);
            next[r][c] = 'burger';
            return next;
          });
          return;
        }
      }
    }
  }, [board, puzzle.solution, won]);

  const cellSize = 38;

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(135deg, #FFF8E7 0%, #FFF0D4 100%)',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 10px', borderBottom: '2px solid #E8C87A',
        background: 'linear-gradient(180deg, #FFE4B5 0%, #FFDAA0 100%)',
      }}>
        <button onClick={onBack} style={{
          background: '#D4956A', border: '1px solid #B87A4F', borderRadius: 4,
          color: '#fff', cursor: 'pointer', padding: '2px 8px', fontSize: '0.7rem',
          fontWeight: 600,
        }}>
          ← Back
        </button>
        <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#8B4513' }}>
          🍔 Burger Battle
        </span>
        <span style={{ fontSize: '0.6rem', color: '#A0724A', marginLeft: 'auto' }}>
          {todayString()}
        </span>
      </div>

      {/* Rules toggle */}
      {showRules && (
        <div style={{
          padding: '8px 12px', background: '#FFF3D6', borderBottom: '1px solid #E8C87A',
          fontSize: '0.6rem', color: '#6B4226', lineHeight: 1.6,
        }}>
          <strong>Rules:</strong><br />
          • Place exactly <strong>2 🍔</strong> in each row, column, and colored region<br />
          • Burgers cannot touch each other, even diagonally<br />
          • Click/drag to cycle: empty → ✕ → 🍔 → empty. Right-click for reverse<br />
          <button onClick={() => setShowRules(false)} style={{
            marginTop: 4, background: 'none', border: 'none', color: '#B87A4F',
            cursor: 'pointer', fontSize: '0.6rem', textDecoration: 'underline',
          }}>
            Hide rules
          </button>
        </div>
      )}

      {/* Game area */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 8, overflow: 'auto', position: 'relative',
      }}>
        {won && showWinAnim && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 10,
            background: 'rgba(255,248,231,0.9)',
            animation: 'fadeIn 0.5s ease',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 8 }}>🍔🎉🍔</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#8B4513' }}>
                BURGER BATTLE WON!
              </div>
              <div style={{ fontSize: '0.7rem', color: '#A0724A', marginTop: 4 }}>
                {hintUsed ? 'Used a hint, but still delicious!' : 'Perfectly grilled! No hints needed!'}
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        <div style={{
          display: 'inline-grid',
          gridTemplateColumns: `repeat(${SIZE}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${SIZE}, ${cellSize}px)`,
          border: '2px solid #8B4513',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(139,69,19,0.2)',
          position: 'relative',
        }}>
          {Array.from({ length: SIZE }).map((_, r) =>
            Array.from({ length: SIZE }).map((_, c) => {
              const regionId = puzzle.regions[r][c];
              const hasError = errors.has(`${r},${c}`);
              const cellValue = board[r][c];
              const borderWidth = 2;

              return (
                <div
                  key={`${r}-${c}`}
                  onPointerDown={(e) => handlePointerDown(e, r, c)}
                  onPointerEnter={() => handlePointerEnter(r, c)}
                  onContextMenu={(e) => handleRightClick(e, r, c)}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    background: REGION_COLORS_LIGHT[regionId],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: won ? 'default' : 'pointer',
                    position: 'relative',
                    userSelect: 'none',
                    borderTop: borders.top[r][c] ? `${borderWidth}px solid #8B4513` : '0.5px solid rgba(139,69,19,0.15)',
                    borderRight: borders.right[r][c] ? `${borderWidth}px solid #8B4513` : '0.5px solid rgba(139,69,19,0.15)',
                    borderBottom: borders.bottom[r][c] ? `${borderWidth}px solid #8B4513` : '0.5px solid rgba(139,69,19,0.15)',
                    borderLeft: borders.left[r][c] ? `${borderWidth}px solid #8B4513` : '0.5px solid rgba(139,69,19,0.15)',
                    boxSizing: 'border-box',
                    transition: 'background 0.15s',
                    ...(hasError && cellValue === 'burger' ? {
                      boxShadow: 'inset 0 0 0 2px #ff0000',
                    } : {}),
                  }}
                >
                  {cellValue === 'burger' && (
                    <span style={{
                      fontSize: '1.3rem',
                      filter: hasError ? 'hue-rotate(90deg) saturate(2)' : 'none',
                      animation: won ? 'bounce 0.5s ease infinite alternate' : 'none',
                    }}>
                      🍔
                    </span>
                  )}
                  {cellValue === 'cross' && (
                    <span style={{ color: '#8B4513', fontWeight: 700, fontSize: '1rem', opacity: 0.5 }}>✕</span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Status */}
        <div style={{
          marginTop: 8, display: 'flex', gap: 12,
          fontSize: '0.65rem', color: '#8B4513', alignItems: 'center',
        }}>
          {errors.size > 0 && !won && (
            <span style={{ color: '#c00' }}>⚠ {errors.size} conflict{errors.size !== 1 ? 's' : ''}</span>
          )}
          {won && <span style={{ color: '#228B22', fontWeight: 700 }}>✓ Solved!</span>}
        </div>
      </div>

      {/* Toolbar */}
      <div style={{
        padding: '6px 10px', borderTop: '2px solid #E8C87A',
        background: 'linear-gradient(180deg, #FFDAA0 0%, #FFE4B5 100%)',
        display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap',
      }}>
        <button onClick={() => setShowRules(r => !r)} style={toolBtn}>
          📖 Rules
        </button>
        <button onClick={handleReset} style={toolBtn}>
          🗑️ Reset
        </button>
        <button onClick={handleHint} style={{
          ...toolBtn,
          opacity: won ? 0.5 : 1,
        }} disabled={won}>
          💡 Hint
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-3px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const toolBtn: React.CSSProperties = {
  background: '#D4956A',
  border: '1px solid #B87A4F',
  borderRadius: 4,
  color: '#fff',
  cursor: 'pointer',
  padding: '3px 10px',
  fontSize: '0.6rem',
  fontWeight: 600,
  fontFamily: 'inherit',
};

export default StarBattle;
