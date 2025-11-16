import races from './data/champions_meetings.json';

function to15UTC(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return Date.UTC(y, m - 1, d, 15, 0, 0, 0);
}

const champions_meeting = races
  .filter(r => r.global_start && r.global_end)
  .map(r => ({
    ...r,
    startMs: to15UTC(r.global_start),
    endMs: to15UTC(r.global_end)
  }))
  .sort((a, b) => a.startMs - b.startMs);

export function getChampionsMeeting() {
  const now = Date.now();

  const active = champions_meeting.find(c => now >= c.startMs && now <= c.endMs);
  if (active) return active;

  const upcoming = champions_meeting.find(c => c.startMs > now);
  if (upcoming) return upcoming;

  return champions_meeting[champions_meeting.length - 1] || null;
}

export function findChampionsMeetingByName(name: string, { upcomingOnly = false } = {}) {
  const matches = champions_meeting.filter(c => c.name === name);
  if (!matches.length) return null;

  const now = Date.now();
  if (upcomingOnly) {
    return matches.find(c => c.startMs > now) || null;
  }

  return matches.reduce((closest, cup) => {
    const diff = Math.abs(cup.startMs - now);
    const closestDiff = Math.abs(closest.startMs - now);
    return diff < closestDiff ? cup : closest;
  });
}
