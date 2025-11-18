import champions_meetings from './data/champions_meetings.json';

function to15UTC(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return Date.UTC(y, m - 1, d, 15, 0, 0, 0);
}

const champions_meeting = champions_meetings
  .filter(r => r.global_start && r.global_end)
  .map(r => ({
    ...r,
    ms_start: to15UTC(r.global_start),
    ms_end: to15UTC(r.global_end)
  }))
  .sort((a, b) => a.ms_start - b.ms_start);

export function cleanOutput(race: any) {
  return {
    ...race,
    id: undefined,
    global_start: undefined,
    global_end: undefined,
    jp_start: undefined,
    jp_end: undefined,
    ms_start: undefined,
    ms_end: undefined,
  };
}

export function getChampionsMeeting() {
  const now = Date.now();

  const active = champions_meeting.find(c => now >= c.ms_start && now <= c.ms_end);
  if (active) return active;

  const upcoming = champions_meeting.find(c => c.ms_start > now);
  if (upcoming) return upcoming;

  return champions_meeting[champions_meeting.length - 1] || null;
}

export function getChampionsMeetingByScope(scope: 'previous'|'current'|'next' = 'current') {
  const current = getChampionsMeeting();
  switch (scope) {
    case 'previous':
      return champions_meeting[current.id - 1] ?? null;
    case 'next':
      return champions_meeting[current.id + 1] ?? null;
    default:
      return champions_meeting;
  }
}

export function findChampionsMeetingByName(name: string, { upcomingOnly = false } = {}) {
  const matches = champions_meeting.filter(c => c.name.toLowerCase() === name.toLowerCase());
  if (!matches.length) return null;

  const now = Date.now();
  if (upcomingOnly) {
    return matches.find(c => c.ms_start > now) || null;
  }

  return matches.reduce((closest, cup) => {
    const diff = Math.abs(cup.ms_start - now);
    const closestDiff = Math.abs(closest.ms_start - now);
    return diff < closestDiff ? cup : closest;
  });
}
