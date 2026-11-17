'use client';

import Link from 'next/link';
import { useState } from 'react';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const hours = [9, 10, 11, 12, 13, 14, 15];

const calendarStart = 9 * 60;
const hourHeight = 40;

const sampleClasses = [
  {
    course: 'ICS 311',
    days: ['Mon', 'Wed'],
    start: 9 * 60,
    duration: 75,
    credits: 4,
    background: '#d9ecdf',
    accent: '#08753b',
  },
  {
    course: 'ICS 332',
    days: ['Mon', 'Wed'],
    start: 10 * 60 + 30,
    duration: 75,
    credits: 3,
    background: '#d9e8f8',
    accent: '#2568ad',
  },
  {
    course: 'MATH 242',
    days: ['Mon', 'Wed'],
    start: 13 * 60,
    duration: 75,
    credits: 4,
    background: '#f6e8cd',
    accent: '#a86e17',
  },
  {
    course: 'ICS 314',
    days: ['Fri'],
    start: 10 * 60 + 30,
    duration: 150,
    credits: 3,
    background: '#e6def2',
    accent: '#7856a7',
  },
];

// Each demo option shifts the meeting times by this many minutes.
const sampleOffsets = [0, 15, 30];

function formatTime(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = String(minutes % 60).padStart(2, '0');
  return `${hour % 12 || 12}:${minute} ${hour < 12 ? 'AM' : 'PM'}`;
}

export default function ScheduleBuilderPage() {
  const [scheduleIndex, setScheduleIndex] = useState<number | null>(null);

  const classes = scheduleIndex === null
    ? []
    : sampleClasses.map((item) => ({
      ...item,
      start: item.start + sampleOffsets[scheduleIndex],
    }));

  return (
    <main className="py-4 py-lg-5" style={{ backgroundColor: '#f5f2ef' }}>
      <div className="container" style={{ maxWidth: 1168 }}>
        <header className="row align-items-center gy-2 mb-4">
          <div className="col-md-3 small">
            <Link href="/" className="link-success">Home</Link>
            {' / Schedule Builder'}
          </div>
          <h1 className="col-md-6 h2 fw-bold text-md-center mb-0">
            Schedule Builder
          </h1>
          <div className="col-md-3 small text-md-end">
            Spring 2027 sample data
          </div>
        </header>

        <div className="row g-3 align-items-start">
          <aside className="col-lg-4 col-xl-auto" style={{ maxWidth: 340 }}>
            <section className="p-3 rounded-3" style={{ backgroundColor: '#e8e5da' }}>
              <h2 className="h5 fw-bold mb-3">Your preferences</h2>

              <label htmlFor="term" className="form-label fw-semibold">Term</label>
              <select id="term" className="form-select rounded-pill mb-3">
                <option>Spring 2027</option>
              </select>

              <label htmlFor="credits" className="form-label fw-semibold">
                Target credits
              </label>
              <input
                id="credits"
                className="form-control rounded-pill mb-3"
                type="number"
                min={1}
                defaultValue={14}
              />

              <label htmlFor="format" className="form-label fw-semibold">
                Class format
              </label>
              <select id="format" className="form-select rounded-pill mb-3">
                <option>Any format</option>
                <option>In person</option>
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
                        defaultChecked={['Mon', 'Wed', 'Fri'].includes(day)}
                        style={{ accentColor: '#005435' }}
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
                    defaultValue="09:00"
                  />
                  <span>to</span>
                  <input
                    aria-label="End time"
                    className="form-control rounded-pill px-2"
                    type="time"
                    defaultValue="15:00"
                  />
                </div>
              </fieldset>

              <button
                type="button"
                className="btn w-100 rounded-pill fw-semibold text-white"
                style={{ backgroundColor: '#005435' }}
                onClick={() => setScheduleIndex(0)}
              >
                Generate schedules
              </button>
            </section>
          </aside>

          <section className="col-lg">
            <div className="border rounded-3 p-3">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                <h2 className="h5 fw-bold mb-0" aria-live="polite">
                  {scheduleIndex === null ? 'Weekly schedule' : '3 sample schedules'}
                </h2>

                {scheduleIndex !== null && (
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
                      {scheduleIndex + 1} of {sampleOffsets.length}
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-light border rounded-pill px-3"
                      disabled={scheduleIndex === sampleOffsets.length - 1}
                      onClick={() => setScheduleIndex(scheduleIndex + 1)}
                    >
                      Next ›
                    </button>
                  </div>
                )}
              </div>

              {scheduleIndex === null && (
                <p className="small text-muted mb-2">No schedule yet.</p>
              )}

              <div className="overflow-auto border rounded-3 bg-white">
                <div
                  className="d-grid"
                  style={{
                    gridTemplateColumns: '94px repeat(5, minmax(105px, 1fr))',
                    minWidth: 619,
                  }}
                >
                  <div className="p-2 fw-semibold small border-end" style={{ backgroundColor: '#e8e5da' }}>
                    Time
                  </div>
                  {weekdays.map((day) => (
                    <div
                      key={day}
                      className="p-2 text-center fw-semibold small border-end"
                      style={{ backgroundColor: '#e8e5da' }}
                    >
                      {day}
                    </div>
                  ))}

                  <div className="border-end" aria-hidden="true">
                    {hours.map((hour) => (
                      <div key={hour} className="border-top px-2 pt-1 small" style={{ height: hourHeight }}>
                        {formatTime(hour * 60)}
                      </div>
                    ))}
                  </div>

                  {weekdays.map((day) => (
                    <div key={day} className="position-relative border-end" aria-hidden="true">
                      {hours.map((hour) => (
                        <div key={hour} className="border-top" style={{ height: hourHeight }} />
                      ))}

                      {classes.filter((item) => item.days.includes(day)).map((item) => (
                        <div
                          key={item.course}
                          className="position-absolute rounded px-2 py-1 lh-sm"
                          style={{
                            top: (item.start - calendarStart) * hourHeight / 60,
                            height: item.duration * hourHeight / 60,
                            left: 3,
                            right: 3,
                            backgroundColor: item.background,
                            borderLeft: `4px solid ${item.accent}`,
                          }}
                        >
                          <div className="small fw-bold">{item.course}</div>
                          <div style={{ fontSize: '0.7rem' }}>
                            {formatTime(item.start)}–{formatTime(item.start + item.duration)}
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
                  <thead style={{ '--bs-table-bg': '#e8e5da' } as React.CSSProperties}>
                    <tr>
                      <th scope="col" className="ps-3">Course</th>
                      <th scope="col">Meeting days</th>
                      <th scope="col">Time</th>
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
                    ) : (
                      classes.map((item) => (
                        <tr key={item.course}>
                          <th scope="row" className="ps-3">{item.course}</th>
                          <td>{item.days.join(' / ')}</td>
                          <td className="text-nowrap">
                            {formatTime(item.start)}–{formatTime(item.start + item.duration)}
                          </td>
                          <td>{item.credits}</td>
                        </tr>
                      ))
                    )}
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