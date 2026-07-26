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

## Building iOS without a local Mac (via Codemagic)

If your Mac can't run a current Xcode (Apple requires apps be built against a
recent SDK to submit at all, so an old local Xcode wouldn't get you to the
App Store even if it ran), [`codemagic.yaml`](../codemagic.yaml) at the repo
root defines a [Codemagic](https://codemagic.io) workflow that builds this
project on their own up-to-date Mac infrastructure — no local Mac needed for
day-to-day builds.

This config was written for Codemagic's documented conventions but hasn't
been run end-to-end (that requires an actual Codemagic account and Apple
signing credentials, neither of which exist yet), so expect to troubleshoot
the first build. Setup is one-time and happens in Codemagic's dashboard —
none of it can be done from a repo:

1. Sign up at [codemagic.io](https://codemagic.io) (GitHub sign-in is the
   easiest way in, since it ties directly to this repo) and add
   `first-pr-practice` as an app.
2. Codemagic should detect the `codemagic.yaml` at the repo root automatically
   and offer the `solaris-ios` workflow.
3. Generate an App Store Connect API key at
   [appstoreconnect.apple.com/access/api](https://appstoreconnect.apple.com/access/api)
   (requires the paid Apple Developer Program membership) and add it in
   Codemagic under **Team settings → Integrations → App Store Connect**. Name
   it `solaris_appstore` to match `codemagic.yaml`, or update that file if you
   name it something else.
4. Make sure an app record for `com.solaris.app` exists in App Store Connect
   (create one there first if not — Codemagic doesn't do this for you).
5. From the Codemagic dashboard, start a build of the `solaris-ios` workflow.
   It builds and signs automatically, then uploads to TestFlight.

The workflow doesn't auto-trigger on every push to `main` on purpose (iOS
builds cost build-minutes, and most changes are to the web app, not the
native shell) — it's manual-start only for now. That's easy to change in
`codemagic.yaml` once it's actually building successfully and you want it
automated.
