import { createContext, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';

import Heading from '../styled/Heading';
import Link from '../styled/Link';
import { Paragraph } from '../styled/Paragraph';
import { ErrorLinkSet } from './ErrorBoundary';

function Alert() {
  const { t } = useTranslation();
  const [alert, setAlert] = useContext(AlertContext);
  const [, setLocation] = useLocation();

  const getAlert = useCallback(
    (kind, code) => {
      const _t = (str) => t(str, { returnObjects: true });

      const getInfo = () => {
        switch (code) {
          case 'account-created':
            return _t('alert.info.accountCreated');
          case 'account-deleted':
            return _t('alert.info.accountDeleted');

          case 'email-updated':
            return _t('alert.info.emailUpdated');
          case 'password-updated':
            return _t('alert.info.passwordUpdated');
          case 'link-sent':
            return _t('alert.info.linkSent');

          default:
            return getError();
        }
      };

      const getError = () => {
        const _getError = () => {
          switch (code) {
            case 'auth/user-not-found':
              return _t('alert.error.userNotFound');
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
              return _t('alert.error.invalidCredential');
            case 'auth/email-already-in-use':
              return _t('alert.error.emailInUse');
            case 'auth/invalid-email':
              return _t('alert.error.invalidEmail');
            case 'auth/weak-password':
              return _t('alert.error.weakPassword');
            default:
              return {
                heading: _t('alert.error.unknown.heading'),
                code: code,
                isUnknown: true,
              };
          }
        };

        return { text: _t('alert.error.tryAgain'), ..._getError() };
      };

      switch (kind) {
        case 'info':
          return getInfo();
        default:
        case 'error':
          return getError();
      }
    },
    [t],
  );

  const [kind, code, backPath] = alert;
  const alertContent = getAlert(kind, code);

  const handleBackClick = () => {
    setAlert(null);
    if (backPath) setLocation(backPath);
  };

  return (
    <>
      <Heading>{alertContent.heading}</Heading>
      {alertContent.text && <Paragraph>{alertContent.text}</Paragraph>}
      {alertContent.code && (
        <Paragraph as="pre">
          {t('alert.error.unknown.errorCode', { code: alertContent.code })}
        </Paragraph>
      )}
      {!alertContent.isUnknown ? (
        <Link as="button" onClick={handleBackClick}>
          {t(`alert.actions.${kind}.leave`)}
        </Link>
      ) : (
        <ErrorLinkSet onGoBack={handleBackClick} />
      )}
    </>
  );
}

export const AlertContext = createContext([null, () => {}]);

export default Alert;
