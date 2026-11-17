'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './my-schedules.module.css';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;
const gridStart = 8 * 60;
const gridEnd = 16 * 60;
const hours = Array.from({ length: 8 }, (_, index) => gridStart + index * 60);

type Course = {
  code: string;
  credits: number;
  days: readonly (typeof days)[number][];
  start: number;
  end: number;
};

type Schedule = {
  id: string;
  name: string;
  bookmarked: boolean;
  courses: Course[];
};

const sampleCourses: Course[] = [
  { code: 'ICS 311', credits: 3, days: ['Mon', 'Wed'], start: 540, end: 615 },
  { code: 'ICS 332', credits: 3, days: ['Mon', 'Wed'], start: 630, end: 705 },
  { code: 'MATH 242', credits: 4, days: ['Mon', 'Wed'], start: 780, end: 855 },
  { code: 'ICS 314', credits: 3, days: ['Mon', 'Wed'], start: 870, end: 945 },
];

const sampleSchedules: Schedule[] = [
  { id: 'fewer-days', name: 'Fewer campus days', bookmarked: true, courses: sampleCourses },
  {
    id: 'later-starts',
    name: 'Later starts',
    bookmarked: false,
    courses: [
      { ...sampleCourses[0], days: ['Tue', 'Thu'], start: 660, end: 735 },
      { ...sampleCourses[1], days: ['Tue', 'Thu'], start: 750, end: 825 },
      sampleCourses[2],
      sampleCourses[3],
    ],
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
    ],
  },
];

function formatTime(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = String(minutes % 60).padStart(2, '0');
  return `${hour % 12 || 12}:${minute} ${hour < 12 ? 'AM' : 'PM'}`;
}

function getScheduleSummary(schedule: Schedule) {
  const credits = schedule.courses.reduce((total, course) => total + course.credits, 0);
  const campusDays = new Set(schedule.courses.flatMap((course) => course.days)).size;
  return `${credits} credits · ${campusDays} campus days`;
}

export default function MySchedulesPage() {
  const [schedules, setSchedules] = useState(sampleSchedules);
  const [selectedId, setSelectedId] = useState(sampleSchedules[0].id);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const visibleSchedules = schedules.filter((schedule) => !bookmarkedOnly || schedule.bookmarked);
  const selected = visibleSchedules.find((schedule) => schedule.id === selectedId)
    ?? visibleSchedules[0];

  function toggleBookmark(id: string) {
    setSchedules((current) => current.map((schedule) => (
      schedule.id === id ? { ...schedule, bookmarked: !schedule.bookmarked } : schedule
    )));
  }

  function renameSchedule(schedule: Schedule) {
    const name = window.prompt('Schedule name', schedule.name)?.trim();
    if (!name) return;

    setSchedules((current) => current.map((item) => (
      item.id === schedule.id ? { ...item, name } : item
    )));
  }

  function moveSchedule(id: string, offset: number) {
    setSchedules((current) => {
      const index = current.findIndex((schedule) => schedule.id === id);
      const target = index + offset;
      if (index < 0 || target < 0 || target >= current.length) return current;

      const next = [...current];
      const [schedule] = next.splice(index, 1);
      next.splice(target, 0, schedule);
      return next;
    });
  }

  function deleteSchedule(schedule: Schedule) {
    if (!window.confirm(`Delete "${schedule.name}"?`)) return;
    setSchedules((current) => current.filter((item) => item.id !== schedule.id));
  }

  return (
    <main className={styles.page}>
      <header className={styles.titleBar}>
        <span><Link href="/">Home</Link> / My Schedules</span>
        <h1>My Schedules</h1>
        <span>Spring 2027 sample data</span>
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
          {visibleSchedules.length === 0 && (
            <p>{bookmarkedOnly ? 'No bookmarked schedules.' : 'No saved schedules.'}</p>
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
                      <button type="button" onClick={() => renameSchedule(schedule)}>Rename</button>
                      <button type="button" disabled={position === 0} onClick={() => moveSchedule(schedule.id, -1)}>
                        Move up
                      </button>
                      <button
                        type="button"
                        disabled={position === schedules.length - 1}
                        onClick={() => moveSchedule(schedule.id, 1)}
                      >
                        Move down
                      </button>
                      <button type="button" onClick={() => deleteSchedule(schedule)}>Delete schedule</button>
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>

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
              <p className={styles.meta}>{getScheduleSummary(selected)}</p>

              <div className={styles.calendarScroll}>
                <div className={styles.calendar}>
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
                        {selected.courses.filter((course) => course.days.includes(day)).map((course) => (
                          <div
                            key={course.code}
                            className={styles.courseBlock}
                            style={{
                              top: `${100 * (course.start - gridStart) / (gridEnd - gridStart)}%`,
                              height: `${100 * (course.end - course.start) / (gridEnd - gridStart)}%`,
                            }}
                          >
                            <b>{course.code}</b>
                            <small>{formatTime(course.start)} – {formatTime(course.end)}</small>
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
                  <li key={course.code}><b>{course.code}</b> · {course.credits} credits</li>
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