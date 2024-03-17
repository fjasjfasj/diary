import { getAuth, signOut } from 'firebase/auth';
import { Component } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';

import Heading from '../styled/Heading';
import Link, { LinkSet } from '../styled/Link';
import { Paragraph } from '../styled/Paragraph';
import { Container } from './App';

const auth = getAuth();

export function ErrorLinkSet({ onGoBack }) {
  const { t } = useTranslation();

  const _signOut = () => {
    signOut(auth);
  };

  return (
    <LinkSet $direction="column">
      <li>
        {onGoBack ? (
          <Link as="button" onClick={onGoBack}>
            {t('links.home')}
          </Link>
        ) : (
          <Link href="/">{t('links.home')}</Link>
        )}
      </li>
      <li>
        <Link as="button" onClick={() => window.location.reload()}>
          {t('alert.actions.error.reloadPage')}
        </Link>
      </li>
      <li>
        <Link as="button" onClick={_signOut}>
          {t('alert.actions.error.signOut')}
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
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      const { t } = this.props;
      const { error } = this.state;
      return (
        <Container>
          <Heading>{t('alert.error.unknown.heading')}</Heading>
          <Paragraph>{t('alert.error.unknown.text')}</Paragraph>
          {error?.code && (
            <Paragraph as="pre">
              {t('alert.error.unknown.errorCode', {
                code: error?.code,
              })}
            </Paragraph>
          )}
          <ErrorLinkSet />
        </Container>
      );
    }

    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);
