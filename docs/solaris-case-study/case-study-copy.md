# Solaris — case study copy for portfolio

Matches the structure used by Fresh Fare Farms, Future Funds, and Ludwitt Academy
on most-click-792330.framer.app: eyebrow tag → title → subhead → The Problem →
The Solution → Process → image gallery.

---

## Home page card (grid item)

**Title:** Solaris
**Description (one line):** Mobile app design and development for a rhythm-based vitamin and supplement tracker.
**Cover image:** `assets/home-dashboard.png`

---

## Case study page

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

**Image gallery:**
1. `assets/home-dashboard.png` — Home dashboard (live capture, phone viewport)
2. `assets/schedule-screen.png` — Schedule builder, dawn/midday/dusk stack (live capture)
3. `assets/pantry-screen.png` — Pantry tracker with depletion states (live capture)
4. `assets/solaris-app-icon-1024.png` — app icon / brand mark (multivitamin capsule character)
5. `assets/solaris-mascot.png` — in-app mascot character (multivitamin capsule)

---

## Screenshots — status: done

Live captures of the running app (React + Vite dev server, phone viewport
390×844, seeded with realistic sample data) are in `assets/`:

- `home-dashboard.png` — morning greeting, check-in card, taken-today/UV stats, today's stack
- `schedule-screen.png` — dawn/midday/dusk schedule builder
- `pantry-screen.png` — pantry tracker with cost-per-serving and depletion badges

All five gallery assets are ready to drop into Framer — nothing outstanding.
