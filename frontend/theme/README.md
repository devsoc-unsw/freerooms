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

Use `theme.space` for the spacing scale and `theme.radius` for
shared radii.

Use DM Sans globally. Named typography variants include `brand`, `cardTitle`,
`sectionHeading`, `heroSubtitle`, `heroWordmark`, and `metadata`. The large
wordmark is opt-in, not the default heading size.

Do **NOT** add raw HEX/RGB/HSL values to feature components. Add a semantic role
in `colours.ts` when a new design colour is needed.