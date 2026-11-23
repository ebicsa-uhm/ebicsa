import Link from 'next/link';
import { Container } from 'react-bootstrap';

const team = [
  { name: 'Chicco', email: 'chicco@hawaii.edu' },
  { name: 'Rodemar', email: 'rcadiz24@hawaii.edu' },
  { name: 'Rocky', email: 'rocky99@hawaii.edu' },
  { name: 'Jonathan', email: 'chungjon@hawaii.edu' },
];

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="site-footer mt-auto">
    <Container className="d-flex flex-wrap justify-content-between gap-3">
      <div>
        <strong>EBICSA</strong>
        ICS 314 Final Project · University of Hawaii at Mānoa
      </div>
      <nav>
        <Link href="/courses">Course Search</Link>
        <Link href="/schedule-builder">Schedule Builder</Link>
        <Link href="/my-schedules">My Schedules</Link>
        <Link href="https://www.ics.hawaii.edu/academics/">Degree Pathways</Link>
        <Link href="https://ebicsa-uhm.github.io/#user-guide">Help</Link>
        <a href="https://github.com/ebicsa-uhm/ebicsa">
          GitHub
        </a>
      </nav>
    </Container>
    <Container className="d-flex flex-wrap justify-content-between gap-3">
      Hi
    </Container>
  </footer>
);

export default Footer;