'use client';

import { memo, useMemo, useState } from 'react';
import { Badge, Breadcrumb, Button, Container, Dropdown, Form, Table } from 'react-bootstrap';
import {
  icsCourses,
  courseLevel,
  courseParticipation,
  type IcsCourse,
  type Participation,
} from '@/data/icsCourses';

const LEVELS = ['All', '100-Level', '200-Level', '300-Level', '400-Level', 'Graduate'];
const PARTICIPATION: ('Any' | Participation)[] = ['Any', 'In-Person', 'Hybrid', 'Online'];
const CREDIT_OPTIONS = [1, 2, 3, 4];

/** Summarizes selected credit values: contiguous runs as ranges ("1-2"),
 *  non-contiguous values individually ("1, 3"). Empty -> "Any". */
const creditsSummary = (selected: number[]): string => {
  if (selected.length === 0) return 'Any';
  const sorted = [...selected].sort((a, b) => a - b);
  const parts: string[] = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (let i = 1; i <= sorted.length; i++) {
    if (i < sorted.length && sorted[i] === prev + 1) {
      prev = sorted[i];
      continue;
    }
    parts.push(start === prev ? `${start}` : `${start}-${prev}`);
    if (i < sorted.length) {
      start = sorted[i];
      prev = sorted[i];
    }
  }
  return parts.join(', ');
};

const CourseRow = memo(function CourseRow({ course }: { course: IcsCourse }) {
  return (
    <tr>
      <td className="text-nowrap fw-semibold">{course.code}</td>
      <td>
        {course.title}
        {course.notes && <div className="text-muted small mt-1">{course.notes}</div>}
      </td>
      <td className="text-nowrap">{course.credits}</td>
      <td>{course.faculty ?? '—'}</td>
      <td className="small">{course.schedule ?? '—'}</td>
      <td className="text-nowrap">{course.rating ?? '—'}</td>
      <td className="small">{course.prerequisites ?? 'None'}</td>
    </tr>
  );
});

interface Filters {
  query: string;
  level: string;
  participation: 'Any' | Participation;
  credits: number[];
  professor: string;
}

const DEFAULT_FILTERS: Filters = {
  query: '',
  level: 'All',
  participation: 'Any',
  credits: [],
  professor: 'Any',
};

/** The ICS course browser page, styled after the Harvard DCE course catalog. */
const CourseBrowser = () => {
  // Draft filter values - results only update when "Apply Filters" is clicked.
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [applied, setApplied] = useState<Filters>(DEFAULT_FILTERS);

  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const toggleCredit = (n: number) =>
    setFilter(
      'credits',
      filters.credits.includes(n)
        ? filters.credits.filter((c) => c !== n)
        : [...filters.credits, n]
    );

  const allCreditsChecked = filters.credits.length === CREDIT_OPTIONS.length;

  const applyFilters = () => setApplied({ ...filters });

  const professors = useMemo(() => {
    const names = new Set<string>();
    for (const c of icsCourses) {
      c.faculty?.split('/').forEach((n) => names.add(n.trim()));
    }
    return ['Any', ...[...names].sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = applied.query.trim().toLowerCase();
    return icsCourses.filter((c) => {
      if (applied.level !== 'All' && courseLevel(c.code) !== applied.level) return false;
      if (applied.participation !== 'Any' && courseParticipation(c) !== applied.participation)
        return false;
      if (applied.credits.length > 0) {
        const cred = parseInt(c.credits, 10);
        if (Number.isNaN(cred) || !applied.credits.includes(cred)) return false;
      }
      if (applied.professor !== 'Any' && !c.faculty?.includes(applied.professor)) return false;
      if (!q) return true;
      return [c.code, c.title, c.faculty, c.notes, c.prerequisites, c.schedule]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q));
    });
  }, [applied]);

  const groups = useMemo(() => {
    const map = new Map<string, IcsCourse[]>();
    for (const c of filtered) {
      const lvl = courseLevel(c.code);
      map.set(lvl, [...(map.get(lvl) ?? []), c]);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <main>
      <Container className="py-4">
        <Breadcrumb className="justify-content-center">
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item active>Search ICS Courses</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-center">Search ICS Courses</h1>
        <p className="text-muted text-center">
          University of Hawaiʻi at Mānoa &mdash; Information and Computer Sciences.
          Typical schedules, faculty, and student ratings compiled from Star GPS and course evaluations.{' '}
          <Badge style={{ backgroundColor: '#024731' }}>UH Mānoa</Badge>
        </p>

        <div className="d-flex justify-content-center">
          <Form.Control
            type="search"
            placeholder="Search courses, faculty, notes..."
            value={filters.query}
            onChange={(e) => setFilter('query', e.target.value)}
            className="mb-3"
            style={{ maxWidth: '480px' }}
            aria-label="Search courses"
          />
        </div>

        <div className="d-flex justify-content-center gap-2 mb-2 flex-wrap">
          <Form.Select
            value={filters.level}
            onChange={(e) => setFilter('level', e.target.value)}
            style={{ width: 'auto' }}
            aria-label="Filter by course level"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l === 'All' ? 'All Levels' : l}
              </option>
            ))}
          </Form.Select>

          <Form.Select
            value={filters.participation}
            onChange={(e) =>
              setFilter('participation', e.target.value as 'Any' | Participation)
            }
            style={{ width: 'auto' }}
            aria-label="Filter by participation"
          >
            {PARTICIPATION.map((p) => (
              <option key={p} value={p}>
                {p === 'Any' ? 'Any Participation' : p}
              </option>
            ))}
          </Form.Select>

          <Form.Select
            value={filters.professor}
            onChange={(e) => setFilter('professor', e.target.value)}
            style={{ width: 'auto' }}
            aria-label="Filter by professor"
          >
            {professors.map((p) => (
              <option key={p} value={p}>
                {p === 'Any' ? 'Any Professor' : p}
              </option>
            ))}
          </Form.Select>

          <Dropdown autoClose={false}>
            <Dropdown.Toggle variant="outline-secondary" id="credits-filter">
              Credits: {creditsSummary(filters.credits)}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() =>
                  setFilter('credits', allCreditsChecked ? [] : [...CREDIT_OPTIONS])
                }
              >
                <Form.Check
                  type="checkbox"
                  label="All"
                  checked={allCreditsChecked}
                  readOnly
                />
              </Dropdown.Item>
              <Dropdown.Divider />
              {CREDIT_OPTIONS.map((n) => (
                <Dropdown.Item key={n} onClick={() => toggleCredit(n)}>
                  <Form.Check
                    type="checkbox"
                    label={`${n} credit${n > 1 ? 's' : ''}`}
                    checked={filters.credits.includes(n)}
                    readOnly
                  />
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="d-flex justify-content-center mb-3">
          <Button variant="primary" onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>

        <p className="text-muted small">
          Showing {filtered.length} of {icsCourses.length} courses
        </p>

        {groups.length === 0 && (
          <p>No courses match your search.</p>
        )}

        {groups.map(([lvl, courses]) => (
          <div key={lvl} className="mb-4">
            <h2 className="h4 border-bottom pb-2">
              {lvl}{' '}
              <Badge bg="secondary" className="fs-6 fw-normal">
                {courses.length}
              </Badge>
            </h2>
            <Table striped hover responsive className="align-middle">
              <thead>
                <tr>
                  <th>Course #</th>
                  <th>Title</th>
                  <th>Credits</th>
                  <th>Faculty</th>
                  <th>Typical Schedule</th>
                  <th>Rating</th>
                  <th>Prerequisites</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <CourseRow key={c.code} course={c} />
                ))}
              </tbody>
            </Table>
          </div>
        ))}
      </Container>
    </main>
  );
};

export default CourseBrowser;
