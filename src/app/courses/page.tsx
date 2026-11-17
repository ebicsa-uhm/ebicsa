'use client';

import { memo, useMemo, useState } from 'react';
import {
  Badge,
  Breadcrumb,
  Button,
  Container,
  Form,
  Pagination,
  Table,
} from 'react-bootstrap';
import {
  icsCourses,
  courseLevel,
  courseNumber,
  courseParticipation,
  courseStatus,
  sectionStatus,
  DEGREE_PATHWAYS,
  type IcsCourse,
  type CourseStatus,
  type Participation,
  type SectionStatus,
} from '@/data/icsCourses';

const PARTICIPATION: ('Any' | Participation)[] = ['Any', 'In-Person', 'Hybrid', 'Online'];
const STATUS_OPTIONS: ('Any' | SectionStatus)[] = [
  'Any',
  'Open',
  'Waitlist',
  'Closed',
  'Full',
];
const STATUS_BADGE: Record<CourseStatus, string> = {
  Core: 'success',
  Undergraduate: 'primary',
  Graduate: 'info',
  Noncredit: 'secondary',
};
const PAGE_SIZE = 10;
const UH_BADGE_STYLE = { backgroundColor: '#024731' } as const;

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
  const status = courseStatus(course.code);
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
        {course.notes && (
          <div className="text-muted small mt-1 fst-italic">{course.notes}</div>
        )}
      </td>
      <td className="text-center">
        <Badge bg={STATUS_BADGE[status]}>{status}</Badge>
      </td>
      <td>{course.faculty ?? '—'}</td>
      <td className="small">{locations.length ? locations.join(', ') : '—'}</td>
      <td className="small">{course.prerequisites ?? 'None'}</td>
      <td className="small">
        <ScheduleList patterns={patterns} />
      </td>
      <td className="text-nowrap">{courseParticipation(course)}</td>
    </tr>
  );
});

interface Filters {
  query: string;
  participation: 'Any' | Participation;
  pathway: string;
  status: 'Any' | SectionStatus;
}

const DEFAULT_FILTERS: Filters = {
  query: '',
  participation: 'Any',
  pathway: 'Any',
  status: 'Any',
};

/** The ICS course browser page, styled after the Harvard DCE course catalog. */
const CourseBrowser = () => {
  // Draft filter values - results only update when "Apply Filters" is clicked.
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [applied, setApplied] = useState<Filters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const applyFilters = () => {
    setApplied({ ...filters });
    setPage(1);
  };

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
      if (
        pathwayNums &&
        !pathwayNums.has(courseNumber(c.code)) &&
        courseLevel(c.code) !== '400-Level'
      )
        return false;
      if (applied.participation !== 'Any' && courseParticipation(c) !== applied.participation)
        return false;
      if (applied.status !== 'Any' && sectionStatus(c) !== applied.status)
        return false;
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
            className="mb-3 rounded-pill"
            aria-label="Search courses"
          />
        </div>

        <div className="row g-2 justify-content-center mb-3">
          <div className="col-12 col-sm-6 col-lg-3">
            <Form.Select
              value={filters.participation}
              onChange={(e) =>
                setFilter('participation', e.target.value as 'Any' | Participation)
              }
              className="rounded-pill w-100"
              aria-label="Filter by participation"
            >
              {PARTICIPATION.map((p) => (
                <option key={p} value={p}>
                  {p === 'Any' ? 'Any Participation' : p}
                </option>
              ))}
            </Form.Select>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <Form.Select
              value={filters.pathway}
              onChange={(e) => setFilter('pathway', e.target.value)}
              className="rounded-pill w-100"
              aria-label="Filter by degree pathway"
            >
              <option value="Any">Any Pathway</option>
              {DEGREE_PATHWAYS.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </Form.Select>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <Form.Select
              value={filters.status}
              onChange={(e) =>
                setFilter('status', e.target.value as 'Any' | SectionStatus)
              }
              className="rounded-pill w-100"
              aria-label="Filter by course status"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st === 'Any' ? 'Any Status' : st}
                </option>
              ))}
            </Form.Select>
          </div>

          <div className="col-12 col-sm-6 col-lg-3 d-flex gap-2">
            <Button
              variant="primary"
              onClick={applyFilters}
              className="rounded-pill flex-fill"
            >
              Apply Filters
            </Button>
          </div>
        </div>

        <p className="text-muted small">
          Showing {filtered.length} of {icsCourses.length} courses
          {pageCount > 1 && ` — page ${page} of ${pageCount}`}
        </p>

        {activePathway && (
          <p className="text-muted small text-center">{activePathway.note}</p>
        )}

        {paged.length === 0 && (
          <p>No courses match your search.</p>
        )}

        {pageCount > 1 && (
          <div className="d-flex justify-content-end mb-3">
            <Pagination size="sm" className="pagination-compact mb-0">
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

        <Table striped hover responsive className="align-middle">
          <thead>
            <tr>
              <th>Course #</th>
              <th>Title</th>
              <th className="text-center">Status</th>
              <th>Faculty</th>
              <th>Location</th>
              <th>Prerequisites</th>
              <th style={{ width: '12%' }}>Meets</th>
              <th>Participation</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c) => (
              <CourseRow key={c.crn ?? c.code} course={c} />
            ))}
          </tbody>
        </Table>
      </Container>
    </main>
  );
};

export default CourseBrowser;
