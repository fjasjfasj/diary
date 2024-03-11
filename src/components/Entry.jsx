import { Fragment, useEffect, useState } from 'react';
import { getDatabase, ref, set } from 'firebase/database';
import styled from 'styled-components';
import TextareaAutosize from 'react-textarea-autosize';
import useDb from '../hooks/use-db';
import useUser from '../hooks/use-user';

const db = getDatabase();

const Container = styled.section`
  background: ${(props) => `var(--rate-${props.$rate}-color)`};

  * {
    background: inherit;
  }

  & + & {
    margin-top: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  cursor: pointer;
`;

const DateButton = styled.button`
  cursor: pointer;
  height: max-content;
`;

const Date = styled.h2`
  font-size: 2.5em;
`;

const Rate = styled.form`
  padding: 1rem;
  padding-bottom: 0;
  line-height: 1.15;

  opacity: ${(props) => (props.$isLoading ? 0.5 : 1)};
`;

const StarContainer = styled.div`
  width: max-content;

  :focus-within {
    outline: 2px solid var(--foreground-color);
    position: relative;
    z-index: 0;
  }
`;

const StarButton = styled.span`
  cursor: pointer;
  font-size: 1.4em;
  margin-right: 0.1rem;

  :disabled {
    cursor: default;
  }
`;

const Textarea = styled(TextareaAutosize)`
  width: 100%;
  padding: 1rem;

  :disabled {
    opacity: 0.5;
    font-style: italic;
  }

  ::placeholder {
    font-style: italic;
  }
`;

function Entry({ year, month, date, isToday, hidden }) {
  const [isOpen, setIsOpen] = useState(isToday);
  const [user, userLoading] = useUser();
  const dataRoot = `users/${user?.uid}/${year}/${month}/${date}`;
  const [data, dataLoading, dataError] = useDb(dataRoot);
  const { rate, text } = data || {};
  const loading = userLoading || dataLoading;

  if (dataError) throw dataError;

  useEffect(() => {
    setIsOpen(isToday);
  }, [isToday, year, month]);

  const handleTextChange = (event) => {
    set(ref(db, `${dataRoot}/text`), event.target.value || null);
  };

  const handleRateChange = (event) => {
    const newRate = event.target.value;
    const rateRef = ref(db, `${dataRoot}/rate`);
    set(rateRef, newRate || null);
  };

  const handleRateClick = (event) => {
    if (rate === event.target.value) {
      const rateRef = ref(db, `${dataRoot}/rate`);
      set(rateRef, null);
    }
  };

  return (
    <Container $rate={rate || 'none'} hidden={hidden}>
      <Header onClick={() => setIsOpen(!isOpen)}>
        <DateButton>
          <Date>{date}</Date>
        </DateButton>

        <Rate $isLoading={loading} hidden={!isOpen}>
          <h3>How did this day go?</h3>

          <StarContainer onClick={(e) => e.stopPropagation()}>
            <input
              className="sr-only"
              type="radio"
              disabled={loading}
              value=""
              checked={rate == null}
              id={`star-${date}-0`}
              name={`rate-${date}`}
              onChange={handleRateChange}
            />
            <label htmlFor={`star-${date}-0`} className="sr-only">
              No rate
            </label>

            {Array(5)
              .fill(null)
              .map((_, index) => (
                <Fragment key={index}>
                  <input
                    className="sr-only"
                    type="radio"
                    disabled={loading}
                    value={index + 1}
                    checked={Number(rate) === index + 1}
                    id={`star-${date}-${index + 1}`}
                    name={`rate-${date}`}
                    onChange={handleRateChange}
                    onClick={handleRateClick}
                  />
                  <label htmlFor={`star-${date}-${index + 1}`}>
                    <StarButton
                      disabled={loading}
                      aria-label={`${index + 1} of 5`}
                    >
                      {Number(rate) >= index + 1 ? '★' : '☆'}
                    </StarButton>
                  </label>
                </Fragment>
              ))}
          </StarContainer>
        </Rate>
      </Header>

      <Textarea
        value={loading ? 'Loading…' : text || ''}
        onChange={handleTextChange}
        minRows={4}
        disabled={loading}
        placeholder="Something memorable about this day…"
        hidden={!isOpen}
      />
    </Container>
  );
}

export default Entry;
