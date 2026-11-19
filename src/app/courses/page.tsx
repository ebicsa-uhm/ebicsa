'use client';

import { memo, useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Collapse,
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

const locationsOf = (patterns: SchedulePattern[]): string[] => {
  const locations = [
    ...new Set(patterns.map((p) => p.location).filter((l): l is string => !!l)),
  ];
  if (patterns.some((p) => p.online)) locations.push('Online');
  return locations;
};

/** Resolves a pathway course code to its catalog title. Exact matches win;
 *  suffix-less codes like 'ICS 691' fall back to numeric matching so they
 *  resolve to 'ICS 691B'/'ICS 691E'. Returns undefined when the course is
 *  not in the current catalog. */
const pathwayCourseTitle = (code: string): string | undefined => {
  const exact = icsCourses.find((c) => c.code === code);
  if (exact) return exact.title;
  const parts = code.split(' ');
  if (parts.length !== 2 || /[A-Za-z]$/.test(parts[1])) return undefined;
  const num = courseNumber(code);
  const match = icsCourses.find(
    (c) => c.code.split(' ')[0] === parts[0] && courseNumber(c.code) === num
  );
  return match?.title;
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

const CourseDetail = ({ course }: { course: IcsCourse }) => (
  <td colSpan={9} className="bg-light">
    <div className="small">{course.description ?? 'No description available.'}</div>
    {(course.gradeMode || course.attributes) && (
      <div className="text-muted small mt-1">
        {[course.gradeMode, course.attributes].filter(Boolean).join(' · ')}
      </div>
    )}
  </td>
);

const CourseRow = memo(function CourseRow({ course }: { course: IcsCourse }) {
  const [open, setOpen] = useState(false);
  const patterns = parseSchedule(course.schedule);
  const status = courseStatus(course.code);
  const locations = locationsOf(patterns);
  return (
    <>
      <tr>
        <td className="text-center" style={{ width: '1%' }}>
          <Button
            size="sm"
            variant="link"
            className="p-0 text-secondary"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={`${open ? 'Hide' : 'Show'} details for ${course.code}`}
          >
            {open ? '▾' : '▸'}
          </Button>
        </td>
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
      <tr className={open ? 'course-detail' : 'course-detail d-none'}>
        <CourseDetail course={course} />
      </tr>
    </>
  );
});

const CourseCard = memo(function CourseCard({ course }: { course: IcsCourse }) {
  const patterns = parseSchedule(course.schedule);
  const status = courseStatus(course.code);
  const locations = locationsOf(patterns);
  return (
    <Card className="mb-2">
      <Card.Body className="py-2">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <div>
            <span className="fw-semibold">{course.code}</span>
            {course.crn && (
              <span className="text-muted small ms-2">
                CRN {course.crn}
                {course.section && ` · Sec ${course.section}`}
              </span>
            )}
          </div>
          <Badge bg={STATUS_BADGE[status]}>{status}</Badge>
        </div>
        <div className="fw-semibold">{course.title}</div>
        {course.notes && <div className="text-muted small fst-italic">{course.notes}</div>}
        <div className="small mt-1">
          <ScheduleList patterns={patterns} />
        </div>
        <div className="small text-muted mt-1">
          {[
            locations.length ? locations.join(', ') : '—',
            course.faculty ?? '—',
            courseParticipation(course),
            `Pre-req: ${course.prerequisites ?? 'None'}`,
          ].join(' · ')}
        </div>
      </Card.Body>
    </Card>
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
  status: 'Open',
};

type SortKey = 'code' | 'title' | 'status' | 'faculty' | 'meets' | 'participation';

const sortValue = (c: IcsCourse, key: SortKey): string => {
  switch (key) {
    case 'code':
      return c.code;
    case 'title':
      return c.title;
    case 'status':
      return courseStatus(c.code);
    case 'faculty':
      return c.faculty ?? '';
    case 'meets':
      return c.schedule ?? '';
    case 'participation':
      return courseParticipation(c);
  }
};

const SortableTh = ({
  label,
  sortKey,
  activeKey,
  dir,
  onSort,
  className,
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  dir: 1 | -1;
  onSort: (k: SortKey) => void;
  className?: string;
}) => (
  <th
    className={className}
    onClick={() => onSort(sortKey)}
    role="button"
    aria-label={
      activeKey === sortKey
        ? `${label}, sorted ${dir === 1 ? 'ascending' : 'descending'}`
        : `Sort by ${label}`
    }
  >
    <span className="sortable-th">
      {label}
      {activeKey === sortKey && <span aria-hidden="true"> {dir === 1 ? '▲' : '▼'}</span>}
    </span>
  </th>
);

/** The ICS course browser page, styled after the Harvard DCE course catalog. */
const CourseBrowser = () => {
  // Filters apply live; the search query is deferred so typing stays smooth.
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>('code');
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [pathwayOpen, setPathwayOpen] = useState(true);
  const deferredQuery = useDeferredValue(filters.query);

  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const toggleSort = (k: SortKey) => {
    if (k === sortKey) {
      setSortDir((d) => (d === 1 ? -1 : 1));
    } else {
      setSortKey(k);
      setSortDir(1);
    }
    setPage(1);
  };

  // "/" focuses the search box from anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (
        e.key === '/' &&
        t.tagName !== 'INPUT' &&
        t.tagName !== 'SELECT' &&
        t.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        document.getElementById('course-search')?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const activePathway = useMemo(
    () => DEGREE_PATHWAYS.find((p) => p.key === filters.pathway),
    [filters.pathway]
  );

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
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
      if (filters.participation !== 'Any' && courseParticipation(c) !== filters.participation)
        return false;
      if (filters.status !== 'Any' && sectionStatus(c) !== filters.status)
        return false;
      if (!q) return true;
      return [c.code, c.title, c.faculty, c.notes, c.prerequisites, c.schedule]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q));
    });
  }, [filters, activePathway, deferredQuery]);

  const sorted = useMemo(
    () =>
      [...filtered].sort(
        (a, b) => sortValue(a, sortKey).localeCompare(sortValue(b, sortKey)) * sortDir
      ),
    [filtered, sortKey, sortDir]
  );

  const pageCount = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = useMemo(
    () => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sorted, page]
  );

  const activeChips: { label: string; clear: () => void }[] = [];
  if (filters.query)
    activeChips.push({
      label: `Search: ${filters.query}`,
      clear: () => setFilter('query', ''),
    });
  if (filters.participation !== 'Any')
    activeChips.push({
      label: filters.participation,
      clear: () => setFilter('participation', 'Any'),
    });
  if (filters.pathway !== 'Any')
    activeChips.push({
      label: activePathway?.label ?? filters.pathway,
      clear: () => setFilter('pathway', 'Any'),
    });
  if (filters.status !== 'Any')
    activeChips.push({
      label: `Status: ${filters.status}`,
      clear: () => setFilter('status', 'Any'),
    });

  const thProps = { activeKey: sortKey, dir: sortDir, onSort: toggleSort };

  return (
    <main>
      <Container className="py-4">
        <Breadcrumb className="justify-content-center">
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item active>Search ICS Courses</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-center">Search ICS Courses</h1>

        <div className="d-flex justify-content-center no-print">
          <Form.Control
            id="course-search"
            type="search"
            placeholder="Search courses, faculty, notes... (press / to focus)"
            value={filters.query}
            onChange={(e) => setFilter('query', e.target.value)}
            className="mb-3 rounded-pill"
            aria-label="Search courses"
          />
        </div>

        <div className="row g-2 justify-content-center mb-2 no-print">
          <div className="col-12 col-sm-6 col-lg-4">
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

          <div className="col-12 col-sm-6 col-lg-4">
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

          <div className="col-12 col-sm-6 col-lg-4">
            <Form.Select
              value={filters.status}
              onChange={(e) =>
                setFilter('status', e.target.value as 'Any' | SectionStatus)
              }
              className="rounded-pill w-100"
              aria-label="Filter by section status"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st === 'Any' ? 'Any Status' : st}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>

        {activeChips.length > 0 && (
          <div className="d-flex justify-content-center gap-1 mb-2 flex-wrap no-print">
            {activeChips.map((chip) => (
              <Badge
                key={chip.label}
                bg="secondary"
                role="button"
                tabIndex={0}
                onClick={chip.clear}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    chip.clear();
                  }
                }}
                style={{ cursor: 'pointer' }}
                title="Click to remove this filter"
              >
                {chip.label} ×
              </Badge>
            ))}
          </div>
        )}

        <p className="text-muted small no-print">
          Showing {sorted.length} of {icsCourses.length} courses
          {pageCount > 1 && ` — page ${page} of ${pageCount}`}
        </p>

        {activePathway && (
          <Card className="mb-3 pathway-card position-relative">
            <Card.Body className="text-center py-2">
              <Card.Title as="h2" className="h5 mb-0">
                {activePathway.label}
              </Card.Title>
              <Button
                size="sm"
                variant="link"
                className="p-0 text-secondary position-absolute bottom-0 end-0 m-2"
                onClick={() => setPathwayOpen((o) => !o)}
                aria-expanded={pathwayOpen}
                aria-label={`${pathwayOpen ? 'Hide' : 'Show'} ${activePathway.label} details`}
              >
                {pathwayOpen ? '▾' : '▸'}
              </Button>
              <Collapse in={pathwayOpen}>
                <div>
                  <Card.Text className="text-muted small">
                    {activePathway.description ?? activePathway.note}
                  </Card.Text>
                  {activePathway.requirements && (
                    <div className="row g-3 text-start mt-2">
                      {activePathway.requirements.map((req) => (
                        <div className="col-12 col-md" key={req.title}>
                          <h3 className="h6 text-uppercase text-muted mb-2">
                            {req.title}
                          </h3>
                          {req.courses && (
                            <ul className="list-unstyled mb-1">
                              {req.courses.map((code) => {
                                const title = pathwayCourseTitle(code);
                                return (
                                  <li key={code} className="small">
                                    <span className="fw-semibold">{code}</span>
                                    {title && (
                                      <span className="text-muted">
                                        {' '}
                                        — {title}
                                      </span>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                          {req.hint && (
                            <div className="small text-muted fst-italic">
                              {req.hint}
                            </div>
                          )}
                          {req.text && <div className="small">{req.text}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="text-muted small mt-3">
                    {activePathway.note}
                  </div>
                </div>
              </Collapse>
            </Card.Body>
          </Card>
        )}

        {paged.length === 0 && (
          <p>No courses match your current filters.</p>
        )}

        {pageCount > 1 && (
          <div className="d-flex justify-content-end mb-3 no-print">
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

        <Table
          striped
          hover
          className="course-table align-middle d-none d-md-table"
        >
          <thead>
            <tr>
              <th style={{ width: '2.5rem' }}>
                <span className="visually-hidden">Details</span>
              </th>
              <SortableTh label="Course #" sortKey="code" {...thProps} />
              <SortableTh label="Title" sortKey="title" {...thProps} />
              <SortableTh label="Status" sortKey="status" {...thProps} className="text-center" />
              <SortableTh label="Faculty" sortKey="faculty" {...thProps} />
              <th>Location</th>
              <th>Prerequisites</th>
              <SortableTh label="Meets" sortKey="meets" {...thProps} className="meets-col" />
              <SortableTh label="Participation" sortKey="participation" {...thProps} />
            </tr>
          </thead>
          <tbody>
            {paged.map((c) => (
              <CourseRow key={c.crn ?? c.code} course={c} />
            ))}
          </tbody>
        </Table>

        <div className="course-cards d-md-none">
          {paged.map((c) => (
            <CourseCard key={c.crn ?? c.code} course={c} />
          ))}
        </div>

        <p className="text-muted text-center small mt-4">
          University of Hawaiʻi at Mānoa &mdash; Information and Computer
          Sciences. Spring 2027 schedules and faculty compiled from Star GPS
          (Jan 11 &ndash; May 14, 2027).
        </p>
      </Container>
    </main>
  );
};

export default CourseBrowser;
