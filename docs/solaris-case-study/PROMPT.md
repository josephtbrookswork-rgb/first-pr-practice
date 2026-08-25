# Prompt: Publish the Solaris case study on Framer

Paste this whole file as your instruction to a Claude session that has
browser/Framer access (and, if possible, access to the
`josephtbrookswork-rgb/first-pr-practice` GitHub repo to pull the image
files directly).

---

## Task

Add a new case study page for **Solaris** to the UX portfolio site at
**https://most-click-792330.framer.app**, following the exact same structure
as the site's three existing case studies (**Fresh Fare Farms**,
**Future Funds**, **Ludwitt Academy**):

Home page grid card → case study page with: eyebrow tag → title (H1) →
subhead → **The Problem** → **The Solution** → **Process** → image gallery.

Before building, open the site and look at how one of those three existing
case studies is actually laid out (typography, spacing, section order, how
the image gallery is presented) and match it as closely as possible — don't
freestyle the layout, mirror what's already there.

## Home page card (grid item)

- **Title:** Solaris
- **Description (one line):** Mobile app design and development for a rhythm-based vitamin and supplement tracker.
- **Cover image:** `home-dashboard.png` (see Assets below)

## Case study page copy

**Eyebrow tag:**
Mobile App Design & Development · Lead Product Designer · 3 Weeks

**Title (H1):**
Solaris

**Subhead:**
A mobile wellness app that times vitamin and supplement intake to the rhythm of your day, and keeps your home cabinet stocked along the way.

**The Problem**
Generic vitamin trackers treat every dose the same, ignoring that supplements land differently depending on when in the day you take them — and they say nothing about what's left in the cabinet, so well-intentioned routines quietly break down the moment a bottle runs dry.

**The Solution**
A mobile app built around three daily anchors — dawn, midday, and dusk — that ties each supplement to the part of the day it actually belongs to, backed by a home dashboard for quick daily check-ins and a pantry tracker that flags servings, cost per serving, and depletion before you run out.

**Process**
Starting from an existing "Organic" design system handoff, I built out the full product surface — onboarding, home dashboard, schedule builder, pantry tracker, and profile — auditing the handed-off color tokens for WCAG 2.2 AA contrast and layering in mobile accessibility (focus traps, 44×44px touch targets, reduced-motion support), then packaged the finished web app as a native iOS shell via Capacitor for App Store distribution.

**Image gallery (in this order):**
1. `home-dashboard.png` — Home dashboard, live app capture
2. `schedule-screen.png` — Schedule builder, dawn/midday/dusk stack, live app capture
3. `pantry-screen.png` — Pantry tracker with depletion states, live app capture
4. `solaris-app-icon-1024.png` — app icon / brand mark
5. `solaris-mascot.png` — in-app mascot character

## Assets

All five image files live in the `josephtbrookswork-rgb/first-pr-practice`
GitHub repo, on branch `claude/handoff-task-cc3w5m`, at:

```
docs/solaris-case-study/assets/home-dashboard.png
docs/solaris-case-study/assets/schedule-screen.png
docs/solaris-case-study/assets/pantry-screen.png
docs/solaris-case-study/assets/solaris-app-icon-1024.png
docs/solaris-case-study/assets/solaris-mascot.png
```

Pull them from there (clone/fetch the repo, or fetch the raw file URLs) and
upload each into Framer's asset library before placing them in the gallery.

## Definition of done

- New Solaris card appears in the home page project grid, matching the
  existing cards' styling.
- New case study page exists with all copy above in the right sections, in
  the same visual structure/typography as the other three case studies.
- All five images are placed per the gallery order above, sized/cropped
  consistently with how the other case studies present their galleries.
- Links from the home grid card to the case study page work.
