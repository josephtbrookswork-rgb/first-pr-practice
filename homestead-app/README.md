# Homestead

A UI prototype for a family chore/calendar/grocery/household-info app, built from
the "Hearth" design plan & product requirements draft. Front-end only for now —
state lives in React context (`FamilyContext`), no backend or persistence yet.

Built with React + Vite + Tailwind CSS v4. No build tool config beyond the
defaults from `npm create vite`.

## Screens

- **Home** — role-aware dashboard: managers (Head of Household / Co-Manager) see
  a family-wide approval queue and today's progress; Teen sees a personal task
  list and stars; Kid Mode is large tap-to-complete chore cards.
- **Chores** — assign, claim open chores, sub-task checklists, recurring
  frequency, photo-confirmation gated behind manager approval.
- **Calendar** — 7-day strip + member-filterable agenda, with chore↔event
  linking (e.g. "Soccer Practice" links to "Pack Sports Bag").
- **Grocery** — aisle-grouped list, a request queue for non-manager adds,
  frequently-bought quick-add.
- **Hub** — Wi-Fi / emergency contacts / pediatrician / pet care / house sitter
  reference cards, with sensitive fields (Wi-Fi password) masked behind
  tap-to-reveal.

Use the avatar in the top bar to switch "viewing as" between the four seeded
family members and see how each role's view differs.

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

**Building/running requires a Mac with Xcode** — none of that is possible from
Windows. The steps from here:

1. On a Mac, clone the repo and `cd homestead-app && npm install`.
2. `npm run cap:open` — builds the web app, syncs it into the iOS project, and
   opens `ios/App/App.xcodeproj` in Xcode. (Dependencies are resolved via
   Swift Package Manager, not CocoaPods, so there's no `.xcworkspace` — just
   the `.xcodeproj` — and no `pod install` needed.)
3. In Xcode: pick a Simulator from the scheme's device menu (top toolbar,
   next to the "App" scheme — e.g. "iPhone 16") and hit Run (⌘R). No signing
   needed to run on a simulator.
4. To run on your own device instead: sign in with your Apple ID under
   Signing & Capabilities, pick a development team, then select your device
   from the same menu and Run.

After any change to the web app, re-run `npm run cap:sync` (or `cap:open`) to
pull the latest build into the native project before rebuilding in Xcode.

Camera access (for chore photo-confirmation) works in the simulator via its
own fake camera feed, or you can pick a photo from the simulator's seeded
Photos library instead of capturing live.

### Building without a local Mac

[`codemagic.yaml`](../codemagic.yaml) at the repo root currently only defines
a workflow for Solaris (`vitamin-reminder-app`). Homestead doesn't have a
Codemagic workflow yet — add one following the same pattern (new
`working_directory`, bundle identifier `com.josephbrooks.homestead`, App Store
Connect integration) once you're ready to build in the cloud instead of
locally.
