import { courseParticipation, icsCourses } from '../data/icsCourses';
import type { IcsCourse } from '../data/icsCourses';

const dayNames = { M: 'Mon', T: 'Tue', W: 'Wed', R: 'Thu', F: 'Fri' } as const;
const resultLimit = 50;

type Meeting = { days: string[]; start: number; end: number };
type Section = IcsCourse & { crn: string; meetings: Meeting[] };

const courseOptions = Array.from(
  new Map(icsCourses.map(({ code, title }) => [code, { code, title }])).values(),
).sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));

export function searchCourses(query: string, selected: string[]) {
  const term = query.trim().toLowerCase();
  if (!term) return [];

  const compact = term.replace(/\s+/g, '');
  return courseOptions.filter(({ code, title }) => (
    !selected.includes(code)
    && (code.toLowerCase().replace(/\s+/g, '').startsWith(compact)
      || title.toLowerCase().includes(term))
  ));
}

function minutes(time: string, period: string) {
  const [hour, minute] = time.split(':').map(Number);
  return (hour % 12 + (period === 'PM' ? 12 : 0)) * 60 + minute;
}

export function parseSection(course: IcsCourse): Section | null {
  if (!course.crn || !course.schedule) return null;

  const meetings: Meeting[] = [];
  for (const part of course.schedule.split(' + ')) {
    if (part === 'Online async') continue;

    const match = /^([MTWRF]+) ((?:1[0-2]|[1-9]):[0-5]\d) (AM|PM) - ((?:1[0-2]|[1-9]):[0-5]\d) (AM|PM)(?:,|$)/.exec(part);
    if (!match) return null;

    const [, days, startTime, startPeriod, endTime, endPeriod] = match;
    const start = minutes(startTime, startPeriod);
    const end = minutes(endTime, endPeriod);
    if (end <= start) return null;

    meetings.push({
      days: Array.from(days, (day) => dayNames[day as keyof typeof dayNames]),
      start,
      end,
    });
  }

  return { ...course, crn: course.crn, meetings };
}

const sections = icsCourses.map(parseSection).filter((section) => section !== null);

function overlaps(a: Meeting, b: Meeting) {
  return a.start < b.end
    && b.start < a.end
    && a.days.some((day) => b.days.includes(day));
}

export function generateSchedules(
  courses: string[],
  preferences: { days: string[]; start: number; end: number; format: string },
) {
  const schedules: Section[][] = [];
  const unavailableCourses: string[] = [];
  const choices = courses.map((code) => {
    const eligible = sections.filter((section) => (
      section.code === code
      && (!preferences.format || courseParticipation(section) === preferences.format)
      && section.meetings.every((meeting) => (
        meeting.days.every((day) => preferences.days.includes(day))
        && meeting.start >= preferences.start
        && meeting.end <= preferences.end
      ))
    ));

    if (eligible.length === 0) unavailableCourses.push(code);
    return eligible;
  });

  function visit(index: number, chosen: Section[], meetings: Meeting[]) {
    if (index === choices.length) {
      schedules.push(chosen);
      return;
    }

    for (const section of choices[index]) {
      if (schedules.length > resultLimit) break;
      if (section.meetings.some((meeting) => meetings.some((other) => overlaps(meeting, other)))) continue;
      visit(index + 1, [...chosen, section], [...meetings, ...section.meetings]);
    }
  }

  if (courses.length && unavailableCourses.length === 0) visit(0, [], []);

  return {
    schedules: schedules.slice(0, resultLimit),
    hasMore: schedules.length > resultLimit,
    unavailableCourses,
  };
}