'use client';

import Link from 'next/link';
import { useState, useSyncExternalStore } from 'react';
import type { CSSProperties } from 'react';
import {
  emptyScheduleSnapshot,
  parseSchedules,
  readScheduleSnapshot,
  subscribeToSchedules,
  updateSavedSchedules,
} from '../../lib/saved-schedules';
import type { SavedCourse, SavedSchedule } from '../../lib/saved-schedules';
import styles from './my-schedules.module.css';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;

type SampleCourse = {
  code: string;
  credits: number;
  days: string[];
  start: number;
  end: number;
};

const sampleCourses: SampleCourse[] = [
  { code: 'ICS 311', credits: 3, days: ['Mon', 'Wed'], start: 540, end: 615 },
  { code: 'ICS 332', credits: 3, days: ['Mon', 'Wed'], start: 630, end: 705 },
  { code: 'MATH 242', credits: 4, days: ['Mon', 'Wed'], start: 780, end: 855 },
  { code: 'ICS 314', credits: 3, days: ['Mon', 'Wed'], start: 870, end: 945 },
];

function asSampleCourse({ code, credits, days: meetingDays, start, end }: SampleCourse): SavedCourse {
  return { code, crn: '', credits, meetings: [{ days: meetingDays, start, end }] };
}

const sampleSchedules: SavedSchedule[] = [
  {
    id: 'fewer-days',
    name: 'Fewer campus days',
    bookmarked: true,
    courses: sampleCourses.map(asSampleCourse),
  },
  {
    id: 'later-starts',
    name: 'Later starts',
    bookmarked: false,
    courses: [
      { ...sampleCourses[0], days: ['Tue', 'Thu'], start: 660, end: 735 },
      { ...sampleCourses[1], days: ['Tue', 'Thu'], start: 750, end: 825 },
      sampleCourses[2],
      sampleCourses[3],
    ].map(asSampleCourse),
  },
  {
    id: 'compact',
    name: 'Compact mornings',
    bookmarked: false,
    courses: [
      sampleCourses[0],
      sampleCourses[1],
      { ...sampleCourses[2], days: ['Tue', 'Thu'], start: 540, end: 615 },
      { ...sampleCourses[3], days: ['Tue', 'Thu'], start: 630, end: 705 },
    ].map(asSampleCourse),
  },
];

function formatTime(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = String(minutes % 60).padStart(2, '0');
  return `${hour % 12 || 12}:${minute} ${hour < 12 ? 'AM' : 'PM'}`;
}

function getScheduleSummary(schedule: SavedSchedule) {
  const credits = schedule.courses.reduce((total, course) => total + course.credits, 0);
  return `${credits} credits`;
}

export default function MySchedulesPage() {
  const snapshot = useSyncExternalStore(
    subscribeToSchedules,
    readScheduleSnapshot,
    emptyScheduleSnapshot,
  );
  const [selectedId, setSelectedId] = useState('');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [rename, setRename] = useState<{ id: string; name: string } | null>(null);
  const [error, setError] = useState('');

  let schedules: SavedSchedule[] = [];
  let loadError = '';

  try {
    schedules = parseSchedules(snapshot) ?? sampleSchedules;
  } catch {
    loadError = 'Could not read your saved schedules.';
  }

  const visibleSchedules = schedules.filter((schedule) => !bookmarkedOnly || schedule.bookmarked);
  const selected = visibleSchedules.find((schedule) => schedule.id === selectedId)
    ?? visibleSchedules[0];

  const meetings = selected?.courses.flatMap((course) => course.meetings.map((meeting) => ({
    ...meeting,
    code: course.code,
    crn: course.crn,
  }))) ?? [];

  const gridStart = Math.min(8, ...meetings.map((meeting) => Math.floor(meeting.start / 60))) * 60;
  const gridEnd = Math.max(16, ...meetings.map((meeting) => Math.ceil(meeting.end / 60))) * 60;
  const hours = Array.from(
    { length: (gridEnd - gridStart) / 60 },
    (_, index) => gridStart + index * 60,
  );

  function saveChanges(update: (current: SavedSchedule[]) => SavedSchedule[]) {
    try {
      updateSavedSchedules(update, sampleSchedules);
      setError('');
      return true;
    } catch {
      setError('Could not update your saved schedules. Your changes were not saved.');
      return false;
    }
  }

  function toggleBookmark(id: string) {
    saveChanges((current) => current.map((schedule) => (
      schedule.id === id ? { ...schedule, bookmarked: !schedule.bookmarked } : schedule
    )));
  }

  function renameSchedule() {
    if (!rename) return;
    const name = rename.name.trim();
    if (!name) return;

    const saved = saveChanges((current) => current.map((schedule) => (
      schedule.id === rename.id ? { ...schedule, name } : schedule
    )));

    if (saved) setRename(null);
  }

  function moveSchedule(id: string, offset: number) {
    saveChanges((current) => {
      const index = current.findIndex((schedule) => schedule.id === id);
      const target = index + offset;
      if (index < 0 || target < 0 || target >= current.length) return current;

      const next = [...current];
      const [schedule] = next.splice(index, 1);
      next.splice(target, 0, schedule);
      return next;
    });
  }

  function deleteSchedule(schedule: SavedSchedule) {
    if (!window.confirm(`Delete "${schedule.name}"?`)) return;
    const saved = saveChanges((current) => current.filter((item) => item.id !== schedule.id));
    if (saved && rename?.id === schedule.id) setRename(null);
  }

  return (
    <main className={styles.page}>
      <header className={styles.titleBar}>
        <span><Link href="/">Home</Link> / My Schedules</span>
        <h1>My Schedules</h1>
      </header>

      <section className={styles.toolbar} aria-label="Schedule filters">
        <select aria-label="Semester" defaultValue="spring-2027">
          <option value="spring-2027">Spring 2027</option>
        </select>
        <label>
          <input
            type="checkbox"
            role="switch"
            checked={bookmarkedOnly}
            onChange={(event) => setBookmarkedOnly(event.target.checked)}
          />
          Bookmarked only
        </label>
        <Link className={styles.buildLink} href="/schedule-builder">Build a schedule</Link>
      </section>

      <div className={styles.panels}>
        <section className={styles.card}>
          <h2>Saved schedules</h2>
          {(loadError || error) && <p role="alert">{loadError || error}</p>}

          {visibleSchedules.length === 0 && (
            <p>
              {bookmarkedOnly
                ? 'No bookmarked schedules.'
                : 'Save a schedule from Schedule Builder to see it here.'}
            </p>
          )}

          <ul className={styles.savedList}>
            {visibleSchedules.map((schedule) => {
              const position = schedules.findIndex((item) => item.id === schedule.id);

              return (
                <li key={schedule.id} className={selected?.id === schedule.id ? styles.active : ''}>
                  <button
                    type="button"
                    className={styles.scheduleName}
                    aria-pressed={selected?.id === schedule.id}
                    onClick={() => setSelectedId(schedule.id)}
                  >
                    {schedule.name}
                  </button>

                  <button
                    type="button"
                    aria-label={`Bookmark ${schedule.name}`}
                    aria-pressed={schedule.bookmarked}
                    onClick={() => toggleBookmark(schedule.id)}
                  >
                    <svg width="17" height="20" viewBox="0 0 18 22" aria-hidden="true">
                      <path
                        d="M2 1h14v19l-7-5-7 5z"
                        fill={schedule.bookmarked ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </button>

                  <details className={styles.actions}>
                    <summary aria-label={`Actions for ${schedule.name}`}>⋯</summary>
                    <div>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.currentTarget.closest('details')?.removeAttribute('open');
                          setRename({ id: schedule.id, name: schedule.name });
                        }}
                      >
                        Rename
                      </button>
                      <button
                        type="button"
                        disabled={position === 0}
                        onClick={() => moveSchedule(schedule.id, -1)}
                      >
                        Move up
                      </button>
                      <button
                        type="button"
                        disabled={position === schedules.length - 1}
                        onClick={() => moveSchedule(schedule.id, 1)}
                      >
                        Move down
                      </button>
                      <button type="button" onClick={() => deleteSchedule(schedule)}>
                        Delete schedule
                      </button>
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>

          {rename && (
            <form
              className="mb-3"
              onSubmit={(event) => {
                event.preventDefault();
                renameSchedule();
              }}
            >
              <label htmlFor="schedule-name" className="form-label">Schedule name</label>
              <input
                key={rename.id}
                id="schedule-name"
                className="form-control"
                value={rename.name}
                onFocus={(event) => event.currentTarget.select()}
                onChange={(event) => setRename({ ...rename, name: event.target.value })}
                autoFocus
                required
                maxLength={80}
              />
              <div className="d-flex gap-2 mt-2">
                <button type="submit" className="btn btn-success btn-sm" disabled={!rename.name.trim()}>
                  Save name
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setRename(null)}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          <button
            type="button"
            className={styles.compare}
            aria-expanded={showComparison}
            disabled={visibleSchedules.length < 2}
            onClick={() => setShowComparison(!showComparison)}
          >
            {showComparison ? 'Hide comparison' : 'Compare schedules'}
          </button>

          {showComparison && visibleSchedules.length >= 2 && (
            <ul>
              {visibleSchedules.map((schedule) => (
                <li key={schedule.id}>{schedule.name} · {getScheduleSummary(schedule)}</li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.card}>
          {selected ? (
            <>
              <h2>{selected.name}</h2>
              <p className={styles.meta}>
                {getScheduleSummary(selected)}
                {sampleSchedules.some((schedule) => schedule.id === selected.id) && ' · Sample schedule'}
              </p>

              <div className={styles.calendarScroll}>
                <div className={styles.calendar} style={{ '--hours': hours.length } as CSSProperties}>
                  <div className={styles.calendarColumn}>
                    <strong>Time</strong>
                    <div className={styles.calendarBody}>
                      {hours.map((hour) => <span key={hour}>{formatTime(hour)}</span>)}
                    </div>
                  </div>

                  {days.map((day) => (
                    <div className={styles.calendarColumn} key={day}>
                      <strong>{day}</strong>
                      <div className={styles.calendarBody}>
                        {meetings.filter((meeting) => meeting.days.includes(day)).map((meeting) => (
                          <div
                            key={`${meeting.code}-${meeting.crn}-${meeting.start}`}
                            className={styles.courseBlock}
                            style={{
                              top: `${100 * (meeting.start - gridStart) / (gridEnd - gridStart)}%`,
                              height: `${100 * (meeting.end - meeting.start) / (gridEnd - gridStart)}%`,
                            }}
                          >
                            <b>{meeting.code}</b>
                            <small>{formatTime(meeting.start)} – {formatTime(meeting.end)}</small>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <h3>Classes in this schedule</h3>
              <ul className={styles.courseList}>
                {selected.courses.map((course) => (
                  <li key={course.crn || course.code}>
                    <b>{course.code}</b> · {course.credits} credits
                    {course.crn && ` · CRN ${course.crn}`}
                    {course.schedule && <div>{course.schedule}</div>}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>Choose a saved schedule to see its classes and weekly calendar.</p>
          )}
        </section>
      </div>
    </main>
  );
}