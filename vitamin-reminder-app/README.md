# Solaris

A mobile-first web app that times vitamin/supplement intake to your day's rhythm
(dawn/midday/dusk anchors) and tracks your home supplement cabinet. Built from the
Solaris design handoff, styled with the "Organic" design system.

Built with React + Vite + Tailwind CSS, no backend — state persists to `localStorage`.

## Screens

- **Onboarding** — welcome, name, age, location permission (for UV/SolarSync timing).
- **Home** — morning check-in, taken-today / UV stat cards, today's stack, next anchor.
- **Schedule** — build a dawn/midday/dusk supplement stack, tied to optional daily anchors.
- **Pantry** — track servings, cost per serving, and depletion status per bottle.
- **Profile** — edit name/age, manage location permission, restart onboarding.

## Accessibility

Targets WCAG 2.2 AA for a mobile viewport:

- All interactive controls are real `<button>`/`<input>` elements with visible
  `:focus-visible` states and minimum 44×44px touch targets (iOS HIG / Material).
- A few colors from the raw design tokens (e.g. `--color-accent` text on `--color-bg`,
  ~3:1) fall short of AA for normal-size text. `src/styles/organic.css` documents the
  darker steps (`--color-accent-700`, etc.) used instead for text/foreground roles,
  while large decorative fills keep the original brand hues.
- Modals (`Sheet`) trap focus, restore focus to the trigger on close, and close on `Escape`.
  Screen transitions move focus to the new screen's heading for screen reader users.
- Respects `prefers-reduced-motion`; viewport allows pinch-zoom (no `maximum-scale` lock).

## Development

```bash
npm install
npm run dev
```
