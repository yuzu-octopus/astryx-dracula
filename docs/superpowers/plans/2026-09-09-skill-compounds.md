# Skill compounds implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add premade sidebar, footer, app-shell, empty-state scaffolds plus a component mapping table, truncation rule, and math-content font exception to the astryx-dracula skill.

**Architecture:** Docs-only change. New copy-paste blocks go in `.agents/skills/astryx-dracula/references/scaffolds.md`; enforceable rules go in `.agents/skills/astryx-dracula/SKILL.md` (doctrine, mapping table, red flags). No theme, CSS, or demo changes.

**Tech Stack:** Markdown, Astryx components (SideNav, Card, Text, Link, Badge, Button, StatusDot), existing skill file layout.

**Spec:** This conversation 2026-09-09 (no separate spec doc): sidebar and footer samples modeled on RsaWebTool but fixed; footer carries copyright plus Powered by GitHub Pages plus Built with React plus Vite plus Astryx; truncation rule for long labels; component mapping table; math-content serif exception (no font enforcement otherwise).

## Global Constraints

- Never invent a color, token name, font, or radius.
- Dark-only; mono default with one exception: math formulas may use serif (observable predicate: element renders math notation only).
- No raw `<div>`, `<span>`, `<a>` for layout or text.
- Section subtitles are `body`, metadata is `supporting`, nothing meaningful below 12px.
- Blind-test with a fresh subagent before commit (established skill-test method).

---

### Task 1: App-shell plus sidebar scaffold

**Files:**
- Modify: `.agents/skills/astryx-dracula/references/scaffolds.md` (append new section at end)

**Interfaces:**
- Consumes: existing scaffolds.md vocabulary (Card 4/3, h2 plus body headers, badge variants).
- Produces: `## App shell (sidebar tool)` section other tasks reference for footer placement.

- [ ] **Step 1: Append the app-shell scaffold block**

```markdown
## App shell (sidebar tool)

Three regions: left nav, main panel, right rail. For tool apps like the RSA toolkit, not showcases.

```tsx
<HStack gap={0} style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
  <SideNav>{/* groups below */}</SideNav>
  <VStack gap={4} style={{ flex: 1, padding: '24px', minWidth: 0 }}>
    <VStack gap={1}>
      <Heading level={2}>Panel title</Heading>
      <Text type="body" color="secondary">What this panel does.</Text>
    </VStack>
    {/* panel body */}
  </VStack>
  <VStack gap={3} style={{ width: '280px', padding: '24px' }}>
    <Heading level={3}>Results</Heading>
    {/* rail body; empty state when idle */}
  </VStack>
</HStack>
```

Main panel gets `minWidth: 0` so wide children (tables, code) never force page-level horizontal scroll.
```

- [ ] **Step 2: Verify markdown renders (visual check of the block)**

Run: `grep -n "App shell" .agents/skills/astryx-dracula/references/scaffolds.md`
Expected: one match, the new section header.

- [ ] **Step 3: Commit**

```bash
git add .agents/skills/astryx-dracula/references/scaffolds.md
git commit -m "docs: app-shell scaffold in skill"
```

### Task 2: Sidebar sample with truncation

**Files:**
- Modify: `.agents/skills/astryx-dracula/references/scaffolds.md` (append after app-shell section)

**Interfaces:**
- Consumes: Task 1 section (placement anchor).
- Produces: `## Sidebar groups` section.

- [ ] **Step 1: Append the sidebar scaffold block**

```markdown
## Sidebar groups

Group header carries the count badge and chevron; rows truncate with full-text tooltips, never raw clip.

```tsx
<VStack gap={1}>
  <HStack justify="between" vAlign="center">
    <Text weight="semibold">Factorization</Text>
    <HStack gap={1} vAlign="center">
      <Badge label="20" variant="neutral" />
      {/* chevron */}
    </HStack>
  </HStack>
  <Link href="#ecm" tooltip="ECM Full Factorization">ECM Full Factorization</Link>
  {/* rows: Link with tooltip holding the full label */}
</VStack>
```

Truncation rule: any label that can exceed its container gets ellipsis plus a tooltip with the full text. Applies to nav rows, table cells, badge labels, and card titles.
```

- [ ] **Step 2: Verify placement after app-shell section**

Run: `grep -n "^## " .agents/skills/astryx-dracula/references/scaffolds.md`
Expected: `App shell` header appears before `Sidebar groups` header.

- [ ] **Step 3: Commit**

```bash
git add .agents/skills/astryx-dracula/references/scaffolds.md
git commit -m "docs: sidebar scaffold plus truncation rule in skill"
```

### Task 3: Footer sample

**Files:**
- Modify: `.agents/skills/astryx-dracula/references/scaffolds.md` (append after sidebar section)

**Interfaces:**
- Consumes: Task 2 section (placement anchor).
- Produces: `## Footer` section.

- [ ] **Step 1: Append the footer scaffold block**

```markdown
## Footer

Copyright plus Powered by GitHub Pages plus Built with React, Vite, and Astryx. One line, supporting size, links inherit.

```tsx
<VStack gap={1} style={{ padding: '24px', borderTop: '1px solid var(--color-separator)' }}>
  <Text type="supporting" color="secondary">© 2026 yuzu-octopus</Text>
  <Text type="supporting" color="secondary">
    Powered by <Link href="https://pages.github.com/" target="_blank" rel="noopener noreferrer">GitHub Pages</Link>
  </Text>
  <Text type="supporting" color="secondary">
    Built with <Link href="https://react.dev/" target="_blank" rel="noopener noreferrer">React</Link>
    , <Link href="https://vite.dev/" target="_blank" rel="noopener noreferrer">Vite</Link>
    , <Link href="https://astryx.atmeta.com/" target="_blank" rel="noopener noreferrer">Astryx</Link>
  </Text>
</VStack>
```
```

- [ ] **Step 2: Verify no fixed external icon on the small links**

Run: `grep -n "isExternalLink" .agents/skills/astryx-dracula/references/scaffolds.md`
Expected: no matches (small supporting-size links use `target="_blank"` so the fixed icon cannot stretch the line).

- [ ] **Step 3: Commit**

```bash
git add .agents/skills/astryx-dracula/references/scaffolds.md
git commit -m "docs: footer scaffold in skill"
```

### Task 4: Empty state plus mapping table plus math exception in SKILL.md

**Files:**
- Modify: `.agents/skills/astryx-dracula/SKILL.md` (three insertions)
- Modify: `.agents/skills/astryx-dracula/references/scaffolds.md` (append empty-state block)

**Interfaces:**
- Consumes: Task 1–3 sections (reference index must list all current files; no new files added here).
- Produces: complete skill content for Task 5 blind test.

- [ ] **Step 1: Append the empty-state block to scaffolds.md**

```markdown
## Empty state

Heading plus one-line why plus primary CTA, centered, width-constrained. Never a bare message.

```tsx
<VStack gap={3} style={{ alignItems: 'center', maxWidth: '420px', marginInline: 'auto', padding: '48px 24px' }}>
  <Heading level={3}>No results yet</Heading>
  <Text type="body" color="secondary">Run an attack and findings land here.</Text>
  <Button label="Open panel" variant="primary" />
</VStack>
```
```

- [ ] **Step 2: Add the component mapping table to SKILL.md layout doctrine**

Insert after the touch-targets item:

```markdown
Map jobs to components, never to lookalikes: action goes to Button (never a nav-item class), navigation goes to SideNav or Link, count goes to Badge, status goes to StatusDot or Banner, label goes to Text type="label".
```

- [ ] **Step 3: Add the math-content exception to SKILL.md typography doctrine**

Insert after the JetBrains Mono paragraph:

```markdown
One exception: math formulas may use serif, and only math formulas. Everything else stays mono; a serif paragraph is a defect unless it renders math notation.
```

- [ ] **Step 4: Verify insertions**

Run: `grep -n "Map jobs to components" .agents/skills/astryx-dracula/SKILL.md && grep -n "math formulas may use serif" .agents/skills/astryx-dracula/SKILL.md && grep -n "^## Empty state" .agents/skills/astryx-dracula/references/scaffolds.md`
Expected: three matches, one per insertion.

- [ ] **Step 5: Commit**

```bash
git add .agents/skills/astryx-dracula/SKILL.md .agents/skills/astryx-dracula/references/scaffolds.md
git commit -m "docs: mapping table, math exception, empty state in skill"
```

### Task 5: Blind-test and push

**Files:**
- Modify: none (verification only, then push prior commits)

**Interfaces:**
- Consumes: complete skill from Tasks 1–4.
- Produces: pushed commits.

- [ ] **Step 1: Dispatch a blind styling scenario**

Dispatch one scout subagent: give it the skill path plus references path and ask for TSX of a tool sidebar (two groups with counts, five truncating rows) plus a footer plus an empty state. Demand a per-value source list with zero invented as the bar.

- [ ] **Step 2: Check the result for the five additions**

Expected: sidebar rows carry tooltips, footer matches the three-line shape with `target="_blank"` links, empty state has heading plus body plus primary Button, no `isExternalLink` on small text, no serif outside math, mapping table visibly applied (Button for CTA).

- [ ] **Step 3: Fix gaps in the skill when the agent misses**

When a check fails, edit the skill wording that allowed the miss, then re-run the same scenario. Repeat until the bar holds.

- [ ] **Step 4: Push**

```bash
git push && git status --short && echo CLEAN
```
Expected: `CLEAN`, remote in sync.
