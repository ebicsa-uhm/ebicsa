'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { generateSchedules, searchCourses } from '../../lib/schedule-builder';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const hourHeight = 44;
const beige = { backgroundColor: '#e8e5da' };
const colors = [
  ['#d9ecdf', '#08753b'],
  ['#d9e8f8', '#2568ad'],
  ['#f6e8cd', '#a86e17'],
  ['#e6def2', '#7856a7'],
];

function timeInputMinutes(value: FormDataEntryValue | null) {
  const [hour, minute] = String(value).split(':').map(Number);
  return hour * 60 + minute;
}

function formatTime(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = String(minutes % 60).padStart(2, '0');
  return `${hour % 12 || 12}:${minute} ${hour < 12 ? 'AM' : 'PM'}`;
}

export default function ScheduleBuilderPage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<ReturnType<typeof generateSchedules> | null>(null);
  const [scheduleIndex, setScheduleIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [targetCredits, setTargetCredits] = useState('14');

  const suggestions = searchCourses(query, selected);
  const classes = result?.schedules[scheduleIndex] ?? [];
  const totalCredits = classes.reduce((total, item) => total + Number(item.credits), 0);
  const blocks = classes.flatMap((section, index) => section.meetings.map((meeting) => ({
    ...meeting,
    code: section.code,
    crn: section.crn,
    colors: colors[index % colors.length],
  })));
  const firstHour = Math.min(9, ...blocks.map((block) => Math.floor(block.start / 60)));
  const lastHour = Math.max(16, ...blocks.map((block) => Math.ceil(block.end / 60)));
  const hours = Array.from({ length: lastHour - firstHour }, (_, index) => firstHour + index);

  function clearResults() {
    setResult(null);
    setScheduleIndex(0);
    setMessage('');
  }

  function addCourse(code: string) {
    setSelected((courses) => courses.includes(code) ? courses : [...courses, code]);
    setQuery('');
    clearResults();
  }

  function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearResults();

    const values = new FormData(event.currentTarget);
    const start = timeInputMinutes(values.get('start'));
    const end = timeInputMinutes(values.get('end'));

    if (start >= end) {
      setMessage('Choose an end time after the start time.');
      return;
    }

    const next = generateSchedules(selected, {
      days: values.getAll('days').map(String),
      start,
      end,
      format: String(values.get('format')),
    });

    setResult(next);
    if (next.unavailableCourses.length) {
      setMessage(`No sections fit for ${next.unavailableCourses.join(', ')}. Try changing your days, times, or class format.`);
    } else if (!next.schedules.length) {
      setMessage('The selected courses have overlapping sections. Try widening your availability or changing a course.');
    }
  }

  return (
    <main className="py-4 py-lg-5" style={{ backgroundColor: '#f5f2ef' }}>
      <div className="container" style={{ maxWidth: 1168 }}>
        <header className="row align-items-center gy-2 mb-4">
          <div className="col-md-3 small">
            <Link href="/" className="link-success">Home</Link>
            {' / Schedule Builder'}
          </div>
          <h1 className="col-md-6 h2 fw-bold text-md-center mb-0">Schedule Builder</h1>
        </header>

        <div className="row g-3 align-items-start">
          <aside className="col-lg-4 col-xl-auto" style={{ maxWidth: 340 }}>
            <form
              className="p-3 rounded-3"
              style={beige}
              onSubmit={generate}
              onChange={(event) => {
                if (event.target instanceof Element
                  && ['days', 'start', 'end', 'format'].includes(event.target.getAttribute('name') ?? '')) {
                  clearResults();
                }
              }}
            >
              <h2 className="h5 fw-bold mb-3">Your preferences</h2>

              <label htmlFor="term" className="form-label fw-semibold">Term</label>
              <select id="term" className="form-select rounded-pill mb-3">
                <option>Spring 2027</option>
              </select>

              <label htmlFor="course-search" className="form-label fw-semibold">Find a course</label>
              <input
                id="course-search"
                className="form-control rounded-pill"
                type="search"
                placeholder="e.g. ICS 311, 314, etc."
                autoComplete="off"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' || !query.trim()) return;
                  event.preventDefault();
                  if (suggestions.length === 1) addCourse(suggestions[0].code);
                }}
              />

              {query.trim() && (
                <ul
                  className="list-group mt-2 overflow-auto"
                  style={{ maxHeight: 200 }}
                  aria-label="Course suggestions"
                >
                  {suggestions.map(({ code, title }) => (
                    <li key={code} className="list-group-item p-0">
                      <button
                        type="button"
                        className="btn btn-light w-100 text-start"
                        onClick={() => addCourse(code)}
                      >
                        <strong>{code}</strong> · {title}
                      </button>
                    </li>
                  ))}
                  {suggestions.length === 0 && (
                    <li className="list-group-item small">No courses to add match your search.</li>
                  )}
                </ul>
              )}

              <ul className="list-unstyled d-flex flex-wrap gap-2 mt-2 mb-3" aria-label="Selected courses">
                {selected.map((code) => (
                  <li key={code}>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success rounded-pill"
                      aria-label={`Remove ${code}`}
                      onClick={() => {
                        setSelected((courses) => courses.filter((course) => course !== code));
                        clearResults();
                      }}
                    >
                      {code} ×
                    </button>
                  </li>
                ))}
              </ul>

              <label htmlFor="credits" className="form-label fw-semibold">Target credits</label>
              <input
                id="credits"
                className="form-control rounded-pill mb-3"
                type="number"
                min={1}
                value={targetCredits}
                onChange={(event) => setTargetCredits(event.target.value)}
              />

              <label htmlFor="format" className="form-label fw-semibold">Class format</label>
              <select id="format" name="format" className="form-select rounded-pill mb-3">
                <option value="">Any format</option>
                <option value="In-Person">In person</option>
                <option>Online</option>
                <option>Hybrid</option>
              </select>

              <fieldset className="mb-3">
                <legend className="fs-6 fw-semibold">Available days</legend>
                <div className="d-flex flex-wrap gap-2">
                  {weekdays.map((day) => (
                    <label key={day} className="small">
                      <input
                        className="form-check-input me-1"
                        type="checkbox"
                        name="days"
                        value={day}
                        defaultChecked
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mb-4">
                <legend className="fs-6 fw-semibold">Time window</legend>
                <div className="d-flex align-items-center gap-2">
                  <input
                    aria-label="Start time"
                    className="form-control rounded-pill px-2"
                    type="time"
                    name="start"
                    required
                    defaultValue="08:00"
                  />
                  <span>to</span>
                  <input
                    aria-label="End time"
                    className="form-control rounded-pill px-2"
                    type="time"
                    name="end"
                    required
                    defaultValue="21:00"
                  />
                </div>
              </fieldset>

              <button
                type="submit"
                className="btn w-100 rounded-pill fw-semibold text-white"
                style={{ backgroundColor: '#005435' }}
                disabled={selected.length === 0}
              >
                Generate schedules
              </button>
            </form>
          </aside>

          <section className="col-lg">
            <div className="border rounded-3 p-3">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                <h2 className="h5 fw-bold mb-0" aria-live="polite">
                  {classes.length
                    ? `${totalCredits} credits${targetCredits ? ` / ${targetCredits} target` : ''}`
                    : 'Weekly schedule'}
                </h2>

                {result && result.schedules.length > 0 && (
                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-light border rounded-pill px-3"
                      disabled={scheduleIndex === 0}
                      onClick={() => setScheduleIndex(scheduleIndex - 1)}
                    >
                      ‹ Previous
                    </button>
                    <span className="small text-nowrap" aria-live="polite">
                      {scheduleIndex + 1} of {result.schedules.length}{result.hasMore ? ' shown' : ''}
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-light border rounded-pill px-3"
                      disabled={scheduleIndex === result.schedules.length - 1}
                      onClick={() => setScheduleIndex(scheduleIndex + 1)}
                    >
                      Next ›
                    </button>
                  </div>
                )}
              </div>

              {classes.length === 0 && (
                <p className="small text-muted mb-2" role="status">
                  {message || 'Add courses and generate schedules to see your options.'}
                </p>
              )}

              <div className="overflow-auto border rounded-3 bg-white" aria-hidden="true">
                <div
                  className="d-grid"
                  style={{ gridTemplateColumns: '94px repeat(5, minmax(105px, 1fr))', minWidth: 619 }}
                >
                  <div className="p-2 fw-semibold small border-end" style={beige}>Time</div>
                  {weekdays.map((day) => (
                    <div key={day} className="p-2 text-center fw-semibold small border-end" style={beige}>
                      {day}
                    </div>
                  ))}

                  <div className="border-end">
                    {hours.map((hour) => (
                      <div key={hour} className="border-top px-2 pt-1 small" style={{ height: hourHeight }}>
                        {formatTime(hour * 60)}
                      </div>
                    ))}
                  </div>

                  {weekdays.map((day) => (
                    <div key={day} className="position-relative border-end">
                      {hours.map((hour) => (
                        <div key={hour} className="border-top" style={{ height: hourHeight }} />
                      ))}
                      {blocks.filter((block) => block.days.includes(day)).map((block) => (
                        <div
                          key={`${block.crn}-${block.start}`}
                          className="position-absolute rounded px-2 py-1 lh-sm"
                          style={{
                            top: (block.start - firstHour * 60) * hourHeight / 60,
                            height: (block.end - block.start) * hourHeight / 60,
                            left: 3,
                            right: 3,
                            backgroundColor: block.colors[0],
                            borderLeft: `4px solid ${block.colors[1]}`,
                          }}
                        >
                          <div className="small fw-bold">{block.code}</div>
                          <div style={{ fontSize: '0.7rem' }}>
                            {formatTime(block.start)}–{formatTime(block.end)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <hr />

              <h2 className="h6 fw-bold">Classes in this schedule</h2>
              <div className="table-responsive border rounded-3">
                <table className="table table-sm align-middle mb-0">
                  <thead style={{ '--bs-table-bg': '#e8e5da' } as CSSProperties}>
                    <tr>
                      <th scope="col" className="ps-3">Course</th>
                      <th scope="col">Meeting days</th>
                      <th scope="col">Time and location</th>
                      <th scope="col">Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-3 text-center text-muted">
                          Classes will appear here after you generate a schedule.
                        </td>
                      </tr>
                    ) : classes.map((item) => (
                      <tr key={item.crn}>
                        <th scope="row" className="ps-3">
                          {item.code} <span className="small fw-normal">({item.crn})</span>
                        </th>
                        <td>{item.meetings.map((meeting) => meeting.days.join(' / ')).join('; ') || '—'}</td>
                        <td>{item.schedule}</td>
                        <td>{item.credits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <hr />

              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-success rounded-pill px-4" disabled>
                  Save schedule
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}