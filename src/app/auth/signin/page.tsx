'use client';

import { signIn } from 'next-auth/react'; // v5 compatible
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

/** The sign in page. */
const SignIn = () => {
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
  await signIn('credentials', {
      callbackUrl: '/',
      email: target.email.value,
      password: target.password.value,
    });
  };
  
  return (
    <main className="signin-page">
      <Container>
        <Card className="signin-card border-0">
          <Row className="g-0">
            {/* the left image thing */}
            <Col md={6} className="signin-image d-none d-md-flex">
              <div className="signin-image-text">
                <div className="smallStuff1">EBICSA</div>
                <h2 className="bigStuff1">
                  Your ICS plan, <span className="bigStuff2">saved in one place.</span>
                </h2>
                <p className="smallStuff2">
                  Sign in to keep your setup, saved schedules, and chat history.
                </p>
              </div>
            </Col>

            {/* the actual form itself */}
            <Col md={6} className="signin-form-side">
              <div className="signin-form">
                {/* the pill that switches n stuff */}
                <div className="signin-tabs">
                  <a href="/auth/signin" className="signin-tab active">Sign in</a>
                  <a href="/auth/signup" className="signin-tab">Sign up</a>
                </div>

                <h1 className="signin-title">Welcome back</h1>
                <p className="subText1">Sign in with your UH email.</p>

                <Form method="post" onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicEmail" className="mb-3">
                    <Form.Label>UH email</Form.Label>
                    <Form.Control
                      name="email"
                      type="text"
                      placeholder="yourname@hawaii.edu"
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <div className="d-flex justify-content-between">
                      <Form.Label>Password</Form.Label>
                      <a href="/signin/forgot-password" className="signin-link small">
                        Forgot password?
                      </a>
                    </div>
                    <Form.Control
                      name="password"
                      type="password"
                      placeholder="Your password"
                    />
                  </Form.Group>

                  <Button type="submit" className="signin-submit mt-4 w-100">
                    Sign in
                  </Button>
                </Form>

                <p className="text-center mt-3 subText1">
                  New to EBICSA?{' '}
                  <a href="/auth/signup" className="signin-link">Create an account</a>
                </p>
              </div>
            </Col>
          </Row>
        </Card>
      </Container>
    </main>
  );
};

export default SignIn;
