'use client';

import { signOut } from 'next-auth/react'; // v5 compatible
import { Button, Col, Row, Card, Container, } from 'react-bootstrap';

/** After the user clicks the "SignOut" link in the NavBar, log them out and display this page. */
const SignOut = () => (
  <main className="signin-page">
    <Container>
      <Card className="signin-card border-0">
        <Row className="g-0">
          {/* the left image thing */}
          <Col md={6} className="signin-image d-none d-md-flex">
            <div className="signin-image-text">
              <div className="smallStuff1">EBICSA</div>
              <h2 className="bigStuff1">
                Leaving so soon? <span className="bigStuff2">Your plan stays saved.</span>
              </h2>
              <p className="smallStuff2">
                Your setup, saved schedules, and chat history will be here when you sign back in.
              </p>
            </div>
          </Col>

          {/* the confirmation itself */}
          <Col md={6} className="signin-form-side">
            <div className="signin-form">
              <h1 className="signin-title">Sign out?</h1>
              <p className="subText1">Are you sure you want to sign out of EBICSA?</p>

              <Button
                className="signin-submit mt-4 w-100"
                onClick={() => signOut({ callbackUrl: '/', redirect: true })}
              >
                Sign out
              </Button>

              <Button variant="outline-secondary" className="mt-2 w-100" href="/">
                Cancel
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  </main>
);

export default SignOut;
