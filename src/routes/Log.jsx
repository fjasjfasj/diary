import { useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useParams } from 'wouter';

import Entry from '../components/Entry';
import Heading from '../styled/Heading';
import Link from '../styled/Link';
import { today as todayFn } from '../util/dates';

const Header = styled.header`
  margin-bottom: 1rem;
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

function Log() {
  const { year: yearParam, month: monthParam } = useParams();
  const year = Number(yearParam);
  const month = Number(monthParam);

  const [, setLocation] = useLocation();

  useEffect(() => {
    if (Number.isNaN(year) || Number.isNaN(month)) {
      setLocation('/');
    }
  }, [year, month, setLocation]);

  const today = todayFn();
  const isCurrentMonth = year === today.year && month === today.month;

  const prevLink = makeDateLink(year, month, -1);
  const nextLink = makeDateLink(year, month, 1);

  const entriesAmount = isCurrentMonth
    ? today.date
    : new Date(year, month, 0).getDate(); // amount of days in month

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
        <Link href="/account">Manage account</Link>
      </Footer>
    </>
  );
}

export default Log;
