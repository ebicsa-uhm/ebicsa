import { Button, Container, Image, Row, Col, Card } from 'react-bootstrap';
import { Bookmark, Calendar, ChatSquareTextFill, Search } from 'react-bootstrap-icons';
import CardBody from 'react-bootstrap/CardBody';
import CardTitle from 'react-bootstrap/CardTitle';
import CardText from 'react-bootstrap/CardText';
import CardLink from 'react-bootstrap/CardLink';
import { auth } from '@/lib/auth';

/* FOR THE CARD */
const features = [
  {
    icon: <Search size={18} />,
    title: 'Course Search',
    description: `Filter ICS courses by degree pathway, term, format, and credits. 
                  See which prerequisites you've met.`,
    linkText: 'Search Courses',
    href: '/courses',
  },
  {
    icon: <Calendar size={18} />,
    title: 'Schedule Builder',
    description: `Set your credits, days, and time window.
                  EBICSA shows weekly schedules with no
                  time conflicts.`,
    linkText: 'Build a schedule',
    href: '/schedule-builder',
  },
  {
    icon: <Bookmark size={18} />,
    title: 'My Schedules',
    description: `Save the schedules you like, bookmark
                  favorites, and compare them side by side.`,
    linkText: 'View saved',
    href: '/my-schedules',
  },
  {
    icon: <ChatSquareTextFill size={18} />,
    title: 'Ask EBICSA',
    description: `A chat assistant on every page. Ask what a
                  course covers, what you need before taking
                  it, and more!`,
    linkText: 'See the assistant',
    href: '#chat',
  },
];

/** The Landing page. */
const Home = async () => {
  
  const session = await auth();

  const signInHref = '/auth/signin';

  const linkFor = (href: string) => {
    if (session?.user || href.startsWith('#')) return href;
    return `${signInHref}?callbackUrl=${encodeURIComponent(href)}`;
  };
  
  return(
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
          {!session?.user && (
          <Button href="/auth/signup" className="heroBtnFilled rounded-pill px-4">
            Get Started
          </Button>
          )}
          <Button href="/courses" className="heroBtnOutline rounded-pill px-4">
            Browse Courses
          </Button>
        </div>
      </div>
    </div>

    <Container id="landing-page" fluid className="bigText1 text-center pt-4">
      What is EBICSA?
    </Container>

    <Container id="landing-page" fluid className="subText1 text-center pb-4">
      One place to find ICS courses, check prerequisites, build a schedule, and ask <br />
      questions, without digging through the catalog.
    </Container>

    <Container className="py-5 px-4" style={{ maxWidth: '800px' }}>
      <Row xs={1} md={2} className="g-4">
        {features.map((f) => (
          <Col key={f.title}>
            <Card className="h-100 border-0 shadow-sm rounded-4">
              <CardBody className="p-4">
                <div className="icon-box mb-3">{f.icon}</div>
                <CardTitle className="fw-bold">{f.title}</CardTitle>
                <CardText className="text-muted">{f.description}</CardText>
                  <CardLink href={linkFor(f.href)}>{f.linkText} →</CardLink>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  </main>
  );
};


export default Home;