import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  return <LoadingIcon src="/assets/light/icon.svg" alt={t('app.loading')} />;
}
