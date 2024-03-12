import styled from 'styled-components';

const LoadingIcon = styled.img`
  display: block;
  margin: 0 auto;
  margin-top: 4rem;
  width: 4rem;

  @media (prefers-color-scheme: dark) {
    filter: invert();
    background: white;
  }
`;

export default function LoadingScreen() {
  return <LoadingIcon src="/assets/light/icon.svg" alt="Loading" />;
}
