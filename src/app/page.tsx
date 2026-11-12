import { Col, Container, Image, Row } from 'react-bootstrap';

/** The Landing page. */
const Home = () => (
  <main>
    { /* Top image */ }
    <div style={{ position: 'relative' }}>
      <Image
        src="uh-manoa-campus-center.jpg"
        alt="Top banner"
        className="w-100 object-fit-cover mx-auto"
        style={{ height: '865px', filter: 'blur(3px)' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(255, 110, 54, 0.15)',
        }}
      />
      
      <figcaption className="">
        FOR ICS STUDENTS AT UH MĀNOA
      </figcaption>
      <figcaption className="bigStuff1">
        Plan your ICS degree
      </figcaption>
      <figcaption className="bigStuff2">

      </figcaption>
    </div>


    <Container id="landing-page" fluid className="py-3">
      <Row className="align-middle text-center">
        <Col xs={4}>
        </Col>

        <Col xs={8} className="d-flex flex-column justify-content-center">
          <h1>Welcome to this template</h1>
          <p>Now get to work and modify this app!</p>
        </Col>
      </Row>
    </Container>
  </main>
);

export default Home;
