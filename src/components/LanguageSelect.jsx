import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Label = styled.label`
  display: block;
  margin-top: 1rem;
`;

const Select = styled.select`
  all: revert;
  background: transparent;
  color: inherit;
  font-family: inherit;
  font-size: 1.1em;
  border: 0;
  border-bottom: 2px solid;
  padding: 0.5rem;
`;

function LanguageSelect({ children }) {
  const { t, i18n } = useTranslation();
  const languages = ['en', 'ru'];

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <>
      <div>{children}</div>
      <div>
        <Label htmlFor="language-select">{t('language.label')}</Label>
        <Select
          id="language-select"
          value={i18n.resolvedLanguage}
          onChange={handleLanguageChange}
        >
          {languages.map((language) => (
            <option key={language} value={language}>
              {t('language.currentLngName', { lng: language })}
            </option>
          ))}
        </Select>
      </div>
    </>
  );
}

export default LanguageSelect;
