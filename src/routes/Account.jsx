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
import styled from 'styled-components';
import { Redirect, useLocation, useParams } from 'wouter';

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
  const [, setLocation] = useLocation();

  const changeEmail = async ({ password, email }) => {
    try {
      await reauthenticate(password);
      await updateEmail(auth.currentUser, email);
      alert('Email updated. Verify by following email link');
      setLocation('/account');
    } catch (error) {
      console.error(error);
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
          alert('Wrong password. Please try again');
          break;
        case 'auth/email-already-in-use':
          alert('Email already in use. Please try again');
          break;
        case 'auth/invalid-email':
          alert('Email invalid. Please try again');
          break;
        default:
          alert(
            `An unknown error occurred. Please try again.\n${error.message}`,
          );
          break;
      }
    }
  };
  const changePassword = async ({ oldPassword, newPassword }) => {
    try {
      await reauthenticate(oldPassword);
      await updatePassword(auth.currentUser, newPassword);
      alert('Password changed');
      setLocation('/account');
    } catch (error) {
      console.error(error);
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
          alert('Wrong password. Please try again');
          break;
        case 'auth/weak-password':
          alert('Password too weak. 6 characters minimum. Please try again');
          break;
        default:
          alert(
            `An unknown error occurred. Please try again.\n${error.message}`,
          );
          break;
      }
    }
  };
  const deleteAccount = async ({ password }) => {
    try {
      await reauthenticate(password);
      await remove(ref(db, `users/${auth.currentUser.uid}`));
      await deleteUser(auth.currentUser);
      alert('Account deleted');
      setLocation('/account');
    } catch (error) {
      console.error(error);
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
          alert('Wrong password. Please try again');
          break;
        default:
          alert(
            `An unknown error occurred. Please try again.\n${error.message}`,
          );
          break;
      }
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

async function resendLink() {
  await sendEmailVerification(auth.currentUser);
  alert('Link sent');
}

function Account() {
  const { action } = useParams();
  const [user, userLoading] = useUser();

  if (userLoading) return <LoadingScreen />;

  if (action) {
    return <AccountAction action={action} />;
  }

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
