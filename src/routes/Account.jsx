import {
  deleteUser,
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  sendEmailVerification,
  signOut,
  updateEmail,
  updatePassword,
} from 'firebase/auth';
import { getDatabase, ref, remove } from 'firebase/database';
import { useContext } from 'react';
import styled from 'styled-components';
import { Redirect, useParams } from 'wouter';

import { AlertContext } from '../components/Alert';
import useLoading from '../hooks/use-loading';
import useUser from '../hooks/use-user';
import Heading from '../styled/Heading';
import Link, { LinkSet } from '../styled/Link';
import LoadingScreen from '../styled/LoadingScreen';
import { fieldPresets, Form } from './Auth';

const auth = getAuth();
const db = getDatabase();

const Paragraph = styled.p`
  margin-bottom: 1rem;
`;

async function reauthenticate(password) {
  const credential = EmailAuthProvider.credential(
    auth.currentUser.email,
    password,
  );
  await reauthenticateWithCredential(auth.currentUser, credential);
}

function AccountAction({ action }) {
  const [, setAlert] = useContext(AlertContext);
  const [, setIsLoading] = useLoading();

  const changeEmail = async ({ password, email }) => {
    try {
      setIsLoading(true);
      await reauthenticate(password);
      await updateEmail(auth.currentUser, email);
      setAlert(['info', 'email-updated', '/account']);
    } catch (error) {
      console.error(error);
      setAlert(['error', error.code]);
    } finally {
      setIsLoading(false);
    }
  };
  const changePassword = async ({ oldPassword, newPassword }) => {
    try {
      setIsLoading(true);
      await reauthenticate(oldPassword);
      await updatePassword(auth.currentUser, newPassword);
      setAlert(['info', 'password-updated', '/account']);
    } catch (error) {
      console.error(error);
      setAlert(['error', error.code]);
    } finally {
      setIsLoading(false);
    }
  };
  const deleteAccount = async ({ password }) => {
    try {
      setIsLoading(true);
      await reauthenticate(password);
      await remove(ref(db, `users/${auth.currentUser.uid}`));
      await deleteUser(auth.currentUser);
      setAlert(['info', 'account-deleted', '/']);
    } catch (error) {
      console.error(error);
      setAlert(['error', error.code]);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line default-case
  switch (action) {
    case 'change-email':
      return (
        <>
          <Heading>Change email</Heading>
          <Form
            fields={[
              fieldPresets.password,
              {
                type: 'email',
                placeholder: 'new email',
                key: 'email',
              },
            ]}
            onSubmit={changeEmail}
          />
          <Link href="/account">← Go back</Link>
        </>
      );
    case 'change-password':
      return (
        <>
          <Heading>Change password</Heading>
          <Form
            fields={[
              {
                type: 'password',
                placeholder: 'old password',
                key: 'oldPassword',
              },
              {
                type: 'password',
                placeholder: 'new password',
                key: 'newPassword',
              },
            ]}
            onSubmit={changePassword}
          />
          <Link href="/account">← Go back</Link>
        </>
      );
    case 'delete':
      return (
        <>
          <Heading>Delete account</Heading>
          <Paragraph>
            This action is irreversible. Enter your password to continue.
          </Paragraph>
          <Form fields={[fieldPresets.password]} onSubmit={deleteAccount} />

          <Link href="/account">← Go back</Link>
        </>
      );
    default:
      return <Redirect to="/account" />;
  }
}

function Account() {
  const [alert, setAlert] = useContext(AlertContext);
  const [, setIsLoading] = useLoading();
  const { action } = useParams();
  const [user, userLoading] = useUser();

  if (userLoading) return <LoadingScreen />;

  if (action) {
    return <AccountAction action={action} />;
  }

  if (alert) return alert;

  const resendLink = async () => {
    setIsLoading(true);
    await sendEmailVerification(auth.currentUser);
    setAlert(['info', 'link-sent']);
    setIsLoading(false);
  };

  return (
    <>
      <Heading>Account</Heading>
      <Paragraph>
        Email: {user.email} ({!user.emailVerified && 'not '}verified)
      </Paragraph>
      <LinkSet $direction="column">
        <li>
          <Link href="/">← Go home</Link>
        </li>
        {!user.emailVerified && (
          <li>
            <Link as="button" onClick={resendLink}>
              Resend verification link
            </Link>
          </li>
        )}
        <li>
          <Link as="button" onClick={() => signOut(auth)}>
            Sign out
          </Link>
        </li>
        <li>
          <Link href="/account/change-email">Change email</Link>
        </li>
        <li>
          <Link href="/account/change-password">Change password</Link>
        </li>
        <li>
          <Link href="/account/delete">Delete account</Link>
        </li>
      </LinkSet>
    </>
  );
}

export default Account;
