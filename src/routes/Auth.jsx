import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Redirect, useLocation, useParams } from 'wouter';

import Heading from '../styled/Heading';
import Link, { LinkSet } from '../styled/Link';
import LoadingScreen from '../styled/LoadingScreen';

const auth = getAuth();

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const InputContainer = styled.div`
  display: flex;
  border-bottom: 2px solid;
  font-size: 1.3rem;

  > * {
    padding: 0.5rem;
  }
`;

const Input = styled.input`
  width: 100%;
`;

const SubmitButton = styled.button`
  cursor: pointer;
`;

async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log('signed in', 'userCredential', userCredential);
  } catch (error) {
    console.error(error);
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        alert('Wrong email or password. Please try again');
        break;
      default:
        alert(`An unknown error occurred. Please try again.\n${error.message}`);
        break;
    }
    throw error;
  }
}

async function createAccount(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    await sendEmailVerification(userCredential.user);
    alert('Account created! Follow email link to confirm');
    console.log('account created', 'userCredential', userCredential);
  } catch (error) {
    console.error(error);
    switch (error.code) {
      case 'auth/weak-password':
        alert('Password too weak. 6 characters minimum. Please try again');
        break;
      case 'auth/email-already-in-use':
        alert('Email already in use. Please try again');
        break;
      case 'auth/invalid-email':
        alert('Email invalid. Please try again');
        break;
      default:
        alert(`An unknown error occurred. Please try again.\n${error.message}`);
        break;
    }
    throw error;
  }
}

async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    alert('Link sent. Check your email');
  } catch (error) {
    console.error(error);
    switch (error.code) {
      case 'auth/invalid-email':
        alert('Email invalid. Please try again');
        break;
      case 'auth/user-not-found':
        alert('User not found. Please try again');
        break;
      default:
        alert(`An unknown error occurred. Please try again.\n${error.message}`);
        break;
    }
    throw error;
  }
}

/* field example:
  {
    type: 'email', // input type
    placeholder: 'email',
    key: 'oldEmail' // results object key
  }
*/
export const fieldPresets = {
  email: {
    type: 'email', // <input type="...">
    placeholder: 'email', // <input placeholder="...">
    key: 'email', // submit result: { _email_: '...' }
  },
  password: {
    type: 'password',
    placeholder: 'password',
    key: 'password',
  },
};

export function Form({ fields, onSubmit }) {
  const [values, setValue] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(values);
  };

  const submitButton = <SubmitButton>→</SubmitButton>;

  return (
    <FormContainer onSubmit={handleSubmit}>
      {fields.map((field, i) => (
        <InputContainer key={field.key}>
          <Input
            type={field.type}
            placeholder={field.placeholder}
            required
            onChange={(e) =>
              setValue((prev) => ({
                ...prev,
                [field.key]: e.target.value,
              }))
            }
          />
          {i + 1 === fields.length && submitButton}
        </InputContainer>
      ))}
    </FormContainer>
  );
}

export default function Auth() {
  const { action } = useParams();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const _signIn = useCallback(({ email, password }) => {
    (async () => {
      try {
        setIsLoading(true);
        await signIn(email, password);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const _createAccount = useCallback(({ email, password }) => {
    (async () => {
      try {
        setIsLoading(true);
        await createAccount(email, password);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const _resetPassword = useCallback(
    ({ email }) => {
      (async () => {
        try {
          setIsLoading(true);
          await resetPassword(email);
          setLocation('/auth');
        } finally {
          setIsLoading(false);
        }
      })();
    },
    [setLocation],
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (action == null) {
    // sign-in
    return (
      <>
        <Heading>Hello! Sign in to continue</Heading>
        <Form
          fields={[fieldPresets.email, fieldPresets.password]}
          onSubmit={_signIn}
        />
        <LinkSet>
          <li>
            <Link href="/auth/create-account">Create account</Link>
          </li>
          <li>
            <Link href="/auth/reset-password">Reset password</Link>
          </li>
        </LinkSet>
      </>
    );
  }

  if (action === 'create-account') {
    return (
      <>
        <Heading>Create an account</Heading>
        <Form
          fields={[fieldPresets.email, fieldPresets.password]}
          onSubmit={_createAccount}
        />
        <LinkSet>
          <li>
            <Link href="/auth">← Go back</Link>
          </li>
        </LinkSet>
      </>
    );
  }

  if (action === 'reset-password') {
    return (
      <>
        <Heading>Reset password</Heading>
        <Form fields={[fieldPresets.email]} onSubmit={_resetPassword} />
        <LinkSet>
          <li>
            <Link href="/auth">← Go back</Link>
          </li>
        </LinkSet>
      </>
    );
  }

  return <Redirect to="/" />;
}
