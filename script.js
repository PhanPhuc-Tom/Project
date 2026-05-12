/* ═══════════════════════════════════════════════════════════
   CHECKMATE LAB  —  script.js
   Puzzles · openings (study / practice / play) · UI
   In-browser minimax engine (free, no CDN dependency).
   ═══════════════════════════════════════════════════════════ */
'use strict';

/* ──────────────────────────────────────────────────────────
   PUZZLES
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
    fen: 'k7/8/1K6/8/8/8/8/7R w - - 0 1',
    solution: ['h1h8'],
    theme: 'Rook Checkmate', icon: '♜', difficulty: 'Beginner',
    hint: 'Your king on b6 covers a7 and b7. Slide the rook up its file to deliver check on the 8th rank — from a safe distance.',
    explanation: "Rh8# — the rook glides up the h-file to deliver check along the 8th rank. The black king on a8 cannot move: a7 and b7 are both controlled by the white king on b6, and b8 is controlled by the rook. The rook on h8 is too far away for the king to capture. This is the fundamental rook-and-king mating technique: cut the enemy king to the edge, bring your king close to cover the escape squares, then deliver the killing check from far enough away that the king cannot reach the rook.",
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
    fen: '8/4k3/8/2n5/8/B7/8/2R1K3 w - - 0 1',
    solution: ['c1c5'],
    theme: 'Pin', icon: '📌', difficulty: 'Intermediate',
    hint: 'The knight on c5 cannot legally move (it is pinned). Find the piece that can capture it for free.',
    explanation: "Rxc5 wins a piece by exploiting the pin! The bishop on a3 pins the knight on c5 against the king on e7 — the knight legally cannot move because doing so would expose the king to check. A pinned piece is almost captured already. White simply marches the rook to c5 and grabs the helpless knight; Black has no way to recapture (the king is too far away). This is the textbook 'pin and win' tactic.",
    masterExamples: [
      { player: 'José Raúl Capablanca', year: 1921, idea: "The Cuban genius routinely identified pinned pieces and attacked them with pawns to win material with effortless simplicity", lesson: 'A pinned piece cannot fight back — attack it with a less valuable piece to win material cleanly.' }
    ]
  },
  {
    id: 7,
    fen: '8/8/7Q/8/8/1r3k2/8/4K3 w - - 0 1',
    solution: ['h6h3', 'f3f4', 'h3b3'],
    theme: 'Skewer', icon: '⚔️', difficulty: 'Intermediate',
    hint: 'Force the king to move with a check — then collect what was hiding behind it.',
    explanation: "Qh3+ forces the king on f3 to step aside (it can't move toward the white king). Once the king moves, the queen sweeps along the 3rd rank to capture the rook on b3. A skewer is the reverse of a pin: the MORE valuable piece is attacked first and forced to move, revealing and winning the piece behind it. Look for alignments where a king, queen, or rook share a rank, file, or diagonal with a less valuable piece behind them.",
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
    fen: '5r1k/6pp/6Q1/8/8/8/8/6RK w - - 0 1',
    solution: ['g6g7'],
    theme: 'Queen & Rook', icon: '⚡', difficulty: 'Intermediate',
    hint: 'The rook on g1 guards the entire g-file. Can the queen capture on g7 and deliver checkmate, protected by the rook?',
    explanation: "Qxg7# is checkmate! The queen captures the g7 pawn with check, supported by the rook on g1. The king on h8 cannot take the queen because it's protected by the rook. The king can't escape to g8 (the queen controls that square diagonally) or to h7 (the queen attacks h7 directly). No piece can capture the queen — the rook on f8 doesn't cover g7, and the pawns can't capture forward.",
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
    explanation: "Qb7# — king and queen checkmate! The queen on b7 covers a8 (diagonal), b8 (file), and a7 (rank). The white king on c6 defends the queen and covers c7 and c8. Every single square around the black king is controlled.",
    masterExamples: [
      { player: 'Endgame Fundamentals', year: 1900, idea: "Every chess master can deliver king and queen checkmate accurately — it is the foundation of all endgame technique", lesson: 'Use the queen to cut off the enemy king, then bring your own king in to assist. Never attempt to checkmate with the queen alone.' }
    ]
  },
  {
    id: 12,
    fen: '4k3/8/2n1b3/8/3P4/8/8/4K3 w - - 0 1',
    solution: ['d4d5'],
    theme: 'Pawn Fork', icon: '♟', difficulty: 'Beginner',
    hint: 'Advance the pawn one square. Which two enemy pieces will it attack diagonally at the same time?',
    explanation: "d5 forks the knight and bishop! A pawn on d5 attacks c6 (diagonally left) and e6 (diagonally right) simultaneously. Since Black can only save one piece, White wins material. Never underestimate pawn advances — even the humblest pawn can fork two powerful pieces.",
    masterExamples: [
      { player: 'Mikhail Botvinnik', year: 1948, idea: "Botvinnik's legendary pawn handling included aggressive central advances that created tactical fork threats and permanent structural advantages", lesson: 'Pawns are tactical weapons, not just structural pieces — always calculate whether a pawn advance creates a fork before pushing.' }
    ]
  },
  {
    id: 13,
    fen: '7k/5KP1/8/8/8/8/8/8 w - - 0 1',
    solution: ['g7g8q'],
    theme: 'Promotion Mate', icon: '⬆️', difficulty: 'Beginner',
    hint: 'The pawn is one step from the 8th rank. Will the new queen — defended by your king — simultaneously deliver checkmate?',
    explanation: "g8=Q# promotes the pawn to a queen AND delivers checkmate in the same move! The new queen on g8 checks the king on h8. The king cannot escape: h7 is covered by the queen diagonally, g7 is covered by the white king on f7, and the king cannot capture the queen because the king on f7 defends g8.",
    masterExamples: [
      { player: 'Endgame Study', year: 1900, idea: "The most elegant endgame victories combine pawn promotion with immediate checkmate", lesson: "Before promoting, always check if the new queen delivers immediate checkmate. Promotion + mate in one move is the ultimate efficiency." }
    ]
  }
];


/* ──────────────────────────────────────────────────────────
   OPENINGS
───────────────────────────────────────────────────────────── */
const OPENINGS = [
  {
    id: 'italian', name: 'Italian Game', eco: 'C50',
    category: 'Open Game · 1.e4 e5', side: 'For White', userColor: 'w', flipForBlack: false,
    summary: "One of the oldest and most natural openings — White develops rapidly and aims the light-squared bishop at f7, Black's most vulnerable square.",
    moves: [
      { uci: 'e2e4', san: 'e4',  note: "King's pawn opening. Stakes a claim in the center, opens diagonals for the queen and bishop." },
      { uci: 'e7e5', san: 'e5',  note: 'Black mirrors, fighting for the center on equal terms.' },
      { uci: 'g1f3', san: 'Nf3', note: "Develops a knight and attacks the e5 pawn — a flexible, classical move." },
      { uci: 'b8c6', san: 'Nc6', note: "Defends e5 and develops naturally." },
      { uci: 'f1c4', san: 'Bc4', note: 'The "Italian bishop." It eyes f7 — the only square defended solely by the king.' },
      { uci: 'g8f6', san: 'Nf6', note: 'The Two Knights Defense — Black counter-attacks e4.' },
      { uci: 'd2d3', san: 'd3',  note: 'The Giuoco Pianissimo — a slow, modern handling. White prepares c3 and a long maneuvering game.' }
    ],
    plans: [
      'Develop knights before bishops; castle kingside early.',
      'Prepare d2–d4 (Giuoco Piano) or play slowly with d3 (Giuoco Pianissimo).',
      'Watch f7 — sacrifice or pile-up tactics on this square are a recurring motif.'
    ]
  },
  {
    id: 'ruylopez', name: 'Ruy Lopez (Spanish Opening)', eco: 'C60',
    category: 'Open Game · 1.e4 e5', side: 'For White', userColor: 'w', flipForBlack: false,
    summary: "Named after a 16th-century Spanish priest, the Ruy Lopez puts immediate strategic pressure on Black's knight — and through it, the e5 pawn.",
    moves: [
      { uci: 'e2e4', san: 'e4',  note: 'King-pawn opening.' },
      { uci: 'e7e5', san: 'e5',  note: 'Classical reply.' },
      { uci: 'g1f3', san: 'Nf3', note: 'Attacks e5.' },
      { uci: 'b8c6', san: 'Nc6', note: 'Defends e5.' },
      { uci: 'f1b5', san: 'Bb5', note: 'The Spanish bishop. Threatens Bxc6 followed by Nxe5.' },
      { uci: 'a7a6', san: 'a6',  note: 'The Morphy Defense — Black challenges the bishop.' },
      { uci: 'b5a4', san: 'Ba4', note: 'White retreats but keeps the diagonal alive.' },
      { uci: 'g8f6', san: 'Nf6', note: 'Counter-attacks e4.' },
      { uci: 'e1g1', san: 'O-O', note: 'White castles, ignoring the e-pawn temporarily.' }
    ],
    plans: [
      "Maintain pressure on e5 with the b5/a4 bishop and Nf3.",
      'Build a strong center with c3 and d4 at the right moment.',
      "Trade the light-squared bishop only when it weakens Black's pawn structure."
    ]
  },
  {
    id: 'sicilian', name: 'Sicilian Defense', eco: 'B20',
    category: 'Semi-Open · 1.e4 c5', side: 'For Black', userColor: 'b', flipForBlack: true,
    summary: "Black's most ambitious response to 1.e4. Creates an immediate asymmetry that fights for the win.",
    moves: [
      { uci: 'e2e4', san: 'e4',  note: 'King-pawn opening.' },
      { uci: 'c7c5', san: 'c5',  note: 'The Sicilian! Black refuses to mirror, claiming d4.' },
      { uci: 'g1f3', san: 'Nf3', note: 'Most popular — prepares the central break d4.' },
      { uci: 'd7d6', san: 'd6',  note: 'Najdorf/Dragon territory — flexible, supports e5 later.' },
      { uci: 'd2d4', san: 'd4',  note: 'White grabs the center with a pawn break.' },
      { uci: 'c5d4', san: 'cxd4',note: 'Black accepts — opens the c-file for counter-play.' },
      { uci: 'f3d4', san: 'Nxd4',note: "White recaptures — the Open Sicilian." },
      { uci: 'g8f6', san: 'Nf6', note: 'Attacks e4 and develops.' },
      { uci: 'b1c3', san: 'Nc3', note: 'Defends e4 — main-line tabiya.' },
      { uci: 'a7a6', san: 'a6',  note: 'The Najdorf — prevents Nb5 and prepares …b5.' }
    ],
    plans: [
      'Use the half-open c-file for queenside counter-play (…Rc8, …Qc7).',
      'Aim for a thematic …d6–d5 break or …b5–b4 expansion.',
      'Castle kingside, but be ready to defend a kingside attack.'
    ]
  },
  {
    id: 'french', name: 'French Defense', eco: 'C00',
    category: 'Semi-Open · 1.e4 e6', side: 'For Black', userColor: 'b', flipForBlack: true,
    summary: "Solid and strategic. Black accepts a slightly cramped position for a rock-solid pawn chain and a clear plan.",
    moves: [
      { uci: 'e2e4', san: 'e4',  note: 'King-pawn opening.' },
      { uci: 'e7e6', san: 'e6',  note: 'The French — preparing …d5 with support.' },
      { uci: 'd2d4', san: 'd4',  note: 'White builds the ideal pawn center.' },
      { uci: 'd7d5', san: 'd5',  note: 'Black strikes — the soul of the French.' },
      { uci: 'b1c3', san: 'Nc3', note: 'The main line — develops and defends e4.' },
      { uci: 'f8b4', san: 'Bb4', note: 'The Winawer — pins the knight, threatens …dxe4.' },
      { uci: 'e4e5', san: 'e5',  note: 'White locks the center, gaining space.' },
      { uci: 'c7c5', san: 'c5',  note: 'The thematic break — Black attacks the base.' }
    ],
    plans: [
      "Always be looking for the …c5 break — the engine of the French.",
      "Solve the 'bad' light-squared bishop: re-route via …b6/…Ba6.",
      'Queenside play with …Qa5, …Nc6, …Rc8.'
    ]
  },
  {
    id: 'caro', name: 'Caro-Kann Defense', eco: 'B10',
    category: 'Semi-Open · 1.e4 c6', side: 'For Black', userColor: 'b', flipForBlack: true,
    summary: "Like the French, but with the light-squared bishop free. Favored by Capablanca, Karpov, and Carlsen.",
    moves: [
      { uci: 'e2e4', san: 'e4',  note: 'King-pawn opening.' },
      { uci: 'c7c6', san: 'c6',  note: 'The Caro-Kann — preparing …d5 while keeping the c8-bishop free.' },
      { uci: 'd2d4', san: 'd4',  note: 'Builds the center.' },
      { uci: 'd7d5', san: 'd5',  note: 'The central challenge.' },
      { uci: 'b1c3', san: 'Nc3', note: 'Classical Variation.' },
      { uci: 'd5e4', san: 'dxe4',note: 'Black accepts the trade, simplifying.' },
      { uci: 'c3e4', san: 'Nxe4',note: 'White recaptures.' },
      { uci: 'c8f5', san: 'Bf5', note: 'The Classical Caro — Black develops the "good" bishop.' }
    ],
    plans: [
      "Develop the light-squared bishop before locking it in with …e6.",
      'Solid structure: …e6, …Nd7, …Ngf6, …Be7, …O-O.',
      'Aim for …c5 break later — gradual equalization.'
    ]
  },
  {
    id: 'qgd', name: "Queen's Gambit Declined", eco: 'D30',
    category: "Closed · 1.d4 d5", side: 'For both colors', userColor: 'w', flipForBlack: false,
    summary: "The most classical of all openings. White offers the c-pawn; Black politely declines and builds a fortress.",
    moves: [
      { uci: 'd2d4', san: 'd4',  note: 'Queen-pawn opening.' },
      { uci: 'd7d5', san: 'd5',  note: 'Classical reply.' },
      { uci: 'c2c4', san: 'c4',  note: "The Queen's Gambit." },
      { uci: 'e7e6', san: 'e6',  note: 'Declined — Black defends d5 with the e-pawn.' },
      { uci: 'b1c3', san: 'Nc3', note: 'Develops and pressures d5.' },
      { uci: 'g8f6', san: 'Nf6', note: 'Develops and supports d5.' },
      { uci: 'c1g5', san: 'Bg5', note: 'The pin — increasing pressure on d5 via the f6 knight.' },
      { uci: 'f8e7', san: 'Be7', note: 'Black breaks the pin and prepares to castle.' }
    ],
    plans: [
      "White: build a minority attack on the queenside (b4–b5).",
      "Black: solve the 'problem bishop' on c8 — often via …b6 and …Bb7.",
      'Central tension: aim for the …c5 break.'
    ]
  },
  {
    id: 'london', name: 'London System', eco: 'D02',
    category: "Closed · 1.d4", side: 'For White', userColor: 'w', flipForBlack: false,
    summary: "A practical system loved by club players and World Champions alike. Same setup against almost anything.",
    moves: [
      { uci: 'd2d4', san: 'd4',  note: 'Queen-pawn opening.' },
      { uci: 'd7d5', san: 'd5',  note: 'Classical reply.' },
      { uci: 'g1f3', san: 'Nf3', note: 'Develops, prepares the bishop.' },
      { uci: 'g8f6', san: 'Nf6', note: 'Mirror.' },
      { uci: 'c1f4', san: 'Bf4', note: 'The London bishop — outside the pawn chain.' },
      { uci: 'c7c5', san: 'c5',  note: "Main challenge — Black attacks d4." },
      { uci: 'e2e3', san: 'e3',  note: 'Supports d4 — keeping the structure stable.' },
      { uci: 'b8c6', san: 'Nc6', note: 'Continues development.' },
      { uci: 'b1d2', san: 'Nbd2',note: 'Avoids …Bb4+; prepares c3 and a slow build-up.' }
    ],
    plans: [
      'Build the pyramid: pawns on d4–e3–c3, bishop on f4, knight on f3 and d2.',
      'Castle short, then push h3–g4 for kingside expansion.',
      'Aim for an Nf3–e5 outpost in the middlegame.'
    ]
  },
  {
    id: 'kings-indian', name: "King's Indian Defense", eco: 'E60',
    category: "Indian · 1.d4 Nf6", side: 'For Black', userColor: 'b', flipForBlack: true,
    summary: "Black lets White build a huge center — then attacks it from the flank with pieces.",
    moves: [
      { uci: 'd2d4', san: 'd4',  note: 'Queen-pawn.' },
      { uci: 'g8f6', san: 'Nf6', note: "Indian Defenses — refusing …d5." },
      { uci: 'c2c4', san: 'c4',  note: 'White claims the center.' },
      { uci: 'g7g6', san: 'g6',  note: "King's Indian setup — fianchetto coming." },
      { uci: 'b1c3', san: 'Nc3', note: 'Develops, supports e4.' },
      { uci: 'f8g7', san: 'Bg7', note: "The King's Indian bishop — long diagonal." },
      { uci: 'e2e4', san: 'e4',  note: 'White takes the big center.' },
      { uci: 'd7d6', san: 'd6',  note: 'Black prepares …e5.' },
      { uci: 'g1f3', san: 'Nf3', note: 'Classical setup.' },
      { uci: 'e8g8', san: 'O-O', note: 'Castles before launching kingside operations.' }
    ],
    plans: [
      'Castle, then push …e5 to challenge the center.',
      "After d5 by White, launch a kingside pawn storm: …f5, …f4, …g5.",
      "Knight tour: …Nbd7–f8–g6 or …Nbd7–c5."
    ]
  },
  {
    id: 'scandinavian', name: 'Scandinavian Defense', eco: 'B01',
    category: "Semi-Open · 1.e4 d5", side: 'For Black', userColor: 'b', flipForBlack: true,
    summary: "Direct and combative. Black challenges e4 immediately, forcing simple structures.",
    moves: [
      { uci: 'e2e4', san: 'e4',  note: 'King-pawn opening.' },
      { uci: 'd7d5', san: 'd5',  note: 'The Scandinavian.' },
      { uci: 'e4d5', san: 'exd5',note: 'White accepts.' },
      { uci: 'd8d5', san: 'Qxd5',note: 'Black recaptures with the queen.' },
      { uci: 'b1c3', san: 'Nc3', note: 'Develops with tempo on the queen.' },
      { uci: 'd5a5', san: 'Qa5', note: "The most popular retreat." },
      { uci: 'd2d4', san: 'd4',  note: 'Builds the center.' },
      { uci: 'g8f6', san: 'Nf6', note: 'Develops naturally.' }
    ],
    plans: [
      "Develop quickly: …Nf6, …c6, …Bf5 or …Bg4, …e6, …Nbd7.",
      'Avoid moving the queen too many times.',
      'Look for …e5 break later to free the position.'
    ]
  },
  {
    id: 'vienna', name: 'Vienna Game', eco: 'C25',
    category: "Open Game · 1.e4 e5", side: 'For White', userColor: 'w', flipForBlack: false,
    summary: "An old, romantic alternative to the Italian or Ruy Lopez — White develops the knight first and aims for an early f4 attack.",
    moves: [
      { uci: 'e2e4', san: 'e4',  note: 'King-pawn opening.' },
      { uci: 'e7e5', san: 'e5',  note: 'Classical reply.' },
      { uci: 'b1c3', san: 'Nc3', note: 'The Vienna — develops the knight first.' },
      { uci: 'g8f6', san: 'Nf6', note: 'Most flexible reply.' },
      { uci: 'f2f4', san: 'f4',  note: "The Vienna Gambit — aggressive!" },
      { uci: 'd7d5', san: 'd5',  note: "Counter in the center against a flank attack." },
      { uci: 'f4e5', san: 'fxe5',note: 'Opens the f-file.' },
      { uci: 'f6e4', san: 'Nxe4',note: 'Black recaptures the pawn.' }
    ],
    plans: [
      'Develop with Nf3, Bc4 or Bb5, and castle short.',
      'Use the f-file after fxe5 — Rf1 then doubled rooks.',
      "Look for kingside attacks — dangerous king hunts."
    ]
  }
];


/* ──────────────────────────────────────────────────────────
   PIECE ARTWORK — Wikimedia cburnett (CC BY-SA 3.0)
───────────────────────────────────────────────────────────── */
const PIECE_URL = {
  wK: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
  wQ: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
  wR: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
  wB: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
  wN: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
  wP: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
  bK: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
  bQ: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
  bR: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
  bB: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
  bN: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
  bP: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg'
};

const PIECE_VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const PIECE_NAME  = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };

/* Unicode fallback glyphs — used if the Wikimedia SVG fails to load
   (offline, blocked CDN, slow connection). Guarantees pieces always show. */
const GLYPHS = {
  wK:'♔', wQ:'♕', wR:'♖', wB:'♗', wN:'♘', wP:'♙',
  bK:'♚', bQ:'♛', bR:'♜', bB:'♝', bN:'♞', bP:'♟'
};


/* ══════════════════════════════════════════════════════════
   CHESS ENGINE — minimax + alpha-beta + simple PSTs
   100% free, runs in browser. ~80 lines.
══════════════════════════════════════════════════════════ */
const PST = {
  // Mid-game piece-square tables (white perspective; row 0 = rank 8).
  p: [
    [  0,  0,  0,  0,  0,  0,  0,  0],
    [ 50, 50, 50, 50, 50, 50, 50, 50],
    [ 10, 10, 20, 30, 30, 20, 10, 10],
    [  5,  5, 10, 25, 25, 10,  5,  5],
    [  0,  0,  0, 20, 20,  0,  0,  0],
    [  5, -5,-10,  0,  0,-10, -5,  5],
    [  5, 10, 10,-20,-20, 10, 10,  5],
    [  0,  0,  0,  0,  0,  0,  0,  0]
  ],
  n: [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  b: [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
  ],
  r: [
    [  0,  0,  0,  0,  0,  0,  0,  0],
    [  5, 10, 10, 10, 10, 10, 10,  5],
    [ -5,  0,  0,  0,  0,  0,  0, -5],
    [ -5,  0,  0,  0,  0,  0,  0, -5],
    [ -5,  0,  0,  0,  0,  0,  0, -5],
    [ -5,  0,  0,  0,  0,  0,  0, -5],
    [ -5,  0,  0,  0,  0,  0,  0, -5],
    [  0,  0,  0,  5,  5,  0,  0,  0]
  ],
  q: [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [ -5,  0,  5,  5,  5,  5,  0, -5],
    [  0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
  ],
  k: [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [ 20, 20,  0,  0,  0,  0, 20, 20],
    [ 20, 30, 10,  0,  0, 10, 30, 20]
  ]
};
const MATERIAL = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

const ENGINE = {
  evaluate(game) {
    if (game.in_checkmate()) return game.turn() === 'w' ? -99999 : 99999;
    if (game.in_draw() || game.in_stalemate() || game.in_threefold_repetition() || game.insufficient_material()) return 0;

    const board = game.board();
    let s = 0;
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const p = board[r][f];
        if (!p) continue;
        const base = MATERIAL[p.type];
        const pst  = PST[p.type];
        const row  = p.color === 'w' ? r : 7 - r;
        const bonus = pst ? pst[row][f] : 0;
        s += (p.color === 'w' ? 1 : -1) * (base + bonus);
      }
    }
    return s;
  },

  minimax(game, depth, alpha, beta, maximizing) {
    if (depth === 0 || game.game_over()) return this.evaluate(game);
    const moves = game.moves();
    if (maximizing) {
      let best = -Infinity;
      for (const m of moves) {
        game.move(m);
        const ev = this.minimax(game, depth - 1, alpha, beta, false);
        game.undo();
        if (ev > best) best = ev;
        if (ev > alpha) alpha = ev;
        if (beta <= alpha) break;
      }
      return best;
    } else {
      let best = Infinity;
      for (const m of moves) {
        game.move(m);
        const ev = this.minimax(game, depth - 1, alpha, beta, true);
        game.undo();
        if (ev < best) best = ev;
        if (ev < beta) beta = ev;
        if (beta <= alpha) break;
      }
      return best;
    }
  },

  // Score every legal move at the current position. Higher = better for the side to move.
  scoreAllMoves(game, depth = 2) {
    const moves   = game.moves({ verbose: true });
    const isWhite = game.turn() === 'w';
    const scored  = [];
    for (const m of moves) {
      game.move(m);
      const ev = this.minimax(game, depth - 1, -Infinity, Infinity, !isWhite);
      game.undo();
      // Convert to mover's perspective: positive = good for mover.
      scored.push({ move: m, evRaw: ev, moverScore: isWhite ? ev : -ev });
    }
    scored.sort((a, b) => b.moverScore - a.moverScore);
    return scored;
  },

  bestMove(game, depth = 2) {
    const scored = this.scoreAllMoves(game, depth);
    if (!scored.length) return null;
    // Tiebreak: pick randomly among the top moves within 15cp to avoid robotic play.
    const top = scored.filter(s => s.moverScore >= scored[0].moverScore - 15);
    return top[Math.floor(Math.random() * top.length)];
  },

  // Classify a played move vs. the best move. Returns category + delta + best.
  classify(gameBefore, userMove, depth = 2) {
    const scored = this.scoreAllMoves(gameBefore, depth);
    const best   = scored[0];
    const user   = scored.find(s =>
      s.move.from === userMove.from &&
      s.move.to   === userMove.to &&
      (s.move.promotion || '') === (userMove.promotion || '')
    );
    const userScore = user ? user.moverScore : -Infinity;
    const delta = best.moverScore - userScore; // cp loss vs best (positive)
    let category;
    if (delta < 25)        category = 'best';
    else if (delta < 75)   category = 'good';
    else if (delta < 200)  category = 'inaccuracy';
    else if (delta < 500)  category = 'mistake';
    else                   category = 'blunder';
    return { category, delta, best: best.move, user: user ? user.move : null };
  }
};


/* ══════════════════════════════════════════════════════════
   SOUND (Web Audio — no asset files)
══════════════════════════════════════════════════════════ */
const SFX = {
  ctx: null, enabled: true,
  ensure() {
    if (!this.ctx && typeof AudioContext !== 'undefined') {
      try { this.ctx = new AudioContext(); } catch { this.ctx = null; }
    }
    return this.ctx;
  },
  blip(freq, dur = 0.07, type = 'sine', gain = 0.08) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type; o.frequency.value = freq; g.gain.value = gain;
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + dur);
  },
  move()    { this.blip(420, 0.06, 'triangle', 0.06); },
  capture() { this.blip(180, 0.10, 'sawtooth', 0.08); setTimeout(() => this.blip(120, 0.10, 'sawtooth', 0.06), 30); },
  check()   { this.blip(880, 0.10, 'square', 0.05); },
  correct() { this.blip(660, 0.08, 'sine', 0.07); setTimeout(() => this.blip(880, 0.10, 'sine', 0.07), 80); },
  wrong()   { this.blip(220, 0.10, 'sawtooth', 0.07); setTimeout(() => this.blip(160, 0.12, 'sawtooth', 0.06), 50); },
  win()     { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.blip(f, 0.14, 'triangle', 0.07), i * 110)); }
};


/* ══════════════════════════════════════════════════════════
   APP STATE
══════════════════════════════════════════════════════════ */
const S = {
  idx: 0, game: null, selected: null, targets: [], step: 0,
  solved: false, flipped: false, hintUsed: false, locked: false,
  wrongCount: 0, lastFrom: null, lastTo: null, moveLog: [],
  lastWrong: null,  // for "Why?" on puzzles
};

// Openings state
const O = {
  idx: 0,
  mode: 'study',           // 'study' | 'practice' | 'play'
  game: null,
  ply: 0,                  // for study
  flipped: false,
  lastFrom: null, lastTo: null,
  autoTimer: null,

  // Practice mode
  prGame: null, prPly: 0, prSelected: null, prTargets: [], prLog: [],

  // Play mode
  playGame: null, playSelected: null, playTargets: [],
  playLog: [], playLastUser: null, playLastBest: null,
  playThinking: false, playPly: 0, playFlipped: false,
  playLastFrom: null, playLastTo: null,
};


/* ──────────────────────────────────────────────────────────
   LOCAL STORAGE
───────────────────────────────────────────────────────────── */
const LS_KEY = 'clab_v4';
function loadProg() {
  try {
    const r = localStorage.getItem(LS_KEY);
    return r ? Object.assign(newProg(), JSON.parse(r)) : newProg();
  } catch { return newProg(); }
}
function newProg() {
  return {
    solvedIds: [], attempts: 0, streak: 0, bestStreak: 0,
    hintSolves: 0, studiedOpenings: [], soundOn: true,
    lastSession: null,    // { screen, puzzleIdx?, openingIdx?, openingMode?, ts }
    resumeDismissed: false
  };
}
function saveLastSession(extra) {
  prog.lastSession = Object.assign({ ts: Date.now() }, extra);
  prog.resumeDismissed = false;
  saveProg();
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
        <p>The chess logic library could not be fetched from the CDN. Check your internet connection.</p>
      </div>`;
    return;
  }

  SFX.enabled = prog.soundOn !== false;

  // Home wiring
  $('btn-mode-puzzles').addEventListener('click', () => startTraining(0));
  $('btn-mode-openings').addEventListener('click', () => startOpenings(0));
  document.querySelectorAll('[data-go]').forEach(el => {
    el.addEventListener('click', () => {
      const t = el.getAttribute('data-go');
      if (t === 'puzzles')       startTraining(0);
      else if (t === 'openings') startOpenings(0);
      else if (t === 'random')   startRandom();
    });
  });
  buildThemePills();
  updateHomeStats();
  renderResumeBanner();
  $('fc-puzzle-count').textContent = `${PUZZLES.length} studies`;
  $('fc-opening-count').textContent = `${OPENINGS.length} openings`;

  // Training wiring
  $('btn-home').addEventListener('click', goHome);
  $('btn-prev').addEventListener('click', () => navigate(-1));
  $('btn-next').addEventListener('click', () => navigate(+1));
  $('btn-hint').addEventListener('click', onHint);
  $('btn-why').addEventListener('click', onPuzzleWhy);
  $('btn-flip').addEventListener('click', flipBoard);
  $('btn-reset').addEventListener('click', () => loadPuzzle(S.idx));
  $('btn-next-puzzle').addEventListener('click', () => navigate(+1));
  $('btn-goto-openings').addEventListener('click', () => startOpenings(O.idx || 0));
  $('btn-sound').addEventListener('click', toggleSound);
  reflectSoundButton();

  // Openings wiring — global
  $('btn-home-2').addEventListener('click', goHome);
  $('btn-op-prev').addEventListener('click', () => navigateOpening(-1));
  $('btn-op-next').addEventListener('click', () => navigateOpening(+1));
  $('btn-goto-puzzles').addEventListener('click', () => startTraining(S.idx || 0));

  // Openings — tabs
  document.querySelectorAll('.op-tab').forEach(t => {
    t.addEventListener('click', () => setOpMode(t.dataset.mode));
  });

  // Openings — Study controls
  $('btn-op-step').addEventListener('click', () => opStep(+1));
  $('btn-op-back').addEventListener('click', () => opStep(-1));
  $('btn-op-first').addEventListener('click', opFirst);
  $('btn-op-auto').addEventListener('click', opAutoPlay);
  $('btn-op-flip').addEventListener('click', () => { O.flipped = !O.flipped; renderOpBoard(); });

  // Practice controls
  $('btn-pr-hint').addEventListener('click', practiceHint);
  $('btn-pr-reset').addEventListener('click', practiceReset);
  $('btn-pr-flip').addEventListener('click', () => { O.flipped = !O.flipped; renderPracticeBoard(); });

  // Play controls
  $('btn-play-why').addEventListener('click', onPlayWhy);
  $('btn-play-takeback').addEventListener('click', playTakeBack);
  $('btn-play-restart').addEventListener('click', () => enterPlay());
  $('btn-play-flip').addEventListener('click', () => { O.playFlipped = !O.playFlipped; renderPlayBoard(); });

  // Keyboard
  document.addEventListener('keydown', onKey);
});

function $(id) { return document.getElementById(id); }


/* ──────────────────────────────────────────────────────────
   KEYBOARD
───────────────────────────────────────────────────────────── */
function onKey(e) {
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
  } else if (screen.id === 'screen-openings') {
    if (O.mode === 'study') {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); opStep(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); opStep(+1); }
    }
    if (e.key.toLowerCase() === 'f') {
      e.preventDefault();
      if (O.mode === 'study') { O.flipped = !O.flipped; renderOpBoard(); }
      else if (O.mode === 'practice') { O.flipped = !O.flipped; renderPracticeBoard(); }
      else if (O.mode === 'play') { O.playFlipped = !O.playFlipped; renderPlayBoard(); }
    }
  }
}


/* ──────────────────────────────────────────────────────────
   SCREENS
───────────────────────────────────────────────────────────── */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
  // Reset window + any inner scroll containers so users never have to scroll on switch.
  window.scrollTo(0, 0);
  document.querySelectorAll('.panel-col').forEach(c => c.scrollTop = 0);
}
function goHome() {
  if (O.autoTimer) { clearTimeout(O.autoTimer); O.autoTimer = null; }
  updateHomeStats();
  renderResumeBanner();
  showScreen('screen-home');
}
function startTraining(idx) {
  loadPuzzle(idx);
  saveLastSession({ screen: 'training', puzzleIdx: idx });
  showScreen('screen-training');
}
function startRandom() {
  const idx = Math.floor(Math.random() * PUZZLES.length);
  loadPuzzle(idx);
  saveLastSession({ screen: 'training', puzzleIdx: idx });
  showScreen('screen-training');
}
function startOpenings(idx) {
  loadOpening(idx || 0);
  saveLastSession({ screen: 'openings', openingIdx: idx || 0, openingMode: O.mode });
  showScreen('screen-openings');
}
function navigate(dir) {
  const idx = (S.idx + dir + PUZZLES.length) % PUZZLES.length;
  loadPuzzle(idx);
  saveLastSession({ screen: 'training', puzzleIdx: idx });
}
function navigateOpening(dir) {
  const idx = (O.idx + dir + OPENINGS.length) % OPENINGS.length;
  loadOpening(idx);
  saveLastSession({ screen: 'openings', openingIdx: idx, openingMode: O.mode });
}
function flipBoard() { S.flipped = !S.flipped; renderBoard(); }


/* ──────────────────────────────────────────────────────────
   SOUND TOGGLE
───────────────────────────────────────────────────────────── */
function toggleSound() {
  SFX.enabled = !SFX.enabled;
  prog.soundOn = SFX.enabled; saveProg();
  reflectSoundButton();
  if (SFX.enabled) SFX.move();
}
function reflectSoundButton() {
  const btn = $('btn-sound');
  if (!btn) return;
  btn.classList.toggle('off', !SFX.enabled);
  btn.setAttribute('aria-label', SFX.enabled ? 'Mute' : 'Unmute');
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
  const acc      = attempts > 0 ? Math.round((solved / Math.max(attempts, solved)) * 100) : null;
  $('stat-solved').textContent   = solved;
  $('stat-acc').textContent      = acc != null ? acc + '%' : '—';
  $('stat-openings').textContent = (prog.studiedOpenings || []).length;
  $('stat-streak').textContent   = prog.bestStreak || 0;
}

/* ──────────────────────────────────────────────────────────
   RESUME BANNER
───────────────────────────────────────────────────────────── */
function renderResumeBanner() {
  const row = $('resume-row');
  if (!row) return;
  const ls = prog.lastSession;
  if (!ls || prog.resumeDismissed) { row.classList.add('hidden'); return; }

  let detail = '', resumeAction = null;
  if (ls.screen === 'training' && ls.puzzleIdx != null && PUZZLES[ls.puzzleIdx]) {
    const p = PUZZLES[ls.puzzleIdx];
    detail = `Tactics · Puzzle ${ls.puzzleIdx + 1} of ${PUZZLES.length} · ${p.theme}`;
    resumeAction = () => startTraining(ls.puzzleIdx);
  } else if (ls.screen === 'openings' && ls.openingIdx != null && OPENINGS[ls.openingIdx]) {
    const op = OPENINGS[ls.openingIdx];
    const modeMap = { study: 'Studying', practice: 'Practicing', play: 'Playing' };
    const modeLabel = modeMap[ls.openingMode] || 'Studying';
    detail = `Openings · ${modeLabel} ${op.name}`;
    resumeAction = () => {
      O.mode = ls.openingMode || 'study';
      startOpenings(ls.openingIdx);
    };
  }

  if (!resumeAction) { row.classList.add('hidden'); return; }
  $('resume-detail').textContent = detail;
  $('resume-cta').onclick = resumeAction;
  $('resume-dismiss').onclick = () => {
    prog.resumeDismissed = true;
    saveProg();
    row.classList.add('hidden');
  };
  row.classList.remove('hidden');
}


/* ══════════════════════════════════════════════════════════
   PUZZLE: LOAD
══════════════════════════════════════════════════════════ */
function loadPuzzle(idx) {
  const p = PUZZLES[idx];
  S.idx = idx;
  S.game = new Chess(p.fen);
  S.selected = null; S.targets = []; S.step = 0;
  S.solved = false; S.hintUsed = false; S.locked = false;
  S.wrongCount = 0; S.lastFrom = null; S.lastTo = null;
  S.moveLog = []; S.lastWrong = null;

  $('puzzle-num').textContent = `${idx + 1} / ${PUZZLES.length}`;
  $('nav-solved').textContent = `${prog.solvedIds.length} solved`;
  $('streak-val').textContent = prog.streak || 0;
  $('meta-theme').textContent = `${p.icon}  ${p.theme}`;
  $('meta-diff').textContent  = p.difficulty;
  $('meta-turn').textContent  = p.fen.includes(' w ') ? 'White to move' : 'Black to move';
  $('panel-instruction').textContent = 'Find the best move.';

  setFeedback('', '', 'Select a piece to begin.');
  $('exp-card').classList.add('hidden');
  $('master-card').classList.add('hidden');
  $('btn-next-puzzle').classList.add('hidden');
  $('btn-hint').classList.remove('hidden');
  $('btn-why').classList.add('hidden');

  S.flipped = p.fen.includes(' b ');
  renderBoard(); renderMoveList(); renderCaptures(); updateProgress();
  const panel = document.querySelector('#screen-training .panel-col');
  if (panel) panel.scrollTop = 0;
}


/* ══════════════════════════════════════════════════════════
   BOARD RENDERING (shared)
══════════════════════════════════════════════════════════ */
function renderBoardInto(boardEl, game, opts) {
  const flipped  = !!opts.flipped;
  const selected = opts.selected || null;
  const targets  = opts.targets  || [];
  const lastFrom = opts.lastFrom || null;
  const lastTo   = opts.lastTo   || null;
  const onClick  = opts.onClick;

  boardEl.innerHTML = '';
  const matrix  = game.board();
  const turn    = game.turn();
  const inCheck = game.in_check();

  let checkSq = null;
  if (inCheck) {
    outer:
    for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) {
      const p = matrix[r][f];
      if (p && p.type === 'k' && p.color === turn) { checkSq = toSqName(r, f, false); break outer; }
    }
  }

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const sqName = toSqName(row, col, flipped);
      const { ri, fi } = sqIdx(sqName);
      const pieceData  = matrix[ri][fi];
      const isLight    = (row + col) % 2 !== 0;

      const div = document.createElement('div');
      div.className  = 'sq ' + (isLight ? 'light' : 'dark');
      div.dataset.sq = sqName;
      div.setAttribute('role', 'gridcell');

      if (sqName === selected) div.classList.add('selected');
      if (sqName === lastFrom) div.classList.add('last-from');
      if (sqName === lastTo)   div.classList.add('last-to');
      if (sqName === checkSq)  div.classList.add('in-check');

      if (targets.includes(sqName)) {
        const occupied = pieceData && pieceData.color !== turn;
        div.classList.add(occupied ? 'legal-ring' : 'legal-dot');
      }

      const cornerRank = flipped ? (row === 0) : (row === 7);
      const cornerFile = flipped ? (col === 7) : (col === 0);
      if (cornerRank) {
        const lbl = document.createElement('span');
        lbl.className = 'coord coord-file'; lbl.textContent = sqName[0];
        div.appendChild(lbl);
      }
      if (cornerFile) {
        const lbl = document.createElement('span');
        lbl.className = 'coord coord-rank'; lbl.textContent = sqName[1];
        div.appendChild(lbl);
      }

      if (pieceData) {
        const key  = pieceData.color + pieceData.type.toUpperCase();
        const img  = document.createElement('img');
        img.className = `piece piece-${key}`;
        img.src       = PIECE_URL[key];
        img.alt       = '';
        img.draggable = false;
        img.setAttribute('aria-hidden', 'true');
        // Fallback to Unicode glyph if the SVG fails to load.
        img.onerror = () => {
          const span = document.createElement('span');
          span.className = `piece piece-fallback piece-${pieceData.color}`;
          span.textContent = GLYPHS[key];
          span.setAttribute('aria-hidden', 'true');
          img.replaceWith(span);
        };
        div.appendChild(img);
      }

      if (onClick) div.addEventListener('click', () => onClick(sqName));
      boardEl.appendChild(div);
    }
  }
}

function renderBoard() {
  renderBoardInto($('board'), S.game, {
    flipped: S.flipped, selected: S.selected, targets: S.targets,
    lastFrom: S.lastFrom, lastTo: S.lastTo, onClick: handleClick
  });
  updateCoordLabels($('rank-labels'), $('file-labels'), S.flipped);
}

function toSqName(row, col, flipped) {
  const fi = flipped ? 7 - col : col;
  const ri = flipped ? row     : 7 - row;
  return 'abcdefgh'[fi] + (ri + 1);
}
function sqIdx(sq) { return { fi: 'abcdefgh'.indexOf(sq[0]), ri: 8 - parseInt(sq[1]) }; }
function updateCoordLabels(rEl, fEl, flipped) {
  if (!rEl || !fEl) return;
  const rs = flipped ? ['1','2','3','4','5','6','7','8'] : ['8','7','6','5','4','3','2','1'];
  const fs = flipped ? ['h','g','f','e','d','c','b','a'] : ['a','b','c','d','e','f','g','h'];
  rEl.innerHTML = rs.map(r => `<span>${r}</span>`).join('');
  fEl.innerHTML = fs.map(f => `<span>${f}</span>`).join('');
}


/* ══════════════════════════════════════════════════════════
   PUZZLE: INPUT
══════════════════════════════════════════════════════════ */
function handleClick(sqName) {
  if (S.locked || S.solved) return;
  const piece = S.game.get(sqName);
  const turn  = S.game.turn();
  if (S.selected) {
    if (sqName === S.selected) { clearSelection(); renderBoard(); return; }
    if (piece && piece.color === turn) { selectSq(sqName); return; }
    tryMove(S.selected, sqName); return;
  }
  if (piece && piece.color === turn) selectSq(sqName);
}
function selectSq(sqName) {
  S.selected = sqName;
  const moves = S.game.moves({ square: sqName, verbose: true });
  S.targets = moves.map(m => m.to);
  renderBoard();
}
function clearSelection() { S.selected = null; S.targets = []; }

function tryMove(from, to) {
  const piece     = S.game.get(from);
  let promotion   = undefined;
  if (piece && piece.type === 'p') {
    if ((piece.color === 'w' && to[1] === '8') || (piece.color === 'b' && to[1] === '1')) promotion = 'q';
  }
  const uci = from + to + (promotion || '');
  clearSelection();

  const test = S.game.move({ from, to, promotion });
  if (!test) {
    setFeedback('fc-wrong', '✗', "That move isn't legal. Try again.");
    SFX.wrong(); renderBoard(); return;
  }
  S.game.undo();

  const expected = PUZZLES[S.idx].solution[S.step];
  if (uci === expected) {
    applyMove(from, to, promotion);
    S.step++;
    const done = S.step >= PUZZLES[S.idx].solution.length;
    if (done) onSolved();
    else {
      const computersTurn = S.step % 2 === 1;
      if (computersTurn) {
        const moreAfter = S.step + 1 < PUZZLES[S.idx].solution.length;
        setFeedback('fc-info', '✓', moreAfter ? 'Correct! Find the follow-up…' : 'Correct! Good thinking.');
        S.locked = true;
        setTimeout(autoPlay, 680);
      } else {
        setFeedback('fc-info', '✓', 'Correct! Keep going — find the next move.');
      }
      renderBoard(); renderMoveList();
    }
  } else {
    S.wrongCount++;
    prog.attempts++; saveProg();
    S.lastWrong = { from, to, promotion };
    $('btn-why').classList.remove('hidden');

    const msgs = [
      "That's legal, but not the best move. Look for a forcing move: check, capture, or fork.",
      "Good try, but there's something stronger here. Can you attack two pieces at once?",
      "Legal, but not the key idea. Ask yourself: what does my opponent value most?",
      "Not quite. Think about forcing moves — checks, captures, and attacks your opponent must answer."
    ];
    const msg = msgs[Math.min(S.wrongCount - 1, msgs.length - 1)];
    setFeedback('fc-wrong', '✗', msg);
    SFX.wrong();
    const boardEl = $('board');
    boardEl.classList.add('wrong-shake');
    setTimeout(() => boardEl.classList.remove('wrong-shake'), 400);
    renderBoard();
  }
}

function applyMove(from, to, promotion) {
  const result = S.game.move({ from, to, promotion });
  if (!result) return;
  S.lastFrom = from; S.lastTo = to;
  if (S.game.in_check()) SFX.check();
  else if (result.captured) SFX.capture();
  else SFX.move();
  S.moveLog.push(result.san);
  requestAnimationFrame(() => {
    const sq = document.querySelector(`#board [data-sq="${to}"] .piece`);
    if (sq) {
      sq.classList.add('arrive');
      sq.addEventListener('animationend', () => sq.classList.remove('arrive'), { once: true });
    }
  });
  renderCaptures();
}

function autoPlay() {
  const uci  = PUZZLES[S.idx].solution[S.step];
  const from = uci.slice(0, 2);
  const to   = uci.slice(2, 4);
  const prom = uci.length === 5 ? uci[4] : undefined;
  applyMove(from, to, prom);
  S.step++; S.locked = false;
  renderBoard(); renderMoveList();
  if (S.step < PUZZLES[S.idx].solution.length) {
    setFeedback('fc-info', '→', 'Your turn — find the continuation!');
  }
}


/* ──────────────────────────────────────────────────────────
   PUZZLE "WHY?" — explain why the user's move wasn't best
───────────────────────────────────────────────────────────── */
function onPuzzleWhy() {
  if (!S.lastWrong || S.solved) return;
  const p = PUZZLES[S.idx];
  const expected = p.solution[S.step];

  // Test what user's move would have led to vs. the expected solution move.
  const test = new Chess(S.game.fen());
  const exp = { from: expected.slice(0,2), to: expected.slice(2,4), promotion: expected.length === 5 ? expected[4] : undefined };
  const userRes = test.move(S.lastWrong);
  let userText = '';
  if (userRes) {
    const expl = describeMoveQuality(new Chess(S.game.fen()), S.lastWrong, exp, 2);
    userText = expl;
  }
  setFeedback('fc-hint', '💡',
    userText + (userText ? '  ' : '') +
    `The puzzle wants ${prettifyUci(exp)} (${p.hint})`);
}


/* ──────────────────────────────────────────────────────────
   PUZZLE SOLVED
───────────────────────────────────────────────────────────── */
function onSolved() {
  S.solved = true;
  const p = PUZZLES[S.idx];
  const already = prog.solvedIds.includes(p.id);
  if (!already) {
    prog.solvedIds.push(p.id);
    prog.streak = (prog.streak || 0) + 1;
    prog.bestStreak = Math.max(prog.bestStreak || 0, prog.streak);
    if (S.hintUsed) prog.hintSolves = (prog.hintSolves || 0) + 1;
  }
  prog.attempts = (prog.attempts || 0) + 1;
  saveProg();
  $('board').classList.add('solved');
  setTimeout(() => $('board').classList.remove('solved'), 800);
  SFX.win();
  // Brief celebratory banner over the board.
  showSolvedBanner(p.theme + ' · ' + (S.moveLog[S.moveLog.length - 1] || ''));
  const msgs = ['🎉 Excellent! You found the winning move!', '⭐ Perfect! That\'s exactly the right idea.', '✨ Brilliant! Spot-on tactical vision.', '🏆 Outstanding — just like the masters!'];
  setFeedback('fc-correct', '✓', msgs[Math.floor(Math.random() * msgs.length)]);
  $('panel-instruction').textContent = 'Puzzle solved!';
  $('btn-hint').classList.add('hidden');
  $('btn-why').classList.add('hidden');
  $('btn-next-puzzle').classList.remove('hidden');
  setTimeout(revealExplanation, 360);
  renderBoard(); renderMoveList(); updateProgress();
  $('nav-solved').textContent = `${prog.solvedIds.length} solved`;
  $('streak-val').textContent = prog.streak || 0;
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
   HINT + FEEDBACK helpers
───────────────────────────────────────────────────────────── */
function onHint() {
  if (S.solved) return;
  S.hintUsed = true;
  const p = PUZZLES[S.idx];
  const uci  = p.solution[S.step];
  const from = uci.slice(0, 2);
  setFeedback('fc-hint', '💡', p.hint);
  const sqEl = document.querySelector(`#board [data-sq="${from}"]`);
  if (sqEl) {
    sqEl.classList.add('hint-sq');
    setTimeout(() => sqEl.classList.remove('hint-sq'), 2000);
  }
  clearSelection(); selectSq(from);
}
function setFeedback(stateClass, icon, msg) {
  const card = $('feedback-card');
  card.className = 'feedback-card';
  if (stateClass) card.classList.add(stateClass);
  $('fb-icon').textContent = icon;
  $('fb-msg').textContent  = msg;
  // Brief flash so a status change is noticed even with similar copy.
  card.classList.remove('fb-flash');
  void card.offsetWidth;
  card.classList.add('fb-flash');
}

/* ──────────────────────────────────────────────────────────
   SOLVED BANNER (smooth success animation)
───────────────────────────────────────────────────────────── */
function showSolvedBanner(detail) {
  const b = $('solved-banner');
  if (!b) return;
  $('sb-sub').textContent = detail || '';
  b.classList.remove('hidden', 'fading');
  // Restart animation
  b.style.animation = 'none';
  void b.offsetWidth;
  b.style.animation = '';
  clearTimeout(b._tHide);
  b._tHide = setTimeout(() => {
    b.classList.add('fading');
    clearTimeout(b._tHide2);
    b._tHide2 = setTimeout(() => b.classList.add('hidden'), 380);
  }, 1500);
}


/* ──────────────────────────────────────────────────────────
   CAPTURED PIECES + MATERIAL SCORE
───────────────────────────────────────────────────────────── */
function renderCaptures() {
  const top = $('cap-top'), bot = $('cap-bot');
  if (!top || !bot) return;
  const startCount = { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 };
  const cur = { w: { p:0,n:0,b:0,r:0,q:0,k:0 }, b: { p:0,n:0,b:0,r:0,q:0,k:0 } };
  const mat = S.game.board();
  for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) {
    const p = mat[r][f];
    if (p) cur[p.color][p.type]++;
  }
  const capturedByWhite = [], capturedByBlack = [];
  let mScore = 0;
  ['p','n','b','r','q'].forEach(t => {
    const missingB = Math.max(0, startCount[t] - cur.b[t]);
    const missingW = Math.max(0, startCount[t] - cur.w[t]);
    for (let i = 0; i < missingB; i++) capturedByWhite.push('b' + t.toUpperCase());
    for (let i = 0; i < missingW; i++) capturedByBlack.push('w' + t.toUpperCase());
    mScore += (missingB - missingW) * PIECE_VALUE[t];
  });
  const ourTop = S.flipped ? capturedByWhite : capturedByBlack;
  const ourBot = S.flipped ? capturedByBlack : capturedByWhite;
  top.innerHTML = renderCapList(ourTop) + scoreBadge(S.flipped ? mScore : -mScore);
  bot.innerHTML = renderCapList(ourBot) + scoreBadge(S.flipped ? -mScore : mScore);
}
function renderCapList(arr) {
  if (!arr.length) return '<span class="cap-empty"></span>';
  return arr.map(k => `<span class="cap-piece" style="background-image:url('${PIECE_URL[k]}')"></span>`).join('');
}
function scoreBadge(score) { return score > 0 ? `<span class="cap-score">+${score}</span>` : ''; }


/* ──────────────────────────────────────────────────────────
   MOVE LIST
───────────────────────────────────────────────────────────── */
function renderMoveList() {
  const list = $('move-list');
  if (!list) return;
  if (!S.moveLog.length) { list.innerHTML = '<span class="mh-empty">No moves yet.</span>'; return; }
  const startsWhite = PUZZLES[S.idx].fen.includes(' w ');
  let html = ''; let moveNum = parseInt(PUZZLES[S.idx].fen.split(' ')[5]) || 1;
  for (let i = 0; i < S.moveLog.length; i++) {
    const sideIsWhite = startsWhite ? (i % 2 === 0) : (i % 2 === 1);
    if (sideIsWhite) html += `<span class="mh-num">${moveNum}.</span>`;
    else if (i === 0) html += `<span class="mh-num">${moveNum}…</span>`;
    html += `<span class="mh-san">${S.moveLog[i]}</span>`;
    if (!sideIsWhite) moveNum++;
  }
  list.innerHTML = html;
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


/* ══════════════════════════════════════════════════════════
   OPENINGS — load + mode switching
══════════════════════════════════════════════════════════ */
function loadOpening(idx) {
  if (O.autoTimer) { clearTimeout(O.autoTimer); O.autoTimer = null; }
  O.idx = idx;
  O.game = new Chess(); O.ply = 0;
  O.flipped = !!OPENINGS[idx].flipForBlack;
  O.lastFrom = O.lastTo = null;

  // Reset practice + play game state when switching openings.
  O.prGame = new Chess(); O.prPly = 0; O.prSelected = null; O.prTargets = []; O.prLog = [];
  O.playGame = null; O.playLog = []; O.playLastUser = null; O.playLastBest = null;
  O.playFlipped = !!OPENINGS[idx].flipForBlack;

  const op = OPENINGS[idx];
  $('op-num').textContent       = `${idx + 1} / ${OPENINGS.length}`;
  $('op-title').textContent     = op.name;
  $('op-summary').textContent   = op.summary;
  $('op-meta-eco').textContent  = op.eco;
  $('op-meta-cat').textContent  = op.category;
  $('op-meta-side').textContent = op.side;
  $('nav-op-progress').textContent = `${(prog.studiedOpenings || []).length} studied`;

  const plansEl = $('op-plans');
  plansEl.innerHTML = '';
  op.plans.forEach(p => { const li = document.createElement('li'); li.textContent = p; plansEl.appendChild(li); });

  renderOpDirectory();
  // Re-render whichever mode is active.
  setOpMode(O.mode, true);
}
function renderOpDirectory() {
  const list = $('op-list');
  list.innerHTML = '';
  OPENINGS.forEach((op, i) => {
    const btn = document.createElement('button');
    btn.className = 'op-list-item' + (i === O.idx ? ' active' : '');
    btn.innerHTML = `
      <span class="op-li-eco">${op.eco}</span>
      <span class="op-li-name">${op.name}</span>
      <span class="op-li-side">${op.side}</span>`;
    btn.addEventListener('click', () => loadOpening(i));
    list.appendChild(btn);
  });
}

function setOpMode(mode, force) {
  if (!force && O.mode === mode) return;
  if (O.autoTimer) { clearTimeout(O.autoTimer); O.autoTimer = null; }
  O.mode = mode;
  // Track mode change for the resume banner.
  saveLastSession({ screen: 'openings', openingIdx: O.idx, openingMode: mode });
  // Tab buttons
  document.querySelectorAll('.op-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === mode));
  // Panes
  $('pane-study').classList.toggle('hidden', mode !== 'study');
  $('pane-practice').classList.toggle('hidden', mode !== 'practice');
  $('pane-play').classList.toggle('hidden', mode !== 'play');
  // Action rows
  $('op-actions-study').classList.toggle('hidden', mode !== 'study');
  $('op-actions-practice').classList.toggle('hidden', mode !== 'practice');
  $('op-actions-play').classList.toggle('hidden', mode !== 'play');
  // Eval bar — visible only in play mode
  $('eval-bar').classList.toggle('hidden', mode !== 'play');

  if (mode === 'study') { renderOpBoard(); renderOpTape(); updateOpMoveLabel(); }
  else if (mode === 'practice') { practiceReset(); }
  else if (mode === 'play') { enterPlay(); }
}


/* ══════════════════════════════════════════════════════════
   OPENINGS — STUDY MODE
══════════════════════════════════════════════════════════ */
function renderOpBoard() {
  renderBoardInto($('op-board'), O.game, {
    flipped: O.flipped, lastFrom: O.lastFrom, lastTo: O.lastTo, onClick: null
  });
  updateCoordLabels($('op-rank-labels'), $('op-file-labels'), O.flipped);
}
function renderOpTape() {
  const tape = $('op-move-tape');
  const op = OPENINGS[O.idx];
  if (!op.moves.length) { tape.innerHTML = '<span class="mh-empty">No moves.</span>'; return; }
  let html = '';
  for (let i = 0; i < op.moves.length; i++) {
    if (i % 2 === 0) html += `<span class="mh-num">${(i / 2) + 1}.</span>`;
    const played = i < O.ply;
    const isCurrent = i === O.ply - 1;
    html += `<button class="mh-san mh-clickable${played ? ' mh-played' : ''}${isCurrent ? ' mh-current' : ''}" data-ply="${i + 1}">${op.moves[i].san}</button>`;
  }
  tape.innerHTML = html;
  tape.querySelectorAll('.mh-clickable').forEach(b => {
    b.addEventListener('click', () => opGoToPly(parseInt(b.dataset.ply)));
  });
}
function updateOpMoveLabel() {
  const op = OPENINGS[O.idx];
  const lblEl = $('op-move-label');
  const noteEl = $('op-move-note');
  if (O.ply === 0) {
    lblEl.textContent  = 'Starting position';
    noteEl.textContent = 'Click "Next" to step through the moves of the ' + op.name + '.';
  } else {
    const i = O.ply - 1;
    const moveNum = Math.floor(i / 2) + 1;
    const side = i % 2 === 0 ? '' : '…';
    lblEl.textContent  = `Move ${moveNum}${side ? ' (Black)' : ' (White)'} · ${moveNum}${side}${op.moves[i].san}`;
    noteEl.textContent = op.moves[i].note;
  }
}
function opStep(dir) {
  if (O.autoTimer) { clearTimeout(O.autoTimer); O.autoTimer = null; updateAutoBtn(false); }
  const op = OPENINGS[O.idx];
  if (dir > 0) {
    if (O.ply >= op.moves.length) return;
    const m = op.moves[O.ply];
    const from = m.uci.slice(0,2), to = m.uci.slice(2,4);
    const prom = m.uci.length === 5 ? m.uci[4] : undefined;
    const res = O.game.move({ from, to, promotion: prom });
    if (!res) return;
    O.lastFrom = from; O.lastTo = to;
    if (O.game.in_check()) SFX.check();
    else if (res.captured) SFX.capture();
    else SFX.move();
    O.ply++;
    if (O.ply === op.moves.length) markOpeningStudied(op.id);
  } else if (dir < 0) {
    if (O.ply === 0) return;
    O.game.undo(); O.ply--;
    if (O.ply === 0) { O.lastFrom = O.lastTo = null; }
    else {
      const prev = op.moves[O.ply - 1];
      O.lastFrom = prev.uci.slice(0,2); O.lastTo = prev.uci.slice(2,4);
    }
    SFX.move();
  }
  renderOpBoard(); renderOpTape(); updateOpMoveLabel();
}
function opFirst() {
  if (O.autoTimer) { clearTimeout(O.autoTimer); O.autoTimer = null; updateAutoBtn(false); }
  O.game = new Chess(); O.ply = 0; O.lastFrom = O.lastTo = null;
  renderOpBoard(); renderOpTape(); updateOpMoveLabel();
}
function opGoToPly(targetPly) {
  if (O.autoTimer) { clearTimeout(O.autoTimer); O.autoTimer = null; updateAutoBtn(false); }
  const op = OPENINGS[O.idx];
  O.game = new Chess();
  for (let i = 0; i < targetPly; i++) {
    const m = op.moves[i];
    O.game.move({ from: m.uci.slice(0,2), to: m.uci.slice(2,4), promotion: m.uci.length === 5 ? m.uci[4] : undefined });
  }
  O.ply = targetPly;
  if (targetPly > 0) {
    const prev = op.moves[targetPly - 1];
    O.lastFrom = prev.uci.slice(0,2); O.lastTo = prev.uci.slice(2,4);
  } else { O.lastFrom = O.lastTo = null; }
  if (O.ply === op.moves.length) markOpeningStudied(op.id);
  renderOpBoard(); renderOpTape(); updateOpMoveLabel();
}
function opAutoPlay() {
  if (O.autoTimer) { clearTimeout(O.autoTimer); O.autoTimer = null; updateAutoBtn(false); return; }
  updateAutoBtn(true);
  const tick = () => {
    const op = OPENINGS[O.idx];
    if (O.ply >= op.moves.length) { O.autoTimer = null; updateAutoBtn(false); return; }
    opStep(+1);
    O.autoTimer = setTimeout(tick, 950);
  };
  if (O.ply >= OPENINGS[O.idx].moves.length) opFirst();
  tick();
}
function updateAutoBtn(playing) {
  const b = $('btn-op-auto');
  if (!b) return;
  b.classList.toggle('playing', playing);
  b.textContent = playing ? 'Pause' : 'Auto';
}
function markOpeningStudied(id) {
  if (!prog.studiedOpenings) prog.studiedOpenings = [];
  if (!prog.studiedOpenings.includes(id)) {
    prog.studiedOpenings.push(id);
    saveProg();
    $('nav-op-progress').textContent = `${prog.studiedOpenings.length} studied`;
  }
}


/* ══════════════════════════════════════════════════════════
   OPENINGS — PRACTICE MODE
   Empty board (standard start position). User plays each
   opening move from memory. Opponent moves auto-play.
══════════════════════════════════════════════════════════ */
function practiceReset() {
  O.prGame = new Chess();
  O.prPly = 0; O.prSelected = null; O.prTargets = []; O.prLog = [];
  O.lastFrom = O.lastTo = null;
  setPracticeFeedback('', '♟', practicePromptText());
  $('practice-prompt').textContent = "Play the moves of the opening from the standard starting position.";
  renderPracticeBoard();
  renderPracticeTape();
  // If the first move is the opponent's (e.g. user is learning a black response), auto-play it.
  scheduleOpponentPracticeMove();
}
function practicePromptText() {
  const op = OPENINGS[O.idx];
  const userColor = op.userColor;
  return userColor === 'w' ? 'You are White. Make White\'s first move.' : 'You are Black. Wait for White, then make Black\'s move.';
}
function renderPracticeBoard() {
  renderBoardInto($('op-board'), O.prGame, {
    flipped: O.flipped,
    selected: O.prSelected,
    targets: O.prTargets,
    lastFrom: O.lastFrom, lastTo: O.lastTo,
    onClick: practiceClick
  });
  updateCoordLabels($('op-rank-labels'), $('op-file-labels'), O.flipped);
}
function renderPracticeTape() {
  const op = OPENINGS[O.idx];
  const tape = $('practice-tape');
  $('practice-progress').textContent = `${O.prPly} / ${op.moves.length}`;
  if (!op.moves.length) { tape.innerHTML = '<span class="mh-empty">No moves.</span>'; return; }
  let html = '';
  for (let i = 0; i < op.moves.length; i++) {
    if (i % 2 === 0) html += `<span class="mh-num">${(i/2)+1}.</span>`;
    const played = i < O.prPly;
    const isCurrent = i === O.prPly;
    const isUser = (i % 2 === 0 ? 'w' : 'b') === op.userColor;
    let cls = 'mh-san';
    if (played) cls += ' mh-played';
    if (isCurrent && isUser) cls += ' mh-current';
    const label = played ? op.moves[i].san : (isUser ? '?' : '·');
    html += `<span class="${cls}">${label}</span>`;
  }
  tape.innerHTML = html;
}
function practiceClick(sq) {
  const op = OPENINGS[O.idx];
  if (O.prPly >= op.moves.length) return;
  const expectedSide = O.prPly % 2 === 0 ? 'w' : 'b';
  if (expectedSide !== op.userColor) return; // not user's turn

  const piece = O.prGame.get(sq);
  const turn  = O.prGame.turn();
  if (O.prSelected) {
    if (sq === O.prSelected) { O.prSelected = null; O.prTargets = []; renderPracticeBoard(); return; }
    if (piece && piece.color === turn) {
      O.prSelected = sq;
      O.prTargets = O.prGame.moves({ square: sq, verbose: true }).map(m => m.to);
      renderPracticeBoard(); return;
    }
    tryPracticeMove(O.prSelected, sq);
    return;
  }
  if (piece && piece.color === turn) {
    O.prSelected = sq;
    O.prTargets = O.prGame.moves({ square: sq, verbose: true }).map(m => m.to);
    renderPracticeBoard();
  }
}
function tryPracticeMove(from, to) {
  const op = OPENINGS[O.idx];
  const expected = op.moves[O.prPly];
  const piece = O.prGame.get(from);
  let promotion;
  if (piece && piece.type === 'p' && ((piece.color === 'w' && to[1] === '8') || (piece.color === 'b' && to[1] === '1'))) promotion = 'q';
  const uci = from + to + (promotion || '');

  // Verify legality
  const test = O.prGame.move({ from, to, promotion });
  if (!test) {
    setPracticeFeedback('fc-wrong', '✗', "Illegal move. Try again."); SFX.wrong();
    O.prSelected = null; O.prTargets = []; renderPracticeBoard(); return;
  }
  O.prGame.undo();

  if (uci === expected.uci) {
    // Correct
    const res = O.prGame.move({ from, to, promotion });
    O.prLog.push(res.san);
    O.lastFrom = from; O.lastTo = to;
    O.prPly++;
    if (O.prGame.in_check()) SFX.check();
    else if (res.captured) SFX.capture(); else SFX.move();

    if (O.prPly >= op.moves.length) {
      setPracticeFeedback('fc-correct', '✓', `Perfect! You memorized the entire ${op.name}.`);
      markOpeningStudied(op.id);
      SFX.win();
    } else {
      setPracticeFeedback('fc-info', '✓', `Correct — ${res.san}. ${expected.note}`);
      scheduleOpponentPracticeMove();
    }
    O.prSelected = null; O.prTargets = [];
    renderPracticeBoard(); renderPracticeTape();
  } else {
    // Wrong move
    setPracticeFeedback('fc-wrong', '✗',
      `Not the book move. The opening expects ${prettifyUci(expected)}. Try again.`);
    SFX.wrong();
    O.prSelected = null; O.prTargets = [];
    const boardEl = $('op-board');
    boardEl.classList.add('wrong-shake');
    setTimeout(() => boardEl.classList.remove('wrong-shake'), 400);
    renderPracticeBoard();
  }
}
function scheduleOpponentPracticeMove() {
  const op = OPENINGS[O.idx];
  if (O.prPly >= op.moves.length) return;
  const sideToMove = O.prPly % 2 === 0 ? 'w' : 'b';
  if (sideToMove === op.userColor) {
    setPracticeFeedback('', '♟', `Your move — find ${prettifyMoveNum(O.prPly)} for ${sideToMove === 'w' ? 'White' : 'Black'}.`);
    return;
  }
  // Opponent's pre-set move
  setTimeout(() => {
    if (O.mode !== 'practice' || O.prPly >= op.moves.length) return;
    const m = op.moves[O.prPly];
    const res = O.prGame.move({ from: m.uci.slice(0,2), to: m.uci.slice(2,4), promotion: m.uci.length === 5 ? m.uci[4] : undefined });
    if (!res) return;
    O.prLog.push(res.san);
    O.lastFrom = m.uci.slice(0,2); O.lastTo = m.uci.slice(2,4);
    O.prPly++;
    if (O.prGame.in_check()) SFX.check();
    else if (res.captured) SFX.capture(); else SFX.move();
    if (O.prPly >= op.moves.length) {
      setPracticeFeedback('fc-correct', '✓', `Opening complete! You finished the ${op.name}.`);
      markOpeningStudied(op.id);
    } else {
      const next = op.moves[O.prPly];
      setPracticeFeedback('', '♟', `Opponent played ${res.san}. Now find ${prettifyMoveNum(O.prPly)} for ${op.userColor === 'w' ? 'White' : 'Black'}.`);
    }
    renderPracticeBoard(); renderPracticeTape();
  }, 650);
}
function practiceHint() {
  const op = OPENINGS[O.idx];
  if (O.prPly >= op.moves.length) return;
  const expected = op.moves[O.prPly];
  if ((O.prPly % 2 === 0 ? 'w' : 'b') !== op.userColor) return;
  const from = expected.uci.slice(0, 2);
  const sqEl = document.querySelector(`#op-board [data-sq="${from}"]`);
  if (sqEl) {
    sqEl.classList.add('hint-sq');
    setTimeout(() => sqEl.classList.remove('hint-sq'), 2000);
  }
  setPracticeFeedback('fc-hint', '💡', `Try moving the piece on ${from}.`);
}
function setPracticeFeedback(cls, icon, msg) {
  const card = $('practice-feedback');
  card.className = 'feedback-card';
  if (cls) card.classList.add(cls);
  $('practice-fb-icon').textContent = icon;
  $('practice-fb-msg').textContent = msg;
}
function prettifyMoveNum(ply) {
  const num = Math.floor(ply / 2) + 1;
  return ply % 2 === 0 ? `${num}.` : `${num}…`;
}


/* ══════════════════════════════════════════════════════════
   OPENINGS — PLAY ON MODE
   Continue the game from the opening's last position vs. engine.
══════════════════════════════════════════════════════════ */
function enterPlay() {
  const op = OPENINGS[O.idx];
  // Fast-forward to the position after the opening line.
  O.playGame = new Chess();
  for (const m of op.moves) {
    O.playGame.move({ from: m.uci.slice(0,2), to: m.uci.slice(2,4), promotion: m.uci.length === 5 ? m.uci[4] : undefined });
  }
  O.playSelected = null; O.playTargets = [];
  O.playLog = op.moves.map(m => m.san);
  O.playLastUser = null; O.playLastBest = null;
  O.playLastFrom = null; O.playLastTo = null;
  O.playPly = op.moves.length;
  O.playThinking = false;
  O.playFlipped = !!op.flipForBlack;
  $('why-card').classList.add('hidden');
  setPlayFeedback('', '⚔', `Position from the ${op.name}. ${op.userColor === O.playGame.turn() ? 'Your move.' : 'Engine will play first…'}`);
  renderPlayBoard(); renderPlayTape(); updateEvalBar();
  // If it's the engine's move, kick it off.
  if (O.playGame.turn() !== op.userColor) setTimeout(engineMove, 450);
}
function renderPlayBoard() {
  renderBoardInto($('op-board'), O.playGame, {
    flipped: O.playFlipped, selected: O.playSelected, targets: O.playTargets,
    lastFrom: O.playLastFrom, lastTo: O.playLastTo, onClick: playClick
  });
  updateCoordLabels($('op-rank-labels'), $('op-file-labels'), O.playFlipped);
}
function renderPlayTape() {
  const tape = $('play-tape');
  if (!O.playLog.length) { tape.innerHTML = '<span class="mh-empty">No moves yet.</span>'; return; }
  let html = '';
  for (let i = 0; i < O.playLog.length; i++) {
    if (i % 2 === 0) html += `<span class="mh-num">${(i/2)+1}.</span>`;
    html += `<span class="mh-san">${O.playLog[i]}</span>`;
  }
  tape.innerHTML = html;
}
function playClick(sq) {
  if (O.playThinking) return;
  const op = OPENINGS[O.idx];
  if (O.playGame.turn() !== op.userColor) return;
  if (O.playGame.game_over()) return;

  const piece = O.playGame.get(sq);
  const turn  = O.playGame.turn();
  if (O.playSelected) {
    if (sq === O.playSelected) { O.playSelected = null; O.playTargets = []; renderPlayBoard(); return; }
    if (piece && piece.color === turn) {
      O.playSelected = sq;
      O.playTargets = O.playGame.moves({ square: sq, verbose: true }).map(m => m.to);
      renderPlayBoard(); return;
    }
    tryPlayMove(O.playSelected, sq);
    return;
  }
  if (piece && piece.color === turn) {
    O.playSelected = sq;
    O.playTargets = O.playGame.moves({ square: sq, verbose: true }).map(m => m.to);
    renderPlayBoard();
  }
}
function tryPlayMove(from, to) {
  const piece = O.playGame.get(from);
  let promotion;
  if (piece && piece.type === 'p' && ((piece.color === 'w' && to[1] === '8') || (piece.color === 'b' && to[1] === '1'))) promotion = 'q';

  // Classify BEFORE applying, using a fresh game clone.
  const gameClone = new Chess(O.playGame.fen());
  const userMove = { from, to, promotion };
  const cls = ENGINE.classify(gameClone, userMove, 2);

  // Try the actual move
  const res = O.playGame.move(userMove);
  if (!res) {
    setPlayFeedback('fc-wrong', '✗', "Illegal move.");
    O.playSelected = null; O.playTargets = []; renderPlayBoard(); return;
  }
  O.playLog.push(res.san);
  O.playLastFrom = from; O.playLastTo = to;
  O.playSelected = null; O.playTargets = [];
  O.playLastUser = { move: res, from, to, promotion, classification: cls };
  O.playLastBest = cls.best;

  if (O.playGame.in_check()) SFX.check();
  else if (res.captured) SFX.capture(); else SFX.move();

  // Feedback message
  const label = {
    best: 'Best',
    good: 'Good',
    inaccuracy: 'Inaccuracy',
    mistake: 'Mistake',
    blunder: 'Blunder'
  }[cls.category];
  const fbCls = {
    best: 'fc-correct',
    good: 'fc-info',
    inaccuracy: 'fc-hint',
    mistake: 'fc-wrong',
    blunder: 'fc-wrong'
  }[cls.category];
  const lossPart = cls.delta > 25 ? ` (lost ${Math.round(cls.delta/100*100)/100} pawns vs. best)` : '';
  setPlayFeedback(fbCls, label === 'Best' ? '★' : (label === 'Blunder' ? '✗' : '⚔'),
    `${res.san} — ${label}${lossPart}. ${cls.category !== 'best' ? 'Tap "Why?" to see the engine\'s preferred move.' : 'The engine agrees.'}`);
  $('why-card').classList.add('hidden');
  renderPlayBoard(); renderPlayTape(); updateEvalBar();

  if (O.playGame.game_over()) { handlePlayGameOver(); return; }

  // Engine reply
  O.playThinking = true;
  setTimeout(engineMove, 350);
}
function engineMove() {
  if (!O.playGame || O.playGame.game_over()) return;
  const op = OPENINGS[O.idx];
  if (O.playGame.turn() === op.userColor) { O.playThinking = false; return; }
  const best = ENGINE.bestMove(O.playGame, 2);
  if (!best) { O.playThinking = false; return; }
  const res = O.playGame.move(best.move);
  if (!res) { O.playThinking = false; return; }
  O.playLog.push(res.san);
  O.playLastFrom = best.move.from; O.playLastTo = best.move.to;
  if (O.playGame.in_check()) SFX.check();
  else if (res.captured) SFX.capture(); else SFX.move();
  O.playThinking = false;
  renderPlayBoard(); renderPlayTape(); updateEvalBar();
  if (O.playGame.game_over()) handlePlayGameOver();
  else setPlayFeedback('', '⚔', `Engine played ${res.san}. Your move.`);
}
function handlePlayGameOver() {
  let msg = 'Game over.';
  if (O.playGame.in_checkmate()) {
    const winnerWhite = O.playGame.turn() === 'b'; // side to move just got mated
    const op = OPENINGS[O.idx];
    const userWon = (winnerWhite ? 'w' : 'b') === op.userColor;
    msg = userWon ? '🏆 Checkmate — you won!' : '✗ Checkmate — the engine won this round.';
  } else if (O.playGame.in_draw()) msg = 'Draw.';
  else if (O.playGame.in_stalemate()) msg = 'Stalemate — draw.';
  else if (O.playGame.insufficient_material()) msg = 'Insufficient material — draw.';
  else if (O.playGame.in_threefold_repetition()) msg = 'Threefold repetition — draw.';
  setPlayFeedback(O.playGame.in_checkmate() ? 'fc-correct' : 'fc-info', '⚔', msg);
}
function playTakeBack() {
  if (O.playThinking) return;
  const op = OPENINGS[O.idx];
  // Undo back to the last user-to-move position (undo two plies if engine just moved).
  if (O.playLog.length === 0) return;
  // Undo engine move if applicable
  if (O.playGame.turn() === op.userColor && O.playLog.length > op.moves.length) {
    O.playGame.undo(); O.playLog.pop();
  }
  // Undo user move
  if (O.playLog.length > op.moves.length) {
    O.playGame.undo(); O.playLog.pop();
  }
  // Re-render
  const last = O.playGame.history({ verbose: true }).slice(-1)[0];
  if (last) { O.playLastFrom = last.from; O.playLastTo = last.to; }
  else { O.playLastFrom = O.playLastTo = null; }
  O.playLastUser = null; O.playLastBest = null;
  $('why-card').classList.add('hidden');
  setPlayFeedback('', '⚔', 'Take-back done. Try a different move.');
  renderPlayBoard(); renderPlayTape(); updateEvalBar();
}
function onPlayWhy() {
  const why = $('why-card');
  if (!O.playLastUser) {
    setPlayFeedback('fc-hint', '💡', 'Make a move first, then I can explain why the engine prefers a different move.');
    return;
  }
  const last = O.playLastUser;
  const best = O.playLastBest;
  if (last.classification.category === 'best') {
    $('why-body').innerHTML = `Your move <b>${last.move.san}</b> matches the engine's top choice. No improvement available.`;
    why.classList.remove('hidden'); return;
  }
  // Build explanation
  const bestSan = sanOf(best);
  const beforeFen = (() => {
    const c = new Chess(O.playGame.fen());
    c.undo(); // undo engine reply if any
    if (O.playGame.history().length > OPENINGS[O.idx].moves.length + 1) c.undo(); // undo user move
    return c.fen();
  })();

  const explanation = explainEngineChoice(last.move, best, last.classification);
  $('why-body').innerHTML = explanation;
  why.classList.remove('hidden');
}
function setPlayFeedback(cls, icon, msg) {
  const card = $('play-feedback');
  card.className = 'feedback-card';
  if (cls) card.classList.add(cls);
  $('play-fb-icon').textContent = icon;
  $('play-fb-msg').textContent = msg;
}
function updateEvalBar() {
  const c = new Chess(O.playGame.fen());
  const ev = ENGINE.evaluate(c) / 100; // pawns, white perspective
  const clipped = Math.max(-8, Math.min(8, ev));
  const pct = 50 + (clipped / 8) * 50; // 0 (black wins) to 100 (white wins)
  $('eval-fill').style.height = pct + '%';
  let label;
  if (Math.abs(ev) > 50) label = (ev > 0 ? '+M' : '-M');
  else label = (ev > 0 ? '+' : '') + ev.toFixed(2);
  $('eval-text').textContent = label;
}


/* ──────────────────────────────────────────────────────────
   "WHY?" — natural-language explanations
───────────────────────────────────────────────────────────── */
function describeMoveQuality(gameBefore, userMove, bestUci, depth) {
  // Used for puzzle "Why?". Returns one or two sentences.
  const c = new Chess(gameBefore.fen());
  const userRes = c.move(userMove);
  if (!userRes) return '';
  c.undo();
  const cls = ENGINE.classify(gameBefore, userMove, depth);
  const moveSan = userRes.san;
  const bestMove = cls.best;
  const lossPawns = cls.delta / 100;
  let txt = `Your move ${moveSan} is rated as a ${cls.category}`;
  if (cls.delta > 25) txt += ` — about ${lossPawns.toFixed(1)} pawns worse than the engine's choice ${sanOf(bestMove)}`;
  txt += '.';
  return txt;
}
function explainEngineChoice(userMv, bestMv, cls) {
  const category = cls.category;
  const userSan = userMv.san;
  const bestSan = sanOf(bestMv);
  const lossPawns = (cls.delta / 100).toFixed(2);

  const parts = [];
  parts.push(`<p><b>Your move:</b> <span class="san-tag san-${category}">${userSan}</span> · ${prettyCategory(category)}.</p>`);
  parts.push(`<p><b>Engine prefers:</b> <span class="san-tag san-best">${bestSan}</span> (about ${lossPawns} pawns better).</p>`);

  // Heuristic reasoning
  const reasons = [];
  if (bestMv.captured) {
    reasons.push(`<b>${bestSan}</b> captures the ${PIECE_NAME[bestMv.captured]} on ${bestMv.to}, winning material.`);
  }
  if (bestMv.san && bestMv.san.includes('#')) reasons.push(`<b>${bestSan}</b> delivers <b>checkmate</b>.`);
  else if (bestMv.san && bestMv.san.includes('+')) reasons.push(`<b>${bestSan}</b> gives check, forcing the opponent's reply.`);

  if (userMv.captured && !bestMv.captured) {
    reasons.push(`Your capture on ${userMv.to} looks tempting, but it overlooks a stronger continuation.`);
  }
  // Hanging-piece check: did the user move place a piece on a square attacked by a less valuable enemy piece?
  // Skip deeper static analysis here for simplicity.

  if (category === 'blunder') reasons.push(`This move loses significant material or allows a decisive attack — review the position carefully.`);
  else if (category === 'mistake') reasons.push(`This move misses a clearly stronger plan. The engine's choice keeps more options alive.`);
  else if (category === 'inaccuracy') reasons.push(`A reasonable move, but not the most precise. The engine's choice creates fewer weaknesses.`);

  if (reasons.length) parts.push('<p>' + reasons.join(' ') + '</p>');
  return parts.join('');
}
function prettyCategory(c) {
  return { best: '★ Best', good: '✓ Good', inaccuracy: '! Inaccuracy', mistake: '?! Mistake', blunder: '?? Blunder' }[c] || c;
}
function sanOf(verboseMv) {
  if (verboseMv && verboseMv.san) return verboseMv.san;
  if (!verboseMv) return '?';
  // Fallback: reconstruct from UCI
  return (verboseMv.from || '') + (verboseMv.to || '');
}
function prettifyUci(m) {
  // Show approx algebraic for an UCI-like {from, to, promotion}
  const from = m.from || m.uci?.slice(0,2) || '';
  const to   = m.to   || m.uci?.slice(2,4) || '';
  const prom = m.promotion || (m.uci && m.uci.length === 5 ? m.uci[4] : '');
  return from + '→' + to + (prom ? '=' + prom.toUpperCase() : '');
}
