import { db, setSetting } from '../db';

// Icon keys matching lucide-react icon names
export const TASK_ICONS = [
  'droplets', 'smartphone', 'dumbbell', 'person-standing', 'utensils',
  'bed', 'book-open', 'coffee', 'brain', 'smile',
  'sun', 'moon', 'heart', 'music', 'pencil',
];

export const SECTION_ICONS = {
  morning: 'sunrise',
  work: 'sprout',
  afternoon: 'sun',
  evening: 'moon',
  fajr: 'sunrise',
  dhuhr: 'sun',
  asr: 'cloud-sun',
  maghrib: 'sunset',
  isha: 'moon',
};

export const DEFAULT_SECTIONS = [
  { name: 'Morning', icon: 'sunrise', startTime: '06:00', endTime: '09:00', order: 0 },
  { name: 'Deep Work', icon: 'sprout', startTime: '09:00', endTime: '13:00', order: 1 },
  { name: 'Afternoon', icon: 'sun', startTime: '13:00', endTime: '17:00', order: 2 },
  { name: 'Evening', icon: 'moon', startTime: '17:00', endTime: '22:00', order: 3 },
];

export const DEFAULT_TASKS = {
  'Morning': [
    { title: 'Hydrate (500ml)', icon: 'droplets', isMandatory: true, durationMinutes: 2, order: 0 },
    { title: 'Stretch', icon: 'person-standing', isMandatory: true, durationMinutes: 10, order: 1 },
    { title: 'Make Coffee', icon: 'coffee', isMandatory: false, durationMinutes: 5, order: 2 },
    { title: 'Review Daily Goals', icon: 'pencil', isMandatory: true, durationMinutes: 5, order: 3 },
    { title: 'Read 10 Pages', icon: 'book-open', isMandatory: false, durationMinutes: 15, order: 4 },
  ],
  'Deep Work': [
    { title: 'Clear Inbox', icon: 'smartphone', isMandatory: true, durationMinutes: 15, order: 0 },
    { title: 'Deep Work Block', icon: 'brain', isMandatory: true, durationMinutes: 90, order: 1 },
    { title: 'Code Review', icon: 'pencil', isMandatory: false, durationMinutes: 30, order: 2 },
  ],
  'Afternoon': [
    { title: 'Walk Outside', icon: 'person-standing', isMandatory: true, durationMinutes: 20, order: 0 },
    { title: 'Healthy Lunch', icon: 'utensils', isMandatory: true, durationMinutes: 30, order: 1 },
    { title: 'Music Break', icon: 'music', isMandatory: false, durationMinutes: 10, order: 2 },
  ],
  'Evening': [
    { title: 'Workout', icon: 'dumbbell', isMandatory: true, durationMinutes: 45, order: 0 },
    { title: 'Journal', icon: 'pencil', isMandatory: false, durationMinutes: 10, order: 1 },
    { title: 'Screens Off', icon: 'smartphone', isMandatory: true, durationMinutes: 0, order: 2 },
    { title: 'Gratitude', icon: 'heart', isMandatory: false, durationMinutes: 5, order: 3 },
  ],
};

// Islamic section tasks — habits clustered around each salah
export const ISLAMIC_TASKS = {
  'Fajr': [
    { title: 'Pray Fajr', icon: 'sunrise', isMandatory: true, durationMinutes: 10, order: 0 },
    { title: 'Morning Adhkar', icon: 'book-open', isMandatory: true, durationMinutes: 10, order: 1 },
    { title: 'Quran Recitation', icon: 'book-open', isMandatory: true, durationMinutes: 15, order: 2 },
    { title: 'Hydrate', icon: 'droplets', isMandatory: false, durationMinutes: 2, order: 3 },
  ],
  'Dhuhr': [
    { title: 'Pray Dhuhr', icon: 'sun', isMandatory: true, durationMinutes: 10, order: 0 },
    { title: 'Dhikr', icon: 'heart', isMandatory: false, durationMinutes: 5, order: 1 },
    { title: 'Healthy Lunch', icon: 'utensils', isMandatory: false, durationMinutes: 30, order: 2 },
  ],
  'Asr': [
    { title: 'Pray Asr', icon: 'cloud-sun', isMandatory: true, durationMinutes: 10, order: 0 },
    { title: 'Evening Adhkar', icon: 'book-open', isMandatory: true, durationMinutes: 10, order: 1 },
    { title: 'Exercise', icon: 'dumbbell', isMandatory: false, durationMinutes: 30, order: 2 },
  ],
  'Maghrib': [
    { title: 'Pray Maghrib', icon: 'sunset', isMandatory: true, durationMinutes: 10, order: 0 },
    { title: 'Family Time', icon: 'heart', isMandatory: false, durationMinutes: 30, order: 1 },
    { title: 'Quran Study', icon: 'book-open', isMandatory: false, durationMinutes: 20, order: 2 },
  ],
  'Isha': [
    { title: 'Pray Isha', icon: 'moon', isMandatory: true, durationMinutes: 10, order: 0 },
    { title: 'Night Adhkar', icon: 'book-open', isMandatory: true, durationMinutes: 10, order: 1 },
    { title: 'Reflect & Journal', icon: 'pencil', isMandatory: false, durationMinutes: 10, order: 2 },
    { title: 'Prepare for Sleep', icon: 'bed', isMandatory: false, durationMinutes: 5, order: 3 },
  ],
};

// Seed the database after onboarding day division selection
export async function seedStandardSections() {
  await db.sections.clear();
  await db.tasks.clear();

  for (const section of DEFAULT_SECTIONS) {
    const sectionId = await db.sections.add({ ...section });
    const tasks = DEFAULT_TASKS[section.name] || [];
    for (const task of tasks) {
      await db.tasks.add({ ...task, sectionId });
    }
  }
}

// Seed Custom sections
export async function seedCustomSections(customSections) {
  await db.sections.clear();
  await db.tasks.clear();

  let isFirst = true;
  for (const section of customSections) {
    const sectionId = await db.sections.add({ ...section });

    // Add a minimal starter routine to the very first custom section
    if (isFirst) {
      const starterTasks = [
        { title: 'Hydrate', icon: 'droplets', isMandatory: true, durationMinutes: 2, order: 0 },
        { title: 'Review Goals', icon: 'pencil', isMandatory: false, durationMinutes: 5, order: 1 }
      ];
      for (const task of starterTasks) {
        await db.tasks.add({ ...task, sectionId });
      }
      isFirst = false;
    }
  }
}

// Seed Islamic sections from prayer times
export async function seedIslamicSections(islamicSections) {
  await db.sections.clear();
  await db.tasks.clear();

  for (const section of islamicSections) {
    const sectionId = await db.sections.add({ ...section });
    const tasks = ISLAMIC_TASKS[section.name] || [];
    for (const task of tasks) {
      await db.tasks.add({ ...task, sectionId });
    }
  }
}

// All possible achievements — unlocked ones have a date, locked ones are grayed out
export const ALL_ACHIEVEMENTS = [
  { id: 'first_routine', title: 'First Steps', description: 'Complete your first routine', icon: 'zap', xpBonus: 50 },
  { id: 'perfect_section', title: 'Perfect Section', description: 'Complete all tasks in a section without skipping', icon: 'star', xpBonus: 100 },
  { id: 'streak_3', title: '3-Day Streak', description: 'Use HabitFlow 3 days in a row', icon: 'flame', xpBonus: 75 },
  { id: 'streak_7', title: 'Week Warrior', description: 'Use HabitFlow 7 days in a row', icon: 'flame', xpBonus: 150 },
  { id: 'streak_14', title: 'Fortnight Force', description: '14-day streak achieved', icon: 'flame', xpBonus: 300 },
  { id: 'streak_30', title: 'Monthly Master', description: '30-day streak — unstoppable!', icon: 'flame', xpBonus: 500 },
  { id: 'tasks_50', title: 'Half Century', description: 'Complete 50 total tasks', icon: 'check-circle', xpBonus: 100 },
  { id: 'tasks_100', title: 'Centurion', description: 'Complete 100 total tasks', icon: 'check-circle', xpBonus: 200 },
  { id: 'tasks_500', title: 'Habit Machine', description: 'Complete 500 total tasks', icon: 'check-circle', xpBonus: 500 },
  { id: 'early_bird', title: 'Early Bird', description: 'Complete a morning routine before 7:00 AM', icon: 'sunrise', xpBonus: 75 },
  { id: 'night_owl', title: 'Night Owl', description: 'Complete an evening routine after 9:00 PM', icon: 'moon', xpBonus: 75 },
  { id: 'builder_pro', title: 'Builder Pro', description: 'Create 10 custom habits', icon: 'pencil', xpBonus: 100 },
  { id: 'section_master', title: 'Section Master', description: 'Complete 5 perfect sections', icon: 'award', xpBonus: 250 },
  { id: 'level_5', title: 'Rising Star', description: 'Reach Level 5', icon: 'star', xpBonus: 200 },
  { id: 'level_10', title: 'Veteran', description: 'Reach Level 10', icon: 'star', xpBonus: 400 },
  { id: 'xp_1000', title: 'XP Collector', description: 'Earn 1,000 total XP', icon: 'zap', xpBonus: 100 },
  { id: 'xp_5000', title: 'XP Hoarder', description: 'Earn 5,000 total XP', icon: 'zap', xpBonus: 300 },
];

// Tutorial tasks (used in onboarding flow)
export const TUTORIAL_TASKS = [
  { title: 'Drink Water', icon: 'droplets', description: 'Stay hydrated to keep your energy levels high.' },
  { title: 'Stretch', icon: 'person-standing', description: 'Wake up those muscles.' },
  { title: 'Smile', icon: 'smile', description: 'Lock in the good vibes.' },
];
