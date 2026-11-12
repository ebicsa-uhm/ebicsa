'use client';

import { memo, useMemo, useState } from 'react';
import {
  Badge,
  Breadcrumb,
  Button,
  Container,
  Dropdown,
  Form,
  Pagination,
  Table,
} from 'react-bootstrap';
import {
  icsCourses,
  courseLevel,
  courseNumber,
  courseParticipation,
  DEGREE_PATHWAYS,
  type IcsCourse,
  type Participation,
} from '@/data/icsCourses';

const LEVELS = ['All', '100-Level', '200-Level', '300-Level', '400-Level', 'Graduate'];
const PARTICIPATION: ('Any' | Participation)[] = ['Any', 'In-Person', 'Hybrid', 'Online'];
const CREDIT_OPTIONS = [1, 2, 3, 4];
const PAGE_SIZE = 10;
const UH_BADGE_STYLE = { backgroundColor: '#024731' } as const;

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

interface SchedulePattern {
  label: string;
  location?: string;
  online: boolean;
}

/** Converts "9:00 AM"/"1:30 PM" style times to 24-hour "09:00"/"13:30". */
const to24h = (s: string): string =>
  s.replace(/\b(\d{1,2}):(\d{2})\s*(AM|PM)\b/gi, (_, h, m, ap) => {
    let hour = parseInt(h, 10) % 12;
    if (/pm/i.test(ap)) hour += 12;
    return `${String(hour).padStart(2, '0')}:${m}`;
  });

const scheduleCache = new Map<string, SchedulePattern[]>();

/** Splits a schedule string ("MW 9:00 AM - 10:15 AM, UHM KUY 101 + Online
 *  async") into meeting patterns with building locations separated out.
 *  Results are cached since many sections share identical schedule strings. */
const parseSchedule = (schedule: string | undefined): SchedulePattern[] => {
  if (!schedule) return [];
  const cached = scheduleCache.get(schedule);
  if (cached) return cached;
  const patterns = schedule.split(' + ').map((raw) => {
    const part = raw.trim();
    const idx = part.indexOf(', UHM');
    if (idx !== -1) {
      return {
        label: to24h(part.slice(0, idx)),
        location: part.slice(idx + 2),
        online: false,
      };
    }
    const cidx = part.lastIndexOf(', ');
    if (cidx !== -1 && /^online/i.test(part.slice(cidx + 2))) {
      return { label: to24h(part.slice(0, cidx)), online: true };
    }
    return { label: to24h(part), online: /^online/i.test(part) };
  });
  scheduleCache.set(schedule, patterns);
  return patterns;
};

const ScheduleList = ({ patterns }: { patterns: SchedulePattern[] }) => {
  if (patterns.length <= 1) return <>{patterns[0]?.label ?? '—'}</>;
  const onsite = patterns.filter((p) => !p.online);
  const online = patterns.filter((p) => p.online);
  return (
    <ul className="list-unstyled mb-0">
      {[...onsite, ...online].map((p, i) => (
        <li key={`${p.label}-${i}`}>
          <span aria-hidden="true" className="me-1">
            {p.online ? '◦' : '•'}
          </span>
          {p.label}
        </li>
      ))}
    </ul>
  );
};

const CourseRow = memo(function CourseRow({ course }: { course: IcsCourse }) {
  const patterns = parseSchedule(course.schedule);
  const locations = [
    ...new Set(patterns.map((p) => p.location).filter((l): l is string => !!l)),
  ];
  if (patterns.some((p) => p.online)) locations.push('Online');
  return (
    <tr>
      <td className="text-nowrap fw-semibold">
        {course.code}
        {course.crn && (
          <div className="text-muted small fw-normal">
            CRN {course.crn}
            {course.section && ` · Sec ${course.section}`}
          </div>
        )}
      </td>
      <td>
        {course.title}
        {course.description && (
          <div className="text-muted small course-description mt-1">
            {course.description}
          </div>
        )}
        {course.notes && (
          <div className="text-muted small mt-1 fst-italic">{course.notes}</div>
        )}
      </td>
      <td className="text-center text-nowrap">{course.credits}</td>
      <td>{course.faculty ?? '—'}</td>
      <td className="small">
        <ScheduleList patterns={patterns} />
      </td>
      <td className="small">{locations.length ? locations.join(', ') : '—'}</td>
      <td className="text-nowrap">{courseParticipation(course)}</td>
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
  pathway: string;
}

const DEFAULT_FILTERS: Filters = {
  query: '',
  level: 'All',
  participation: 'Any',
  credits: [],
  professor: 'Any',
  pathway: 'Any',
};

/** The ICS course browser page, styled after the Harvard DCE course catalog. */
const CourseBrowser = () => {
  // Draft filter values - results only update when "Apply Filters" is clicked.
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [applied, setApplied] = useState<Filters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

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

  const applyFilters = () => {
    setApplied({ ...filters });
    setPage(1);
  };

  const professors = useMemo(() => {
    const names = new Set<string>();
    for (const c of icsCourses) {
      c.faculty?.split('/').forEach((n) => names.add(n.trim()));
    }
    return ['Any', ...[...names].sort()];
  }, []);

  const activePathway = useMemo(
    () => DEGREE_PATHWAYS.find((p) => p.key === applied.pathway),
    [applied.pathway]
  );

  const filtered = useMemo(() => {
    const q = applied.query.trim().toLowerCase();
    const pathwayNums = activePathway
      ? new Set(activePathway.courses.map(courseNumber))
      : null;
    return icsCourses.filter((c) => {
      if (pathwayNums && !pathwayNums.has(courseNumber(c.code))) return false;
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
  }, [applied, activePathway]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const groups = useMemo(() => {
    const map = new Map<string, IcsCourse[]>();
    for (const c of paged) {
      const lvl = courseLevel(c.code);
      map.set(lvl, [...(map.get(lvl) ?? []), c]);
    }
    return [...map.entries()];
  }, [paged]);

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
          Spring 2027 schedules and faculty compiled from Star GPS (Jan 11 &ndash; May 14, 2027).{' '}
          <Badge style={UH_BADGE_STYLE}>UH Mānoa</Badge>
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

          <Form.Select
            value={filters.pathway}
            onChange={(e) => setFilter('pathway', e.target.value)}
            style={{ width: 'auto' }}
            aria-label="Filter by degree pathway"
          >
            <option value="Any">Any Pathway</option>
            {DEGREE_PATHWAYS.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
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
          <Button variant="secondary" onClick={() => setFilters(DEFAULT_FILTERS)} className="ms-2">
            Clear Filters
          </Button>
        </div>

        <p className="text-muted small">
          Showing {filtered.length} of {icsCourses.length} courses
          {pageCount > 1 && ` — page ${page} of ${pageCount}`}
        </p>

        {activePathway && (
          <p className="text-muted small text-center">{activePathway.note}</p>
        )}

        {groups.length === 0 && (
          <p>No courses match your search.</p>
        )}

        {pageCount > 1 && (
          <div className="d-flex justify-content-center mb-3">
            <Pagination className="mb-0">
              <Pagination.Prev
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              />
              {Array.from({ length: pageCount }, (_, i) => (
                <Pagination.Item
                  key={i}
                  active={page === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={page >= pageCount}
                onClick={() => setPage((p) => p + 1)}
              />
            </Pagination>
          </div>
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
                  <th className="text-center">Credits</th>
                  <th>Faculty</th>
                  <th style={{ width: '12%' }}>Typical Schedule</th>
                  <th>Location</th>
                  <th>Format</th>
                  <th>Prerequisites</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <CourseRow key={c.crn ?? c.code} course={c} />
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
