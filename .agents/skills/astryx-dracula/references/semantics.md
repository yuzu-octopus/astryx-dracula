# Semantics: links, dividers, spacing

Four rules that decide what a control *is*, where a rule belongs, and where a
number comes from. Each one names a file and line in this repo that obeys it,
because a rule with no exemplar is a request rather than a standard. The
templates are the reference implementations: read the closest one before
writing a new template, and do not invent a pattern the tree already answers.

| Rule | Canonical exemplar |
|---|---|
| A destination is a `Link`; an action is a `Button` | `templates/settings-dialog.tsx:718-722` (Request → `Button`) against `:653` (View → `Link`), same panel |
| Prose links pass `hasUnderline`, navigation passes nothing | `templates/login.tsx:126-134` (prose) against `templates/dashboard.tsx:675` (card header) |
| A divider marks a group boundary, at most one per panel | `templates/settings-dialog.tsx:398-415` (four groups, `gap` is the boundary, `hasDivider={false}` on every row) |
| Spacing comes from `Stack gap`, never a tuned pixel | `shared/settings-rows.tsx:88` (`<VStack gap={1}>` for a label/value pair) |

## 1. A link is a destination, a button is an action

If the control goes somewhere — a route, a hash, a file, an anchor — it is a
`Link` with an `href`. If it changes state where the user already is — submit,
save, delete, deactivate, disconnect, log out, request, toggle, expand — it is
a `Button`. An action rendered as `<Link href="#">` draws a purple navigation
affordance for something that does not navigate, and a screen reader announces
"link" for a control that acts.

In this repo the decision is a typed field, not a guess read off the label.
`shared/settings-data.ts:55` declares `actionKind?: 'action' | 'destination'`
on `InfoRow`, and the row renderer branches on it once at
`shared/settings-rows.tsx:97`: `'destination'` with an `href` renders a
`Link`, everything else a `Button`. Reading the English verb off the row is
what made "View" a button, and inferring the kind from the presence of an
`href` means renaming a label can silently flip a destination back into an
action, so the fact lives in the data next to the label.
`shared/settings-data.ts:61` (`'Create'`), `:65` (`'Disconnect'`), `:81` and
`:85` (`'Log out'`) are the actions; `templates/settings-sidebar.tsx:81-87`
and `:92-98` are the destinations, each carrying `actionKind: 'destination'`
and `href: SELF_HASH`. Every in-place trailing control in the settings
surfaces is a `Button`:

- `templates/settings-dialog.tsx:445-449` — `Deactivate`, `variant="destructive"`, with the reason in a comment at `:444`.
- `templates/settings-dialog.tsx:719-723` — `Request`, comment at `:718` "A request is submitted in place, so it acts."
- `templates/settings-dialog.tsx:737-741` — `Delete`, `destructive`.
- `templates/settings-dialog.tsx:134-135` — `Log out` on a device session, comment at `:134` "Ending a session changes state in place — a Button, not a Link."
- `templates/settings-sidebar.tsx:355-361`, `:711-717`, `:731-737` — the same three in the sidebar.
- `templates/payment-form.tsx:240` — `Remove`, `ghost`, on a saved card.

And the genuine destinations stay `Link`s, including inside those same panels,
so the contrast is visible on one screen rather than asserted: `View` next to
`Blocked people` at `templates/settings-dialog.tsx:653` and
`templates/settings-sidebar.tsx:644`. Both take `SELF_HASH`
(`templates/settings-dialog.tsx:56`, `templates/settings-sidebar.tsx:63`).

**`SELF_HASH` is for real destinations only.** A `#/templates/<id>` constant is
a stand-in for a route the showcase does not have yet. It stands in for a place
a user could arrive, never for an operation they could perform. All 26 sites
resolve to navigation (`rg -n 'SELF_HASH' templates shared | rg -v 'const
SELF_HASH'`): `Link` and `ClickableCard href`, `SideNavItem` and `TopNavItem`
`href`, `headingHref`, `railHref`, `linkHref`, and the row `href` read only
when `actionKind` says the row is a destination. None is handed to a control
whose job is to change something, and a new one that is should be a `Button`
instead.

Two details that are easy to get wrong and are settled in the code: a row action
is `variant="secondary"`, never `primary`, because a filled accent button in a
trailing column outranks the panel's own primary and is what made these panels
read as a form (`shared/settings-rows.tsx:54-56`); and a row action passes
`style={actionNoWrap}` from `shared/settings-data.ts:125` so "Log out" and
"Disconnect" stay on one line.

## 2. The underline follows the context, not the element

Core's `Link` is undecorated by default and underlines on hover only:
`node_modules/@astryxdesign/core/src/Link/Link.tsx:61-66` sets
`textDecoration` to `none` at rest and `underline` under `:hover` inside
`@media (hover: hover)`. The `hasUnderline` prop (`:91-93`, defaulted `false`
at `:300`) is the only way to get a persistent underline, and this theme adds
none of its own — `astryx-theme.ts:394-399` sets colour and hover colour and
stops there, shipping as `.astryx-link` in `theme.css:471-477`.

**Links in running prose pass `hasUnderline`.** A link inside a sentence — a
sentence in a description, help text, a privacy line, terms of service — has
nothing else marking it. Purple is the only other channel, and colour alone is
not a sufficient cue: WCAG 1.4.1 Use of Color, cited as F73 by the gates in
this repo. An underlined link also survives greyscale, low vision, and a
printed page. The rule is in the templates that get it right:

- `templates/login.tsx:126-134` — signup prompt, with the reasoning in the comment at `:126-128` and `hasUnderline` at `:132`.
- `templates/login.tsx:144` and `:148` — the two terms links inside one sentence.
- `templates/settings-dialog.tsx:671-676` — "Learn more" closing the Reviews description; `templates/settings-sidebar.tsx:662-670` is the same line in the sibling template.
- `templates/settings-dialog.tsx:753-760` — "Privacy Policy" inside "We are committed to keeping your data protected…"; `templates/settings-sidebar.tsx:749-758` likewise.
- `templates/detail-page.tsx:596-598` — "Show more" closing a note, which is also why it passes `type="inherit"`: the link adopts the paragraph's size instead of rendering larger than its sentence.

**Links in navigation pass no underline prop and get no hand-rolled CSS.** The
grouping, the icon, the selected state, or the item's position already says
what it is, and underlining a whole rail turns it into a wall of links. The
contexts, each with a site in this tree:

| Navigation context | Exemplar |
|---|---|
| Header | `templates/detail-page.tsx:222` — the "All orders" breadcrumb, `Link` with no underline |
| Sidebar | `templates/shell-side-nav.tsx:174-185` — `SideNavItem` entries take `href` and never take an underline |
| Top nav | `templates/shell-top-nav.tsx:219-220` — `TopNavItem` |
| Tab list | `templates/settings-dialog.tsx:390-396` — a `TabList` is navigation by construction |
| Card header | `templates/dashboard.tsx:675` — the `TableCard` header link, a plain `Link` |
| Table row label | `templates/table-page-heatmap-status.tsx:339-341` — an incident id, `isStandalone`, no underline |
| Settings rail | `templates/settings-dialog.tsx:653` — "View" beside a section heading |

`templates/detail-page.tsx:587-591` is the worked contrast in one comment: the
two links in the notes header are navigation and pass nothing, while the link
closing the paragraph below passes `hasUnderline` and `type="inherit"`, three
lines apart in the same component.

**When it is ambiguous it is prose, so underline it.** The test is not how
prominent the link looks but whether the surrounding text forms a sentence the
link belongs to. "Choose what is shared when you write a review. Learn more"
is one sentence. A "View" in a trailing column is not.

**Never hand-roll it.** Do not write `text-decoration` or `textDecoration` in
`astryx-theme.ts`, `tokens.css`, or any template. The prop exists; the only
thing a hand-rolled rule buys is a second source of truth that outranks core's
documented behaviour. A theme-level `link.base` override carrying
`textDecoration: 'underline'` is exactly the defect that made `hasUnderline`
inert while every gate stayed green: the declaration looks like branding, the
cost is that the prop stops working for every consumer.

## 3. A divider marks a group boundary, not a row background

`Divider` belongs between genuinely different groups. One at most inside a
panel, and only where the groups are real: if two adjacent blocks are separated
by nothing but a rule, they are one group and `Stack gap` is the separator. A
rule after every row is what makes a settings panel read as a form grid and
flattens the hierarchy the grouping was meant to express.

The canonical panel is `templates/settings-dialog.tsx:398-415`. Four groups —
Login, Social accounts, Device history, Account — each with its own `Heading
level={3}` and its own `VStack gap={2}`, and the comment at `:398-400` states
the rule at the site: "`gap` is the boundary, so no rule between them and none
after the last row". Every row there passes `hasDivider={false}`
(`:406`, `:413`); `templates/settings-sidebar.tsx:804` and `:821` do the same.

Where a divider is right:

- `templates/shell-nav.tsx:213` — between menu groups in a dropdown, and the guard is `gi > 0`, so there is none after the last group.
- `templates/library.tsx:472` — one per shelf section.
- `templates/settings-sidebar.tsx:186` — one, between the settings nav and the promo section below it.
- `templates/settings-dialog.tsx:207` and `templates/settings.tsx:98` — `LayoutPanel`/`LayoutHeader` `hasDivider` is chrome, a seam between regions rather than a row rule. `templates/settings.tsx:17-18` records the seam rule: a panel beside `LayoutContent` takes `hasDivider={false}` because whitespace already separates them.

The one place a rule does sit between rows is a `List`, where the rows are
peers in a list rather than fields in a form, and the panel-level boundary is
the list itself:

- `List hasDividers` — `templates/incident-console.tsx:350`, inside one status group. Elsewhere the same component is explicitly off, because those lists sit inside a group the heading already separates: `templates/messaging-shell.tsx:482` and `:512`, `templates/editor.tsx:601`, `:734`, `:750`, `templates/file-explorer.tsx:533`.
- `CollapsibleGroup hasDividers` — `templates/product-detail.tsx:284-287`, where the rows are sibling sections. Same reasoning, and the group boundary is the accordion.

The shared row renderers take the decision as a prop rather than guessing:
`shared/settings-rows.tsx:79` and `:83` declare `hasDivider`, defaulting to
`true`, and `:111` renders `{hasDivider && <Divider />}` so a caller that does
not want a rule says so once. `ExpandableRow` does the same at `:184` and
`:217`. The rule is stated in the module header at `:57-60`.

## 4. Spacing comes from the scale

Spacing is `Stack gap`, or a layout prop on the kit component, or nothing.
Never a hand-tuned `margin`/`padding` chosen to make a panel look right: a
panel that needs twenty rules to assemble is a panel that should be a `Stack`.
The canonical values and their provenance are `references/spacing.md`.

`shared/settings-rows.tsx:88` is the shape — a label/value pair spaced with
`<VStack gap={1}>`, with the reason at `:61-64`: `gap={1}` matches the rows each
template builds itself, so nothing on the page reads tighter than its
neighbours.

**`gap={0}` genuinely renders 0**, which is worth stating because the opposite
is widely assumed. Core applies the gap style only when the value is non-null
(`node_modules/@astryxdesign/core/src/Stack/stack.stylex.ts:235`,
`gap != null && gapStyles[gap]`), and `gapStyles[0]` is a real entry
(`:113-116`) resolving `--spacing-0` to `0px`
(`node_modules/@astryxdesign/core/src/theme/tokens.stylex.ts:153`). So `0`
flips the switch on, it does not read as absent. In templates:
`templates/settings-dialog.tsx:259` (a column whose sections carry their own
gaps), `templates/incident-console.tsx:336` and `:338`,
`templates/detail-page.tsx:228`.

The converse is the trap: **core's `Stack` has no default gap.**
`node_modules/@astryxdesign/core/src/Stack/Stack.tsx:211` takes `gap` with no
default and passes it through at `:255` and `:285`, so an omitted `gap` renders
0 and the children touch. `templates/detail-page.tsx:507-511` records the fix
in a comment: the heading and the Filters button were touching because no gap
was passed, while the byte-identical header rows at `:340` and `:408` passed
`gap={2}` and read correctly. Omitting a gap is a defect; stating `gap={0}` is
a decision.

The one sanctioned use of inline spacing style is a value no prop expresses.
`templates/detail-page.tsx:53-57` bleeds a tab row to the header's content
edges and names why (`#2622`, no edge-dock prop on `TabList`);
`templates/documentation.tsx:27-29` pulls grid cards back by
`calc(var(--spacing-2) * -1)`, which is a token, not a pixel. Both say what
they are compensating for. A tuned `margin: 12` with no such reason is the
thing to reject.
