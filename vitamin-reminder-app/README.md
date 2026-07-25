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

## iOS app (via Capacitor)

The `ios/` folder is a real Xcode project, wrapping the built web app in a
native WKWebView shell via [Capacitor](https://capacitorjs.com). It's checked
into the repo; only the copied web bundle (`ios/App/App/public`) and Xcode's
own user/build state are gitignored (see `ios/.gitignore`, which Capacitor
generated).

**Building/running/submitting requires a Mac with Xcode** — none of that is
possible from this environment. The steps from here:

1. On a Mac, clone the repo and `cd vitamin-reminder-app && npm install`.
2. `npm run cap:open` — builds the web app, syncs it into the iOS project,
   and opens `ios/App/App.xcworkspace` in Xcode. (Dependencies are resolved
   via Swift Package Manager, not CocoaPods — no `pod install` needed.)
3. In Xcode: sign in with your Apple ID under Signing & Capabilities, pick a
   development team, and run on a simulator or your own device to test.
4. To publish: you'll need an active
   [Apple Developer Program](https://developer.apple.com/programs/) membership
   ($99/year), an app record in App Store Connect, and app icons/screenshots/
   privacy policy for the listing. Then Product → Archive in Xcode, upload
   through Organizer, and submit the build for Apple's review.

After any change to the web app, re-run `npm run cap:sync` (or `cap:open`) to
pull the latest build into the native project before rebuilding in Xcode.

Two things that currently only use standard web APIs and would benefit from
native Capacitor plugins for a fuller iOS experience:
- **Location** (`navigator.geolocation`) — works in the WKWebView, but
  [`@capacitor/geolocation`](https://capacitorjs.com/docs/apis/geolocation)
  gives a proper native permission prompt and `Info.plist` usage-description
  wiring.
- **Reminders** (`Notification` API) — the web Notification API doesn't map
  to real iOS notifications at all. Getting reminders working natively means
  swapping to [`@capacitor/local-notifications`](https://capacitorjs.com/docs/apis/local-notifications),
  which schedules actual OS-level notifications and needs its own permission
  flow.
