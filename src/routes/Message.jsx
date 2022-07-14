import styled from 'styled-components';
import { Link, useLocation } from 'wouter';
import { deleteAccount } from '../util/firebase';
import _LinkButton from '../components/LinkButton';

const Heading = styled.h1`
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Text = styled.p`
  margin-bottom: 1rem;
`;

const LinkButton = styled(_LinkButton)`
  display: block;

  & + & {
    margin-top: 0.3rem;
  }
`;

function Message({ type }) {
  const [, setLocation] = useLocation();

  const _deleteAccount = async () => {
    try {
      await deleteAccount();
      setLocation('/m/delete-complete');
    } catch (error) {
      console.error(error);
      setLocation(`/m/${error.code || 'unknown-error'}`);
    }
  };

  const messages = {
    'delete-account': (
      <>
        <Heading>Are you sure you would like to delete your account?</Heading>
        <Text>This action is irreversible.</Text>
        <LinkButton onClick={_deleteAccount}>Confirm</LinkButton>
      </>
    ),

    'auth/requires-recent-login': (
      <>
        <Heading>An email sent</Heading>
        <Text>Follow the link to confirm deletion</Text>
      </>
    ),

    'upgrade-complete': (
      <>
        <Heading>Diary saved</Heading>
        <Text>Now you can use your email to sign in</Text>
      </>
    ),
    'delete-complete': <Heading>Account has been deleted</Heading>,

    default: <Heading>Something went wrong</Heading>,
  };

  return (
    <>
      {messages[type] || messages.default}
      <LinkButton as={Link} href="/">
        Return to home page
      </LinkButton>
    </>
  );
}

export default Message;
