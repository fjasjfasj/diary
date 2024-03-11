import styled from 'styled-components';
import { Link } from 'wouter';

import { getAuth, signOut } from 'firebase/auth';

import Entry from '../components/Entry';
import LinkButton from '../components/LinkButton';
import { today as todayFn } from '../util/dates';
import useUser from '../hooks/use-user';

const auth = getAuth();

const Header = styled.header`
  margin-bottom: 1rem;
`;

const Heading = styled.h1`
  font-size: 1.5em;
  font-weight: bold;
`;

const Nav = styled.nav`
  margin-bottom: 0.3rem;

  ul {
    display: flex;
    justify-content: space-between;
  }

  a {
    color: var(--link-color);
  }
`;

const Footer = styled.footer`
  margin-top: 2rem;

  li {
    display: inline-block;
    margin-right: 1rem;
  }
`;

function dateToString(date) {
  return date.toLocaleDateString('en', {
    month: 'long',
    year: 'numeric',
  });
}

function makeDateLink(year, month, delta) {
  const date = new Date(year, month - 1 + delta, 1);

  return {
    text: dateToString(date),
    href: `/${date.getFullYear()}/${date.getMonth() + 1}`,
  };
}

function Log({ year, month }) {
  const [user] = useUser();

  const today = todayFn();
  const isCurrentMonth =
    Number(year) === today.year && Number(month) === today.month;

  const prevLink = makeDateLink(year, month, -1);
  const nextLink = makeDateLink(year, month, 1);

  const entriesAmount = isCurrentMonth
    ? today.date
    : new Date(year, month, 0).getDate();

  return (
    <>
      <Header>
        <Nav>
          <ul>
            <li>
              <Link href={prevLink.href}>
                {'← '}
                {prevLink.text}
              </Link>
            </li>
            <li hidden={isCurrentMonth}>
              <Link href={nextLink.href}>
                {nextLink.text}
                {' →'}
              </Link>
            </li>
          </ul>
        </Nav>

        <Heading>{dateToString(new Date(year, month - 1))}</Heading>
      </Header>

      {Array(31)
        .fill(null)
        .map((_, index) => index + 1)
        .reverse() // result: [31, 30, ..., 1]
        .map((date) => (
          <Entry
            key={date}
            year={year}
            month={month}
            date={date}
            isToday={isCurrentMonth && date === today.date}
            hidden={date > entriesAmount}
          />
        ))}

      <Footer>
        <ul>
          <li hidden={!user?.isAnonymous}>
            <LinkButton as={Link} href="/auth/upgrade-account">
              Save diary to account
            </LinkButton>
          </li>
          <li hidden={user?.isAnonymous}>
            <LinkButton onClick={() => signOut(auth)}>Sign out</LinkButton>
          </li>
          <li>
            <LinkButton as={Link} href="/m/delete-account">
              Delete account
            </LinkButton>
          </li>
        </ul>
      </Footer>
    </>
  );
}

export default Log;
