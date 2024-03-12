import { useEffect, useState } from 'react';
import ReactHelmet from 'react-helmet';
import styled from 'styled-components';
import { Redirect, Route, Switch } from 'wouter';

import useUser from '../hooks/use-user';
import Account from '../routes/Account';
import Auth from '../routes/Auth';
import Log from '../routes/Log';
import LoadingScreen from '../styled/LoadingScreen';
import { today as todayFn } from '../util/dates';
import ErrorBoundary from './ErrorBoundary';
import ErrorMessage from './ErrorMessage';

export const Container = styled.div`
  margin: 0 auto;
  max-width: 30rem;
  padding: 1rem;
`;

function App() {
  const [user, userLoading, userError] = useUser();
  const today = todayFn();

  if (userError) {
    return (
      <ErrorMessage
        message="There's an error with your account"
        actions={['sign-out', 'home']}
      />
    );
  }

  if (userLoading) {
    return (
      <Container>
        <LoadingScreen />
      </Container>
    );
  }

  return (
    <Container>
      <Switch>
        {!user && <Route path="/auth/:action?" component={Auth} />}
        {user && <Route path="/account/:action?" component={Account} />}
        {user && <Route path="/:year/:month" component={Log} />}

        <Route>
          <Redirect to={user ? `/${today.year}/${today.month}` : '/auth'} />
        </Route>
      </Switch>
    </Container>
  );
}

function Helmet() {
  const [colorScheme, setColorScheme] = useState('light');

  useEffect(() => {
    const listener = (e) => {
      setColorScheme(e.matches ? 'dark' : 'light');
    };

    const match = window.matchMedia('(prefers-color-scheme: dark)');
    setColorScheme(match.matches ? 'dark' : 'light');

    match.addEventListener('change', listener);
    return () => match.removeEventListener('change', listener);
  }, []);

  return (
    <ErrorBoundary>
      <ReactHelmet>
        <meta
          name="theme-color"
          content={colorScheme === 'light' ? '#ffffff' : '#000000'}
        />
        <link
          rel="icon"
          href={`/assets/${colorScheme}/icon.png`}
          type="image/png"
        />
        <link
          rel="icon"
          href={`/assets/${colorScheme}/icon.svg`}
          type="image/svg+xml"
        />
        <link
          rel="apple-touch-icon"
          href={`/assets/${colorScheme}/apple-touch-icon.png`}
        />
        <link rel="manifest" href={`/assets/${colorScheme}/manifest.json`} />
      </ReactHelmet>

      <App />
    </ErrorBoundary>
  );
}

export default Helmet;
