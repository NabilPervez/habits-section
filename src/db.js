import Dexie from 'dexie';

export const db = new Dexie('habits-section-db');

db.version(1).stores({
  tasks: '++id, sectionId, title, isMandatory, durationMinutes, xpReward',
  sections: '++id, name, startTime, endTime',
  history: '++id, date, taskId, sectionId, completedAt'
});
