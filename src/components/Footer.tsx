import Link from 'next/link';
import { Col, Container, Row } from 'react-bootstrap';

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
    <Container className="pt-5 d-flex flex-wrap justify-content-between gap-3">
      <strong className="d-block mb-3 text-end">CONTACT US</strong>
    </Container>
    <Container className="d-flex flex-wrap justify-content-between">
      <Row xs={1} sm={2} md={4} className="g-3">
        {team.map((member) => (
          <Col key={member.email}>
            <div className="fw-semibold">{member.name}</div>
            <a href={`mailto:${member.email}`}>{member.email}</a>
          </Col>
        ))}
      </Row>
    </Container>
  </footer>
);

export default Footer;