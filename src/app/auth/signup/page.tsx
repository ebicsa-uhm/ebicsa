'use client';

import { signIn } from 'next-auth/react'; // v5 compatible
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Card, Col, Container, Button, Form, Row } from 'react-bootstrap';
import { createUser } from '@/lib/dbActions';

type SignUpForm = {
  email: string;
  password: string;
  confirmPassword: string;
  // acceptTerms: boolean;
};

/** The sign up page. */
const SignUp = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), ''], 'Confirm Password does not match'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: SignUpForm) => {
    // console.log(JSON.stringify(data, null, 2));
    await createUser(data);
    // After creating, signIn with redirect to the home page
    await signIn('credentials', { callbackUrl: '/', ...data });
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
                  Plan your ICS path, <span className="bigStuff2">starting today.</span>
                </h2>
                <p className="smallStuff2">
                  Create an account to save your setup, schedules, and chat history.
                </p>
              </div>
            </Col>

            {/* the actual form itself */}
            <Col md={6} className="signin-form-side">
              <div className="signin-form">
                {/* the pill that switches n stuff */}
                <div className="signin-tabs">
                  <a href="/auth/signin" className="signin-tab">Sign in</a>
                  <a href="/auth/signup" className="signin-tab active">Sign up</a>
                </div>

                <h1 className="signin-title">Create your account</h1>
                <p className="subText1">Sign up with your UH email.</p>

                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group controlId="signupEmail" className="mb-3">
                    <Form.Label>UH email</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="yourname@hawaii.edu"
                      isInvalid={!!errors.email}
                      {...register('email')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="signupPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Your password"
                      isInvalid={!!errors.password}
                      {...register('password')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="signupConfirmPassword">
                    <Form.Label>Confirm password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Re-enter your password"
                      isInvalid={!!errors.confirmPassword}
                      {...register('confirmPassword')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button type="submit" className="signin-submit mt-4 w-100">
                    Create account
                  </Button>
                </Form>

                <p className="text-center mt-3 subText1">
                  Already have an account?{' '}
                  <a href="/auth/signin" className="signin-link">Sign in</a>
                </p>
              </div>
            </Col>
          </Row>
        </Card>
      </Container>
    </main>
  );
};

export default SignUp;
