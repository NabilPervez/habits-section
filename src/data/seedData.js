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

// Seed the database after onboarding day division selection
export async function seedStandardSections() {
  // Clear existing data
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

// Seed with some historical data so the app looks populated
export async function seedHistoricalData() {
  const sections = await db.sections.toArray();
  const today = new Date();

  // Simulate last 15 days of history
  for (let daysAgo = 1; daysAgo <= 15; daysAgo++) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    const dateStr = date.toISOString().split('T')[0];

    for (const section of sections) {
      const tasks = await db.tasks.where('sectionId').equals(section.id).toArray();
      for (const task of tasks) {
        // 85% chance of completing each task
        const completed = Math.random() < 0.85;
        if (completed) {
          await db.history.add({
            date: dateStr,
            taskId: task.id,
            sectionId: section.id,
            completedAt: new Date(date.getTime() + Math.random() * 86400000).toISOString(),
            skipped: false,
            xpEarned: 10,
          });
        }
      }
    }
  }

  // Add some achievements
  if (sections.length > 0) {
    await db.achievements.bulkAdd([
      { type: 'perfect_section', sectionId: sections[0].id, date: new Date(today.getTime() - 86400000).toISOString().split('T')[0], xpBonus: 100 },
      { type: 'perfect_section', sectionId: sections[3]?.id || sections[0].id, date: new Date(today.getTime() - 172800000).toISOString().split('T')[0], xpBonus: 100 },
    ]);
  }
}

// Tutorial tasks (used in onboarding flow)
export const TUTORIAL_TASKS = [
  { title: 'Drink Water', icon: 'droplets', description: 'Stay hydrated to keep your energy levels high.' },
  { title: 'Stretch', icon: 'person-standing', description: 'Wake up those muscles.' },
  { title: 'Smile', icon: 'smile', description: 'Lock in the good vibes.' },
];
