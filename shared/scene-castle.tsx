// Shared castle scenes for owned hero/gallery/form/auth surfaces.
// `wide` is the centered-hero banner (800x450); `card` and `tall` are the
// gallery-hero castle and pines tiles (400x500); `rooftops` is the
// login-split cover (400x300, crescent-overlay moon, rooftop skyline).
// Chevron bats stay foreground stroke (w4 wide, w3 card/rooftops); stars
// carry a `comment` label so the decorative-purple rule survives refactors.
// Moons are harvest yellow in every scene. Hills live in per-scene
// constants below.

import {galleryImage} from 'astryx-dracula/shared/gallery-image';

export type SceneCastleVariant = 'wide' | 'card' | 'tall' | 'rooftops';

const WIDE_HILLS = {
  back: 'M0 330 Q200 260 400 320 T800 300 V450 H0 Z',
  front: 'M0 385 Q240 320 480 375 T800 360 V450 H0 Z',
} as const;

const CARD_HILLS = {
  back: 'M0 360 Q140 300 260 350 T400 335 V500 H0 Z',
  front: 'M0 420 Q160 365 300 410 T400 400 V500 H0 Z',
} as const;

const TALL_HILL = 'M0 380 Q200 320 400 370 V500 H0 Z' as const;

function WideCastle() {
  return (
    <svg
      style={galleryImage}
      viewBox="0 0 800 450"
      role="img"
      aria-label="Moonlit castle on a hill in Dracula theme colors">
      <rect width="800" height="450" fill="var(--dracula-bg-dark)" />
      {/* Stars */}
      <g fill="var(--dracula-comment)">
        <circle cx="60" cy="60" r="2.5" />
        <circle cx="180" cy="120" r="2" />
        <circle cx="330" cy="50" r="2.5" />
        <circle cx="470" cy="90" r="2" />
        <circle cx="700" cy="200" r="2.5" />
        <circle cx="750" cy="80" r="2" />
      </g>
      <g fill="var(--dracula-cyan)">
        <circle cx="120" cy="90" r="2" />
        <circle cx="270" cy="70" r="2.5" />
        <circle cx="540" cy="50" r="2" />
        <circle cx="660" cy="160" r="2" />
      </g>
      <g fill="var(--dracula-pink)">
        <circle cx="90" cy="170" r="2" />
        <circle cx="400" cy="130" r="2.5" />
        <circle cx="590" cy="200" r="2" />
        <circle cx="730" cy="260" r="2" />
      </g>
      {/* Harvest moon */}
      <circle cx="620" cy="110" r="56" fill="var(--dracula-yellow)" />
      <circle
        cx="600"
        cy="95"
        r="10"
        fill="var(--dracula-orange)"
        opacity={0.5}
      />
      <circle
        cx="638"
        cy="125"
        r="7"
        fill="var(--dracula-orange)"
        opacity={0.5}
      />
      {/* Bats */}
      <g
        fill="none"
        stroke="var(--dracula-fg)"
        strokeWidth={4}
        strokeLinecap="round">
        <path d="M120 130 q12 -12 24 0 q12 -12 24 0" />
        <path d="M210 90 q9 -9 18 0 q9 -9 18 0" />
        <path d="M470 160 q9 -9 18 0 q9 -9 18 0" />
      </g>
      {/* Hills */}
      <path d={WIDE_HILLS.back} fill="var(--dracula-selection)" />
      <path d={WIDE_HILLS.front} fill="var(--dracula-bg-light)" />
      {/* Castle */}
      <g>
        <rect
          x="150"
          y="225"
          width="120"
          height="120"
          rx={4}
          fill="var(--dracula-bg-lighter)"
        />
        <rect
          x="130"
          y="185"
          width="44"
          height="160"
          rx={4}
          fill="var(--dracula-bg-lighter)"
        />
        <rect
          x="246"
          y="185"
          width="44"
          height="160"
          rx={4}
          fill="var(--dracula-bg-lighter)"
        />
        <g fill="var(--dracula-bg-lighter)">
          <rect x="130" y="175" width="12" height="14" rx={2} />
          <rect x="149" y="175" width="12" height="14" rx={2} />
          <rect x="246" y="175" width="12" height="14" rx={2} />
          <rect x="265" y="175" width="12" height="14" rx={2} />
          <rect x="150" y="215" width="14" height="16" rx={2} />
          <rect x="173" y="215" width="14" height="16" rx={2} />
          <rect x="196" y="215" width="14" height="16" rx={2} />
          <rect x="219" y="215" width="14" height="16" rx={2} />
          <rect x="242" y="215" width="14" height="16" rx={2} />
        </g>
        <g fill="var(--dracula-yellow)">
          <rect x="168" y="255" width="14" height="20" rx={2} />
          <rect x="203" y="255" width="14" height="20" rx={2} />
          <rect x="238" y="255" width="14" height="20" rx={2} />
          <rect x="143" y="215" width="10" height="14" rx={2} />
          <rect x="259" y="215" width="10" height="14" rx={2} />
        </g>
        <path
          d="M195 345 v-30 a15 15 0 0 1 30 0 v30 Z"
          fill="var(--dracula-bg-dark)"
        />
      </g>
    </svg>
  );
}

function CardCastle() {
  return (
    <svg
      style={galleryImage}
      viewBox="0 0 400 500"
      role="img"
      aria-label="Moonlit castle on midnight hills">
      <rect width="400" height="500" fill="var(--dracula-bg-dark)" />
      {/* Stars */}
      <g fill="var(--dracula-comment)">
        <circle cx="50" cy="60" r="2.5" />
        <circle cx="140" cy="130" r="2" />
        <circle cx="240" cy="50" r="2.5" />
        <circle cx="330" cy="110" r="2" />
        <circle cx="300" cy="200" r="2.5" />
      </g>
      <g fill="var(--dracula-cyan)">
        <circle cx="95" cy="90" r="2" />
        <circle cx="200" cy="100" r="2.5" />
        <circle cx="360" cy="60" r="2" />
      </g>
      <circle cx="290" cy="120" r="52" fill="var(--dracula-yellow)" />
      <circle
        cx="272"
        cy="106"
        r="9"
        fill="var(--dracula-orange)"
        opacity={0.5}
      />
      <g
        fill="none"
        stroke="var(--dracula-fg)"
        strokeWidth={3}
        strokeLinecap="round">
        <path d="M70 170 q12 -12 24 0 q12 -12 24 0" />
        <path d="M150 130 q9 -9 18 0 q9 -9 18 0" />
      </g>
      <path d={CARD_HILLS.back} fill="var(--dracula-selection)" />
      <path d={CARD_HILLS.front} fill="var(--dracula-bg-light)" />
      <g>
        <rect
          x="140"
          y="270"
          width="120"
          height="110"
          rx={4}
          fill="var(--dracula-bg-lighter)"
        />
        <rect
          x="118"
          y="235"
          width="44"
          height="145"
          rx={4}
          fill="var(--dracula-bg-lighter)"
        />
        <rect
          x="238"
          y="235"
          width="44"
          height="145"
          rx={4}
          fill="var(--dracula-bg-lighter)"
        />
        <g fill="var(--dracula-yellow)">
          <rect x="160" y="300" width="14" height="20" rx={2} />
          <rect x="196" y="300" width="14" height="20" rx={2} />
          <rect x="232" y="300" width="14" height="20" rx={2} />
          <rect x="131" y="262" width="10" height="14" rx={2} />
          <rect x="253" y="262" width="10" height="14" rx={2} />
        </g>
        <path
          d="M185 380 v-28 a15 15 0 0 1 30 0 v28 Z"
          fill="var(--dracula-bg-dark)"
        />
      </g>
    </svg>
  );
}

function TallPines() {
  return (
    <svg
      style={galleryImage}
      viewBox="0 0 400 500"
      role="img"
      aria-label="Harvest moon over midnight pines">
      <rect width="400" height="500" fill="var(--dracula-bg-dark)" />
      {/* Stars */}
      <g fill="var(--dracula-pink)">
        <circle cx="60" cy="80" r="2" />
        <circle cx="160" cy="50" r="2.5" />
        <circle cx="320" cy="70" r="2" />
        <circle cx="90" cy="190" r="2.5" />
        <circle cx="250" cy="160" r="2" />
      </g>
      <g fill="var(--dracula-cyan)">
        <circle cx="110" cy="120" r="2" />
        <circle cx="220" cy="90" r="2" />
        <circle cx="350" cy="150" r="2.5" />
      </g>
      <circle cx="200" cy="190" r="72" fill="var(--dracula-yellow)" />
      <circle
        cx="176"
        cy="170"
        r="12"
        fill="var(--dracula-orange)"
        opacity={0.5}
      />
      <circle
        cx="222"
        cy="210"
        r="8"
        fill="var(--dracula-orange)"
        opacity={0.5}
      />
      <g
        fill="none"
        stroke="var(--dracula-fg)"
        strokeWidth={3}
        strokeLinecap="round">
        <path d="M90 260 q12 -12 24 0 q12 -12 24 0" />
        <path d="M260 250 q9 -9 18 0 q9 -9 18 0" />
      </g>
      <path d={TALL_HILL} fill="var(--dracula-selection)" />
      <g fill="var(--dracula-bg-light)">
        <path d="M70 500 V400 l28 -44 28 44 v100 Z" />
        <path d="M170 500 V420 l28 -44 28 44 v80 Z" />
        <path d="M270 500 V410 l28 -44 28 44 v90 Z" />
      </g>
      <g fill="var(--dracula-yellow)">
        <rect x="81" y="442" width="8" height="12" rx={2} />
        <rect x="181" y="458" width="8" height="12" rx={2} />
        <rect x="281" y="450" width="8" height="12" rx={2} />
      </g>
    </svg>
  );
}

function Rooftops() {
  return (
    <svg
      style={galleryImage}
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Harvest moon over the castle rooftops">
      <rect width="400" height="300" fill="var(--dracula-bg)" />
      <g fill="var(--dracula-fg)">
        <circle cx="68" cy="52" r="2" />
        <circle cx="330" cy="70" r="2" />
      </g>
      <g fill="var(--dracula-comment)">
        <circle cx="140" cy="36" r="1.5" />
        <circle cx="292" cy="34" r="1.5" />
        <circle cx="360" cy="140" r="1.5" />
      </g>
      <circle cx="200" cy="118" r="52" fill="var(--dracula-yellow)" />
      <circle cx="182" cy="104" r="44" fill="var(--dracula-bg)" />
      <g
        fill="var(--dracula-current-line)"
        stroke="var(--dracula-comment)"
        strokeWidth="3"
        strokeLinejoin="round">
        <rect x="20" y="220" width="110" height="80" />
        <path d="M20 220 L75 178 L130 220 Z" />
        <rect x="150" y="200" width="100" height="100" />
        <path d="M150 200 L200 162 L250 200 Z" />
        <rect x="270" y="228" width="110" height="72" />
        <path d="M270 228 L325 190 L380 228 Z" />
      </g>
      <g fill="var(--dracula-yellow)">
        <rect x="58" y="244" width="14" height="18" />
        <rect x="188" y="224" width="14" height="18" />
        <rect x="312" y="250" width="14" height="18" />
      </g>
    </svg>
  );
}

export function SceneCastle({variant}: {variant: SceneCastleVariant}) {
  if (variant === 'wide') return <WideCastle />;
  if (variant === 'card') return <CardCastle />;
  if (variant === 'rooftops') return <Rooftops />;
  return <TallPines />;
}
