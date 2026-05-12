import { playSuccessSound } from './sounds';
// Notifications utils
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

export function sendNotification(title, options = {}) {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      ...options
    });

    // Play sound if requested
    if (options.playSound) {
      // Need a way to play sound outside react component, could use sounds.js
      playSuccessSound();
    }

    return notification;
  }
}
