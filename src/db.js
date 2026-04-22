import Dexie from 'dexie';

export const db = new Dexie('habitflow-db');

db.version(1).stores({
  settings: 'key',
  sections: '++id, name, order',
  tasks: '++id, sectionId, title, order',
  history: '++id, date, taskId, sectionId, completedAt',
  achievements: '++id, type, sectionId, date',
});

// --- Helper: Get a setting ---
export async function getSetting(key) {
  const row = await db.settings.get(key);
  return row ? row.value : null;
}

// --- Helper: Set a setting ---
export async function setSetting(key, value) {
  await db.settings.put({ key, value });
}

// --- Helper: Check if onboarding is complete ---
export async function isOnboardingComplete() {
  return (await getSetting('onboardingComplete')) === true;
}

// --- Helper: Get sections in order ---
export async function getSections() {
  return db.sections.orderBy('order').toArray();
}

// --- Helper: Get tasks for a section ---
export async function getTasksForSection(sectionId) {
  return db.tasks.where('sectionId').equals(sectionId).sortBy('order');
}

// --- Helper: Get all tasks ---
export async function getAllTasks() {
  return db.tasks.orderBy('order').toArray();
}

// --- Helper: Get today's history ---
export async function getTodayHistory() {
  const today = new Date().toISOString().split('T')[0];
  return db.history.where('date').equals(today).toArray();
}

// --- Helper: Record task completion ---
export async function completeTask(taskId, sectionId, skipped = false) {
  const today = new Date().toISOString().split('T')[0];
  const xpEarned = skipped ? 0 : 10;
  await db.history.add({
    date: today,
    taskId,
    sectionId,
    completedAt: new Date().toISOString(),
    skipped,
    xpEarned,
  });
  return xpEarned;
}

// --- XP Engine ---
export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800,
  4700, 5700, 6800, 8000, 9300, 10700, 12200, 13800, 15500, 17300,
  19200, 21200, 23300, 25500, 27800,
];

export const LEVEL_TITLES = [
  'Beginner', 'Starter', 'Learner', 'Builder', 'Achiever',
  'Warrior', 'Champion', 'Hero', 'Legend', 'Elite',
  'Master', 'Grandmaster', 'Sage', 'Titan', 'Immortal',
  'Ascended', 'Mythic', 'Cosmic', 'Transcendent', 'Godlike',
  'Routine Rookie', 'Routine Pro', 'Routine Expert', 'Routine Master', 'Routine Legend',
];

export function getLevelFromXP(totalXP) {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return level;
}

export function getLevelTitle(level) {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
}

export function getXPForNextLevel(level) {
  if (level >= LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 5000;
  return LEVEL_THRESHOLDS[level];
}

export function getXPForCurrentLevel(level) {
  return LEVEL_THRESHOLDS[Math.max(0, level - 1)];
}

// --- Stats calculations ---
export async function calculateStats() {
  const allHistory = await db.history.toArray();
  const totalXP = allHistory.reduce((sum, h) => sum + (h.xpEarned || 0), 0);
  const tasksCompleted = allHistory.filter(h => !h.skipped).length;

  // Calculate unique section completions (all tasks in section done in a day)
  const sections = await getSections();
  let sectionsCompleted = 0;
  const sectionDays = {};

  for (const h of allHistory) {
    if (!h.skipped) {
      const key = `${h.sectionId}-${h.date}`;
      if (!sectionDays[key]) sectionDays[key] = new Set();
      sectionDays[key].add(h.taskId);
    }
  }

  for (const section of sections) {
    const sectionTasks = await getTasksForSection(section.id);
    const taskIds = new Set(sectionTasks.map(t => t.id));
    for (const [key, completed] of Object.entries(sectionDays)) {
      if (key.startsWith(`${section.id}-`)) {
        if (taskIds.size > 0 && [...taskIds].every(id => completed.has(id))) {
          sectionsCompleted++;
        }
      }
    }
  }

  // Streak calculation
  const dates = [...new Set(allHistory.filter(h => !h.skipped).map(h => h.date))].sort().reverse();
  let currentStreak = 0;
  const today = new Date();
  for (let i = 0; i < dates.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    const expectedStr = expected.toISOString().split('T')[0];
    if (dates[i] === expectedStr) {
      currentStreak++;
    } else {
      break;
    }
  }

  const level = getLevelFromXP(totalXP);

  return {
    totalXP,
    level,
    levelTitle: getLevelTitle(level),
    xpForNextLevel: getXPForNextLevel(level),
    xpForCurrentLevel: getXPForCurrentLevel(level),
    tasksCompleted,
    sectionsCompleted,
    currentStreak,
  };
}
