import { Button, Col, Container, Row } from 'react-bootstrap';

/** The Home page. */
const Home = () => (
  <main>
    <Container id="landing-page" className="py-5">
      <Row className="align-middle text-center">
        <Col>
          <h1>EBICSA</h1>
          <p className="lead">
            University of Hawaiʻi at Mānoa &mdash; Information and Computer Sciences
          </p>
          <p>
            Browse ICS course offerings, schedules, faculty, and student ratings.
          </p>
          <Button href="/courses" size="lg">
            Browse Courses
          </Button>
        </Col>
      </Row>
    </Container>
  </main>
);

export default Home;
