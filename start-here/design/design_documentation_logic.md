# Design Documentation: Sectional Habit Tracker (V2)

## 1. Overview
The **Sectional Habit Tracker** is designed as a "High-Dopamine Velocity" experience. The core design philosophy, inspired by "Spotify Light Mode," focuses on high contrast, vibrant green accents (#1DB954), and tactile feedback to reduce cognitive load and turn routine completion into a rewarding game.

---

## 2. Design System: High-Dopamine Velocity
- **Typography:** Lexend (clean, modern, and highly legible).
- **Primary Color:** #1DB954 (Vibrant Green) - used for success actions and focus.
- **Background:** #FFFFFF (Pure White) for a clean, non-distracting canvas.
- **Interactions:** Heavy use of rounded corners (ROUND_EIGHT), subtle shadows for depth, and intent-based animations.

---

## 3. Screen-by-Screen Breakdown

### A. Onboarding Flow (Zero-Friction)
The goal is to get users into the app value as quickly as possible without accounts.
- **Welcome ({{DATA:SCREEN:SCREEN_11}}):** Sets the high-energy tone.
- **Waking Window ({{DATA:SCREEN:SCREEN_16}}):** Establages the boundaries of the user's day.
- **Day Division ({{DATA:SCREEN:SCREEN_25}}):** Allows choosing between custom blocks or the geolocation-based Islamic Preset.
- **Tutorial Intro ({{DATA:SCREEN:SCREEN_7}}):** Previews the "Shepherding" experience.

### B. The "Shepherding" Experience (Core Loop)
This flow guides users through tasks one at a time to combat "ADHD paralysis."
- **Timeline / Home ({{DATA:SCREEN:SCREEN_24}}):** The daily dashboard showing the active routine block and a prominent "Start" button.
- **Focus Mode ({{DATA:SCREEN:SCREEN_26}}):** An immersive, full-screen view. It removes all distractions, showing only one massive task card and a "DONE" button.
- **Tutorial Flow ({{DATA:SCREEN:SCREEN_6}}, {{DATA:SCREEN:SCREEN_27}}, {{DATA:SCREEN:SCREEN_2}}, {{DATA:SCREEN:SCREEN_32}}):** A 3-step mandatory walkthrough ("Drink Water", "Stretch", "Smile") to immediately trigger the dopamine-hit checkmark animation.

### C. Task & Section Management
- **Routine Builder ({{DATA:SCREEN:SCREEN_9}}):** A tactile space for brain-dumping tasks. Features drag-and-drop handles for reordering.
- **Task Creation ({{DATA:SCREEN:SCREEN_29}}):** A sliding bottom sheet for adding icons, setting mandatory/optional status, and timing.
- **Manage Sections ({{DATA:SCREEN:SCREEN_30}}) & Divide Waking Hours ({{DATA:SCREEN:SCREEN_22}}):** Screens for structural day planning, allowing users to stretch and move time blocks.

### D. Success & Gamification
- **Task Completed! ({{DATA:SCREEN:SCREEN_17}}):** The "Aha!" moment screen with explosive success indicators.
- **Section Summary ({{DATA:SCREEN:SCREEN_4}}):** Recaps earned XP and highlights the 2x Multiplier for perfect (no-skip) sections.
- **Stats & XP Dashboard ({{DATA:SCREEN:SCREEN_18}}):** A high-visibility progress center showing level-ups, streaks, and achievement badges.

### E. Configuration & Utility
- **Settings ({{DATA:SCREEN:SCREEN_20}}):** Central hub for toggling haptics, sounds, and geolocation.
- **Geolocation Flow ({{DATA:SCREEN:SCREEN_15}}, {{DATA:SCREEN:SCREEN_12}}):** Permission and manual search screens for location-based timing accuracy.

---

## 4. User Journey Happy Path
1. **Setup:** Onboarding establishes the schedule.
2. **Action:** User taps "Start Routine" on the Timeline.
3. **Execution:** User is shepherded through Focus Mode cards.
4. **Reward:** User receives haptic buzz, visual confetti, and XP.
5. **Review:** Stats dashboard reinforces the habit loop through streaks.