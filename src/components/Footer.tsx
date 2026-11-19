import Link from 'next/link';
import { Container } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="site-footer mt-auto">
    <Container className="d-flex flex-wrap justify-content-between gap-3">
      <div>
        <strong>EBICSA</strong>
        ICS 314 Final Project · University of Hawaii at Mānoa
      </div>
      <nav>
        <Link href="/course_search">Course Search</Link>
        <Link href="/schedule_builder">Schedule Builder</Link>
        <Link href="/my_schedules">My Schedules</Link>
        <Link href="/degree_pathways">Degree Pathways</Link>
        <Link href="/help">Help</Link>
        <a href="https://github.com/ebicsa-uhm/ebicsa">
          GitHub
        </a>
      </nav>
    </Container>
  </footer>
);

export default Footer;