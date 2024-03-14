import { useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'wouter';

import Heading from '../styled/Heading';
import Link from '../styled/Link';

const Paragraph = styled.p`
  font-size: 1.1;
  margin-bottom: 1rem;
`;

function getAlert(kind, code) {
  const getInfo = () => {
    switch (code) {
      case 'account-deleted':
        return {
          heading: 'Account deleted',
        };
      case 'account-created':
        return {
          heading: 'Account created',
          text: 'Verify by following email link',
        };

      case 'email-updated':
        return {
          heading: 'Email updated',
          text: 'Verify by following email link',
        };
      case 'password-updated':
        return {
          heading: 'Password updated',
        };
      case 'link-sent':
        return {
          heading: 'Link sent',
          text: 'Verify email by following link',
        };

      default:
        return getError();
    }
  };

  const getError = () => {
    const _getError = () => {
      switch (code) {
        case 'auth/user-not-found':
          return {
            heading: 'User not found',
          };
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
          return {
            heading: 'Wrong email or password',
          };
        case 'auth/email-already-in-use':
          return { heading: 'Email already in use' };
        case 'auth/invalid-email':
          return { heading: 'Email invalid' };
        case 'auth/weak-password':
          return {
            heading: 'Password too weak',
            text: '6 characters minimum. Please try again',
          };
        default:
          return {
            heading: 'An unknown error occurred',
            code: code,
          };
      }
    };

    return { text: 'Please try again', ..._getError() };
  };

  switch (kind) {
    case 'info':
      return getInfo();
    default:
    case 'error':
      return getError();
  }
}

function useAlert() {
  const [, setLocation] = useLocation();
  const [alert, setAlert] = useState(null);

  if (alert) {
    const [kind, code, backPath] = alert;
    const alertContent = getAlert(kind, code);

    const handleClick = () => {
      setAlert(null);
      if (backPath) setLocation(backPath);
    };

    return [
      <>
        <Heading>{alertContent.heading}</Heading>
        {alertContent.text && <Paragraph>{alertContent.text}</Paragraph>}
        <Link as="button" onClick={handleClick}>
          {kind === 'info' ? 'Done' : '← Go back'}
        </Link>
      </>,
      setAlert,
    ];
  }

  return [null, setAlert];
}

export default useAlert;
