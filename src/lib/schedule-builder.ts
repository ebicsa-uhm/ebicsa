import { courseParticipation, icsCourses } from '../data/icsCourses';
import type { IcsCourse } from '../data/icsCourses';

const dayNames = { M: 'Mon', T: 'Tue', W: 'Wed', R: 'Thu', F: 'Fri' } as const;
const resultLimit = 50;
export const ICS_COURSE_TERM = 'Spring 2027';

const termStarts = [
  { season: 'Spring', month: 0 },
  { season: 'Summer', month: 4 },
  { season: 'Fall', month: 7 },
];

const hawaiiMonth = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Pacific/Honolulu',
  year: 'numeric',
  month: 'numeric',
});

export function currentScheduleMonth() {
  const [month, year] = hawaiiMonth.format(new Date()).split('/').map(Number);
  return year * 12 + month - 1;
}

export function scheduleTerms(currentMonth: number | null) {
  if (currentMonth === null) return [ICS_COURSE_TERM];

  const firstYear = Math.floor(currentMonth / 12);
  const terms: string[] = [];

  // Approximate term boundaries for planning. Actual meeting data is loaded separately.
  for (let year = firstYear; year <= firstYear + 2; year += 1) {
    termStarts.forEach(({ season, month }, index) => {
      const firstMonth = year * 12 + month;
      const nextTermMonth = year * 12 + (termStarts[index + 1]?.month ?? 12);

      if (nextTermMonth > currentMonth && firstMonth <= currentMonth + 24) {
        terms.push(`${season} ${year}`);
      }
    });
  }

  return terms;
}

type Meeting = { days: string[]; start: number; end: number };
type Section = IcsCourse & { crn: string; meetings: Meeting[] };

const courseOptions = Array.from(
  new Map(icsCourses.map(({ code, title }) => [code, { code, title }])).values(),
).sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));

function normalizeSearch(value: string) {
  return value.toLowerCase().replace(/\s+/g, '');
}

export function searchCourses(query: string, selected: string[]) {
  const term = normalizeSearch(query);
  if (!term) return [];

  return courseOptions.filter(({ code, title }) => (
    !selected.includes(code)
    && (normalizeSearch(code).includes(term) || normalizeSearch(title).includes(term))
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

const sectionsByTerm = new Map<string, IcsCourse[]>([
  [ICS_COURSE_TERM, icsCourses],
]);

export function hasScheduleData(term: string) {
  return Boolean(sectionsByTerm.get(term)?.some((course) => !course.closed && course.crn));
}

function overlaps(a: Meeting, b: Meeting) {
  return a.start < b.end
    && b.start < a.end
    && a.days.some((day) => b.days.includes(day));
}

export type CoursePreferences = {
  days?: string[];
  format?: string;
  start?: number;
  end?: number;
};

export function generateSchedules(
  courses: string[],
  preferences: {
    term: string;
    days: string[];
    start: number;
    end: number;
    format: string;
    byCourse?: Record<string, CoursePreferences | undefined>;
  },
) {
  const schedules: Section[][] = [];
  const unavailableCourses: { code: string; reason: string }[] = [];
const termSections = sectionsByTerm.get(preferences.term) ?? [];

const choices = courses.map((code) => {
  function unavailable(reason: string): Section[] {
    unavailableCourses.push({ code, reason });
    return [];
  }

  const listed = termSections.filter((section) => section.code === code);
  const offered = listed.filter((section) => !section.closed && section.crn);

  if (offered.length === 0) {
    if (listed.some((section) => section.closed)) {
      return unavailable(
        `EBICSA lists this course as not offered in ${preferences.term}. Try another term or choose a different course.`,
      );
    }

    return unavailable(
      `No sections are listed for ${preferences.term} in EBICSA. Try another term or choose a different course.`,
    );
  }

    const override = preferences.byCourse?.[code];
    const days = override?.days ?? preferences.days;
    const format = override?.format ?? preferences.format;
    const start = override?.start ?? preferences.start;
    const end = override?.end ?? preferences.end;

    if (start >= end) {
      return unavailable(
        'This course’s start time must be before its end time. Check its preferences and the builder’s time window.',
      );
    }

    const matchingFormat = offered.filter((section) => (
      !format || courseParticipation(section) === format
    ));

  if (matchingFormat.length === 0) {
    const formats = [...new Set(offered.map(courseParticipation))].join(', ');
    return unavailable(`The listed sections are offered in these formats: ${formats}. Try Any format.`);
  }

  const scheduled = matchingFormat.map(parseSection).filter((section) => section !== null);

  if (scheduled.length === 0) {
    return unavailable(
      'The sections for your selected format lack usable meeting details. Check the course listing or try another format.',
    );
  }

  const matchingDays = scheduled.filter((section) => section.meetings.every((meeting) => (
    meeting.days.every((day) => days.includes(day))
  )));

  if (matchingDays.length === 0) {
    return unavailable(
      'Sections with meeting details in your selected format meet on days outside your availability. Try adding more days.',
    );
  }

  const eligible = matchingDays.filter((section) => section.meetings.every((meeting) => (
    meeting.start >= start && meeting.end <= end
  )));

  if (eligible.length === 0) {
    return unavailable(
      'Sections that match your format and days meet outside your time window. Try an earlier start or later end.',
    );
  }

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
    term: preferences.term,
    schedules: schedules.slice(0, resultLimit),
    hasMore: schedules.length > resultLimit,
    unavailableCourses,
  };
}