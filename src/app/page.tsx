import { Button, Col, Container, Image, Row } from 'react-bootstrap';

/** The Landing page. */
const Home = () => (
  <main>
    {/* Top image */}
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
          backgroundColor: 'rgba(2, 71, 49, 0.6)',
        }}
      />

      <div className="heroText">
        <p className="smallStuff1">FOR ICS STUDENTS AT UH MĀNOA</p>

        <h1 className="bigStuff1">
          Plan your ICS degree <span className="bigStuff2">with</span>
          <br />
          <span className="bigStuff3">less guesswork</span>
        </h1>

        <p className="smallStuff2">
          Even Better ICS Advising (EBICSA) is an AI-powered advising <br />
          assistant for Information and Computer Sciences students at the <br />
          University of Hawaii at Manoa.
        </p>

        <div className="heroButtons">
          <Button className="heroBtnFilled rounded-pill px-4">
            Get Started
          </Button>
          <Button className="heroBtnOutline rounded-pill px-4">
            Browse Courses
          </Button>
        </div>
      </div>
    </div>

    <Container id="landing-page" fluid className="py-3">
      <Row className="align-middle text-center">
        <Col xs={4} />

        <Col xs={8} className="d-flex flex-column justify-content-center">
          <h1>Welcome to this template</h1>
          <p>Now get to work and modify this app!</p>
        </Col>
      </Row>
    </Container>
  </main>
);

export default Home;