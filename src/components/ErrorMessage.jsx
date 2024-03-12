import { getAuth, signOut } from 'firebase/auth';
import { useCallback } from 'react';

import Heading from '../styled/Heading';
import Link, { LinkSet } from '../styled/Link';

const auth = getAuth();

export default function ErrorMessage({ actions, message }) {
  const _signOut = useCallback(() => {
    signOut(auth);
  }, []);

  return (
    <>
      <Heading>{message || 'Something went wrong'}</Heading>

      {actions && (
        <LinkSet>
          {actions.includes('sign-out') && (
            <li>
              <Link as="button" onClick={_signOut}>
                Sign out
              </Link>
            </li>
          )}

          {actions.includes('home') && (
            <li>
              <Link href="/">Return to home page</Link>
            </li>
          )}
        </LinkSet>
      )}
    </>
  );
}
