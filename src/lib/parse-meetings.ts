/** Parsed fields of a Meeting row (see prisma/schema.prisma). */
export type MeetingData = {
  days: string;
  startMin: number | null;
  endMin: number | null;
  location: string | null;
  online: boolean;
};

function minutes(time: string, period: string) {
  const [hour, minute] = time.split(':').map(Number);
  return (hour % 12 + (period === 'PM' ? 12 : 0)) * 60 + minute;
}

/** Splits a Star GPS schedule string ("MW 9:00 AM - 10:15 AM, UHM KUY 101 +
 *  Online async") into Meeting rows. "Online sync" keeps its days and times
 *  with online = true; "Online async" becomes a meeting with null times.
 *  Unparsed parts like "TBA" produce no rows. */
export function parseMeetings(schedule = ''): MeetingData[] {
  return schedule.split(' + ').flatMap((part): MeetingData[] => {
    if (part === 'Online async') {
      return [{ days: '', startMin: null, endMin: null, location: null, online: true }];
    }
    const match = /^([MTWRF]+) (\d{1,2}:\d\d) (AM|PM) - (\d{1,2}:\d\d) (AM|PM), (.+)$/.exec(part);
    if (!match) return [];
    const [, days, start, startPeriod, end, endPeriod, location] = match;
    const online = location === 'Online sync';
    return [{
      days,
      startMin: minutes(start, startPeriod),
      endMin: minutes(end, endPeriod),
      location: online ? null : location,
      online,
    }];
  });
}
