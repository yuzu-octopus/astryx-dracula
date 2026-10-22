# XLE drift — the inventory that survived the 0.7.2 upgrade

**Probed 2026-10-22 (core+cli 0.6.3 → 0.7.2), after the `astryx layout` command
group was removed.** Two independent read-only audits swept all 45 templates
and reported XLE-header drift. This file records what is still outstanding, so
the next pass starts from facts instead of from 45 headers nobody can check.

## Why the drift is now unforced

CLI 0.7.0 removed `astryx layout check` (breaking change #7137). Until then a
`bunx astryx layout check "<expr>"` could prove a header matched the tree it
described. Nothing replaced it — `astryx docs layout` is a guide, not a checker.
Every header now says so in its own text, and `references/xle.md` no longer
teaches the command.

That is why the drift accumulated: the headers are hand-maintained prose in a
comment, and the only thing that would have caught a stale one was deleted.

**The 26 corrections that DID land** (each verified against the template's own
source in the same pass, because three of the audit's quotes were wrong):
`t=display-2` on seven h1s the headers claimed were plain level-1 headings; the
`L[h=auto]` / `L[h=fill]` and `LC[p=8]` attributes seven headers omitted; the
login CTA label, which the headers called "Enter the night" while the shipped
`AUTH_PRIMARY_CTA` is "Sign in"; `C*3` → `SC*3` in the editor (the blocks are
`SelectableCard`s, not `Card`s); the library card description's Text role
(`supporting` → `body`); `S.section` → `S.transparent` in the two AI-chat
artifact panels; three placeholder strings; and the file-explorer's preview
Section padding.

## Still outstanding

### A. Needs a notation token that does not exist yet

The XLE vocabulary (`references/xle.md`) has no token for these nodes, so
writing them correctly means extending the notation first:

| Node | Needs | Where |
|---|---|---|
| `VisuallyHidden` | a `VH` token | `ai-chat-landing` ("Suggested prompts" is a `VisuallyHidden as="h2"`, not a `Heading`), `file-explorer` ("File Explorer"), `ide` ("Code editor") |
| `ChatSystemMessage` | a `ChSM` token | `ai-chat` (two "Today" dividers between the message groups) |
| chart legend swatch | a swatch token | `dashboard` (the shared legend renders a swatch element per entry, not an `Icon`) |
| `SeverityBadge` | a token for the local component | `incident-console` (the header records `StatusDot`; the row actually renders a local `SeverityBadge` with a "SEV-1" label) |
| `SceneTile` / `SceneCastle` | `Scene` exists but the payload slot does not | `login-split` (the cover art is `<Card variant="transparent"><SceneCastle variant="rooftops"/></Card>` — no `AspectRatio`, which the header claims) |
| `Banner` | `Bn` exists in `payment-form` only | `form-two-column` (the header omits the success `Banner` entirely) |

### B. Structure that was flattened or collapsed

- `ai-chat` — the header says `(ChM > ChB)*4`; the file renders **8** messages
  (4 user + 4 assistant) plus the two system dividers, a `ChatToolCalls`, a
  `CodeBlock` and a `Markdown`, none of which appear in the header. The chat
  column is a `VStack`, not a `StackItem`.
- `detail-page` — the header omits the **second root** (the mobile inspector
  `Dialog`); two gap values are wrong (`V[g=0]` where the source has
  `gap={2}`, `H[g=3]` where the source has no gap); the metadata row is
  flattened and its "Needs attention" item is missing; the invoice section
  has **two** `MetadataList`s separated by a `Divider`, not one.
- `editor` — the header omits the second root (the mobile customisations
  `Dialog`) and flattens each `Hd` + `UL` pair that the source nests in its
  own `VStack gap={1}`.
- `ide` — the header models one `Layout`; the source is two nested `Layout`s
  and two `LayoutContent`s, with a `VisuallyHidden` h1. The `ResizeHandle` is
  absent.
- `file-explorer` — the toolbar's start and end content are bare fragments in
  the source, but the header wraps them in `H`.
- `incident-console` — the header says one `List` of 7 items; the source
  renders **three** `List`s (one per status group), each preceded by a group
  header row. The inspector title row is `gap={1}`, not `gap={2}`.
- `library` — the source renders one `Divider` **and one `VStack gap={8}` per
  category** via `flatMap`; the header shows a single `D` and a single `V[g=8]`.
- `documentation-technical` — the header's `H[j=between]` is wrong: the source
  uses `gap={2}` with a `StackItem size="fill"` to right-align.
- `dashboard-portfolio` — the chart caption is nested the wrong way round: the
  source is `VStack > (Card + Text)`, the header says `Card > VStack > Text`.
- `dashboard` — the legend row is mis-modelled (see the swatch token above).

### C. Counts and abbreviated strings

- `kanban-board` — the per-column card counts are `*2` in the header; the
  actual counts are 2 / 2 / 1 / 3, and the drag-clone `Card` is absent.
- `documentation-design` — the first section of each example card is
  `variant="transparent"`, and `LC` omits the `!scroll` marker that
  `file-explorer` records for the same prop.
- Truncated or paraphrased user-visible strings: `classic-gallery`
  ("A coven-curated wall"), `contact-form` ("Tell us a bit"), `library`
  ("Search the stacks…"), `documentation-technical` ("Prompt description"),
  `ai-chat` (the `DialogHeader` title truncates `ARTIFACT_TITLE` and drops its
  `subtitle` / `endContent`), `form-two-column` ("Company" / "Phone" for
  "Company name" / "Phone number", "Budget" for "Budget range").

## How to close it

The cheap half is B and C: read the template, rewrite the header, done. The
expensive half is A, because it means extending the notation in
`references/xle.md` first — and the notation is exactly the thing that no
longer has a validator, so a new token is a convention with nothing enforcing
it.

**If a validator is wanted back, the cheapest route is a gate in
`scripts/check.ts`**: the file already walks the template tree for other
reasons, and the XLE is a single line per template. A gate that checks the
XLE's *node names* against the component names the template imports would
catch the class of drift that matters — a header naming a component the file
does not render — without needing a grammar. That is a real piece of work and
it is not in this pass.
