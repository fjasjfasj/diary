import { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'wouter';
import { getAuth, signOut } from 'firebase/auth';
import { Container } from './App';
import _LinkButton from './LinkButton';

const auth = getAuth();

const Heading = styled.p`
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const LinkButton = styled(_LinkButton)`
  display: block;
`;

function ErrorMessage() {
  return (
    <Container>
      <Heading>Something went wrong</Heading>
      <LinkButton onClick={() => signOut(auth)}>Sign out</LinkButton>
      <LinkButton as={Link} href="/">
        Return to home page
      </LinkButton>
    </Container>
  );
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.error(error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorMessage />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
