Product Requirements Document: Sectional Habit Tracker (V2)
1. Context & Scope
Elevator Pitch: A totally free, mobile-first web app that helps users build highly granular routines by dividing their day into custom sections. Instead of passive checklists, the app actively "shepherds" users through their routines one step at a time, relying on highly satisfying, dopamine-inducing animations to build momentum.
Product Type: New Product.
KPIs: 10,000 MAU, 40% D7 Retention, 80% Routine Completion.

2. User Personas
The End User: Individuals seeking structure (ADHD, productivity enthusiasts, practicing Muslims).
The Admin: Internal staff managing preset routines.

3. Functional Requirements
3.1 Zero-Friction Onboarding: No sign-up. IndexedDB storage. Define waking window, choose Day Division (Custom or Islamic), auto-populate starter routine.
3.2 Core Workflow (Shepherding): Triggered by "Start Routine". One large task card at a time. "DONE" button triggers haptics, sound, and confetti. 10 XP per task. 2x multiplier for perfect sections.
3.3 Settings: Edit hours, toggle haptics/sounds, geolocation for prayer times.
3.4 Notifications: Web Push for section starts.
3.5 Routine Builder: "Brain Dump" sticky input. Drag-and-drop sequencing across vertical containers. Single-tap for task settings (icon, mandatory/optional, time).

4. Monetization
100% Free.

5. Information Architecture
Navigation: Timeline (Home) | Builder | Stats & XP | Settings

6. Page Breakdown
Timeline: Vertical timeline, current level/streak, pulsing "Start" button for active block.
Focus Mode: Full-screen modal, progress bar, massive task typography, huge "DONE" button, swipe to skip.
Routine Builder: Draggable cards, quick-add bar, section blocks.
Stats & XP: Hero card with Level/XP, Streak banner, 2x2 metric grid, multiplier log.

9. Design System
Vibe: "Spotify Light Mode".
Colors: #FFFFFF bg, #1DB954 primary success, #121212 text, #FFD700 multiplier.
Motion: Framer Motion/Lottie. High-quality transitions and haptic feedback.

10. Technical
Stack: React/Next.js, Framer Motion, IndexedDB (Dexie.js), Vercel.
APIs: Aladhan API for prayer times.