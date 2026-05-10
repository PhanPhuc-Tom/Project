/* ═══════════════════════════════════════════════════════════
   CHECKMATE LAB  —  script.js
   Puzzle data, board rendering, move logic, UI management.
   ═══════════════════════════════════════════════════════════ */
'use strict';

/* ──────────────────────────────────────────────────────────
   PUZZLE DATABASE
   solution[] — UCI strings. Even indices (0, 2, 4…) = user.
   Odd indices (1, 3…) = opponent auto-play.
───────────────────────────────────────────────────────────── */
const PUZZLES = [
  {
    id: 1,
    fen: '6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1',
    solution: ['d1d8'],
    theme: 'Back-Rank Mate', icon: '🏰', difficulty: 'Beginner',
    hint: "The black king can't escape from its own pawns. Look for a checkmate along the 8th rank.",
    explanation: "Rd8# is checkmate — the rook slides to the 8th rank and the black king is completely smothered by its own pawns on f7, g7, and h7. Back-rank weakness is one of the most common ways games end at every level. This is why creating a 'luft' (escape square) by advancing a pawn in front of your castled king is such essential technique.",
    masterExamples: [
      { player: 'Paul Morphy vs. Duke of Brunswick', year: 1858, idea: "Morphy's brilliant piece activity forced the Duke into a hopelessly cramped position that collapsed to a back-rank attack", lesson: 'Activate all your pieces first — passive development leads to back-rank disasters.' },
      { player: 'Deep Blue vs. Garry Kasparov', year: 1997, idea: 'Machine-like calculation exposed the back-rank weakness with clinical precision that shocked the chess world', lesson: "Even the greatest players fall to back-rank mates — always create an escape square after castling." }
    ]
  },
  {
    id: 2,
    fen: '6k1/7q/8/8/4N3/8/8/4K3 w - - 0 1',
    solution: ['e4f6'],
    theme: 'Knight Fork', icon: '♞', difficulty: 'Beginner',
    hint: 'A knight can attack two pieces at once. Which square lets the knight check the king AND attack the queen?',
    explanation: "Nf6+ is a royal fork! The knight leaps to f6, simultaneously checking the king on g8 AND attacking the queen on h7. Because the king is in check, Black must move it — losing the queen on the next move. This classic pattern is called a 'royal fork'. Always scan for squares where your knight can skewer both the king and queen in a single jump.",
    masterExamples: [
      { player: 'Paul Morphy', year: 1858, idea: "Morphy's knights constantly found advanced outpost squares from which devastating royal forks became possible", lesson: 'A centralized knight reaches more squares — always look for fork opportunities from strong central posts.' },
      { player: 'Bobby Fischer vs. Boris Spassky', year: 1972, idea: 'Fischer constantly threatened knight forks throughout the match, forcing Spassky into passive defensive positions', lesson: 'Even the threat of a fork is powerful — it forces concessions without the tactic ever needing to happen.' }
    ]
  },
  {
    id: 3,
    fen: 'k7/8/1K6/8/8/8/8/1R6 w - - 0 1',
    solution: ['b1b8'],
    theme: 'Rook Checkmate', icon: '♜', difficulty: 'Beginner',
    hint: 'Your king on b6 covers the a7 escape square. One rook move delivers checkmate on the 8th rank.',
    explanation: "Rb8# — the rook delivers check on the 8th rank while the white king on b6 controls a7, the only escape square. The black king is trapped against the corner with no where to go. This fundamental technique ends any rook endgame: cut the enemy king to the edge, bring your king close to control escape squares, then deliver the final blow.",
    masterExamples: [
      { player: 'Classic Endgame Theory', year: 1900, idea: 'Chess endgame theory codified that the rook must cut the king to the edge, then the friendly king closes in to assist checkmate', lesson: 'Your king must be active in the endgame — it helps deliver mate and win material, not just stay safe.' }
    ]
  },
  {
    id: 4,
    fen: '4k3/7q/8/8/4B3/8/8/4R1K1 w - - 0 1',
    solution: ['e4h7'],
    theme: 'Discovered Attack', icon: '💥', difficulty: 'Intermediate',
    hint: "The bishop is blocking the rook's line to the king. Move the bishop somewhere useful — uncovering the rook's attack!",
    explanation: "Bxh7+ is a devastating discovered attack! The bishop moves off the e-file, uncovering the rook's check on e8 — while simultaneously capturing the black queen on h7. Because the king must deal with the check first, Black cannot save the queen. Discovered attacks create two threats at once: the uncovered piece attacks one target while the moving piece attacks another.",
    masterExamples: [
      { player: 'Mikhail Tal', year: 1960, idea: "The 'Magician from Riga' built his entire attacking style around discovered attacks, sacrificing material to set them up", lesson: 'Look for pieces that block your own powerful pieces — moving them can create two unstoppable threats simultaneously.' },
      { player: 'Garry Kasparov', year: 1985, idea: 'Kasparov routinely created discovered attacks that his opponents simply could not address both threats at once', lesson: 'A discovered attack is devastating because the defender can only deal with one threat per move — but you create two.' }
    ]
  },
  {
    id: 5,
    fen: '4k3/8/8/n3b3/8/8/8/2Q3K1 w - - 0 1',
    solution: ['c1c5'],
    theme: 'Queen Fork', icon: '♛', difficulty: 'Beginner',
    hint: 'Find a queen move that attacks TWO undefended pieces at the same time.',
    explanation: "Qc5 forks! The queen slides to c5, attacking the knight on a5 and the bishop on e5 in a single move — both along rank 5. Since Black can only save one piece, White wins material. The queen's unique ability to control multiple directions at once makes it the most powerful forking piece. Always look for undefended pieces that share a rank, file, or diagonal.",
    masterExamples: [
      { player: 'Wilhelm Steinitz', year: 1880, idea: "The first World Champion demonstrated the queen's long-range power by constantly creating double attacks on undefended material", lesson: 'Always check for hanging pieces. Attacking two with one queen move wins material every single time.' }
    ]
  },
  {
    id: 6,
    fen: '8/4k3/8/2n5/1P6/B7/8/4K3 w - - 0 1',
    solution: ['b4c5'],
    theme: 'Pin', icon: '📌', difficulty: 'Intermediate',
    hint: 'The knight on c5 cannot legally move. Exploit this immobility by attacking it with a less valuable piece.',
    explanation: "bxc5 wins a piece by exploiting the pin! The bishop on a3 pins the knight on c5 to the king on e7 — the knight legally cannot move because doing so would expose the king to check. A pinned piece is almost captured already. White attacks the helpless, pinned knight with the pawn, and Black cannot recapture with the king (the bishop controls c5). This is how the 'pin and win' tactic works.",
    masterExamples: [
      { player: 'José Raúl Capablanca', year: 1921, idea: "The Cuban genius routinely identified pinned pieces and attacked them with pawns to win material with effortless simplicity", lesson: 'A pinned piece cannot fight back — attack it with a less valuable piece to win material cleanly.' }
    ]
  },
  {
    id: 7,
    fen: '8/8/8/7Q/8/1r3k2/8/4K3 w - - 0 1',
    solution: ['h5h3', 'f3e2', 'h3b3'],
    theme: 'Skewer', icon: '⚔️', difficulty: 'Intermediate',
    hint: 'Force the king to move with a check — then collect what was hiding behind it.',
    explanation: "Qh3+ forces the king on f3 to step aside. Once the king moves, the queen sweeps along the 3rd rank to capture the rook on b3. A skewer is the reverse of a pin: the MORE valuable piece is attacked first and forced to move, revealing and winning the piece behind it. Look for alignments where a king, queen, or rook share a rank, file, or diagonal with a less valuable piece behind them.",
    masterExamples: [
      { player: 'Anatoly Karpov', year: 1978, idea: "Karpov's legendary endgame precision regularly featured skewers to convert seemingly drawn positions into decisive wins", lesson: 'Skewers often arise in endgames when pieces line up behind the king — always check for these alignments before simplifying.' }
    ]
  },
  {
    id: 8,
    fen: '6rk/6pp/3N4/8/8/8/8/6K1 w - - 0 1',
    solution: ['d6f7'],
    theme: 'Smothered Mate', icon: '🤫', difficulty: 'Intermediate',
    hint: 'The black king is surrounded by its own pieces. Only one piece type can jump over blockades to deliver checkmate.',
    explanation: "Nf7# — smothered mate! The knight jumps to f7, giving check to the king on h8. But the king has no escape: the rook on g8 blocks g8, the pawns on g7 and h7 block every flight square, and the king is completely smothered by its own army. Only a knight can deliver this type of mate because knights are the only pieces that leap over other pieces. This is one of chess's most beautiful and memorable patterns.",
    masterExamples: [
      { player: "Philidor's Legacy", year: 1749, idea: "The great Philidor analyzed the smothered mate as one of chess's most elegant tactical themes — the sequence has captivated players for centuries", lesson: 'When a king is surrounded by its own pieces, look for a knight check — only the knight can leap over pieces to deliver a smothered mate.' }
    ]
  },
  {
    id: 9,
    fen: '4k3/8/8/3q4/8/8/8/3RK3 w - - 0 1',
    solution: ['d1d5'],
    theme: 'Hanging Piece', icon: '🎯', difficulty: 'Beginner',
    hint: "Scan the entire board. Is there a powerful enemy piece sitting completely undefended?",
    explanation: "Rxd5 captures the queen — a completely undefended piece! An undefended piece is called 'hanging' in chess. It can be captured for free, and there's almost never a reason to leave such an opportunity untaken. Before every single move, train yourself to ask two questions: Are any of MY pieces hanging? Are any of my OPPONENT'S pieces undefended? These questions alone prevent most blunders.",
    masterExamples: [
      { player: 'Magnus Carlsen', year: 2013, idea: "Even at World Championship level, Carlsen punishes hanging pieces with immediate, ruthless precision — he never misses a free piece", lesson: "Chess is a game of threats. Capture hanging pieces immediately — waiting gives your opponent time to defend." }
    ]
  },
  {
    id: 10,
    fen: '6rk/6pp/6Q1/8/8/8/8/6RK w - - 0 1',
    solution: ['g6g7'],
    theme: 'Queen & Rook', icon: '⚡', difficulty: 'Intermediate',
    hint: 'The rook on g1 guards the g-file. Can the queen capture on g7 and deliver checkmate with the rook supporting?',
    explanation: "Qxg7# is checkmate! The queen captures the g7 pawn with check. The king on h8 cannot take the queen because it's protected by the rook on g1. The king can't escape to g8 (queen controls that square) or h7 (the queen on g7 attacks h7 diagonally). This is textbook queen-and-rook coordination — use the rook to protect the queen as she delivers the killing blow.",
    masterExamples: [
      { player: 'Paul Morphy', year: 1859, idea: "Morphy's attacking genius was built on perfect queen–rook coordination, creating mating nets that left opponents completely helpless", lesson: "The queen and rook are chess's most powerful attacking duo. The rook protects the queen while she delivers the final blow." }
    ]
  },
  {
    id: 11,
    fen: 'k7/2Q5/2K5/8/8/8/8/8 w - - 0 1',
    solution: ['c7b7'],
    theme: 'King & Queen Mate', icon: '👑', difficulty: 'Beginner',
    hint: 'Your king on c6 controls the escape squares. Where can the queen deliver the final checkmate?',
    explanation: "Qb7# — king and queen checkmate! The queen on b7 covers a8 (diagonal), b8 (file), and a7 (rank). The white king on c6 covers c7 and c8. Every single square around the black king is controlled. This is the most fundamental checkmate pattern in chess — every player must know how to deliver it quickly and confidently.",
    masterExamples: [
      { player: 'Endgame Fundamentals', year: 1900, idea: "Every chess master can deliver king and queen checkmate accurately — it is the foundation of all endgame technique and must be mastered first", lesson: 'Use the queen to cut off the enemy king, then bring your own king in to assist. Never attempt to checkmate with the queen alone.' }
    ]
  },
  {
    id: 12,
    fen: '4k3/8/2n1b3/8/3P4/8/8/4K3 w - - 0 1',
    solution: ['d4d5'],
    theme: 'Pawn Fork', icon: '♟', difficulty: 'Beginner',
    hint: 'Advance the pawn one square. Which two enemy pieces will it attack diagonally at the same time?',
    explanation: "d5 forks the knight and bishop! A pawn on d5 attacks c6 (diagonally left) and e6 (diagonally right) simultaneously. Since Black can only save one piece, White wins material. Never underestimate pawn advances — even the humblest pawn can fork two powerful pieces. Always ask whether a pawn push creates a fork before pushing it.",
    masterExamples: [
      { player: 'Mikhail Botvinnik', year: 1948, idea: "Botvinnik's legendary pawn handling included aggressive central advances that created tactical fork threats and permanent structural advantages", lesson: 'Pawns are tactical weapons, not just structural pieces — always calculate whether a pawn advance creates a fork before pushing.' }
    ]
  },
  {
    id: 13,
    fen: '7k/6P1/5K2/8/8/8/8/8 w - - 0 1',
    solution: ['g7g8q'],
    theme: 'Promotion Mate', icon: '⬆️', difficulty: 'Beginner',
    hint: 'The pawn is one step from the 8th rank. Will the new queen simultaneously deliver checkmate?',
    explanation: "g8=Q# promotes the pawn to a queen AND delivers checkmate in the same move! The new queen on g8 checks the king on h8. The king cannot escape: h7 is covered by the queen diagonally, g7 is covered by the white king on f6, and g8 itself is the queen's square. When promoting a pawn, always calculate whether the new queen gives immediate checkmate — this is often the fastest path to victory.",
    masterExamples: [
      { player: 'Endgame Study', year: 1900, idea: "The most elegant endgame victories combine pawn promotion with immediate checkmate — two goals achieved in a single, decisive move", lesson: "Before promoting, always check if the new queen delivers immediate checkmate. Promotion + mate in one move is the ultimate efficiency." }
    ]
  }
];


/* ──────────────────────────────────────────────────────────
   UNICODE PIECE MAP
───────────────────────────────────────────────────────────── */
const GLYPHS = {
  wK:'♔', wQ:'♕', wR:'♖', wB:'♗', wN:'♘', wP:'♙',
  bK:'♚', bQ:'♛', bR:'♜', bB:'♝', bN:'♞', bP:'♟'
};


/* ──────────────────────────────────────────────────────────
   APP STATE
───────────────────────────────────────────────────────────── */
const S = {
  idx:        0,       // current puzzle index
  game:       null,    // chess.js instance
  selected:   null,    // currently selected square ('e2' etc.)
  targets:    [],      // legal target squares for selected piece
  step:       0,       // position within solution[]
  solved:     false,
  flipped:    false,
  hintUsed:   false,
  locked:     false,   // blocks input during auto-play
  wrongCount: 0,
  lastFrom:   null,
  lastTo:     null,
};


/* ──────────────────────────────────────────────────────────
   LOCAL STORAGE
───────────────────────────────────────────────────────────── */
const LS_KEY = 'clab_v2';

function loadProg() {
  try {
    const r = localStorage.getItem(LS_KEY);
    return r ? JSON.parse(r) : newProg();
  } catch { return newProg(); }
}
function newProg() {
  return { solvedIds:[], attempts:0, streak:0, bestStreak:0, hintSolves:0 };
}
let prog = loadProg();
function saveProg() { try { localStorage.setItem(LS_KEY, JSON.stringify(prog)); } catch {} }


/* ──────────────────────────────────────────────────────────
   INIT
───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Chess === 'undefined') {
    document.body.innerHTML = `
      <div style="padding:2.5rem;color:#e05555;font-family:monospace;max-width:540px;margin:2rem auto;">
        <h2 style="font-size:1.3rem;margin-bottom:.8rem;">⚠ chess.js failed to load</h2>
        <p>The chess logic library could not be fetched from the CDN.<br>
        Check your internet connection, or download it manually:</p>
        <p style="margin-top:.8rem;"><a href="https://github.com/jhlywa/chess.js" style="color:#4a8fff">
        github.com/jhlywa/chess.js</a></p>
        <p style="margin-top:.5rem;font-size:.85rem;color:#6e7580;">
        Place chess.min.js in the same folder as index.html and update the &lt;script&gt; src.</p>
      </div>`;
    return;
  }

  // Wire up home screen
  $('btn-start').addEventListener('click', () => startTraining(0));
  $('btn-random').addEventListener('click', startRandom);
  buildThemePills();
  updateHomeStats();

  // Wire up training screen
  $('btn-home').addEventListener('click', goHome);
  $('btn-prev').addEventListener('click', () => navigate(-1));
  $('btn-next').addEventListener('click', () => navigate(+1));
  $('btn-hint').addEventListener('click', onHint);
  $('btn-flip').addEventListener('click', flipBoard);
  $('btn-reset').addEventListener('click', () => loadPuzzle(S.idx));
  $('btn-next-puzzle').addEventListener('click', () => navigate(+1));

  // Keyboard shortcuts
  document.addEventListener('keydown', onKey);
});

function $(id) { return document.getElementById(id); }


/* ──────────────────────────────────────────────────────────
   KEYBOARD SHORTCUTS
───────────────────────────────────────────────────────────── */
function onKey(e) {
  // Don't steal events from inputs
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  const screen = document.querySelector('.screen.active');
  if (!screen) return;

  if (screen.id === 'screen-training') {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); navigate(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); navigate(+1); }
    if (e.key.toLowerCase() === 'h') { e.preventDefault(); onHint(); }
    if (e.key.toLowerCase() === 'f') { e.preventDefault(); flipBoard(); }
    if (e.key.toLowerCase() === 'r') { e.preventDefault(); loadPuzzle(S.idx); }
    if (e.key === 'Escape') { clearSelection(); renderBoard(); }
  }
}


/* ──────────────────────────────────────────────────────────
   SCREENS
───────────────────────────────────────────────────────────── */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

function goHome() {
  updateHomeStats();
  showScreen('screen-home');
}

function startTraining(idx) {
  loadPuzzle(idx);
  showScreen('screen-training');
}

function startRandom() {
  const idx = Math.floor(Math.random() * PUZZLES.length);
  loadPuzzle(idx);
  showScreen('screen-training');
}

function navigate(dir) {
  const idx = (S.idx + dir + PUZZLES.length) % PUZZLES.length;
  loadPuzzle(idx);
}

function flipBoard() {
  S.flipped = !S.flipped;
  renderBoard();
}


/* ──────────────────────────────────────────────────────────
   HOME SCREEN
───────────────────────────────────────────────────────────── */
function buildThemePills() {
  const themes = [...new Set(PUZZLES.map(p => p.theme))];
  const container = $('theme-pills');
  themes.forEach(theme => {
    const btn = document.createElement('button');
    btn.className = 'pill';
    btn.textContent = theme;
    btn.addEventListener('click', () => {
      const first = PUZZLES.findIndex(p => p.theme === theme);
      if (first !== -1) startTraining(first);
    });
    container.appendChild(btn);
  });
}

function updateHomeStats() {
  const solved   = prog.solvedIds.length;
  const attempts = prog.attempts;
  const acc      = attempts > 0
    ? Math.round((solved / Math.max(attempts, solved)) * 100)
    : null;

  $('stat-solved').textContent = solved;
  $('stat-acc').textContent    = acc != null ? acc + '%' : '—';
  $('stat-streak').textContent = prog.bestStreak || 0;
}


/* ──────────────────────────────────────────────────────────
   LOAD PUZZLE
───────────────────────────────────────────────────────────── */
function loadPuzzle(idx) {
  const p = PUZZLES[idx];
  S.idx       = idx;
  S.game      = new Chess(p.fen);
  S.selected  = null;
  S.targets   = [];
  S.step      = 0;
  S.solved    = false;
  S.hintUsed  = false;
  S.locked    = false;
  S.wrongCount = 0;
  S.lastFrom  = null;
  S.lastTo    = null;

  // Nav
  $('puzzle-num').textContent    = `${idx + 1} / ${PUZZLES.length}`;
  $('nav-solved').textContent    = `${prog.solvedIds.length} solved`;
  $('streak-val').textContent    = prog.streak || 0;

  // Badges
  $('meta-theme').textContent    = `${p.icon}  ${p.theme}`;
  $('meta-diff').textContent     = p.difficulty;
  $('meta-turn').textContent     = p.fen.includes(' w ') ? 'White to move' : 'Black to move';

  // Instruction
  $('panel-instruction').textContent = 'Find the best move.';

  // Reset panel
  setFeedback('', '', 'Select a piece to begin.');
  $('exp-card').classList.add('hidden');
  $('master-card').classList.add('hidden');
  $('btn-next-puzzle').classList.add('hidden');
  $('btn-hint').classList.remove('hidden');

  // Render
  renderBoard();
  updateProgress();

  // Scroll panel to top
  const panel = document.querySelector('.panel-col');
  if (panel) panel.scrollTop = 0;
}


/* ──────────────────────────────────────────────────────────
   BOARD RENDERING
───────────────────────────────────────────────────────────── */
function renderBoard() {
  const boardEl = $('board');
  boardEl.innerHTML = '';

  const matrix   = S.game.board();   // [rank8..rank1][a..h]
  const turn     = S.game.turn();
  const inCheck  = S.game.in_check();

  // Find king square if in check
  let checkSq = null;
  if (inCheck) {
    outer:
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const p = matrix[r][f];
        if (p && p.type === 'k' && p.color === turn) {
          checkSq = toSqName(r, f, false); // board[] is always unflipped
          break outer;
        }
      }
    }
  }

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const sqName = toSqName(row, col, S.flipped);
      const { ri, fi } = sqIdx(sqName);
      const pieceData  = matrix[ri][fi];
      const isLight    = (row + col) % 2 !== 0;

      const div = document.createElement('div');
      div.className    = 'sq ' + (isLight ? 'light' : 'dark');
      div.dataset.sq   = sqName;
      div.setAttribute('role', 'gridcell');
      div.setAttribute('aria-label', sqName + (pieceData ? ' ' + pieceData.color + pieceData.type : ''));

      // State layers
      if (sqName === S.selected)              div.classList.add('selected');
      if (sqName === S.lastFrom)              div.classList.add('last-from');
      if (sqName === S.lastTo)                div.classList.add('last-to');
      if (sqName === checkSq)                 div.classList.add('in-check');

      // Legal move highlights
      if (S.targets.includes(sqName)) {
        const occupied = pieceData && pieceData.color !== turn;
        div.classList.add(occupied ? 'legal-ring' : 'legal-dot');
      }

      // Piece
      if (pieceData) {
        const key  = pieceData.color + pieceData.type.toUpperCase();
        const span = document.createElement('span');
        span.className   = `piece ${pieceData.color}`;
        span.textContent = GLYPHS[key];
        span.setAttribute('aria-hidden', 'true');
        div.appendChild(span);
      }

      div.addEventListener('click', () => handleClick(sqName));
      boardEl.appendChild(div);
    }
  }

  updateCoordLabels();
}

/* Convert visual grid (row,col) → square name, respecting flip */
function toSqName(row, col, flipped) {
  const fi = flipped ? 7 - col : col;
  const ri = flipped ? row     : 7 - row;
  return 'abcdefgh'[fi] + (ri + 1);
}

/* Convert square name → board[] indices */
function sqIdx(sq) {
  return {
    fi: 'abcdefgh'.indexOf(sq[0]),
    ri: 8 - parseInt(sq[1])
  };
}

/* Update coordinate labels */
function updateCoordLabels() {
  const ranks  = $('rank-labels');
  const files  = $('file-labels');
  if (!ranks || !files) return;

  const rs = S.flipped
    ? ['1','2','3','4','5','6','7','8']
    : ['8','7','6','5','4','3','2','1'];
  const fs = S.flipped
    ? ['h','g','f','e','d','c','b','a']
    : ['a','b','c','d','e','f','g','h'];

  ranks.innerHTML = rs.map(r => `<span>${r}</span>`).join('');
  files.innerHTML = fs.map(f => `<span>${f}</span>`).join('');
}


/* ──────────────────────────────────────────────────────────
   PIECE SELECTION & MOVEMENT
───────────────────────────────────────────────────────────── */
function handleClick(sqName) {
  if (S.locked || S.solved) return;

  const piece = S.game.get(sqName);
  const turn  = S.game.turn();

  if (S.selected) {
    // Clicking same square → deselect
    if (sqName === S.selected) {
      clearSelection();
      renderBoard();
      return;
    }
    // Clicking another own piece → switch selection
    if (piece && piece.color === turn) {
      selectSq(sqName);
      return;
    }
    // Attempt move
    tryMove(S.selected, sqName);
    return;
  }

  // Nothing selected — select if own piece
  if (piece && piece.color === turn) {
    selectSq(sqName);
  }
}

function selectSq(sqName) {
  S.selected = sqName;
  const moves = S.game.moves({ square: sqName, verbose: true });
  S.targets  = moves.map(m => m.to);
  renderBoard();
}

function clearSelection() {
  S.selected = null;
  S.targets  = [];
}


/* ──────────────────────────────────────────────────────────
   MOVE VALIDATION
───────────────────────────────────────────────────────────── */
function tryMove(from, to) {
  // Detect pawn promotion
  const piece     = S.game.get(from);
  let promotion   = undefined;
  if (piece && piece.type === 'p') {
    if ((piece.color === 'w' && to[1] === '8') ||
        (piece.color === 'b' && to[1] === '1')) {
      promotion = 'q';
    }
  }

  const uci = from + to + (promotion || '');
  clearSelection();

  // Verify the move is legal
  const test = S.game.move({ from, to, promotion });
  if (!test) {
    // Shouldn't reach here via normal UI, but safety
    setFeedback('fc-wrong', '✗', "That move isn't legal. Try again.");
    renderBoard();
    return;
  }
  S.game.undo(); // undo test — re-apply after checking solution

  // Check against expected solution step
  const expected = PUZZLES[S.idx].solution[S.step];
  if (uci === expected) {
    applyMove(from, to, promotion);
    S.step++;

    const done = S.step >= PUZZLES[S.idx].solution.length;
    if (done) {
      onSolved();
    } else {
      // Is the next step a computer response?
      const computersTurn = S.step % 2 === 1;
      if (computersTurn) {
        const moreAfter = S.step + 1 < PUZZLES[S.idx].solution.length;
        setFeedback('fc-info', '✓',
          moreAfter ? 'Correct! Find the follow-up…' : 'Correct! Good thinking.');
        S.locked = true;
        setTimeout(autoPlay, 680);
      } else {
        setFeedback('fc-info', '✓', 'Correct! Keep going — find the next move.');
      }
      renderBoard();
    }
  } else {
    // Wrong move
    S.wrongCount++;
    prog.attempts++;
    saveProg();

    const msgs = [
      "That's legal, but not the best move. Look for a forcing move: check, capture, or fork.",
      "Good try, but there's something stronger here. Can you attack two pieces at once?",
      "Legal, but not the key idea. Ask yourself: what does my opponent value most?",
      "Not quite. Think about forcing moves — checks, captures, and attacks your opponent must answer.",
    ];
    const msg = msgs[Math.min(S.wrongCount - 1, msgs.length - 1)];
    setFeedback('fc-wrong', '✗', msg);

    // Brief shake animation on board
    const boardEl = $('board');
    boardEl.classList.add('wrong-shake');
    setTimeout(() => boardEl.classList.remove('wrong-shake'), 400);

    renderBoard();
  }
}

/* Apply a move to the game state */
function applyMove(from, to, promotion) {
  const result = S.game.move({ from, to, promotion });
  if (result) {
    S.lastFrom = from;
    S.lastTo   = to;
    // Trigger arrive animation on destination piece
    requestAnimationFrame(() => {
      const sq = document.querySelector(`[data-sq="${to}"] .piece`);
      if (sq) {
        sq.classList.add('arrive');
        sq.addEventListener('animationend', () => sq.classList.remove('arrive'), { once: true });
      }
    });
  }
}

/* Auto-play the opponent's response move */
function autoPlay() {
  const uci  = PUZZLES[S.idx].solution[S.step];
  const from = uci.slice(0, 2);
  const to   = uci.slice(2, 4);
  const prom = uci.length === 5 ? uci[4] : undefined;

  applyMove(from, to, prom);
  S.step++;
  S.locked = false;
  renderBoard();

  if (S.step < PUZZLES[S.idx].solution.length) {
    setFeedback('fc-info', '→', 'Your turn — find the continuation!');
  }
}


/* ──────────────────────────────────────────────────────────
   PUZZLE SOLVED
───────────────────────────────────────────────────────────── */
function onSolved() {
  S.solved = true;

  const p       = PUZZLES[S.idx];
  const already = prog.solvedIds.includes(p.id);

  if (!already) {
    prog.solvedIds.push(p.id);
    prog.streak    = (prog.streak || 0) + 1;
    prog.bestStreak = Math.max(prog.bestStreak || 0, prog.streak);
    if (S.hintUsed) prog.hintSolves = (prog.hintSolves || 0) + 1;
  }
  prog.attempts = (prog.attempts || 0) + 1;
  saveProg();

  // Board celebration
  $('board').classList.add('solved');
  setTimeout(() => $('board').classList.remove('solved'), 800);

  // Feedback
  const msgs = [
    '🎉 Excellent! You found the winning move!',
    '⭐ Perfect! That\'s exactly the right idea.',
    '✨ Brilliant! Spot-on tactical vision.',
    '🏆 Outstanding — just like the masters!',
  ];
  setFeedback('fc-correct', '✓', msgs[Math.floor(Math.random() * msgs.length)]);

  $('panel-instruction').textContent = 'Puzzle solved!';
  $('btn-hint').classList.add('hidden');
  $('btn-next-puzzle').classList.remove('hidden');

  setTimeout(revealExplanation, 360);
  renderBoard();
  updateProgress();
  $('nav-solved').textContent  = `${prog.solvedIds.length} solved`;
  $('streak-val').textContent  = prog.streak || 0;
}

function revealExplanation() {
  const p = PUZZLES[S.idx];

  $('exp-body').textContent = p.explanation;
  $('exp-card').classList.remove('hidden');

  setTimeout(() => {
    const list = $('master-list');
    list.innerHTML = '';
    p.masterExamples.forEach(ex => {
      const div = document.createElement('div');
      div.className = 'master-item';
      div.innerHTML =
        `<div class="master-who">${ex.player} (${ex.year})</div>` +
        `<div class="master-idea">${ex.idea}</div>` +
        `<div class="master-lesson">${ex.lesson}</div>`;
      list.appendChild(div);
    });
    $('master-card').classList.remove('hidden');
  }, 250);
}


/* ──────────────────────────────────────────────────────────
   HINT
───────────────────────────────────────────────────────────── */
function onHint() {
  if (S.solved) return;
  S.hintUsed = true;

  const p    = PUZZLES[S.idx];
  const uci  = p.solution[S.step];
  const from = uci.slice(0, 2);

  setFeedback('fc-hint', '💡', p.hint);

  // Highlight hint square briefly
  const sqEl = document.querySelector(`[data-sq="${from}"]`);
  if (sqEl) {
    sqEl.classList.add('hint-sq');
    setTimeout(() => sqEl.classList.remove('hint-sq'), 2000);
  }

  // Auto-select the piece
  clearSelection();
  selectSq(from);
}


/* ──────────────────────────────────────────────────────────
   FEEDBACK
───────────────────────────────────────────────────────────── */
function setFeedback(stateClass, icon, msg) {
  const card = $('feedback-card');
  card.className = 'feedback-card';
  if (stateClass) card.classList.add(stateClass);
  $('fb-icon').textContent = icon;
  $('fb-msg').textContent  = msg;
}


/* ──────────────────────────────────────────────────────────
   PROGRESS
───────────────────────────────────────────────────────────── */
function updateProgress() {
  const total  = PUZZLES.length;
  const solved = prog.solvedIds.length;
  const pct    = Math.round((solved / total) * 100);

  $('progress-fill').style.width  = pct + '%';
  $('progress-text').textContent  = `${solved} / ${total} completed`;
  $('progress-pct').textContent   = pct + '%';
}
