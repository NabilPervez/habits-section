import { setSetting } from '../db';

// Default coordinates for Dallas, TX
const DALLAS_COORDS = { latitude: 32.7767, longitude: -96.7970 };

/**
 * Request browser geolocation. Falls back to Dallas coordinates.
 */
export async function requestGeolocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(DALLAS_COORDS);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve(DALLAS_COORDS),
      { timeout: 8000, enableHighAccuracy: false }
    );
  });
}

/**
 * Fetch prayer times from Aladhan API for a given date and location.
 * Returns an object like { Fajr: "05:23", Dhuhr: "12:45", Asr: "16:12", Maghrib: "19:35", Isha: "21:00" }
 */
export async function fetchPrayerTimes(latitude, longitude, date = new Date()) {
  const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  try {
    const res = await fetch(
      `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=2`
    );
    const data = await res.json();
    if (data.code === 200 && data.data?.timings) {
      const t = data.data.timings;
      return {
        Fajr: t.Fajr,
        Sunrise: t.Sunrise,
        Dhuhr: t.Dhuhr,
        Asr: t.Asr,
        Maghrib: t.Maghrib,
        Isha: t.Isha,
      };
    }
  } catch (e) {
    console.warn('Failed to fetch prayer times, using defaults:', e);
  }
  // Fallback prayer times (Dallas approximation)
  return {
    Fajr: '05:15',
    Sunrise: '06:40',
    Dhuhr: '12:50',
    Asr: '16:20',
    Maghrib: '19:45',
    Isha: '21:10',
  };
}

/**
 * Build Islamic section objects from prayer times.
 * Each section starts at one prayer and ends at the next.
 */
export function buildIslamicSections(prayerTimes) {
  const convert24 = (timeStr) => {
    // Aladhan returns "HH:MM (TZ)" — strip timezone
    return timeStr.split(' ')[0];
  };

  return [
    { name: 'Fajr', icon: 'sunrise', startTime: convert24(prayerTimes.Fajr), endTime: convert24(prayerTimes.Sunrise), order: 0 },
    { name: 'Dhuhr', icon: 'sun', startTime: convert24(prayerTimes.Dhuhr), endTime: convert24(prayerTimes.Asr), order: 1 },
    { name: 'Asr', icon: 'cloud-sun', startTime: convert24(prayerTimes.Asr), endTime: convert24(prayerTimes.Maghrib), order: 2 },
    { name: 'Maghrib', icon: 'sunset', startTime: convert24(prayerTimes.Maghrib), endTime: convert24(prayerTimes.Isha), order: 3 },
    { name: 'Isha', icon: 'moon', startTime: convert24(prayerTimes.Isha), endTime: '23:59', order: 4 },
  ];
}

/**
 * Reverse-geocode coordinates to a city name using a free API.
 */
export async function reverseGeocode(latitude, longitude) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
    );
    const data = await res.json();
    const city = data.address?.city || data.address?.town || data.address?.village || 'Unknown';
    const state = data.address?.state || '';
    return `${city}, ${state}`.replace(/, $/, '');
  } catch (e) {
    return 'Dallas, TX';
  }
}

/**
 * Full geolocation flow: get coords → fetch prayer times → reverse geocode → save to DB.
 */
export async function fullGeoFlow() {
  const coords = await requestGeolocation();
  await setSetting('latitude', coords.latitude);
  await setSetting('longitude', coords.longitude);

  const prayerTimes = await fetchPrayerTimes(coords.latitude, coords.longitude);
  await setSetting('prayerTimes', prayerTimes);

  const cityName = await reverseGeocode(coords.latitude, coords.longitude);
  await setSetting('city', cityName);

  return { coords, prayerTimes, cityName };
}
