# **Product Requirements Document: Sectional Habit Tracker (V2)**

## **1\. Context & Scope (Essential)**

**1.1 Executive Summary**

* **Elevator Pitch:** A totally free, mobile-first web app that helps users build highly granular routines by dividing their day into custom sections. Instead of passive checklists, the app actively "shepherds" users through their routines one step at a time, relying on highly satisfying, dopamine-inducing animations to build momentum.  
* **Product Type:** New Product.  
* **KPIs:** \* 10,000 Monthly Active Users (MAUs).  
  * 40% Day-7 Retention Rate.  
  * 80% Routine Completion Rate (tracking how often a user finishes a shepherded routine once started).

**1.2 Problem Statement**

* **Pain Point:** Traditional habit trackers present users with overwhelming walls of tasks tied to arbitrary times, and usually force a sign-up wall before the user even sees value. When people have "ADHD paralysis" or low motivation, looking at 15 morning tasks causes them to abandon the app entirely.  
* **Consequence:** Users fail to build habits because the cognitive load of *remembering what to do next* and *deciding to do it* is too high.  
* **Current Workarounds:** Clunky to-do lists, sticky notes, or trying to hold a 15-step morning routine entirely in working memory.

**1.3 Value Proposition**

* **Solution:** We organize the day into flexible sections (Morning, Work, Evening) with **zero barrier to entry**. No sign-up required. When a section begins, the user presses "Start" and is shown *only one task at a time*. The app guides them step-by-step.  
* **The "Aha\!" Moment:** When the user taps a massive, colorful "Done" button on a micro-task (like "Put on deodorant"), feels a haptic buzz, sees a beautiful animated checkmark explode with color, and is instantly served the very next micro-task.

## **2\. User Personas & Roles (Essential)**

**2.1 The Personas**

* **The End User:** Individuals seeking structure, ranging from productivity enthusiasts to users with ADHD, and practicing Muslims wanting to structure days dynamically around Salah.  
* **The Admin:** Internal staff managing the app and the global library of preset routines.

**2.2 Role-Based Access Control (RBAC)**

* **Roles:** Standard User (Local-First).  
* **Permissions:** All features are unlocked for all Standard Users (100% Free model, zero accounts required).

## **3\. User Stories & Functional Requirements (Essential)**

**3.1 Zero-Friction Onboarding (No Sign-Up)**

* **Entry:** User opens the web app and immediately starts onboarding. No email, no passwords, no Google Auth. Data is stored entirely locally on their device via IndexedDB.  
* **Onboarding Flow:** 1\. Define waking window (e.g., 6:00 AM to 10:00 PM). 2\. Choose Day Division: Custom Sections or Islamic Preset (requests Geolocation permission here; if denied, asks for text input of City/Country). 3\. The app auto-populates a "Starter Routine" (e.g., a 5-step Morning) to guarantee immediate interaction.  
* **Tutorial:** A mandatory 3-step interactive "dummy" routine right after setup to immediately let them feel the checkmark animation and haptic feedback.

**3.2 Core Workflow (The "Shepherding" Happy Path)**

* **Trigger:** User opens the app and sees the current active section (e.g., "Morning") with a prominent "Start Routine" button.  
* **Inputs (Focus Mode):**  
  * The screen clears. A large card appears in the center: "Go to toilet".  
  * User completes real-world action, taps a massive "DONE" button.  
* **Processing:** \* App triggers success sound, haptic vibration, and a rich, saturated UI animation (e.g., green confetti, checkmark drawing itself).  
  * Local engine logs **10 Points (XP)** for the completed task.  
  * UI immediately slides the next card into view: "Go wash hands".  
* **Output:** The user is seamlessly carried through micro-habits until the routine is complete. If the user finished the *entire* section without skipping a single habit (mandatory or optional), a **2x Point Multiplier** is applied to that section's score during the final "Section Mastered\!" summary screen.

**3.3 Settings & Configuration**

* **User Settings:** Edit waking hours, toggle haptics/sound effects, adjust geolocation/city for dynamic presets. Account creation/Cloud Sync is an *optional* setting hidden here if they ever want to back up their data.

**3.4 Notifications**

* **Triggers:** Start of a new daily section.  
* **Delivery:** Native Web Push notifications ("Your Evening block has started. Tap to begin your wind-down routine.").

## **3.5 Habit Creation & Routine Structuring Journey (Deep Dive)**

To make highly granular routines (15+ steps) easy to build, the app requires a specialized, tactile "Builder Mode". The goal is to let users brain-dump tasks rapidly and then organize them with zero friction.  
**Phase 1: The Brain Dump (Quick Add)**

* **UX Goal:** Allow users to add 10 habits in 10 seconds without navigating through multiple menus.  
* **Feature:** A sticky input bar at the bottom of the Builder screen. The user types "Wash face" \-\> hits *Enter* \-\> it instantly drops onto the canvas as a new card. They type "Brush teeth" \-\> hits *Enter*.  
* **Smart Library:** As they type, an auto-suggest drawer pops up with pre-made, icon-equipped habits (e.g., typing "Drin..." suggests "💧 Drink a glass of water"). Tapping a suggestion instantly adds it.

**Phase 2: Structuring & Sequencing (The Drag-and-Drop Canvas)**

* **UX Goal:** Make moving tasks between sections and reordering them feel like arranging physical cards on a desk.  
* **Feature:** The screen displays daily sections (Morning, Work, Evening) as distinct vertical containers.  
* **Interaction:** \* Every habit card has a prominent "grab handle" (six dots icon).  
  * The user long-presses a card, it slightly enlarges and detaches from the list with a light haptic "pop".  
  * They can drag it up and down to reorder the sequence within a section (e.g., putting "Make Coffee" before "Read Book").  
  * They can drag it *across* sections (e.g., moving "Take Vitamins" from Morning to Evening). The target container highlights in a bright accent color when hovered.

**Phase 3: Dialing It In (Micro-Task Settings)**

* **UX Goal:** Allow users to customize how each specific task behaves during the "Focus Mode" shepherding process.  
* **Interaction:** Tapping once on any habit card opens a sliding bottom-sheet menu for deep customization:  
  * **Icon Selector:** A grid of colorful Phosphor/Emoji icons to give the task visual weight in Focus Mode.  
  * **Mandatory vs. Optional Toggle:** \* *Mandatory:* The user MUST click "Done" to proceed in Focus Mode.  
    * *Optional:* In Focus Mode, the user can swipe this card left to "Skip" it without breaking their streak or failing the routine.  
  * **Estimated Time (Optional):** Add a label like "5 mins" so the system can calculate that the whole Morning routine will take 25 minutes.  
  * **Action Button:** "Delete Habit" (requires double-tap confirmation to prevent accidental loss).

## **4\. Monetization & Billing (Essential for SaaS)**

**4.1 Pricing Model**

* **100% Free:** There is no paywall, no premium tiers, and no credit card required.  
* *(Future monetization could include optional tips/donations or cosmetic skins, but MVP is strictly free).*

## **5\. Site Map & Information Architecture (Essential)**

**5.1 Global Navigation**

* **Layout:** Bottom Tab Navigation.  
* **Menu Items:** 1\. Timeline (Home) | 2\. Builder | 3\. Stats & XP | 4\. Settings

## **6\. Page-by-Page Component Breakdown (Essential)**

**Page: Timeline (Dashboard / Home)**

* **Goal:** Show the user where they are in their day and prompt them to start their active routine.  
* **Layout:** Vertical timeline with saturated accent colors.  
* **Components:**  
  * **Top Bar:** Current Level (XP) and Current Day Streak.  
  * **Active Block:** The current section (e.g., "Morning") is highlighted. Contains a massive, pulsing "Start Morning Routine" button.  
  * **Future Blocks:** Grayed out/muted below the active block.  
  * **Past Blocks:** Show a summary of earned XP and completion status.

**Page: The "Focus Mode" (Active Routine Execution)**

* **Goal:** Guide the user through micro-tasks with maximum dopamine and zero distractions.  
* **Layout:** Full-screen immersive modal. No bottom navigation.  
* **Components:**  
  * **Progress Bar:** A thick, bright green bar across the top showing Step 4 of 15\.  
  * **Task Card:** Dead center, massive typography (e.g., "Brush Teeth").  
  * **Primary Action:** A huge "DONE" button at the bottom (thumb-friendly). (+10 Points).  
  * **Secondary Actions:** Swipe left to "Skip" optional tasks. (Forfeits the 2x Section Multiplier).  
  * **Animations:** *Critical requirement.* Use Framer Motion/Lottie. Buttons must physically "press" down. Checkmarks must be explosive and satisfying.

**Page: Routine Builder (See Section 3.5 for Logic)**

* **Goal:** Let users brain-dump and organize their micro-steps.  
* **Layout:** Vertical list of sections containing draggable cards.  
* **Components:**  
  * **Quick-Add Input Bar:** Sticky at the bottom.  
  * **Section Containers:** Visually distinct blocks (Morning, Afternoon, etc.).  
  * **Draggable Cards:** Individual habits.

**Page: Stats, XP & Analytics**

* **Goal:** Display the simple XP gamification system and robust tracking metrics.  
* **Layout:** A bright dashboard with chunky, readable stat cards.  
* **Components:**  
  * **The "Hero" Gamification Card:** Shows Total Lifetime Points (XP) and current user "Level" (e.g., Level 5 Routine Master).  
  * **Daily Streak Banner:** Highlights consecutive days where *at least one section* was completed. Includes a fire icon.  
  * **Completion Metrics Grid (2x2):**  
    * *Tasks Completed:* Lifetime total count of individual micro-habits checked off.  
    * *Sections Completed:* Lifetime total count of full sections fully executed.  
    * *Section Streaks:* Tracks consecutive days a *specific* section has been completed (e.g., "Morning Streak: 12 Days", "Evening Streak: 3 Days").  
  * **Perfect Routine Multiplier Log:** A fun chart or badge list showing how many times the user achieved the "2x Perfect Section Multiplier" by not skipping any tasks.

## **7\. Technical Requirements (Essential)**

**7.1 Stack Preferences**

* **Frontend:** React (Next.js) or Vite \+ React.  
* **Animation Library:** Framer Motion (for page transitions, drag-and-drop, and card swipes) \+ Lottie (for complex checkmarks).  
* **Database (Primary):** IndexedDB (via localForage or Dexie.js) for 100% local, offline-first data storage.  
* **Hosting:** Vercel.

**7.2 Performance & Reliability**

* **Connectivity:** Fully functional offline. API calls are only needed for initial Geolocation/Aladhan API setup.  
* **Responsiveness:** Must feel like a native mobile app. Drag-and-drop must run at 60fps.

**7.3 Integrations & APIs**

* **Dynamic Islamic Preset:** Aladhan API (https://aladhan.com/prayer-times-api).  
* **Geolocation Fallback:** Google Maps Geocoding API or Mapbox API.

## **8\. Data & Analytics (Local Gamification Engine)**

**8.1 Tracking Models (IndexedDB)** The local database must distinctly track the following arrays/objects to power the Stats page:

* Tasks: Boolean completion state per task \+ 10 XP logged per true state.  
* Sections: Boolean completion state. Marked true when the Focus Mode sequence is finished.  
* Perfect\_Sections: Boolean flag attached to the Section completion event. True if 0 skips were recorded, triggering a recalculation of the section's XP (Base XP \* 2).  
* Streaks: Evaluated locally on load. Requires a simple script to check the last active timestamp for both Global Daily Streaks and Specific Section Streaks.

**8.2 Internal Events (Anonymous)**

* Track Routine\_Started and Routine\_Completed.  
* Track Micro\_Task\_Completed vs Micro\_Task\_Skipped.  
* *(Must be explicitly anonymized since there are no user accounts).*

## **9\. Design System & UI Rules (Optional)**

* **Vibe:** "Spotify Light Mode" — clean, bright, highly legible.  
* **Colors:** \* Background: \#FFFFFF.  
  * Primary Success (The Dopamine Color): \#1DB954 (Vibrant Green).  
  * Typography: \#121212 (Near black for maximum contrast).  
  * Multiplier Accent: Gold/Yellow (\#FFD700) to signify a 2x Perfect Routine.  
* **Motion Design Rules:** Nothing should appear instantly. Modals slide up. Checked items slide off-screen playfully. The drag-and-drop physics should feel heavy and tactile. Haptics (navigator.vibrate) MUST fire on every task completion and list re-order.

## **10\. Roadmap & Phasing (Essential)**

**10.1 MVP (Phase 1\)**

* Local Storage Engine (IndexedDB setup).  
* Dynamic timeline based on user-defined times OR the Aladhan API integration.  
* The Routine Builder (Brain dump \+ drag-and-drop logic).  
* **The Focus Mode Execution Engine** (The full-screen, shepherding UI with high-quality Framer Motion animations).  
* Gamification engine: 10 points per task, 2x section multiplier, task/section tracking, and daily/section streaks.

**10.2 V2 (Future)**

* Optional Account Creation (Supabase Cloud Sync).  
* Social accountability (share streaks/levels with friends).  
* Pre-made celebrity/expert routines (e.g., "The Huberman Morning").