import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'wouter';

import {
  getAuth,
  isSignInWithEmailLink,
  signInAnonymously,
} from 'firebase/auth';
import { handleEmailLink, sendEmailLink } from '../util/firebase';

import Heading from '../components/Heading';
import _LinkButton from '../components/LinkButton';

const auth = getAuth();

const FormContainer = styled.form`
  display: flex;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  font-size: 1.5em;
  padding: 0.5rem;
  border-bottom: 2px dashed;

  flex: 1;
  width: 0;

  ::placeholder {
    font-style: italic;
  }
`;

const InputButton = styled.button`
  font-size: 1.5em;
  font-weight: bold;
  padding: 0.5rem;
  border-bottom: 2px solid;
  cursor: pointer;
`;

const LinkButton = styled(_LinkButton)`
  display: block;
`;

function Form({ onSubmit }) {
  const [email, setEmail] = useState('');

  const handleFormSubmit = (event) => {
    event.preventDefault();
    onSubmit(email);
  };

  return (
    <FormContainer onSubmit={handleFormSubmit}>
      <Input
        type="email"
        required
        placeholder="your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputButton>Done</InputButton>
    </FormContainer>
  );
}

function getDefaultState() {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    return 'signing-in';
  }

  return 'default';
}

function Auth({ action }) {
  // ['default', 'sending-link', 'waiting-for-link', 'signing-in']
  const [state, setState] = useState(getDefaultState);
  const [, setLocation] = useLocation();

  useEffect(() => {
    (async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        const email = new URL(window.location).searchParams.get('email');

        try {
          setState('signing-in');
          await handleEmailLink(email, action);

          if (action === 'upgrade-account') {
            setLocation(`/m/upgrade-complete`);
          }
          if (action === 'delete-account') {
            setLocation(`/m/delete-complete`);
          }
        } catch (error) {
          console.error(error);
          setState('error');
        }
      }
    })();
  }, [action, setLocation]);

  const handleSubmit = async (email) => {
    setState('sending-link');

    try {
      await sendEmailLink(email, action);
      setState('waiting-for-link');
    } catch (error) {
      console.error(error);
      setState('error');
    }
  };

  const resetState = () => setState('default');

  const anonymousSignIn = async () => {
    setState('signing-in');
    await signInAnonymously(auth);
  };

  if (state === 'signing-in') {
    return <Heading as="p">Signing in…</Heading>;
  }

  if (state === 'waiting-for-link') {
    return (
      <>
        <Heading as="p">Email sent</Heading>
        <LinkButton onClick={resetState}>Cancel</LinkButton>
      </>
    );
  }

  if (state === 'sending-link') {
    return (
      <>
        <Heading as="p">Sending an email…</Heading>
        <LinkButton onClick={resetState}>Cancel</LinkButton>
      </>
    );
  }

  if (state === 'default') {
    if (action === 'upgrade-account') {
      return (
        <>
          <Heading as="p">Save diary to account</Heading>
          <Form onSubmit={handleSubmit} />
          <LinkButton as={Link} href="/">
            Cancel
          </LinkButton>
        </>
      );
    }

    if (action === 'sign-in') {
      return (
        <>
          <Heading as="p">Sign in to continue</Heading>
          <Form onSubmit={handleSubmit} />
          <LinkButton onClick={anonymousSignIn}>
            Continue without account
          </LinkButton>
        </>
      );
    }
  }

  if (action === 'delete-account') return null;

  // unknown state
  return (
    <>
      <Heading as="p">Something went wrong</Heading>
      <LinkButton onClick={resetState}>Try again</LinkButton>
      <LinkButton as={Link} href="/">
        Return to home page
      </LinkButton>
    </>
  );
}

export default Auth;
