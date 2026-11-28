export type SavedCourse = {
  code: string;
  crn: string;
  section?: string;
  credits: number;
  schedule?: string;
  meetings: { days: string[]; start: number; end: number }[];
};

export type SavedSchedule = {
  id: string;
  name: string;
  term?: string;
  bookmarked: boolean;
  courses: SavedCourse[];
};

const storageKey = 'ebicsa.saved-schedules.v1';
const changeEvent = 'ebicsa:schedules-changed';
const emptySnapshot = 'null';

export function readScheduleSnapshot() {
  try {
    return window.localStorage.getItem(storageKey) ?? emptySnapshot;
  } catch {
    return emptySnapshot;
  }
}

export function emptyScheduleSnapshot() {
  return emptySnapshot;
}

export function parseSchedules(snapshot: string): SavedSchedule[] | null {
  const schedules = JSON.parse(snapshot);
  if (schedules === null) return null;
  if (!Array.isArray(schedules)) throw new Error('Invalid saved schedules');
  return schedules;
}

export function subscribeToSchedules(listener: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === storageKey || event.key === null) listener();
  }

  window.addEventListener('storage', onStorage);
  window.addEventListener(changeEvent, listener);

  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(changeEvent, listener);
  };
}

export function updateSavedSchedules(
  update: (current: SavedSchedule[]) => SavedSchedule[],
  initialSchedules: SavedSchedule[] = [],
) {
  const snapshot = window.localStorage.getItem(storageKey) ?? emptySnapshot;
  const current = parseSchedules(snapshot) ?? initialSchedules;

  window.localStorage.setItem(storageKey, JSON.stringify(update(current)));
  window.dispatchEvent(new Event(changeEvent));
}

type GeneratedCourse = Omit<SavedCourse, 'credits'> & { credits: number | string };

export function saveGeneratedSchedule(
  name: string,
  courses: readonly GeneratedCourse[],
  term?: string,
) {
  const schedule: SavedSchedule = {
    id: window.crypto.randomUUID(),
    name,
    term,
    bookmarked: false,
    courses: courses.map(({ code, crn, section, credits, schedule: meetingLabel, meetings }) => ({
      code,
      crn,
      section,
      credits: Number(credits),
      schedule: meetingLabel,
      meetings,
    })),
  };

  updateSavedSchedules((current) => [schedule, ...current]);
  return schedule;
}