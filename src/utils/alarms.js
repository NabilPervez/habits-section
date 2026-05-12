import { getSections, getSetting } from '../db';
import { sendNotification } from './notifications';
import { playAlarmSound } from './sounds';

let checkInterval = null;
let lastCheckedMinute = null;

export function setupAlarms() {
  if (checkInterval) {
    clearInterval(checkInterval);
  }

  // We check every 30 seconds to catch the minute switch even if throttled slightly in bg
  checkInterval = setInterval(async () => {
    const now = new Date();
    const currentH = String(now.getHours()).padStart(2, '0');
    const currentM = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentH}:${currentM}`;

    // Only check db and fire alarms once per minute
    if (currentTimeStr !== lastCheckedMinute) {
      lastCheckedMinute = currentTimeStr;

      const soundsOn = await getSetting('sounds');
      const sections = await getSections();

      sections.forEach(section => {
        if (section.startTime === currentTimeStr) {
          sendNotification(`Time for ${section.name}!`, {
            body: 'Your routine is scheduled to start now.',
            playSound: false
          });
          if (soundsOn !== false) {
             playAlarmSound();
          }
        }
      });
    }
  }, 30000);
}
