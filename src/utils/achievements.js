import { db, calculateStats } from '../db';
import { ALL_ACHIEVEMENTS } from '../data/seedData';
import { playSuccessSound } from './sounds';

export async function checkAchievements() {
  const newAchievements = [];

  try {
    const stats = await calculateStats();
    const history = await db.history.toArray();
    const earned = await db.achievements.toArray();
    const earnedIds = new Set(earned.map(e => e.type));
    const today = new Date().toISOString().split('T')[0];

    const unlock = async (id, sectionId = null) => {
      if (!earnedIds.has(id)) {
        await db.achievements.add({
          type: id,
          sectionId,
          date: today
        });
        earnedIds.add(id);
        const achInfo = ALL_ACHIEVEMENTS.find(a => a.id === id);
        if (achInfo) {
          newAchievements.push(achInfo);
        }
      }
    };

    // First routine
    if (stats.sectionsCompleted > 0) {
      await unlock('first_routine');
    }

    // Perfect section
    const perfectSectionsCount = 0; // Need to calculate this properly, or if stats has it
    // Actually, stats doesn't expose perfect sections count directly, but we can infer from sectionsCompleted vs skipped.
    // Or we pass perfect section status when a section completes. Let's do it in advanceOrFinish.

    // Streaks
    if (stats.currentStreak >= 3) await unlock('streak_3');
    if (stats.currentStreak >= 7) await unlock('streak_7');
    if (stats.currentStreak >= 14) await unlock('streak_14');
    if (stats.currentStreak >= 30) await unlock('streak_30');

    // Tasks
    if (stats.tasksCompleted >= 50) await unlock('tasks_50');
    if (stats.tasksCompleted >= 100) await unlock('tasks_100');
    if (stats.tasksCompleted >= 500) await unlock('tasks_500');

    // Builder
    const tasks = await db.tasks.toArray();
    if (tasks.length >= 10) await unlock('builder_pro'); // simplified, checks total tasks, could check custom ones

    // Levels
    if (stats.level >= 5) await unlock('level_5');
    if (stats.level >= 10) await unlock('level_10');

    // XP
    if (stats.totalXP >= 1000) await unlock('xp_1000');
    if (stats.totalXP >= 5000) await unlock('xp_5000');

    return newAchievements;
  } catch (err) {
    console.error("Error checking achievements:", err);
    return [];
  }
}
