# HabitFlow — Build Checklist

> **Brand**: "Spotify Light Mode" · **Font**: Lexend · **Primary**: #1DB954 · **Gold**: #FFD700 · **Stack**: React + Vite, Framer Motion, Dexie.js (IndexedDB), Netlify

---

## 0. Foundation & Infrastructure
- [x] Project scaffolding (Vite + React)
- [x] `package.json` with dependencies
- [x] `.gitignore`
- [x] GitHub repo created & pushed
- [x] `netlify.toml` (SPA redirect, build command, caching headers)
- [x] `public/manifest.webmanifest` (PWA manifest)
- [x] Design System CSS (`src/index.css`) — full token set
- [x] Dexie database schema (`src/db.js`) — full tables + helpers + XP engine
- [x] Seed data module (`src/data/seedData.js`) — pre-populated routines + history
- [x] App shell & router (`src/App.jsx`) — page routing + onboarding gate
- [x] Bottom navigation bar component
- [x] Shared UI primitives (Button, Card, ProgressBar, Toggle, Chip, BottomSheet) — in index.css
- [x] Icon component (`src/components/Icon.jsx`)

---

## 1. Onboarding Flow (4 screens → Tutorial → Timeline)

### 1A. Welcome Screen
- [x] Hero illustration (lightning bolt + green wave)
- [x] "Build Momentum, One Step at a Time." headline
- [x] "No sign-ups. No walls. Just flow." subtitle
- [x] "Let's Begin" pill button → navigates to Waking Window
- [x] Fade-in entrance animation

### 1B. Waking Window Screen
- [x] Progress bar (step 1 of 4)
- [x] Back arrow + "HABITFLOW" wordmark + "Skip" link
- [x] "When does your day start?" headline
- [x] Wake-up time picker (hour:minute + AM/PM toggle)
- [x] Sleep time picker (hour:minute + AM/PM toggle)
- [x] "Next" pill button → saves to IndexedDB, navigates to Day Division

### 1C. Day Division Screen
- [x] Progress bar (step 2 of 4)
- [x] "How do you want to divide your day?" headline
- [x] Standard Blocks option card (Morning, Work, Evening)
- [x] Islamic Preset option card (syncs with prayer times)
- [x] Islamic Preset expands to show location access prompt
- [x] "Continue" pill button → creates sections in IndexedDB

### 1D. Tutorial Intro Screen
- [x] Progress bar (step 3 of 4, ~80%)
- [x] "Experience the Flow" headline
- [x] Preview list of 3 tutorial tasks (Drink Water, Stretch, Smile)
- [x] "Try Tutorial" pill button → launches Focus Mode tutorial

### 1E. Tutorial Focus Mode (3 steps)
- [x] Focus Mode header ("FOCUS MODE" + close X)
- [x] "Tutorial: Step N" label + percentage
- [x] Green progress bar
- [x] Large task card with icon circle + massive task name
- [x] "SWIPE TO COMPLETE" hint text
- [x] Huge "DONE ✓" button (squishy press animation)
- [x] "Skip for now" text link
- [x] Task Completed celebration screen (checkmark burst + "+10 XP" badge)
- [x] "Next Task →" button
- [x] Advances through all 3 tutorial tasks

### 1F. Tutorial Complete / Routine Mastered Screen
- [x] Medal icon with confetti particles
- [x] "Routine Mastered!" headline
- [x] "⚡ 2X MULTIPLIER" gold badge
- [x] "TOTAL XP EARNED: 30 XP" card
- [x] "Go to Timeline →" pill button → marks onboarding done, routes to Timeline

---

## 2. Timeline / Home Page (Tab 1)

- [x] Top bar: avatar placeholder + "HabitFlow" wordmark + fire icon
- [x] Level card: "Level N" + XP progress bar + "X Day Streak" with fire icon
- [x] Vertical timeline with dot connector line
- [x] Section cards for each time block:
  - [x] Time chip (e.g. "07:00 AM")
  - [x] Section icon (sun/moon/leaf)
  - [x] Section name headline
  - [x] Task list preview (checkbox + task name)
  - [x] Active section gets green border glow + pulsing "Start [Section] Routine" button
- [x] Inactive/future sections shown muted
- [x] Completed sections show green checkmarks
- [x] Tap "Start Routine" → opens Focus Mode for that section

---

## 3. Focus Mode (Full-Screen Modal Overlay)

- [x] Close button (X) top-left
- [x] "FOCUS MODE" header
- [x] "STEP N OF M" counter
- [x] Green progress bar (fills as tasks complete)
- [x] Large task card:
  - [x] Icon in circle with subtle green halo
  - [x] Massive task name (Lexend 800 weight)
  - [x] "SWIPE TO COMPLETE" hint
- [x] Huge "DONE ✓" pill button (squishy scale-down on press)
- [x] "Skip for now" text link below
- [x] On DONE: confetti burst + haptic vibration + sound effect
- [x] Task Completed interstitial:
  - [x] Green checkmark circle
  - [x] "DONE!" headline
  - [x] "+10 XP" gold badge
  - [x] Floating confetti particles
  - [x] "Next Task →" button
- [x] After final task → Section Summary screen

---

## 4. Section Summary Screen

- [x] Medal/trophy icon
- [x] "Section Mastered!" headline
- [x] Section name subtitle
- [x] Total XP earned (big green number)
- [x] Bonus badges ("2x Perfect Combo", "+50 Early Bird")
- [x] "COMPLETED TASKS" list with checkmarks and XP per task
- [x] "Return to Timeline →" pill button

---

## 5. Routine Builder Page (Tab 2)

- [x] Page header: "Routine Builder" + "Design your ideal day, block by block."
- [x] Section groups (Morning ☀️, Work 🌱, Evening 🌙)
- [x] Task cards within each section:
  - [x] Drag handle (6-dot grip)
  - [x] Task icon
  - [x] Task name
  - [x] Duration chip (if set, e.g. "90m")
- [x] Quick-add input bar at bottom ("Add a habit..." + green "+" button)
- [x] Tap "+" opens New Habit bottom sheet
- [x] Tap on task card → opens edit bottom sheet

### 5A. New Habit Bottom Sheet (Task Creation)
- [x] Slide-up modal with drag handle
- [x] "New Habit" title + close X
- [x] "HABIT NAME" input field
- [x] "ICON" picker grid (10 icon options + "+" custom)
- [x] "PRIORITY" toggle (Mandatory / Optional)
- [x] "ESTIMATED TIME" chips (5m, 15m, 30m, 1h+)
- [x] "Save Habit" pill button → saves to IndexedDB under current section

---

## 6. Stats & XP Dashboard Page (Tab 3)

- [x] Top bar showing "Level N" + total XP
- [x] Hero card:
  - [x] Star trophy icon
  - [x] "TOTAL LIFETIME XP" label
  - [x] Giant XP number
  - [x] "Level N [Title]" (e.g. "Routine Master")
  - [x] XP progress bar to next level
- [x] Streak banner (gold/yellow):
  - [x] Fire icon + "N Day Streak" + motivational text
- [x] 2×2 Metric grid:
  - [x] Tasks Completed (✓ icon + count)
  - [x] Sections Completed (list icon + count)
  - [x] Morning Streak (sun icon + days)
  - [x] Evening Streak (moon icon + days)
- [x] Achievements section:
  - [x] "2x Perfect Section" entries with gold star + "+100 XP" chip
  - [x] Section name + date

---

## 7. Settings Page (Tab 4)

- [x] "← Settings" header
- [x] **ROUTINE SCHEDULE** group:
  - [x] Waking Window row (shows times, edit pencil icon)
  - [x] Day Division row (shows "Custom" or "Islamic", chevron)
- [x] **EXPERIENCE** group:
  - [x] Haptic Feedback toggle
  - [x] Sound Effects toggle
- [x] **LOCATION & DATA** group:
  - [x] Geolocation toggle (for prayer times)
  - [x] Current City display + refresh icon
  - [x] "Backup my data" button
- [x] **ABOUT** group:
  - [x] Version number
  - [x] Privacy Policy link
  - [x] Terms of Service link

---

## 8. Data Layer (IndexedDB via Dexie)

- [x] `settings` store: waketime, sleeptime, dayDivision, haptics, sounds, geo, city, onboardingComplete
- [x] `sections` store: id, name, icon, startTime, endTime, order
- [x] `tasks` store: id, sectionId, title, icon, isMandatory, durationMinutes, order
- [x] `history` store: id, date, taskId, sectionId, completedAt, skipped, xpEarned
- [x] `achievements` store (bonus): type, sectionId, date, xpBonus
- [x] Seed data: pre-populate Morning/Work/Evening sections with sample tasks
- [x] Historical seed data: 15 days of simulated completion history
- [x] XP calculation engine (10 XP per task, 2x multiplier for perfect sections)
- [x] Level thresholds (25 levels with titles)

---

## 9. Polish & PWA

- [x] Haptic feedback on DONE button (navigator.vibrate)
- [x] Confetti animation (canvas-confetti)
- [x] Framer Motion page transitions
- [x] Staggered list animations
- [x] Squishy button press animations
- [x] `@media (prefers-reduced-motion: reduce)` support
- [x] Meta tags + Open Graph
- [x] PWA manifest
- [ ] PWA icons (192x192, 512x512) — placeholder needed
- [ ] Service worker — optional enhancement

---

## 10. Final Push

- [x] All pages functional
- [x] Data persists across reloads (IndexedDB)
- [x] App populated with realistic local seed data
- [ ] Git commit + push to GitHub
- [ ] Netlify build succeeds
