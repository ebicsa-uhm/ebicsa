'use client';

import Link from 'next/link';
import { useState, useSyncExternalStore } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { Badge, Button, Modal, Spinner } from 'react-bootstrap';
import { CheckCircleFill } from 'react-bootstrap-icons';
import { courseNumber, courseStatus, type CourseStatus } from '@/data/icsCourses';
import {
  currentScheduleMonth,
  generateSchedules,
  hasScheduleData,
  scheduleTerms,
  searchCourses,
} from '@/lib/schedule-builder';
import { saveGeneratedSchedule } from '@/lib/saved-schedules';
import type { CoursePreferences } from '@/lib/schedule-builder';
import CoursePreferencesModal from './course-preferences';
import styles from '../my-schedules/my-schedules.module.css';


const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const hourHeight = 50;
const beige = { backgroundColor: '#e8e5df' };
const primaryGreen = { backgroundColor: '#064b38', color: 'white' };

const statusBadge: Record<CourseStatus, string> = {
  Core: 'success',
  Undergraduate: 'primary',
  Graduate: 'info',
  Noncredit: 'secondary',
};

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

function subscribeToTermMonth(onChange: () => void) {
  window.addEventListener('focus', onChange);
  return () => window.removeEventListener('focus', onChange);
}

function serverTermMonth() {
  return null;
}

function CourseBadges({ code }: { code: string }) {
  const status = courseStatus(code);
  const level = courseNumber(code) >= 500 ? 'Graduate' : 'Undergraduate';

  return (
    <span className="d-flex flex-wrap gap-1 mt-1">
      <Badge bg={statusBadge[status]}>{status}</Badge>
      {status === 'Core' && <Badge bg={statusBadge[level]}>{level}</Badge>}
    </span>
  );
}

export default function ScheduleBuilderPage() {
  const [query, setQuery] = useState('');
  const [chosenTerm, setChosenTerm] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [editingCourse, setEditingCourse] = useState<string | null>(null);
  const [byCourse, setByCourse] = useState<Record<string, CoursePreferences>>({});
  const [result, setResult] = useState<ReturnType<typeof generateSchedules> | null>(null);
  const [scheduleIndex, setScheduleIndex] = useState(0);
 const [error, setError] = useState<{
  title: string;
  detail: string;
  courses?: ReturnType<typeof generateSchedules>['unavailableCourses'];
} | null>(null);
  const [targetCredits, setTargetCredits] = useState('14');
  const [showSave, setShowSave] = useState(false);
  const [scheduleName, setScheduleName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedName, setSavedName] = useState('');
  const [saveError, setSaveError] = useState('');

  const currentMonth = useSyncExternalStore(subscribeToTermMonth, currentScheduleMonth, serverTermMonth);
  const terms = scheduleTerms(currentMonth);
  const term = terms.includes(chosenTerm) ? chosenTerm : (terms.find(hasScheduleData) ?? terms[0]);
  const suggestions = searchCourses(query, selected);
  const classes = result?.schedules[scheduleIndex] ?? [];
  const defaultScheduleName = result ? `${result.term} Schedule ${scheduleIndex + 1}` : '';
  const totalCredits = classes.reduce((total, item) => total + Number(item.credits), 0);
  const blocks = classes.flatMap((section, index) => section.meetings.map((meeting) => ({
    ...meeting,
    code: section.code,
    crn: section.crn,
    colors: colors[index % colors.length],
  })));
  const firstHour = Math.min(8, ...blocks.map((block) => Math.floor(block.start / 60)));
  const lastHour = Math.max(20, ...blocks.map((block) => Math.ceil(block.end / 60)));
  const hours = Array.from({ length: lastHour - firstHour }, (_, index) => firstHour + index);

  function clearResults() {
    setResult(null);
    setScheduleIndex(0);
    setError(null);
    setShowSave(false);
  }

  function addCourse(code: string) {
    setSelected((courses) => courses.includes(code) ? courses : [...courses, code]);
    setQuery('');
    clearResults();
  }

   function updateCoursePreferences(code: string, preferences?: CoursePreferences) {
    setByCourse((current) => {
      const next = { ...current };
      if (preferences) next[code] = preferences;
      else delete next[code];
      return next;
    });
    clearResults();
  } 

 function openSave() {
  setScheduleName('');
  setSavedName('');
  setSaveError('');
  setShowSave(true);
}

async function confirmSave(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  if (!result || classes.length === 0 || isSaving) return;

  const name = scheduleName.trim() || defaultScheduleName;
  setSaveError('');
  setIsSaving(true);

  try {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 750));
    saveGeneratedSchedule(name, classes, result.term);
    setSavedName(name);
  } catch {
    setSaveError('Could not save this schedule. Check that browser storage is allowed and try again.');
  } finally {
    setIsSaving(false);
  }
}

  function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selected.length === 0) return;
    clearResults();

    const values = new FormData(event.currentTarget);
    const start = timeInputMinutes(values.get('start'));
    const end = timeInputMinutes(values.get('end'));

    if (!hasScheduleData(term)) {
      setError({
        title: 'Schedule data unavailable',
        detail: `EBICSA does not have class sections for ${term} yet. Choose a term with schedule data to generate an option.`,
      });
      return;
    }

    if (start >= end) {
      setError({
        title: 'Check your time window',
        detail: 'Choose an end time after the start time, then generate again.',
      });
      return;
    }

      const next = generateSchedules(selected, {
      term,
      days: values.getAll('days').map(String),
      start,
      end,
      format: String(values.get('format')),
      byCourse,
    });

    if (next.unavailableCourses.length) {
      setError({
        title: 'Could not schedule every course',
        detail: `Here’s what prevented these courses from being scheduled for ${term}.`,
        courses: next.unavailableCourses,
      });
      return;
    }

    if (!next.schedules.length) {
      setError({
        title: 'Section times overlap',
        detail: 'Each course has a matching section, but no combination fits without a time conflict. Try widening your availability to include more sections or swapping a course.',
      });
      return;
    }

    setResult(next);
  }

  return (
        <main className={styles.page}>
      <div>
        <header className={styles.titleBar}>
          <span><Link href="/">Home</Link> / Schedule Builder</span>
          <h1>Schedule Builder</h1>
        </header>

        <div className="row g-3 align-items-start">
          <aside className="col-lg-4 col-xl-3">
            <form
              className={styles.card}
              onSubmit={generate}
              onChange={(event) => {
                if (event.target instanceof Element
                  && ['term', 'days', 'start', 'end', 'format'].includes(event.target.getAttribute('name') ?? '')) {
                  clearResults();
                }
              }}
            >
              <h2 className="mb-3">Your preferences</h2>

              <label htmlFor="term" className="form-label fw-semibold">Term</label>
              <select
                id="term"
                name="term"
                className="form-select rounded-pill mb-3"
                value={term}
                onChange={(event) => setChosenTerm(event.target.value)}
              >
                {terms.map((option) => (
                  <option key={option} value={option}>
                    {option}{hasScheduleData(option) ? '' : ' (data unavailable)'}
                  </option>
                ))}
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
                  {suggestions.map(({ code, title }) => {
                    const status = courseStatus(code);
                    const level = courseNumber(code) >= 500 ? 'Graduate' : 'Undergraduate';

                    return (
                      <li key={code} className="list-group-item p-0">
                        <button
                          type="button"
                          className="btn btn-light w-100 text-start"
                          onClick={() => addCourse(code)}
                        >
                          <strong>{code}</strong> · {title}
                          <span className="d-flex flex-wrap gap-1 mt-1">
                            <Badge bg={statusBadge[status]}>{status}</Badge>
                            {status === 'Core' && (
                              <Badge bg={statusBadge[level]}>{level}</Badge>
                            )}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                  {suggestions.length === 0 && (
                    <li className="list-group-item small">No courses to add match your search.</li>
                  )}
                </ul>
              )}

                            <ul className="list-unstyled d-flex flex-wrap gap-2 mt-2 mb-3" aria-label="Selected courses">
                {selected.map((code) => (
                  <li key={code} className="btn-group">
                    <button
                      type="button"
                      className={`btn btn-sm ${byCourse[code] ? 'btn-success' : 'btn-outline-success'}`}
                      aria-label={`Edit ${code} preferences${byCourse[code] ? ' (custom)' : ''}`}
                      aria-haspopup="dialog"
                      onClick={() => setEditingCourse(code)}
                    >
                      {code}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success"
                      aria-label={`Remove ${code}`}
                      onClick={() => {
                        setSelected((courses) => courses.filter((course) => course !== code));
                        updateCoursePreferences(code);
                      }}
                    >
                      ×
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
                className="btn w-100 rounded-pill"
                style={primaryGreen}
                disabled={selected.length === 0}
              >
                Generate Schedule
              </button>
            </form>
          </aside>

          <section className="col-lg">
            <div className={styles.card}>
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                <h2 className="mb-0" aria-live="polite">
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
                  Add courses and press generate to see your schedule!
                </p>
              )}

              <div
                className="overflow-auto border rounded-3 bg-white"
                style={{ '--bs-border-color': '#dedbd4' } as CSSProperties}
                aria-hidden="true"
              >
                <div
                  className="d-grid"
                  style={{ gridTemplateColumns: '94px repeat(5, minmax(105px, 1fr))', minWidth: 619 }}
                >
                  <div className="p-2 fw-semibold border-end" style={beige}>Time</div>
                  {weekdays.map((day) => (
                    <div key={day} className="p-2 text-center fw-semibold border-end" style={beige}>
                      {day}
                    </div>
                  ))}

                  <div className="border-end">
                    {hours.map((hour) => (
                      <div key={hour} className="border-top px-2 pt-1 text-nowrap" style={{ height: hourHeight }}>
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
                          <div className="small">
                            {formatTime(block.start)}–{formatTime(block.end)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <hr />

              <h3>Classes in this schedule</h3>
              <div className="table-responsive border rounded-3">
                <table className="table table-sm align-middle mb-0">
                  <thead style={{ '--bs-table-bg': '#e8e5df' } as CSSProperties}>
                    <tr>
                      <th scope="col" className="ps-3">Course</th>
                      <th scope="col">Section details</th>
                      <th scope="col">Meeting days</th>
                      <th scope="col">Time and location</th>
                      <th scope="col">Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-3 text-center text-muted">
                          No classes yet...
                        </td>
                      </tr>
                    ) : classes.map((item) => (
                      <tr key={item.crn}>
                        <th scope="row" className="ps-3">
                          {item.code}
                          <CourseBadges code={item.code} />
                        </th>
                        <td className="small text-nowrap">
                          <div>CRN: {item.crn}</div>
                          <div>Section: {item.section ?? '—'}</div>
                        </td>
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
                                <button
                  type="button"
                  className="btn rounded-pill px-4"
                  style={primaryGreen}
                  disabled={classes.length === 0}
                  onClick={openSave}
                >
                  Save Schedule
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

            {editingCourse && (
        <CoursePreferencesModal
          key={editingCourse}
          code={editingCourse}
          weekdays={weekdays}
          preferences={byCourse[editingCourse]}
          onClose={() => setEditingCourse(null)}
          onApply={(preferences) => {
            updateCoursePreferences(editingCourse, preferences);
            setEditingCourse(null);
          }}
        />
      )}
      
      <Modal
        show={error !== null}
        onHide={() => setError(null)}
        aria-labelledby="schedule-error-title"
        aria-describedby="schedule-error-detail"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="schedule-error-title">{error?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body id="schedule-error-detail">
          {error?.detail}
          {error?.courses && (
            <ul className="mt-2 mb-0 ps-3">
              {error.courses.map(({ code, reason }) => (
                <li key={code} className="mb-1">
                  <strong>{code}:</strong> {reason}
                </li>
              ))}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setError(null)}>Back to builder</Button>
        </Modal.Footer>
      </Modal>

      <Modal
  show={showSave}
  onHide={() => setShowSave(false)}
  backdrop={isSaving ? 'static' : true}
  keyboard={!isSaving}
  aria-labelledby="schedule-save-title"
  centered
>
  <Modal.Header closeButton={!isSaving} className={savedName ? 'border-0' : undefined}>
    <Modal.Title
      id="schedule-save-title"
      className={savedName ? 'visually-hidden' : undefined}
    >
      {savedName ? 'Schedule saved' : 'Save this schedule?'}
    </Modal.Title>
  </Modal.Header>

  {isSaving ? (
    <Modal.Body className="text-center py-4" role="status">
      <Spinner animation="border" variant="success" aria-hidden="true" />
      <p className="mb-0 mt-2">Saving schedule…</p>
    </Modal.Body>
  ) : savedName ? (
    <>
      <Modal.Body className="text-center py-4" role="status">
        <CheckCircleFill size={48} className="text-success mb-3" aria-hidden="true" />
        <p className="h5 mb-2">Saved successfully!</p>
        <p className="mb-0">“{savedName}” was added to My Schedules in this browser.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={() => setShowSave(false)}>
          Back to builder
        </Button>
        <Link href="/my-schedules" className="btn btn-success">
          Open My Schedules
        </Link>
      </Modal.Footer>
    </>
  ) : (
    <form onSubmit={confirmSave}>
      <Modal.Body>
        <label htmlFor="schedule-name" className="form-label">Schedule name (optional)</label>
        <input
          id="schedule-name"
          name="schedule-name"
          className="form-control"
          placeholder={defaultScheduleName}
          value={scheduleName}
          onChange={(event) => setScheduleName(event.target.value)}
          maxLength={80}
        />
        {saveError && <p role="alert" className="text-danger mt-2 mb-0">{saveError}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="outline-secondary" onClick={() => setShowSave(false)}>
          Keep browsing
        </Button>
        <Button type="submit" variant="success">Confirm Save</Button>
      </Modal.Footer>
    </form>
  )}
</Modal>
    </main>
  );
}