import { getAuth, signOut } from 'firebase/auth';
import { Component } from 'react';

import Heading from '../styled/Heading';
import Link, { LinkSet } from '../styled/Link';
import { Paragraph } from '../styled/Paragraph';
import { Container } from './App';

const auth = getAuth();

export function ErrorLinkSet({ onGoBack }) {
  const _signOut = () => {
    signOut(auth);
  };

  return (
    <LinkSet $direction="column">
      <li>
        {onGoBack ? (
          <Link as="button" onClick={onGoBack}>
            ← Go home
          </Link>
        ) : (
          <Link href="/">← Go home</Link>
        )}
      </li>
      <li>
        <Link as="button" onClick={() => window.location.reload()}>
          Reload page
        </Link>
      </li>
      <li>
        <Link as="button" onClick={_signOut}>
          Sign out
        </Link>
      </li>
    </LinkSet>
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
      return (
        <Container>
          <Heading>Something went wrong</Heading>
          <Paragraph>Please try again</Paragraph>
          <ErrorLinkSet />
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
