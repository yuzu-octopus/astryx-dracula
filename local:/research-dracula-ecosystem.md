# The Dracula ecosystem and colour-derivation practice beyond what astryx-dracula ships

**Date:** 2026-09-28 · **Depth:** deep (6 workers + own diff) · **Mode:** research filing, no edits

**This is a documented candidate set for human review. It is NOT a recommendation to add any
of these hexes.** Every new hex, token, font or radius requires human approval.

---

## Answer

**No. The official Dracula specification contains no guidance on deriving tints, shades, alpha
ladders, or surface tiers — it is a flat list of pinned hexes, and it says so normatively
("Use exact color values from this specification").** [1][2] Every derivation you see in a
Dracula port is a port's own invention. That is the single most important fact here, because it
means there is no ecosystem authority to appeal to when a derivation goes wrong.

Against that, six spec-sanctioned **dark** hexes are absent from our palette. Two of them
(`#191A21`, and the four ANSI brights) are already inside our own codebase in another role, so
the real candidate set is smaller than it looks. Full audited set in §5, kept strictly separate
from the approved palette in §7.

Three results are new and not in the current grill list:

1. **Our `--color-data-base-muted` `#8288A6` measures 4.0832:1 on `#282A36`** — it fails the
   4.5:1 floor it is presumably being gated against, and WCAG 2.2 explicitly forbids rounding
   4.499 up. [20] The sibling `#9AA1BC` clears by only 0.103 on the floating tier and **fails
   outright at 3.7704:1 on `#424450`**. [20]
2. **Our 45 HSL ramps are not lightness ramps.** The five nominal steps 28/44/60/74/88 span
   **33.0 → 97.4 in OKLCH L**, a 64.4-point spread, because HSL lightness is hue-dependent. The
   blue family reaches only **20.6%** of its available chroma and yellow **57.6%**. [27]
3. **The spec's designated focus colour, Functional Purple `#815CD6`, has zero adoption.** No
   port in the study uses it. Every port that ships a focus ring uses `#BD93F9` — which is what
   we do. [3][4] We are right by practice against the spec's letter, and it should be recorded
   as a deliberate deviation rather than left to be "corrected" later.

**Confidence: high** on the spec diff, the Comment finding, and the port census (all read at
HEAD from primary files, 514 repos enumerated, every claim carrying a file:line). **Medium** on
the Dracula PRO structure — the values are corroborated by two independent third-party configs
but remain `unverified — paywalled`; nothing official publishes them. **High** on the technique
verdicts; **medium** on one sub-claim about cross-engine `color-mix` behaviour, which was
single-engine tested.

---

## 1. Does the spec sanction derivation? No.

Measured against `spec.mdx` at HEAD (401 lines) [1] and the standalone `dracula/spec` repo [2]:

| Question | Answer | Evidence |
|---|---|---|
| Pin or derive? | **Pin.** "Use exact color values from this specification" | `spec.mdx:367`, `:391` [1] |
| Tint / shade / wash rules | **Zero.** Grep for `derive\|lighten\|darken\|tint\|shade\|wash\|ramp\|sequential\|diverging` returns nothing | full-file grep [1] |
| Alpha rules | **One, and it is a ceiling, not a number.** "use the `Current Line` token as a translucent overlay" | `spec.mdx:52` [1] |
| Surface tiers | **5 table rows, 4 distinct hexes.** No ordering rule, no spacing rule, no derivation | `spec.mdx:107-127` [1] |
| Chart ramps | **None.** No sequential, no diverging, anywhere in the file | full-file grep [1] |
| Contrast | "Maintain **4.5:1 minimum contrast ratio** (WCAG 2.1 Level AA)" | `spec.mdx:253-255` [1] |

**The spec contradicts itself on contrast.** It pins Comment at `#6272A4` (`spec.mdx:24`) and
mandates 4.5:1 (`spec.mdx:255`) in the same document. Measured, `#6272A4` on `#282A36` is
**3.0260:1**. [20] There is no carve-out clause. The contradiction is arithmetically
demonstrated, not inferred.

The one derivation the ecosystem *does* share is **alpha off a named token**, and even that is
port-local: `dracula/cursor`, the reference implementation the spec itself names, uses 131
`!alpha` references with a discrete ladder `{10,20,30,40,55,60,65,80,90,95}`, resolved at
build time. Our own alpha ladder (§3) is unrelated to it and matches nothing upstream.

---

## 2. Dracula PRO: the ceiling, and what is actually knowable

**The PRO palette is paywalled and no official source publishes a single PRO hex value.**
Verified as a measured absence, not a search failure [8]:

| Hex searched | Hits in `dracula/draculatheme.com` (full tree) |
|---|---|
| `#22212C` PRO background | 0 |
| `#FF9580` PRO red | 0 |
| `#8AFF80` PRO green | 0 |
| `#AA99FF` PRO bright blue | 0 |
| `#504C67` PRO bright black | 0 |

The `dracula` org's 130+ public repos contain **no PRO repository**. `dracula/spec` never
mentions PRO (`grep -rniE 'dracula pro'` → 0). The full 21-entry PRO changelog [9] contains no
colour values at all. The palette ships as `design/PALETTE.md` inside a paid Gumroad package.

**What is public, and it corrects the framing.** PRO's own site says [8]:

> "Dracula's original colors, created in 2013, were based on personal taste. This new Pro
> version brings a more refined and *mathematical approach* that **normalizes luminosity and
> saturation**."

The widely-repeated "PRO colours are hand-crafted" framing is third-party and inverts the
source. What is hand-*picked* in PRO is typography; what is hand-*crafted* is application
coverage. The team's own reason PRO costs money is re-derivation plus per-app depth — not
accessibility work. Accessibility is stated as the reason for **Alucard**, the light theme,
which they released free. [8][9]

### The measurable structure, from two corroborating third-party configs

Two unrelated users transcribed PRO ANSI into Hyper and Windows Terminal [19]. All 16
values match byte-for-byte. Still `unverified — paywalled` officially, but the *structure* is
arithmetic and reproducible, and it is the most useful thing in this whole investigation:

| Tier | HSL L | HSL S | Tokens |
|---|---|---|---|
| base accents | **75.10%** | **100.00%** | `#FF9580` `#8AFF80` `#FFFF80` `#9580FF` `#FF80BF` `#80FFEA` |
| light accents | **80.00%** | **100.00%** | `#FFAA99` `#A2FF99` `#FFFF99` `#AA99FF` `#FF99CC` `#99FFEE` |
| neutrals | 15.10% / 35.10% | ~15% | `#22212C` background / `#504C67` bright black |

Two lightness tiers, a 4.90-point step, constant saturation, hue preserved to sub-degree
(8-bit rounding drift only). That is exactly what "normalizes lightness and saturation"
describes. **[secondary inputs, arithmetic structure]**

### The finding that matters most — and it indicts our own ramps

Normalising HSL lightness does **not** normalise contrast. Measured contrast of every PRO
accent against PRO's own background `#22212C`, at *identical* HSL lightness 75.10% and
*identical* saturation 100%:

| accent | ratio | | accent | ratio |
|---|---|---|---|---|
| yellow `#FFFF80` | **15.03:1** | | magenta `#FF80BF` | 6.88:1 |
| cyan `#80FFEA` | 13.17:1 | | **blue `#9580FF`** | **5.15:1** |
| green `#8AFF80` | 12.63:1 | | *spread* | **2.9×** |
| red `#FF9580` | 7.46:1 | | | |

A 2.9× contrast spread at identical L and S, because **relative luminance is hue-dependent**:
a blue at 75% HSL lightness is far darker than a yellow at 75% HSL lightness.

**This is the same defect our own 45 HSL ramps carry, measured from the other end.** Our
`hsl(264.71 89.47% 28%)` → `hsl(264.71 89.47% 88%)` ladder is hue-pinned and S-pinned with L
stepped — the same construction, and it inherits the same blindness. It is also the arithmetic
reason the purple ramp's darkest step measures **1.07:1** against the body: purple at 28%
lightness on a dark page *is* that dark. The purple ban and the maths agree because the ban is
the consequence of building a ramp off the one hue reserved for interaction.

**Caveat that must not be dropped:** this is a *diagnostic*, not a licence. PRO buys surface
separation by pushing the canvas down (L 18.43% → 15.10%) and the secondary up (1.56:1 →
1.94:1) — it adds **no new tiers**. And PRO's own `#504C67` secondary sits at 1.94:1, well
under WCAG 1.4.11's 3:1. PRO's public 4.5:1 claim is scoped to "standard text" and does not
cover 2.2's non-text criterion. [8]

**What is NOT knowable:** the five non-base PRO variants (Blade, Buffy, Lincoln, Morbius, Van
Helsing) have zero publicly discoverable values. PRO's Alucard is deliberately *different* from
the open-source Alucard and stays paywalled. [9] No public PRO documentation of elevation,
hover, disabled or focus exists — a measured absence across the whole changelog. The only real
signal is a 2025-05-23 entry admitting PRO had a bug where translucent surfaces "were hiding
underlying decorations". That is the maintainers warning, in their own words, about
alpha-based state layers. [9]

---

## 3. Colour-math technique inventory

Every verdict is measured, not estimated. **SAFE** = correct regardless of colour-scheme mode;
**CONDITIONAL** = correct only while a named constraint holds; **BREAKS** = the technique
encodes mode or assumes a backdrop it does not have.

**What this table does and does not cover.** It evaluates *colour techniques*, not *delivery
channels*. Three things are orthogonal to every row below, and a technique can be perfectly
correct on colour and still unusable:

- **Reachability.** Whether a rule can reach the pixel at all. A value that resolves correctly
  per spec can be unreachable because a substrate sets the property inline. Measured across
  `core/src` [26]: `.style.backgroundColor` appears **twice**; `.style.boxShadow` appears
  **zero** times, against 23 `.style.width` and 13 `.style.maxWidth`. So a *wash* on a state
  core claims is unreachable, while a *ring* lands. The cascade is **per property**, not per
  element — the discriminator worth remembering.
- **Contrast.** A reachable technique can still fail a threshold. The 2.51:1 Comment ceiling
  is unreachable at *any* alpha, which is a colour fact, not a cascade fact.
- **Naming.** A technique can be correct and still ship under a token name that misdescribes
  it (our `--color-shadow` is `#21222C`; every actual shadow is `#191A21` — see §7). [26]

None of the SAFE/BREAKS verdicts below speak to any of those three.

**One correction recorded against this work's own framing.** An earlier note from this angle
reported the selected-ring blocker as a cascade problem in the per-element sense. That was
wrong and has been withdrawn: the measurement is per-property, so a `box-shadow` ring is not
blocked. The colour-math claim was never the binding constraint there. Noted because the
failure mode — a research artifact quietly accumulating a claim its author has retracted — is
the same one this whole wave's doctrine work is about.

### 3.1 Alpha compositing over a known surface — **SAFE**

- **Formula** (Compositing and Blending Level 1) [24]: `co = Cs × αs + Cb × αb × (1 − αs)`,
  where `αb = αs` for a fully opaque backdrop, giving `co = α·F + (1−α)·B`. The spec states
  compositing happens in **premultiplied space** and the result is **non-linearised**
  (sRGB-encoded, not linear) — the spec says so explicitly and calls the practice non-conventional.
- **Parameters**: α, foreground F, background B.
- **Failure modes**, all primary or measured:
  - **Unknown backdrop is not computable** (C3). A `backdrop-filter`, `opacity` or `transform`
    ancestor silently redefines B. Filter Effects 2 §2, Compositing §8.2. [25]
  - **Stacking compounds** (C4): three 10% washes = **72.9%**, not 30%. Requires a stated
    nesting depth per surface.
  - **Alpha text loses contrast non-linearly and in the *opposite* direction from intuition**
    (C5): measured, a 10% white wash **costs 3.58 points** of text contrast on `#282A36`.
  - Premultiplied vs unpremultiplied is a correctness fork, not a detail — any tool reading
    our stored channels must declare which space they are in (C6).
- **Our ladder is safe, and is a real, measured, self-invented thing.** Computed from
  `tokens.css`, 32 unique 8-digit hexes over 11 base colours:

  | tail | byte | **actual %** | job |
  |---|---|---|---|
  | `0x0D` | 13 | 5.10% | shadow blur 1 |
  | `1A` | 26 | **10.20%** | state wash surface ×10 |
  | `1F` | 31 | **12.16%** | overlay hover |
  | `26` | 38 | 14.90% | shadow blur 3 |
  | `30` | 48 | **18.82%** | inset ring ×5 |
  | `33` | 51 | **20.00%** | overlay pressed |
  | `4D` | 77 | **30.20%** | state wash border ×10 |
  | `CC` | 204 | 80.00% | scrim |

  Two labels in circulation are wrong and should be corrected wherever they appear: the inset
  family is **18.82%, not 30%**, and the skill's "12%" hover is **12.16%**. The wash spine *is*
  30.20% / 10.20% — those are two different families, and conflating them is what produced the
  bad label.

### 3.2 OKLCH / OKLab lightness steps — **SAFE**

- **Formula**: `oklch(L C H)`, with L perceptual, C chroma, H hue. Conversion is
  `oklch → oklab → LMS → linear sRGB → sRGB` [22].
- **No spec step set exists**, which is why every system picks its own and must cite its own
  library, never CSS: Tailwind 50–950 in 11 steps (authored directly in OKLCH) [28]; Radix
  1–12 [28]; Material 3 tone 0–100, which is **CIE L\*** — not relative luminance, not OKLCH L
  [28].
- **Failure modes**:
  - CSS gamut mapping is OKLCH **chroma reduction** with local-MINDE, JND = 0.02. The colour
    changes; it does not fail. Anything asserting an exact hex must know the browser may have
    moved it. [22]
  - Material's HCT sacrifices **chroma** to hold hue and tone, silently. Consumers read the
    reduced chroma as intent unless it is documented. [28]
  - **The one that bites us, measured** (C16): naming steps 28/44/60/74/88 and computing them in
    **HSL** lightness means the numbers are decorative labels.

  | family | OKLCH L at 28 / 44 / 60 / 74 / 88 | min C_actual / C_max |
  |---|---|---|
  | purple | 33.0 / 45.4 / 56.5 / 70.1 / 86.1 | 91.7% |
  | teal | 51.7 / 72.1 / 82.0 / 87.0 / 93.6 | 94.7% |
  | red | 40.8 / 56.9 / 64.9 / 73.5 / 86.9 | 99.4% |
  | green | 56.3 / 78.6 / 87.2 / 89.6 / 94.3 | 99.7% |
  | **yellow** | 60.0 / 83.8 / 93.4 / 95.1 / 97.4 | **57.6%** |
  | **blue** | 36.8 / 50.0 / 64.2 / 77.1 / 89.5 | **20.6%** |

  Across 30 sampled steps the OKLCH L spread is **64.4 points for five nominal steps**. Yellow's
  "28%" sits at OKLCH L 60; purple's sits at 33. The CSS spec itself warns of exactly this
  ("two colors with visually different lightness, like yellow and blue, can have the same HSL
  lightness") [22]. **The fix direction is not "use OKLCH"** — it is *author the ladder in the
  coordinate system the steps are named in*, or rename the steps.
  - The Dracula ecosystem's own answer runs the *other* way: the Tailwind port's 11 families pin
    **hue** and step L in ~6.6–7.4 point increments, letting **saturation decay** as L falls
    [13]. Same anchor hex, same hue, opposite choice about which of H/S is held constant.

### 3.3 `color-mix()` — **SAFE if the space is written down; the percentage alone BREAKS**

- **Formula** (CSS Color 5) [22]: `color-mix(in <space>, C1 p%, C2)`, alpha-weighted, converted
  to the named space, then interpolated. **Default space is `oklab`**, not sRGB.
- **The measured reason a bare percentage is meaningless** (C22) — a 50/50 mix of our own
  `#282A36` and `#F8F8F2`:

  | space | OKLCH L of result | error vs perceptual midpoint |
  |---|---|---|
  | ideal | 0.6329 | — |
  | `in oklab` | 0.6330 | +0.0001 |
  | `in srgb-linear` | 0.7817 | +0.149 |
  | **`in srgb`** | **0.8292** | **+0.196** |

  sRGB mixing is 31% of perceptual lightness off the midpoint. **Never quote a percentage
  without its space.** Upstream systems do not agree: Primer and Astryx core mix in `srgb`,
  Radix Themes in `oklab`, Bootstrap uses Sass HSL `mix()`. All three are first-party and live.
- **Failure modes**: out-of-gamut results are **not clamped** — they are gamut-mapped at
  computed-value time, so the colour silently changes, by an amount that depends on the mixing
  space (C22).
- **`light-dark()` inside `color-mix()` is a spec/impl gap.** CSS Color 5 §2 says non-absolute
  colours are "not used inside `color-mix()`"; Chromium resolves it to the identical value
  (measured). Works in current engines, fragile for token parsers, **not tested in Safari or
  Firefox** (C23).

### 3.4 WCAG contrast-solving — **CONDITIONAL: must declare the search coordinate**

- **Formula** (WCAG 2.2 REC) [20]: `C_lin = C/12.92` if `C ≤ 0.04045`, else `((C+0.055)/1.055)^2.4`;
  `L = 0.2126·R_lin + 0.7152·G_lin + 0.0722·B_lin`; `ratio = (L_light + 0.05)/(L_dark + 0.05)`.
- **Failure mode, measured** (C18): solving the same target (4.5:1 on `#282A36`) in two
  coordinates gives two different colours —

  | search coordinate | result | ratio | coordinate |
  |---|---|---|---|
  | HSL lightness | `#8390B7` | 4.501:1 | HSL L 61.70 |
  | OKLCH lightness | `#7C8FC9` | 4.495:1 | OKLCH L 0.826 |

  **And a gate must assert the ratio, never the solved hex.** A gate that pins a literal string
  cannot catch a value that contradicts its own message.
- WCAG 2.2 also states thresholds are **not rounded** — "4.499:1 would not meet the 4.5:1
  threshold." That kills every "it's basically 4.5" argument. [21]

### 3.5 APCA — **SAFE as a diagnostic, BREAKS as a conformance target**

- **Exact constants and polarity rule** (C19) [23]: APCA is a **signed** value. Light text on a
  dark background is **negative**; the inverted badge is positive. Using it in dark mode voids
  the Lc↔ratio equivalence table, which APCA's own README disclaims for dark backgrounds.
- **Status** (C20): **not a W3C standard.** `https://www.w3.org/TR/apca/` returns **404**.
  WCAG 3.0 says the replacement algorithm is "yet to be determined". No browser ships it. The
  reference implementation's own solver is marked `DEPRECATED SOON`.
- **Measured on our palette** (C21), against APCA's own published floors:

  | token | WCAG on `#282A36` | APCA Lc | APCA's own band |
  |---|---|---|---|
  | `#6272A4` Comment | 3.03:1 **fail** | 25.1 | **below the Lc 30 absolute floor for *any* text** |
  | `#8288A6` base-muted | **4.08:1 fail** | 35.3 | just above the Lc 30 spot-text floor |
  | `#9AA1BC` secondary | 5.56:1 pass | 47.8 | between Lc 45 and Lc 60 |
  | `#B0B3C4` paragraph | 6.84:1 pass | 57.6 | 2.4 under the Lc 60 content floor |
  | `#4C5067` subdue | 1.80:1 fail (by design) | 10.7 | **below Lc 15 — "treat as invisible"** |

  The two models agree on ordering, and APCA supplies a *number* for the existing
  "chrome only, never text" rule on `#4C5067`. Note the polarity trap: a naive `Lc >= 60` gate
  passes every badge (all negative → inverted positive) and nothing else.

### 3.6 `light-dark(X, X)` — **SAFE, with three named costs**

Value is mode-invariant; *resolution* is not. The only reason it works for us is that the two
arguments are **identical** [22]:

1. It is **not an absolute colour**, so it is excluded by spec from `color-mix()` and from
   relative colour syntax.
2. It binds to the element's `color-scheme`.
3. It needs a parser special-case — the exact thing a token pipeline will trip on.

### 3.7 What every real system agrees on

State tints are anchored to a **named token**, never a literal (C31) [28]: Polaris
`whiteAlpha[5]`, Primer `alpha: 0.2` on `neutral.8`, Radix `var(--gray-3) 25%`, Astryx core
`var(--color-tint-hover) 15%` with light and dark deliberately mixing toward **opposite**
targets. **The mix target is the one thing that must be mode-aware; the percentage is the one
thing that can be a constant.** Our split — pinned tint target, constant overlay alphas —
matches all four.

There is **no standard hover alpha.** Upstream cites are 5/15/20% (core), 10/20% (Primer), 15%
*lightness* (Bootstrap). Our 12%/20% is kit-local and coexists with core's 15% `color-mix` in
the same product. Two ladders, one product.

### 3.8 One-line verdict for a dark-only brand pinning identical tuples

**Safe:** OKLCH/OKLab ladders, HCT tone, alpha compositing over a *known* surface, `color-mix`
with its space written down, `light-dark(X, X)`, named-token anchoring.
**Breaks:** APCA as a conformance target, `contrast-color()` (two-valued, non-perceptual, and
`newly` available), and **any mix percentage stated without its surface** — the same 10% is
9.778:1 over `#282A36` and something else over an already-washed row.

---

## 4. Comment: what real implementations actually do

**Nobody in the Dracula org changes the hex.** Verified across nine first-party ports, every one
using the spec value verbatim *for text* [3][4][5][6][7][11][14][18]: `cursor` `classic.yml:15`, `vim`
`autoload/dracula.vim:12`, `visual-studio-code` `dracula.yml:13`, `jetbrains` `Dracula.xml:568`,
`zed` `dracula.json:177`, `atom-ui` `ui-variables.less:16` (HSL form, same value), `dracula-css`
`dracula-variables.css:5`, `obsidian` `theme.css:91`, `dracula` R/ggplot2 `theme_dracula.R:31`.

Three things follow, and only the third is new.

1. **The maintainers' posture is "fix it in your theme."** In `dracula/sublime#16` a community
   answer points users at `.sublime-color-scheme` overrides to "roll their own variant to suit
   their needs if contrast is a problem." An accessibility-badge request,
   `dracula/dracula-theme#907`, was **opened and never answered** — there is no maintainer
   confirmation of any contrast claim. [18] There is no comment-contrast blog post; a full blog
   index scrape and 11 issue queries found none. This is a well-supported negative, not a
   provably exhaustive one.
2. **The org's answer to readability reports is to change the *other* colour.** Every complaint
   filed — `visual-studio-code#283` (search highlight obscures comments), `vim#95` — is a
   composition problem (Current Line × Comment), and the remedy offered is always at the
   composition layer. Not one report in the corpus asks for the Comment hex to change.
3. **The first-party precedent for lifting it is the team's own website.** [10] `draculatheme.com`
   contains **zero** occurrences of `6272a4`; its dark `--code-comment` is
   `hsl(248 36% 64%)` = `#8B82C4` (`src/app/globals.css:101`) — L 64% against the spec's L 51%.
   That is a lightness lift of the same kind our kit already applies, from a codebase that is
   not itself a Dracula port.

**Our own four lifts, measured** [20][27]:

| token | on `#282A36` | on `#343746` | on `#424450` | on `#21222C` |
|---|---|---|---|---|
| `#6272A4` spec | 3.0260 | 2.5056 | 2.0523 | 3.3555 |
| `#8288A6` base-muted | **4.0832** | 3.3811 | 2.7693 | 4.5279 |
| `#9AA1BC` secondary | 5.5593 | **4.6033** | **3.7704** | 6.1647 |
| `#B0B3C4` paragraph | 6.8430 | 5.6662 | 4.6410 | 7.5882 |

**Three results that change the picture.** `#8288A6` **fails** at 4.0832:1 on the body and only
clears 4.5:1 on the *darkest* tier; the spec's no-rounding rule forbids rounding it. `#9AA1BC`
clears the floating tier by **0.103** and fails outright on `#424450` at 3.7704 — so any
surface added at or below that lightness breaks the token the skill calls "secondary".
And `#6272A4`'s 2.5056 on floating is **below the 3:1 large-text threshold**, so the
"reserve it for large text" escape is available on two of our four surfaces, not universally.

**What the ecosystem's good practice looks like** [28]: Radix and GitHub Primer both ship a
**dedicated text step** rather than a lift of the surface colour, with a stated contrast
floor. Primer states plainly that "color contrast is valid only if it meets WCAG 2.2
criteria" and derives its 1.4.11 exemption from WCAG 2.2 Technique **G174**. The lesson is
the token shape, not the value.

---

## 5. Candidate hex set — NOT approved, for human review

### Tier 1 — spec-sanctioned, dark variant, absent from our 29

The only candidates where "never invent a hex" is not an objection, because the spec names them.
Verified in **two independent official files** (the site spec and the `dracula/spec` repo).

| hex | spec job | our status | first-party ports |
|---|---|---|---|
| **`#191A21`** | Background Darker — darkest surface tier | **already in our theme** as shadow + scrim hue (`tokens.css:156-158,173`) | 19 ports |
| **`#353747`** | opaque Current Line fallback (non-alpha renderers) | absent | `cursor` [5], `emacs` [15] |
| **`#FF6E6E`** | AnsiBrightRed | absent (derivable from our red ramp) | **33 ports** |
| **`#69FF94`** | AnsiBrightGreen | absent (derivable from shamrock) | 32 ports |
| **`#FFFFA5`** | AnsiBrightYellow | absent (**not** derivable — misses the ramp by 0.6 L) | 32 ports |
| **`#FF92DF`** | AnsiBrightMagenta | absent (derivable from pink) | 31 ports |

**The `#191A21` reframe, which matters more than the list.** This is not a new hex. It is
already in our codebase four ways and in the token list zero ways. The question is not "do we
adopt it" but **"does it become a named surface tier, or does it stay a shadow/scrim
implementation detail?"** That is a much cheaper decision than the candidate list implies. It
also puts us in direct conflict with our own `BRAND.md:16` ("shadow washes only, never a
surface") — because `dracula-css/_forms.scss:63` uses it for the **disabled input surface**
and `google-chrome/manifest.json:15` for the **browser window frame**. Two official consumers
disagree with our rule. The value is corroborated; only our job-assignment is the outlier.

Also absent and correctly so: **23 Alucard (light) hexes.** A dark-only brand should exclude
every one. Listed in the findings for completeness only.

### Tier 2 — first-party, non-spec, with a real UI job

| hex | job | source | note |
|---|---|---|---|
| `#17181E` | browser window frame, below `#191A21` | `google-chrome/manifest.json:13-14` [12] | the only new surface value in the whole app-consumer sweep |
| `#20212B` | surface below body / code bg | `obsidian/theme.css:57,89` | 2 bytes off our `#21222C` |
| `#3A3D4C` | IDE secondary surface, panels, scrollbar thumb | `jetbrains/Dracula.theme.json:11` | the most-used extra surface in the IDE port |
| `#60657D` | **inactive** selection background | `jetbrains/Dracula.theme.json:14` | a job we have no token for |
| `#8063A6` | **active** selection background | `jetbrains/Dracula.theme.json:13` | a second selection model |
| `#414450` | disabled control background | `jetbrains/Dracula.theme.json:383` | 1 byte off our `#424450` |
| `#3E404A` | non-text chrome: rulers, indent guides, invisibles | `cursor/classic.yml:44` | solid alternative to `#FFFFFF1A` |
| `#3F4152` / `#3E404B` | gutter / indent guide | `jetbrains/Dracula.xml:34-35` | |
| `#48B764` / `#CD4644` / `#74B4C1` | added/deleted/modified line markers | `jetbrains/Dracula.xml:3,10,40` | **see exclusion below** |
| `#3A3A3A` | inactive chrome | `emacs/dracula-theme.el:199` [15] | |
| `#4D4D4D` | terminal bright-black / dimmed default | 6 ports | consensus; the ports that need a *visible* dim default reach for grey, not `#6272A4` |
| `#BFBFBF` | terminal ANSI white | 6 ports | consensus; the spec says `#F8F8F2` |
| `#999999` | muted / secondary text grey | 12 ports | the most-replicated muted grey in the org |
| `#93B8F9` | indeterminate progress | `jetbrains/Dracula.theme.json:213` | the only ecosystem value for that state |

**Exclusion, stated because it is a trap:** `Dracula.xml` declares
`parent_scheme="Darcula"` (line 1). Values like `#48B764`, `#CD4644`, `#EF233C`, `#F8961E`
are Darcula/Material defaults restated in the file, **not Dracula choices** — `#EF233C` is
Material Red 500. The JetBrains port must not be read as ecosystem intent wholesale. Only the
values sitting on Dracula-named keys are authored.

### Tier 3 — alpha conventions worth knowing (not hexes)

The alpha byte is the real variable in these, and the base is usually ours already:

| value | job | source |
|---|---|---|
| `#44475A75` | current line at 46% | `vscode/dracula.yml:43` — the reference implementation's own alpha |
| `#FFFFFF1A` | non-text chrome at 10% white | `vscode/dracula.yml:44` |
| `#44475AA0` | tooltip at 63% | `telegram/colors.tdesktop-theme:94` |
| `#44475A66` | menu / popover layer at 40% | `telegram/colors.tdesktop-theme:111` |
| 5 hues @ `33` | **selection at 20%** | `zed/dracula.json:132-162` |
| `#FF555540` | destructive-button hover at 25% | `telegram/colors.tdesktop-theme:63` |
| `#FF79C680` | active tab border at 50% | the *official* focus border alpha |

### Tier 4 — explicitly not candidates

- **All 254 harvested candidates outside the R1/R2/R3 inclusion rule** (4 253 literals dropped
  as single-occurrence values in repos bundling non-Dracula themes). Reproducible.
- **The entire "Snazzy" family** [16] (`#FF6E67 #5AF78E #F4F99D #CAA9FA #FF92D0 #9AEDFE`) — shipped by
  7 org ports, but it is a fork's alternative to the spec block, not the spec.
- **The base16 re-mapping** [17] — not one of its 16 slots is a core Dracula hex, and `base00` is
  `282936`, a typo of `282a36`. Anyone importing it gets a wrong background.
- **Monokai/Solarized residue** in Sublime, Atom and micro (`#3B3A32 #222218 #EFFB7B #AE81FF
  #E6DB74`) — pre-Dracula carry-over, not a Dracula derivation.
- **dracula-ui's 7 accents** — non-compliant with the spec, and already ruled: the spec governs
  hex values, dracula-ui contributes structure only.
- **"Material Dracula" does not exist.** The brief for this research named it as the most
  valuable derivation in the ecosystem, and it is not there: `dracula/dracula-material-theme`
  and `material-theme/dracula` both return **404**, and a 514-repo enumeration of the org
  contains no such project. The only Material-origin values anywhere in the corpus are the
  Darcula-inherited defaults inside the JetBrains scheme — Material Red 500 `#EF233C` and
  Orange 500 `#F8961E` among them, restated in a file, **not** Dracula choices. [4] Anyone
  citing "Material Dracula's surface derivation" is citing something that does not exist.
  Nor is there an official Dracula theme for Notion.
- **PRO's 16 ANSI values** — `unverified — paywalled`, listed only in §2 as a structure.
- **The 81 Tailwind chromatic steps** — data scales, not surfaces, and 90 of the 254 candidates
  are already derivable from our existing ramps.

---

## 6. Findings that are new to the grill list

Six, all measured, none requiring a new hex to act on. The first three are colour and
contrast; the last three are a token that does not do what its name says — which is the
recurring class across this whole investigation.

1. **`#8288A6` measures 4.0832:1 on the body.** Whatever gate currently passes this token is
   not applying SC 1.4.3 as written. If the intent was 4.5:1, the token is wrong; if the intent
   was "supporting metadata, deliberately dim", the gate's claim is wrong. One of the two is a
   false statement. [20]
2. **`#9AA1BC` fails at 3.7704:1 on `#424450`.** The skill calls it the secondary text colour
   unconditionally. Any surface at or below that lightness breaks it. This constrains the
   whole "do we add `#191A21` as a tier" question — a deeper surface is a *darker* surface, so
   the risk is in the other direction, but the popover at `#424450` is already affected. [20]
3. **Our ramp step names are decorative.** 28/44/60/74/88 are HSL lightness values that span
   33.0–97.4 OKLCH L, with blue at 20.6% of available chroma. Either rename the steps or
   re-derive them. This is the same class of defect as the `check.ts` literal-string gate and
   `SKILL.md:93`'s false x-height premise: **a number about a value that was never checked
   against the value.** [4][27]
4. **The kit ships two hover ladders and two mechanisms, and nothing in the skill says so.**
   Ours is an 8-digit hex at 12.157% / 20.00%. Astryx core's is `color-mix` at 5 / 15 / 20%
   — measured census across `core/src`: **nine uses at 15%, three at 5%, two at 20%**. Two
   ladders, two mechanisms, one product. There is no upstream standard to defer to — Primer
   uses 10/20, Bootstrap uses 15% *lightness* — so this is a convention decision, and the
   current one is undocumented. [26][28]
5. **Functional Purple `#815CD6` has zero adoption as a focus colour.** Across every port read
   — VS Code, JetBrains, kakoune, dracula-css, the spec's own named reference implementation —
   **no port uses it**, despite `spec.mdx:139` naming it "Focus indicators" and `spec.mdx:318`
   saying "Focus rings: Functional Purple or appropriate accent". Every port ships `#BD93F9`.
   We ship `#BD93F9`. We are right by universal practice and wrong by the spec's letter, with
   nothing recorded anywhere saying the deviation is deliberate — which makes it exactly the
   kind of thing a future correctness pass "fixes" toward `#815CD6`. [3][4][7][13]
6. **`--color-shadow` is `#21222C`; every actual shadow is `#191A21`.** The token named as the
   shadow colour is not the colour any shadow uses, and `skill://astryx-dracula` repeats the
   wrong one. Detailed in §7.

---

## 7. What the approved palette is, unchanged

For contrast with §5. Our 29 hexes, verified identical in `tokens.css` and `astryx-theme.ts`:

```
#000000 #0081D6 #089108 #21222C #282A36 #343746 #424450 #44475A #4C5067 #50FA7B
#6272A4 #815CD6 #8288A6 #8BE9FD #8C939B #9AA1BC #A39514 #A4FFFF #B0B3C4 #BD93F9
#D6ACFF #DE5735 #F1FA8C #F8F8F2 #FF5555 #FF79C6 #FFB86C #FFD5CC #FFFFFF
```

Plus 45 HSL sequential ramps at L 28/44/60/74/88. **Nothing in §5 is in this list, and
nothing in this list is proposed for change.** `#FFFFFF` is listed here because the human's
ruling repins `--color-on-dark` to `#F8F8F2`, which drops it to 28.

Seven of the 29 are not in the spec, all previously documented in the `tokens.css` header as
deliberate same-hue Comment lifts plus the pale inverted error surface: `#000000 #4C5067
#8288A6 #8C939B #9AA1BC #B0B3C4 #FFD5CC`.

**One inconsistency found while reading our own files, flagged not fixed.** `tokens.css:182`
declares `--color-shadow: #21222C`, and `astryx-theme.ts:115` pins the same — but every actual
shadow (`tokens.css:156-158`) and the overlay scrim (`:173`) are built from **`#191A21`**. The
token named as the shadow colour is not the colour any shadow uses. `skill://astryx-dracula`
states the shadow hue is `#21222C`. Either the token is declared-but-unused or the docs are
wrong. This is the spec's Background Darker already living in our file under a different name,
which is worth knowing before anyone rules on §5 Tier 1.

---

## 8. What would change these conclusions

- **A PRO licence.** `design/PALETTE.md` would convert §2 from `secondary` to `primary` and
  settle whether the two-tier 75/80 L structure is a deliberate system or a transcription of
  something more considered.
- **A first-party contrast statement from the Dracula team.** The absence is well-supported but
  not provably exhaustive. A maintainer position would settle whether the spec's 4.5:1 line
  was meant to bind the Comment token.
- **A full-depth clone of `dracula/vim` and `dracula/zed`.** Shallow clones cannot see the
  commits that introduced `#191A21` into the Vim port or `#635D97` into Zed's Alucard, so
  their *provenance* is unverified even though their presence is not.
- **A second browser engine.** The `light-dark()` inside `color-mix()` result is
  Chromium-only; Safari and Firefox were not probed. If either rejects it, §3.3's verdict
  moves from CONDITIONAL to BREAKS.

---

## 9. Open questions

1. Does `#191A21` become a named surface tier, or stay a shadow/scrim detail? Cheapest
   decision in the set — the hex already ships.
2. Is the 4.5:1 gate for `--color-data-base-muted` real, and if so is `#8288A6` the wrong
   token? (Cannot both be true.)
3. Are the ramp step names meant to be perceptual? If yes they must be re-derived in OKLCH L;
   if no they should be renamed so nobody reads them as lightness.
4. Should the four missing ANSI brights be adopted for **charts**? The spec scopes that block
   "For terminal applications", and three of the four are already derivable from our ramps —
   so adopting them for data would be a judgement, not a spec mandate.
5. Functional Purple `#815CD6` has **zero** adoption as a focus colour across every port read.
   We use `#BD93F9`. Is that deviation recorded anywhere, or is it at risk of being
   "corrected" toward the spec letter by a future pass?
6. The ecosystem's four-way split on hover (lighten toward fg / darken toward black / white rim
   / elevation bump) is recorded as **the ecosystem having no answer**, not a different answer
   from ours. Worth stating as such, because "everyone does something different" reads as
   "we should too".


## Sources

All fetched **2026-09-28**. [primary] unless tagged. Grouped by weight. **Cite findings by full
path** — `F5.md` collides across slices.

### Official specification and first-party ports
1. `dracula/draculatheme.com` — `content/spec.mdx`, 401 lines, HEAD. `https://raw.githubusercontent.com/dracula/draculatheme.com/main/content/spec.mdx` — [primary]. Pin mandate `:367,:391`; Comment `:24`; contrast `:253-255`; alpha rule `:52`; UI palette `:107-127`; ANSI brights `:77-84`; line-highlight fallback `:54-59`; focus guidance `:139,:318`; layer gate `:131`.
2. `dracula/spec` — `dracula-spec.md`. `https://github.com/dracula/spec` — [primary]. Second official file; corroborates the pin mandate and the ANSI bright values.
3. `dracula/visual-studio-code` — `src/dracula.yml` — [primary]. The implementation the spec names as compliant. Comment `:13`; ANSI brights `:31-35`; `&BGDarker #191A21` `:51`; `&NonText #FFFFFF1A` `:44`; `&LineHighlight #44475A75` `:43`; `focusBorder: *COMMENT` `:81`; diff alphas `:266-269`.
4. `dracula/jetbrains` — `Dracula.xml` + `Dracula.theme.json` — [primary]. `parent_scheme="Darcula"` (`:1`) — many values here are Darcula-inherited, **not** Dracula-authored. Focus `:379-386`; `FILESTATUS_DELETED #FF6E6E` `:15`; secondary surface `:11`; selection `:13-14`; disabled `:383`.
5. `dracula/cursor` — `dev/src/classic.yml` — [primary]. The spec's declared reference implementation. Comment `:15`; `&LineHighlightColor #353747` `:43`; `&NonTextCharacterColor #3E404A` `:44`.
6. `dracula/vim` — `autoload/dracula.vim`, `colors/dracula_base.vim`, `doc/dracula.txt` — [primary]. Comment `:12`; `bgdarker #191A21` `:10`; the only 5-step surface ladder; `CursorLine = #424450`, not the spec's translucent Current Line; **no contrast claim anywhere**; `g:dracula_high_contrast_diff` `:100-103`.
7. `dracula/dracula-css` — `src/scss/{_variables.scss,_forms.scss,_web-components.scss}` — [primary]. 5-tier surface scale `:23-32`; **two focus hues and two ring widths inside one library**; three hover strategies; disabled by two mechanisms; ANSI brights `:60-64`; `#191A21` as the **disabled input surface** `:63`.
8. Dracula PRO — `https://draculatheme.com/pro`, `src/components/pro/bento/{palette,precise-contrast,why-pro}.tsx`, `/pro/journey` — [primary]. The "mathematical approach / normalizes luminosity and saturation" wording; the WCAG **2.0** 4.5:1 claim; 19 listed apps against "20 themes" advertised.
9. Dracula PRO changelog — `https://draculatheme.com/pro/changelog`, 21 entries — [primary]. **Zero colour values.** 2020-02-22 design files; 2020-04-15 `design/PALETTE.md`; 2024-07-07 Alucard divergence; 2025-05-23 "eliminating opacity issues that were hiding underlying decorations".
10. `dracula/draculatheme.com` — `src/app/globals.css:65,84-118` — [primary]. The team's own site: `hsl(248 36% 64%)` code comment, and **zero occurrences of `6272a4`**.
11. `dracula/obsidian` — `theme.css:10-100`, `obsidian.css:12` — [primary]. Imports Obsidian's own 12-step "Dark" base; adds `#20212B`, `#FF79C0`, `#BD93F4` (typo), `#B294BB`; the only HSL-channel treatment in the corpus; measured shadow alphas `0.121/0.179/0.071/0.112`.
12. `dracula/google-chrome` — `manifest.json` — [primary]. **RGB arrays, not hex strings** — a `#[0-9a-f]{6}` grep returns zero and misses the whole file. `#17181E` frame, `#191A21` incognito, `toolbar = #44475A`.
13. `dracula/tailwind` — `colors.js` — [primary]. 11 families × 10 steps; the measured ramp law (**hue pinned, L stepped ~6.6–7.4, S free to fall**); 22 keys collapsing to 11 via character aliases.
14. `dracula/zed` — `themes/dracula.json` — [primary]. Comment `#6272a4ff` in both dark variants; **`#635D97` substituted in Alucard light** `:1000-1004` (provenance unverified); selection at 20% `:132-162`; the only complete hover/active/selected/disabled ladder in the corpus.
15. `dracula/emacs` — `dracula-theme.el` — [primary]. `#353747` current line `:199`; a 3-step foreground de-emphasis ramp `:217-220`; the `"40% darker official variant"` claim `:221-223`, **verified wrong for 2 of 3 pairs**.
16. `alacritty/alacritty-theme` — `themes/{dracula,snazzy,omni,dracula_plus}.toml` — [primary]. `#555555` bright-black `:21`; "bright" as a no-op for 5 of 8 slots; Snazzy as a full alternative bright set.
17. `dracula/base16-dracula-scheme/dracula.yaml:1-18` — [primary]. A 16-slot re-derivation sharing **no value** with the core palette; `base00: 282936` is a typo of `282a36`. Bare 6-digit values with no `#` — invisible to any hex regex.
18. `dracula/kakoune`, `kitty`, `xresources`, `terminal-app`, `iterm`, `micro`, `sublime`, `telegram`, `nova`, `atom-ui`, `markdown`, `dracula/R` — [primary]. iTerm2, Xcode and VS store float RGB or binary: **zero hex literals, excluded by the file-attribution rule.**
19. Third-party PRO transcriptions — Hyper `https://gist.github.com/Nagref/dac1da0e39ffd0d2bee5689c5a29efb4` `config-default.js:58-76`; Windows Terminal `https://gist.github.com/jeangatto/f7ec6ead45ced089324cb0b7dd938086` `:91-111` — [secondary] — 16 values agree byte-for-byte across two independent authors. **`unverified — paywalled`.**

### Standards and reference implementations
20. WCAG 2.2 REC — `https://www.w3.org/TR/WCAG22/` — [primary]. Relative-luminance definition, lines 3605-3640, including the 0.04045 threshold and its Note 2. **Every contrast ratio in this report is computed from this formula with every input shown in `findings/F5.md` §Computation A — arithmetic, not quotation.**
21. WCAG 2.2 Understanding SC 1.4.3 — `https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html` — [primary]. Large text 3:1; the inactive-component carve-out; the no-rounding rule; Technique G174.
22. CSS Color 4 / Color 5 — `https://drafts.csswg.org/css-color-4/`, `https://drafts.csswg.org/css-color-5/` — [primary]. OKLCH conversion; gamut mapping (chroma reduction, local-MINDE, JND 0.02); `color-mix()` and its `oklab` default; `light-dark()`; §3's warning that yellow and blue can share an HSL lightness.
23. APCA — `https://github.com/Myndex/apca-w3`; `https://www.w3.org/TR/apca/` → **404**; WCAG 3.0 "yet to be determined" — [primary]. Signed value, polarity rule, Lc bands, the light-mode-only disclaimer, `DEPRECATED SOON` on its own solver.
24. Compositing and Blending Level 1 — `https://www.w3.org/TR/2024/CRD-compositing-1-20240321/` — [primary]. `co = Cs × αs + Cb × αb × (1 − αs)`, premultiplied, non-linearised.
25. Filter Effects Level 2 — `https://drafts.csswg.org/filter-effects-2/` — [primary]. Why a `backdrop-filter` ancestor makes the backdrop uncomputable.

### This repository
26. `tokens.css:1-11,45-63,156-182,208-212,260-313`; `astryx-theme.ts:105-115,225-249`; `BRAND.md:16`; `node_modules/@astryxdesign/core/src` (the `style.*` and `color-mix` censuses, `useTableSelection.tsx:130`) — [primary]
27. **Our measured data** — the 29-hex palette, the 8-stop alpha ladder, the HSL→OKLCH ramp table, the chroma-fidelity figures, the `color-mix` space comparison. Computed locally from [26]; every input and command is in `findings/F0.md` §C9 and `findings/F4.md` §Data tables — [primary, own computation]
28. Design-system references for §3.7 and §4 — `Shopify/polaris` `polaris-tokens/src/themes/dark.ts:23-24`; `primer/primitives`; `radix-ui/colors`; `radix-ui/themes` `src/styles/tokens/color.css:13-35`; `tailwindlabs/tailwindcss`; `twbs/bootstrap`; `material-foundation/material-color-utilities`; `https://m3.material.io`; webstatus.dev — [primary]

### Findings
`docs/research/dracula-ecosystem/findings/` — `F0.md` spec diff + our measured alpha ladder ·
`F1.md` Dracula PRO · `F2.md` terminal and editor consumers · `F3.md` application/UI consumers ·
`F4.md` colour-math technique inventory · `F5.md` Comment contrast · `F6.md` candidate hex sweep.
514 repos enumerated via the GitHub org API, 0 clone failures.

**Cite by full path.** `dracula-ecosystem/findings/F5.md` and `lib-landscape/findings/F5.md`
are different files.
