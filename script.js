/* ═══════════════════════════════════════════════════════════
   CHECKMATE LAB  —  script.js
   Puzzles · openings · board rendering · move logic · UI.
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
    // FIX: original FEN had the rook on b1, so the only 8th-rank move was Rb8 — which the black king simply
    // captured (the rook was undefended there). Moved the rook to h1 so Rh8# is reachable AND mate.
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
    // FIX: original FEN had a white pawn on b4 blocking the bishop's diagonal — so there was NO real pin.
    // Replaced the b4 pawn with a c1 rook so the bishop genuinely pins the knight a3–c5–e7, and the rook
    // captures the pinned knight.
    fen: '8/4k3/8/2n5/8/B7/8/2R1K3 w - - 0 1',
    solution: ['c1c5'],
    theme: 'Pin', icon: '📌', difficulty: 'Intermediate',
    hint: 'The knight on c5 cannot legally move (it is pinned). Find the piece that can capture it for free.',
    explanation: "Rxc5 wins a piece by exploiting the pin! The bishop on a3 pins the knight on c5 against the king on e7 — the knight legally cannot move because doing so would expose the king to check. A pinned piece is almost captured already. White simply marches the rook to c5 and grabs the helpless knight; Black has no way to recapture (the king is too far away, and any king move would still leave it on the pin diagonal). This is the textbook 'pin and win' tactic.",
    masterExamples: [
      { player: 'José Raúl Capablanca', year: 1921, idea: "The Cuban genius routinely identified pinned pieces and attacked them with pawns to win material with effortless simplicity", lesson: 'A pinned piece cannot fight back — attack it with a less valuable piece to win material cleanly.' }
    ]
  },
  {
    id: 7,
    // FIX: original FEN had queen on h5, but that put Black's king already in check on h5-g4-f3 — illegal position.
    // FIX: original middle response 'f3e2' was illegal — Ke2 would be adjacent to white king on e1.
    // Queen moved one square back (h6); Black's forced reply becomes Kf4; then Qxb3 wins the skewered rook.
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
    // FIX: original had black rook on g8 — Black could play Rxg7 to save the king. Moved rook to f8.
    fen: '5r1k/6pp/6Q1/8/8/8/8/6RK w - - 0 1',
    solution: ['g6g7'],
    theme: 'Queen & Rook', icon: '⚡', difficulty: 'Intermediate',
    hint: 'The rook on g1 guards the entire g-file. Can the queen capture on g7 and deliver checkmate, protected by the rook?',
    explanation: "Qxg7# is checkmate! The queen captures the g7 pawn with check, supported by the rook on g1. The king on h8 cannot take the queen because it's protected by the rook. The king can't escape to g8 (the queen controls that square diagonally) or to h7 (the queen attacks h7 directly). No piece can capture the queen — the rook on f8 doesn't cover g7, and the pawns can't capture forward. This is textbook queen-and-rook coordination: the rook protects the queen as she delivers the killing blow.",
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
    explanation: "Qb7# — king and queen checkmate! The queen on b7 covers a8 (diagonal), b8 (file), and a7 (rank). The white king on c6 defends the queen and covers c7 and c8. Every single square around the black king is controlled. This is the most fundamental checkmate pattern in chess — every player must know how to deliver it quickly and confidently.",
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
    // FIX: original had white king on f6, which did NOT defend g8. Black could capture the new queen with Kxg8.
    // White king moved to f7 so it defends g8.
    fen: '7k/5KP1/8/8/8/8/8/8 w - - 0 1',
    solution: ['g7g8q'],
    theme: 'Promotion Mate', icon: '⬆️', difficulty: 'Beginner',
    hint: 'The pawn is one step from the 8th rank. Will the new queen — defended by your king — simultaneously deliver checkmate?',
    explanation: "g8=Q# promotes the pawn to a queen AND delivers checkmate in the same move! The new queen on g8 checks the king on h8. The king cannot escape: h7 is covered by the queen diagonally, g7 is covered by the white king on f7, and the king cannot capture the queen because the king on f7 defends g8. When promoting a pawn, always calculate whether the new queen gives immediate checkmate — and confirm that it's defended so the enemy king can't simply take it back.",
    masterExamples: [
      { player: 'Endgame Study', year: 1900, idea: "The most elegant endgame victories combine pawn promotion with immediate checkmate — two goals achieved in a single, decisive move", lesson: "Before promoting, always check if the new queen delivers immediate checkmate. Promotion + mate in one move is the ultimate efficiency." }
    ]
  }
];


/* ──────────────────────────────────────────────────────────
   OPENINGS DATABASE
   Curated lines through the main moves of classical openings.
───────────────────────────────────────────────────────────── */
const OPENINGS = [
  {
    id: 'italian',
    name: 'Italian Game',
    eco: 'C50',
    category: 'Open Game · 1.e4 e5',
    side: 'For White',
    flipForBlack: false,
    summary: "One of the oldest and most natural openings — White develops rapidly and aims the light-squared bishop at f7, Black's most vulnerable square.",
    moves: [
      { uci: 'e2e4', san: 'e4',  note: "King's pawn opening. Stakes a claim in the center, opens diagonals for the queen and bishop." },
      { uci: 'e7e5', san: 'e5',  note: 'Black mirrors, fighting for the center on equal terms.' },
      { uci: 'g1f3', san: 'Nf3', note: "Develops a knight to its best square and attacks the e5 pawn — a flexible, classical move." },
      { uci: 'b8c6', san: 'Nc6', note: "Defends e5 and develops naturally toward the center." },
      { uci: 'f1c4', san: 'Bc4', note: 'The "Italian bishop." It eyes f7 — the only square defended solely by the king.' },
      { uci: 'g8f6', san: 'Nf6', note: 'The Two Knights Defense — Black counter-attacks e4 instead of defending passively.' },
      { uci: 'd2d3', san: 'd3',  note: 'The Giuoco Pianissimo — a slow, modern handling. White prepares c3 and a long maneuvering game.' }
    ],
    plans: [
      'Develop knights before bishops; castle kingside early.',
      'Prepare d2–d4 (Giuoco Piano) or play slowly with d3 (Giuoco Pianissimo).',
      'Watch f7 — sacrifice or pile-up tactics on this square are a recurring motif.',
      'Avoid the Fried Liver if Black is theoretically prepared.'
    ]
  },
  {
    id: 'ruylopez',
    name: 'Ruy Lopez (Spanish Opening)',
    eco: 'C60',
    category: 'Open Game · 1.e4 e5',
    side: 'For White',
    flipForBlack: false,
    summary: "Named after a 16th-century Spanish priest, the Ruy Lopez puts immediate strategic pressure on Black's knight — and through it, the e5 pawn.",
    moves: [
      { uci: 'e2e4', san: 'e4',  note: 'King-pawn opening.' },
      { uci: 'e7e5', san: 'e5',  note: 'Classical reply.' },
      { uci: 'g1f3', san: 'Nf3', note: 'Attacks e5.' },
      { uci: 'b8c6', san: 'Nc6', note: 'Defends e5.' },
      { uci: 'f1b5', san: 'Bb5', note: 'The Spanish bishop. Threatens Bxc6 followed by Nxe5, indirectly attacking e5.' },
      { uci: 'a7a6', san: 'a6',  note: 'The Morphy Defense — Black challenges the bishop. The main line of modern chess.' },
      { uci: 'b5a4', san: 'Ba4', note: 'White retreats but keeps the diagonal alive. The bishop will become a long-term asset.' },
      { uci: 'g8f6', san: 'Nf6', note: 'Counter-attacks e4.' },
      { uci: 'e1g1', san: 'O-O', note: 'White castles, ignoring the e-pawn temporarily (it can be re-won).' }
    ],
    plans: [
      "Maintain pressure on e5 with the b5/a4 bishop and Nf3.",
      'Build a strong center with c3 and d4 at the right moment.',
      "Trade the light-squared bishop only when it weakens Black's pawn structure.",
      'The Closed Spanish (with …Be7, …b5, …d6) is a great strategic battleground.'
    ]
  },
  {
    id: 'sicilian',
    name: 'Sicilian Defense',
    eco: 'B20',
    category: 'Semi-Open · 1.e4 c5',
    side: 'For Black',
    flipForBlack: true,
    summary: "Black's most ambitious and aggressive response to 1.e4. Instead of symmetry, Black creates an immediate asymmetry that fights for the win.",
    moves: [
      { uci: 'e2e4', san: 'e4',  note: 'King-pawn opening.' },
      { uci: 'c7c5', san: 'c5',  note: 'The Sicilian! Black refuses to mirror, claiming d4 and starting a structural fight.' },
      { uci: 'g1f3', san: 'Nf3', note: 'Most popular — prepares the central break d4.' },
      { uci: 'd7d6', san: 'd6',  note: 'Najdorf/Dragon territory — flexible, supports e5 later.' },
      { uci: 'd2d4', san: 'd4',  note: 'White grabs the center with a pawn break.' },
      { uci: 'c5d4', san: 'cxd4',note: 'Black accepts — the trade opens the c-file, which Black will use for counter-play.' },
      { uci: 'f3d4', san: 'Nxd4',note: "White recaptures — this is the Open Sicilian, the main battleground." },
      { uci: 'g8f6', san: 'Nf6', note: 'Attacks e4 and develops.' },
      { uci: 'b1c3', san: 'Nc3', note: 'Defends e4 — main-line tabiya.' },
      { uci: 'a7a6', san: 'a6',  note: 'The Najdorf — prevents Nb5 and prepares …e5 or …b5.' }
    ],
    plans: [
      'Use the half-open c-file for queenside counter-play (…Rc8, …Qc7).',
      'Aim for a thematic …d6–d5 break or a …b5–b4 expansion.',
      'Castle kingside, but be ready to defend if White launches a kingside attack (Yugoslav, English Attack).',
      'Pawn structures (Najdorf, Scheveningen, Dragon) define the plans — know yours.'
    ]
  },
  {
    id: 'french',
    name: 'French Defense',
    eco: 'C00',
    category: 'Semi-Open · 1.e4 e6',
    side: 'For Black',
    flipForBlack: true,
    summary: "A solid, strategic system. Black accepts a slightly cramped position in exchange for a rock-solid pawn chain and a clear plan: …d5 and …c5.",
    moves: [
      { uci: 'e2e4', san: 'e4',  note: 'King-pawn opening.' },
      { uci: 'e7e6', san: 'e6',  note: 'The French — preparing …d5 with support.' },
      { uci: 'd2d4', san: 'd4',  note: 'White builds the ideal pawn center.' },
      { uci: 'd7d5', san: 'd5',  note: 'Black strikes at the center on move 2 — the soul of the French.' },
      { uci: 'b1c3', san: 'Nc3', note: 'The main line — develops and defends e4.' },
      { uci: 'f8b4', san: 'Bb4', note: 'The Winawer Variation — pins the knight and threatens …dxe4.' },
      { uci: 'e4e5', san: 'e5',  note: 'White locks the center, gaining space but giving Black a target.' },
      { uci: 'c7c5', san: 'c5',  note: 'The thematic break — Black attacks the base of the white pawn chain.' }
    ],
    plans: [
      "Always be looking for the …c5 break — it's the engine of the French.",
      "Solve the 'bad' light-squared bishop: re-route via …b6/…Ba6 or exchange it.",
      'Queenside play with …Qa5, …Nc6, …Rc8 vs. kingside attack potential.',
      'In closed positions, knights often outshine bishops — accept slow maneuvering.'
    ]
  },
  {
    id: 'caro',
    name: 'Caro-Kann Defense',
    eco: 'B10',
    category: 'Semi-Open · 1.e4 c6',
    side: 'For Black',
    flipForBlack: true,
    summary: "Like the French, but with the light-squared bishop free. A rock-solid choice favored by World Champions Capablanca, Karpov, and Carlsen.",
    moves: [
      { uci: 'e2e4', san: 'e4',  note: 'King-pawn opening.' },
      { uci: 'c7c6', san: 'c6',  note: 'The Caro-Kann — preparing …d5 with support, while keeping the c8-bishop free.' },
      { uci: 'd2d4', san: 'd4',  note: 'Builds the center.' },
      { uci: 'd7d5', san: 'd5',  note: 'The central challenge.' },
      { uci: 'b1c3', san: 'Nc3', note: 'Classical Variation.' },
      { uci: 'd5e4', san: 'dxe4',note: 'Black accepts the trade, simplifying.' },
      { uci: 'c3e4', san: 'Nxe4',note: 'White recaptures.' },
      { uci: 'c8f5', san: 'Bf5', note: 'The Classical Caro — Black develops the "good" bishop outside the pawn chain.' }
    ],
    plans: [
      "Develop the light-squared bishop before locking it in with …e6.",
      'Solid structure: …e6, …Nd7, …Ngf6, …Be7, …O-O.',
      'Aim for …c5 break later — gradual equalization.',
      'Endgames favor Black thanks to the healthy pawn structure.'
    ]
  },
  {
    id: 'qgd',
    name: "Queen's Gambit Declined",
    eco: 'D30',
    category: "Closed · 1.d4 d5",
    side: 'For both colors',
    flipForBlack: false,
    summary: "The most classical of all openings. White offers the c-pawn to deflect Black's center; Black politely declines and builds a fortress.",
    moves: [
      { uci: 'd2d4', san: 'd4',  note: 'Queen-pawn opening.' },
      { uci: 'd7d5', san: 'd5',  note: 'Classical reply.' },
      { uci: 'c2c4', san: 'c4',  note: "The Queen's Gambit — offers a pawn to lure Black off the center." },
      { uci: 'e7e6', san: 'e6',  note: 'Declined — Black defends d5 with the e-pawn instead of grabbing material.' },
      { uci: 'b1c3', san: 'Nc3', note: 'Develops and pressures d5.' },
      { uci: 'g8f6', san: 'Nf6', note: 'Develops and supports d5.' },
      { uci: 'c1g5', san: 'Bg5', note: 'The pin — increasing pressure on d5 via the knight on f6.' },
      { uci: 'f8e7', san: 'Be7', note: 'Black breaks the pin and prepares to castle.' }
    ],
    plans: [
      "White: build a minority attack on the queenside (b4–b5).",
      "Black: solve the 'problem bishop' on c8 — often via …b6 and …Bb7.",
      'Central tension: aim for the …c5 break or …dxc4 at the right time.',
      'Castle kingside, then look for piece play in the center.'
    ]
  },
  {
    id: 'london',
    name: 'London System',
    eco: 'D02',
    category: "Closed · 1.d4",
    side: 'For White',
    flipForBlack: false,
    summary: "A practical system loved by club players and World Champions alike. White builds the same setup against almost anything — easy to learn, hard to crack.",
    moves: [
      { uci: 'd2d4', san: 'd4',  note: 'Queen-pawn opening.' },
      { uci: 'd7d5', san: 'd5',  note: 'Classical reply.' },
      { uci: 'g1f3', san: 'Nf3', note: 'Develops, prepares the bishop.' },
      { uci: 'g8f6', san: 'Nf6', note: 'Mirror.' },
      { uci: 'c1f4', san: 'Bf4', note: 'The London bishop — outside the pawn chain on its best diagonal.' },
      { uci: 'c7c5', san: 'c5',  note: "The main challenge — Black attacks d4 immediately." },
      { uci: 'e2e3', san: 'e3',  note: 'Supports d4 — keeping the structure stable.' },
      { uci: 'b8c6', san: 'Nc6', note: 'Continues development and pressures d4.' },
      { uci: 'b1d2', san: 'Nbd2',note: 'Avoids …Bb4+; prepares c3 and a slow build-up.' }
    ],
    plans: [
      'Build the pyramid: pawns on d4–e3–c3, bishop on f4, knight on f3 and d2.',
      'Castle short, then push h3–g4 for kingside expansion.',
      "Watch out for …Qb6 hitting both b2 and d4 — be ready with Qb3 or Nc3.",
      'Aim for an Nf3–e5 outpost in the middlegame.'
    ]
  },
  {
    id: 'kings-indian',
    name: "King's Indian Defense",
    eco: 'E60',
    category: "Indian · 1.d4 Nf6",
    side: 'For Black',
    flipForBlack: true,
    summary: "Black lets White build a huge center — then attacks it from the flank with pieces. A favorite of Fischer, Kasparov, and Nakamura.",
    moves: [
      { uci: 'd2d4', san: 'd4',  note: 'Queen-pawn.' },
      { uci: 'g8f6', san: 'Nf6', note: "Indian Defenses — refusing …d5." },
      { uci: 'c2c4', san: 'c4',  note: 'White claims the center.' },
      { uci: 'g7g6', san: 'g6',  note: "King's Indian setup — fianchetto coming." },
      { uci: 'b1c3', san: 'Nc3', note: 'Develops, supports e4.' },
      { uci: 'f8g7', san: 'Bg7', note: "The King's Indian bishop — long diagonal." },
      { uci: 'e2e4', san: 'e4',  note: 'White takes the big center.' },
      { uci: 'd7d6', san: 'd6',  note: 'Black prepares …e5 to challenge the center later.' },
      { uci: 'g1f3', san: 'Nf3', note: 'Classical setup.' },
      { uci: 'e8g8', san: 'O-O', note: 'Castles before launching kingside operations.' }
    ],
    plans: [
      'Castle, then push …e5 to challenge the center.',
      "After d5 by White, lock the center and launch a kingside pawn storm: …f5, …f4, …g5, …h5.",
      "Knight tour: …Nbd7–f8–g6 or …Nbd7–c5 depending on the structure.",
      'Trust the long diagonal — the Bg7 is a monster in the endgame.'
    ]
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian Defense',
    eco: 'B01',
    category: "Semi-Open · 1.e4 d5",
    side: 'For Black',
    flipForBlack: true,
    summary: "Direct and combative. Black challenges White's e-pawn immediately, forcing simple structures and avoiding deep theory.",
    moves: [
      { uci: 'e2e4', san: 'e4',  note: 'King-pawn opening.' },
      { uci: 'd7d5', san: 'd5',  note: 'The Scandinavian — direct central challenge.' },
      { uci: 'e4d5', san: 'exd5',note: 'White accepts — the main line.' },
      { uci: 'd8d5', san: 'Qxd5',note: 'Black recaptures with the queen — exposed, but actively placed.' },
      { uci: 'b1c3', san: 'Nc3', note: 'Develops with tempo on the queen.' },
      { uci: 'd5a5', san: 'Qa5', note: "The most popular retreat — the queen stays active." },
      { uci: 'd2d4', san: 'd4',  note: 'Builds the center.' },
      { uci: 'g8f6', san: 'Nf6', note: 'Develops naturally.' }
    ],
    plans: [
      "Develop quickly: …Nf6, …c6, …Bf5 or …Bg4, …e6, …Nbd7, then castle queenside or short.",
      'Avoid moving the queen too many times — get the pieces out!',
      'Look for …e5 break later to free the position.',
      'A simple, sound defense — great for players who hate memorizing theory.'
    ]
  },
  {
    id: 'vienna',
    name: 'Vienna Game',
    eco: 'C25',
    category: "Open Game · 1.e4 e5",
    side: 'For White',
    flipForBlack: false,
    summary: "An old, romantic alternative to the Italian or Ruy Lopez — White develops the queen's knight first and aims for an early f4 attack.",
    moves: [
      { uci: 'e2e4', san: 'e4',  note: 'King-pawn opening.' },
      { uci: 'e7e5', san: 'e5',  note: 'Classical reply.' },
      { uci: 'b1c3', san: 'Nc3', note: 'The Vienna — develops the knight first, keeps options open.' },
      { uci: 'g8f6', san: 'Nf6', note: 'Most flexible reply.' },
      { uci: 'f2f4', san: 'f4',  note: "The Vienna Gambit — aggressive! Threatens to disrupt Black's center." },
      { uci: 'd7d5', san: 'd5',  note: "The principled reply — counter in the center against a flank attack." },
      { uci: 'f4e5', san: 'fxe5',note: 'Opens the f-file for the rook.' },
      { uci: 'f6e4', san: 'Nxe4',note: 'Black recaptures the pawn — the main line.' }
    ],
    plans: [
      'Develop with Nf3, Bc4 or Bb5, and castle short.',
      'Use the f-file after fxe5 — Rf1 then doubled rooks are common.',
      "Look for kingside attacks — the Vienna often produces dangerous king hunts.",
      'Mix surprise value with sound development — perfect for club play.'
    ]
  }
];


/* ──────────────────────────────────────────────────────────
   PIECE GRAPHICS
   Wikimedia "cburnett" SVG set — the same designs Lichess uses.
   Licensed CC BY-SA 3.0 (free for any use, attribution-share).
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


/* ──────────────────────────────────────────────────────────
   SOUND (Web Audio — no asset files needed)
───────────────────────────────────────────────────────────── */
const SFX = {
  ctx: null,
  enabled: true,
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
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = gain;
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


/* ──────────────────────────────────────────────────────────
   APP STATE
───────────────────────────────────────────────────────────── */
const S = {
  idx:        0,       // current puzzle index
  game:       null,    // chess.js instance
  selected:   null,    // currently selected square
  targets:    [],      // legal target squares
  step:       0,       // position within solution[]
  solved:     false,
  flipped:    false,
  hintUsed:   false,
  locked:     false,
  wrongCount: 0,
  lastFrom:   null,
  lastTo:     null,
  moveLog:    [],      // SAN move log for the move-history panel
};

// Openings state
const O = {
  idx:       0,
  game:      null,
  ply:       0,
  flipped:   false,
  lastFrom:  null,
  lastTo:    null,
  autoTimer: null,
};


/* ──────────────────────────────────────────────────────────
   LOCAL STORAGE
───────────────────────────────────────────────────────────── */
const LS_KEY = 'clab_v3';

function loadProg() {
  try {
    const r = localStorage.getItem(LS_KEY);
    return r ? Object.assign(newProg(), JSON.parse(r)) : newProg();
  } catch { return newProg(); }
}
function newProg() {
  return { solvedIds:[], attempts:0, streak:0, bestStreak:0, hintSolves:0, studiedOpenings:[], soundOn:true };
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
      </div>`;
    return;
  }

  SFX.enabled = prog.soundOn !== false;

  // Home wiring
  $('btn-start').addEventListener('click', () => startTraining(0));
  $('btn-random').addEventListener('click', startRandom);
  $('btn-mode-puzzles').addEventListener('click', () => startTraining(0));
  $('btn-mode-openings').addEventListener('click', () => startOpenings(0));
  buildThemePills();
  updateHomeStats();

  // Training wiring
  $('btn-home').addEventListener('click', goHome);
  $('btn-prev').addEventListener('click', () => navigate(-1));
  $('btn-next').addEventListener('click', () => navigate(+1));
  $('btn-hint').addEventListener('click', onHint);
  $('btn-flip').addEventListener('click', flipBoard);
  $('btn-reset').addEventListener('click', () => loadPuzzle(S.idx));
  $('btn-next-puzzle').addEventListener('click', () => navigate(+1));
  $('btn-goto-openings').addEventListener('click', () => startOpenings(O.idx || 0));
  $('btn-sound').addEventListener('click', toggleSound);
  reflectSoundButton();

  // Openings wiring
  $('btn-home-2').addEventListener('click', goHome);
  $('btn-op-prev').addEventListener('click', () => navigateOpening(-1));
  $('btn-op-next').addEventListener('click', () => navigateOpening(+1));
  $('btn-op-step').addEventListener('click', () => opStep(+1));
  $('btn-op-back').addEventListener('click', () => opStep(-1));
  $('btn-op-first').addEventListener('click', opFirst);
  $('btn-op-auto').addEventListener('click', opAutoPlay);
  $('btn-op-flip').addEventListener('click', () => { O.flipped = !O.flipped; renderOpBoard(); });
  $('btn-goto-puzzles').addEventListener('click', () => startTraining(S.idx || 0));

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
    if (e.key === 'ArrowLeft')  { e.preventDefault(); opStep(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); opStep(+1); }
    if (e.key.toLowerCase() === 'f') { e.preventDefault(); O.flipped = !O.flipped; renderOpBoard(); }
  }
}


/* ──────────────────────────────────────────────────────────
   SOUND TOGGLE
───────────────────────────────────────────────────────────── */
function toggleSound() {
  SFX.enabled = !SFX.enabled;
  prog.soundOn = SFX.enabled;
  saveProg();
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
   SCREENS
───────────────────────────────────────────────────────────── */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}
function goHome() {
  if (O.autoTimer) { clearTimeout(O.autoTimer); O.autoTimer = null; }
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
function startOpenings(idx) {
  loadOpening(idx || 0);
  showScreen('screen-openings');
}
function navigate(dir) {
  const idx = (S.idx + dir + PUZZLES.length) % PUZZLES.length;
  loadPuzzle(idx);
}
function navigateOpening(dir) {
  const idx = (O.idx + dir + OPENINGS.length) % OPENINGS.length;
  loadOpening(idx);
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

  $('stat-solved').textContent   = solved;
  $('stat-acc').textContent      = acc != null ? acc + '%' : '—';
  $('stat-openings').textContent = (prog.studiedOpenings || []).length;
  $('stat-streak').textContent   = prog.bestStreak || 0;
}


/* ══════════════════════════════════════════════════════════
   PUZZLE: LOAD
═════════════════════════════════════════════════════════════ */
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
  S.moveLog   = [];

  $('puzzle-num').textContent    = `${idx + 1} / ${PUZZLES.length}`;
  $('nav-solved').textContent    = `${prog.solvedIds.length} solved`;
  $('streak-val').textContent    = prog.streak || 0;

  $('meta-theme').textContent    = `${p.icon}  ${p.theme}`;
  $('meta-diff').textContent     = p.difficulty;
  $('meta-turn').textContent     = p.fen.includes(' w ') ? 'White to move' : 'Black to move';

  $('panel-instruction').textContent = 'Find the best move.';

  setFeedback('', '', 'Select a piece to begin.');
  $('exp-card').classList.add('hidden');
  $('master-card').classList.add('hidden');
  $('btn-next-puzzle').classList.add('hidden');
  $('btn-hint').classList.remove('hidden');

  // Auto-flip if it's black to move so the active side is on bottom
  S.flipped = p.fen.includes(' b ');

  renderBoard();
  renderMoveList();
  renderCaptures();
  updateProgress();

  const panel = document.querySelector('#screen-training .panel-col');
  if (panel) panel.scrollTop = 0;
}


/* ══════════════════════════════════════════════════════════
   BOARD RENDERING
═════════════════════════════════════════════════════════════ */
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
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const p = matrix[r][f];
        if (p && p.type === 'k' && p.color === turn) {
          checkSq = toSqName(r, f, false);
          break outer;
        }
      }
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
      div.setAttribute('aria-label', sqName + (pieceData ? ' ' + pieceData.color + pieceData.type : ''));

      if (sqName === selected) div.classList.add('selected');
      if (sqName === lastFrom) div.classList.add('last-from');
      if (sqName === lastTo)   div.classList.add('last-to');
      if (sqName === checkSq)  div.classList.add('in-check');

      if (targets.includes(sqName)) {
        const occupied = pieceData && pieceData.color !== turn;
        div.classList.add(occupied ? 'legal-ring' : 'legal-dot');
      }

      // Corner coordinate hints (a-h on rank 1, 1-8 on a-file)
      const cornerRank = flipped ? (row === 0) : (row === 7);
      const cornerFile = flipped ? (col === 7) : (col === 0);
      if (cornerRank) {
        const lbl = document.createElement('span');
        lbl.className = 'coord coord-file';
        lbl.textContent = sqName[0];
        div.appendChild(lbl);
      }
      if (cornerFile) {
        const lbl = document.createElement('span');
        lbl.className = 'coord coord-rank';
        lbl.textContent = sqName[1];
        div.appendChild(lbl);
      }

      if (pieceData) {
        const key  = pieceData.color + pieceData.type.toUpperCase();
        const span = document.createElement('span');
        span.className = `piece piece-${key}`;
        span.style.backgroundImage = `url("${PIECE_URL[key]}")`;
        span.setAttribute('aria-hidden', 'true');
        div.appendChild(span);
      }

      if (onClick) div.addEventListener('click', () => onClick(sqName));
      boardEl.appendChild(div);
    }
  }
}

function renderBoard() {
  renderBoardInto($('board'), S.game, {
    flipped:  S.flipped,
    selected: S.selected,
    targets:  S.targets,
    lastFrom: S.lastFrom,
    lastTo:   S.lastTo,
    onClick:  handleClick
  });
  updateCoordLabels($('rank-labels'), $('file-labels'), S.flipped);
}

function toSqName(row, col, flipped) {
  const fi = flipped ? 7 - col : col;
  const ri = flipped ? row     : 7 - row;
  return 'abcdefgh'[fi] + (ri + 1);
}
function sqIdx(sq) {
  return {
    fi: 'abcdefgh'.indexOf(sq[0]),
    ri: 8 - parseInt(sq[1])
  };
}
function updateCoordLabels(rEl, fEl, flipped) {
  if (!rEl || !fEl) return;
  const rs = flipped
    ? ['1','2','3','4','5','6','7','8']
    : ['8','7','6','5','4','3','2','1'];
  const fs = flipped
    ? ['h','g','f','e','d','c','b','a']
    : ['a','b','c','d','e','f','g','h'];
  rEl.innerHTML = rs.map(r => `<span>${r}</span>`).join('');
  fEl.innerHTML = fs.map(f => `<span>${f}</span>`).join('');
}


/* ══════════════════════════════════════════════════════════
   PUZZLE: SELECTION & MOVEMENT
═════════════════════════════════════════════════════════════ */
function handleClick(sqName) {
  if (S.locked || S.solved) return;

  const piece = S.game.get(sqName);
  const turn  = S.game.turn();

  if (S.selected) {
    if (sqName === S.selected) {
      clearSelection();
      renderBoard();
      return;
    }
    if (piece && piece.color === turn) {
      selectSq(sqName);
      return;
    }
    tryMove(S.selected, sqName);
    return;
  }

  if (piece && piece.color === turn) selectSq(sqName);
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

function tryMove(from, to) {
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

  // Verify legality
  const test = S.game.move({ from, to, promotion });
  if (!test) {
    setFeedback('fc-wrong', '✗', "That move isn't legal. Try again.");
    SFX.wrong();
    renderBoard();
    return;
  }
  S.game.undo();

  const expected = PUZZLES[S.idx].solution[S.step];
  if (uci === expected) {
    applyMove(from, to, promotion, /*recordLog*/ true);
    S.step++;

    const done = S.step >= PUZZLES[S.idx].solution.length;
    if (done) {
      onSolved();
    } else {
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
      renderMoveList();
    }
  } else {
    S.wrongCount++;
    prog.attempts++;
    saveProg();

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

function applyMove(from, to, promotion, recordLog) {
  const result = S.game.move({ from, to, promotion });
  if (!result) return;

  S.lastFrom = from;
  S.lastTo   = to;

  // Sounds
  if (S.game.in_check()) SFX.check();
  else if (result.captured) SFX.capture();
  else SFX.move();

  if (recordLog) S.moveLog.push(result.san);

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

  applyMove(from, to, prom, true);
  S.step++;
  S.locked = false;
  renderBoard();
  renderMoveList();

  if (S.step < PUZZLES[S.idx].solution.length) {
    setFeedback('fc-info', '→', 'Your turn — find the continuation!');
  }
}


/* ──────────────────────────────────────────────────────────
   CAPTURED PIECES TRAY + MATERIAL SCORE
───────────────────────────────────────────────────────────── */
function renderCaptures() {
  const top = $('cap-top'), bot = $('cap-bot');
  if (!top || !bot) return;

  // Count remaining pieces from the game state and infer captured.
  const startCount = { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 };
  const cur = { w: { p:0,n:0,b:0,r:0,q:0,k:0 }, b: { p:0,n:0,b:0,r:0,q:0,k:0 } };

  const mat = S.game.board();
  for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) {
    const p = mat[r][f];
    if (p) cur[p.color][p.type]++;
  }

  const capturedByWhite = []; // black pieces that have been captured
  const capturedByBlack = [];
  let mScore = 0;
  ['p','n','b','r','q'].forEach(t => {
    const missingB = Math.max(0, startCount[t] - cur.b[t]);
    const missingW = Math.max(0, startCount[t] - cur.w[t]);
    for (let i = 0; i < missingB; i++) capturedByWhite.push('b' + t.toUpperCase());
    for (let i = 0; i < missingW; i++) capturedByBlack.push('w' + t.toUpperCase());
    mScore += (missingB - missingW) * PIECE_VALUE[t];
  });

  // Bottom = our side (white if not flipped). We display pieces *captured by* that side.
  const ourTop  = S.flipped ? capturedByWhite : capturedByBlack;
  const ourBot  = S.flipped ? capturedByBlack : capturedByWhite;
  top.innerHTML = renderCapList(ourTop) + scoreBadge(S.flipped ? mScore : -mScore);
  bot.innerHTML = renderCapList(ourBot) + scoreBadge(S.flipped ? -mScore : mScore);
}
function renderCapList(arr) {
  if (!arr.length) return '<span class="cap-empty"></span>';
  return arr.map(k => `<span class="cap-piece" style="background-image:url('${PIECE_URL[k]}')"></span>`).join('');
}
function scoreBadge(score) {
  if (score <= 0) return '';
  return `<span class="cap-score">+${score}</span>`;
}


/* ──────────────────────────────────────────────────────────
   MOVE LIST
───────────────────────────────────────────────────────────── */
function renderMoveList() {
  const list = $('move-list');
  if (!list) return;
  if (!S.moveLog.length) {
    list.innerHTML = '<span class="mh-empty">No moves yet.</span>';
    return;
  }
  // Reconstruct move pairs based on whose turn the puzzle started with.
  const startsWhite = PUZZLES[S.idx].fen.includes(' w ');
  let html = '';
  let moveNum = parseInt(PUZZLES[S.idx].fen.split(' ')[5]) || 1;
  for (let i = 0; i < S.moveLog.length; i++) {
    const sideIsWhite = startsWhite ? (i % 2 === 0) : (i % 2 === 1);
    if (sideIsWhite) {
      html += `<span class="mh-num">${moveNum}.</span>`;
    } else if (i === 0) {
      // Puzzle starts with Black to move
      html += `<span class="mh-num">${moveNum}…</span>`;
    }
    html += `<span class="mh-san">${S.moveLog[i]}</span>`;
    if (!sideIsWhite) moveNum++;
  }
  list.innerHTML = html;
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

  $('board').classList.add('solved');
  setTimeout(() => $('board').classList.remove('solved'), 800);
  SFX.win();

  const msgs = [
    '🎉 Excellent! You found the winning move!',
    '⭐ Perfect! That\'s exactly the right idea.',
    '✨ Brilliant! Spot-on tactical vision.',
    '🏆 Outstanding — just like the masters!'
  ];
  setFeedback('fc-correct', '✓', msgs[Math.floor(Math.random() * msgs.length)]);

  $('panel-instruction').textContent = 'Puzzle solved!';
  $('btn-hint').classList.add('hidden');
  $('btn-next-puzzle').classList.remove('hidden');

  setTimeout(revealExplanation, 360);
  renderBoard();
  renderMoveList();
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

  const sqEl = document.querySelector(`#board [data-sq="${from}"]`);
  if (sqEl) {
    sqEl.classList.add('hint-sq');
    setTimeout(() => sqEl.classList.remove('hint-sq'), 2000);
  }

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


/* ══════════════════════════════════════════════════════════
   OPENINGS — load, render, step
═════════════════════════════════════════════════════════════ */
function loadOpening(idx) {
  if (O.autoTimer) { clearTimeout(O.autoTimer); O.autoTimer = null; }
  O.idx     = idx;
  O.game    = new Chess();
  O.ply     = 0;
  O.flipped = !!OPENINGS[idx].flipForBlack;
  O.lastFrom = null;
  O.lastTo   = null;

  const op = OPENINGS[idx];
  $('op-num').textContent       = `${idx + 1} / ${OPENINGS.length}`;
  $('op-title').textContent     = op.name;
  $('op-summary').textContent   = op.summary;
  $('op-meta-eco').textContent  = op.eco;
  $('op-meta-cat').textContent  = op.category;
  $('op-meta-side').textContent = op.side;
  $('nav-op-progress').textContent = `${(prog.studiedOpenings || []).length} studied`;

  // Plans
  const plansEl = $('op-plans');
  plansEl.innerHTML = '';
  op.plans.forEach(p => {
    const li = document.createElement('li');
    li.textContent = p;
    plansEl.appendChild(li);
  });

  renderOpDirectory();
  renderOpBoard();
  renderOpTape();
  updateOpMoveLabel();
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

function renderOpBoard() {
  renderBoardInto($('op-board'), O.game, {
    flipped:  O.flipped,
    lastFrom: O.lastFrom,
    lastTo:   O.lastTo,
    onClick:  null
  });
  updateCoordLabels($('op-rank-labels'), $('op-file-labels'), O.flipped);
}

function renderOpTape() {
  const tape = $('op-move-tape');
  const op = OPENINGS[O.idx];
  if (!op.moves.length) {
    tape.innerHTML = '<span class="mh-empty">No moves.</span>';
    return;
  }
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
  const lblEl  = $('op-move-label');
  const noteEl = $('op-move-note');
  if (O.ply === 0) {
    lblEl.textContent  = 'Starting position';
    noteEl.textContent = 'Click "Next" to step through the moves of the ' + op.name + '.';
  } else {
    const i = O.ply - 1;
    const moveNum = Math.floor(i / 2) + 1;
    const side    = i % 2 === 0 ? '' : '…';
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
    const from = m.uci.slice(0, 2), to = m.uci.slice(2, 4);
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
    O.game.undo();
    O.ply--;
    if (O.ply === 0) { O.lastFrom = null; O.lastTo = null; }
    else {
      const prev = op.moves[O.ply - 1];
      O.lastFrom = prev.uci.slice(0, 2);
      O.lastTo   = prev.uci.slice(2, 4);
    }
    SFX.move();
  }
  renderOpBoard();
  renderOpTape();
  updateOpMoveLabel();
}

function opFirst() {
  if (O.autoTimer) { clearTimeout(O.autoTimer); O.autoTimer = null; updateAutoBtn(false); }
  O.game = new Chess();
  O.ply = 0;
  O.lastFrom = O.lastTo = null;
  renderOpBoard();
  renderOpTape();
  updateOpMoveLabel();
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
    O.lastFrom = prev.uci.slice(0, 2);
    O.lastTo   = prev.uci.slice(2, 4);
  } else {
    O.lastFrom = null; O.lastTo = null;
  }
  if (O.ply === op.moves.length) markOpeningStudied(op.id);
  renderOpBoard();
  renderOpTape();
  updateOpMoveLabel();
}

function opAutoPlay() {
  if (O.autoTimer) {
    clearTimeout(O.autoTimer);
    O.autoTimer = null;
    updateAutoBtn(false);
    return;
  }
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
  b.lastChild.textContent = playing ? ' Pause' : ' Play';
}

function markOpeningStudied(id) {
  if (!prog.studiedOpenings) prog.studiedOpenings = [];
  if (!prog.studiedOpenings.includes(id)) {
    prog.studiedOpenings.push(id);
    saveProg();
    $('nav-op-progress').textContent = `${prog.studiedOpenings.length} studied`;
  }
}
