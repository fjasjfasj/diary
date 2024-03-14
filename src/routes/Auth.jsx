import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useContext, useState } from 'react';
import styled from 'styled-components';
import { Redirect, useParams } from 'wouter';

import { AlertContext } from '../components/Alert';
import useLoading from '../hooks/use-loading';
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
  const [, setAlert] = useContext(AlertContext);
  const [isLoading, setIsLoading] = useLoading();

  const signIn = async ({ email, password }) => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log('signed in', 'userCredential', userCredential);
    } catch (error) {
      console.error(error);
      setAlert(['error', error.code]);
    } finally {
      setIsLoading(false);
    }
  };

  const createAccount = async ({ email, password }) => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await sendEmailVerification(userCredential.user);
      setAlert(['info', 'account-created']);
      console.log('account created', 'userCredential', userCredential);
    } catch (error) {
      console.error(error);
      setAlert(['error', error.code]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async ({ email }) => {
    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
      setAlert(['info', 'link-sent', '/auth']);
    } catch (error) {
      console.error(error);
      setAlert(['error', error.code]);
    } finally {
      setIsLoading(false);
    }
  };

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
          onSubmit={signIn}
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
          onSubmit={createAccount}
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
        <Form fields={[fieldPresets.email]} onSubmit={resetPassword} />
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
