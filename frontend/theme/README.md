# Theme foundation

Use semantic colours in MUI components:

```tsx
<Box sx={{
  bgcolor: "background.paper",
  color: "text.primary",
  borderColor: "divider",
}} />

<Box sx={{
  bgcolor: (theme) => theme.colours.status.available.background,
  color: (theme) => theme.colours.status.available.text,
}} />
```

For ordinary CSS, use variables such as `var(--colour-text-primary)` and
`var(--colour-status-available-background)`.

## Layout tokens

Use shared tokens instead of introducing repeated raw layout values:

- `theme.space.*` for padding, margins and gaps. These match Figma's
  `padgap-xs` through `padgap-xxl` variables.
- `theme.radius.*` for shared corner radii. These match Figma's `corner-*`
  variables.
- `theme.sizes.*` for repeated control, icon and component dimensions.

Examples:

```tsx
const Card = styled(AppSurface)(({ theme }) => ({
  padding: theme.space.md,
  gap: theme.space.sm,
  borderRadius: theme.radius.lg,
}));

<AppButton
  sx={{
    height: (theme) => theme.sizes.control.xl,
    padding: (theme) => `${theme.space.md}px`,
  }}
/>
```

Prefer values from the 4/8-based scale for new layout work. Exact
component dimensions supplied by Figma remain exact even when they do not fit
the generic scale.

When using MUI System spacing shorthands (`p`, `m`, `gap`, etc.), remember that
a raw number is interpreted using MUI's spacing multiplier. For direct pixel
tokens, prefer CSS properties such as `padding`, `margin`, and `gap` with
`theme.space.*`.

Use DM Sans globally. Named typography variants include `brand`, `cardTitle`,
`sectionHeading`, `heroSubtitle`, `heroWordmark`, and `metadata`. The large
wordmark is opt-in, not the default heading size.

Do **NOT** add raw HEX/RGB/HSL values to feature components. Add a semantic role
in `colours.ts` when a new design colour is needed.

## CSS layout variables

`CssBaseline` also exposes the layout tokens as CSS custom properties. This keeps
plain CSS aligned with the MUI theme:

```css
.panel {
  padding: var(--space-md);
  gap: var(--space-sm);
  border-radius: var(--radius-lg);
  min-height: var(--size-control-xl);
}
```

The variable names are generated from the theme tokens, for example:

- `theme.space.md` -> `--space-md`
- `theme.radius.lg` -> `--radius-lg`
- `theme.sizes.control.xl` -> `--size-control-xl`

## Design-system checks

Run `npm run lint:design` to check both colours and layout tokens. The layout
check blocks new hardcoded spacing and corner-radius values while allowing the
existing legacy values recorded in `scripts/design-token-baseline.json`. As old
components are redesigned, removing legacy values is encouraged; do not refresh
the baseline simply to accept new hardcoded values.

Run `npm run check` before opening a PR to run formatting/linting, design-system
checks, TypeScript, and the Jest suite together.
