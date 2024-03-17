const en = {
  language: { currentLngName: 'English', label: 'Language' },
  app: {
    loading: 'Loading…',
  },
  links: {
    back: '← Go back',
    home: '← Go home',
  },
  form: {
    fields: {
      email: 'email',
      password: 'password',
      newEmail: 'new email',
      oldPassword: 'old password',
      newPassword: 'new password',
    },
  },
  auth: {
    signIn: {
      heading: 'Hello! Sign in to continue',
    },
    createAccount: {
      heading: 'Create an account',
    },
    resetPassword: {
      heading: 'Reset password',
    },
    links: {
      createAccount: 'Create an account',
      resetPassword: 'Reset password',
      submit: {
        ariaLabel: 'Done',
      },
    },
  },
  account: {
    heading: 'Account',
    email: {
      label: 'Email: {{email}}',
      notVerified: '(not verified)',
    },
    links: {
      resendEmail: 'Resend verification link',
      signOut: 'Sign out',
      changeEmail: 'Change email',
      changePassword: 'Change password',
      deleteAccount: 'Delete account',
    },
  },
  accountActions: {
    changeEmail: {
      heading: 'Change email',
    },
    changePassword: {
      heading: 'Change password',
    },
    deleteAccount: {
      heading: 'Delete account',
      text: 'This action is irreversible. Enter your password to continue.',
    },
  },
  log: {
    nav: {
      links: {
        prev: '← {{date}}',
        next: '{{date}} →',
      },
    },
    footer: {
      links: {
        account: 'Manage account',
      },
    },
  },
  entry: {
    rate: {
      prompt: 'How did this day go?',
      values: {
        none: 'No rate',
        any: '{{rate}} out of {{max}}',
      },
    },
    text: {
      prompt: 'Something memorable about this day…',
    },
  },
  alert: {
    info: {
      accountCreated: {
        heading: 'Account created',
        text: 'Verify by following link in email',
      },
      accountDeleted: {
        heading: 'Account deleted',
      },
      emailUpdated: {
        heading: 'Email updated',
        text: 'Verify by following link in email',
      },
      passwordUpdated: { heading: 'Password updated' },
      linkSent: {
        heading: 'Link sent',
        text: 'Verify email by following link',
      },
    },
    error: {
      userNotFound: { heading: 'User not found' },
      invalidCredential: { heading: 'Wrong email or password' },
      emailInUse: { heading: 'Email already in use' },
      invalidEmail: { heading: 'Email invalid' },
      weakPassword: {
        heading: 'Password too weak',
        text: '6 characters minimum. Please try again',
      },
      unknown: {
        heading: 'An unknown error has occurred',
        text: 'Please try again',
        errorCode: 'Error code: {{code}}',
      },
      tryAgain: 'Please try again',
    },
    actions: {
      info: {
        leave: 'Done',
      },
      error: {
        leave: '← Go back',
        reloadPage: 'Reload page',
        signOut: 'Sign out',
      },
    },
  },
};

export default en;
