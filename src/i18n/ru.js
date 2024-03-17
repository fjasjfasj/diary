const ru = {
  language: { currentLngName: 'Русский', label: 'Язык' },
  app: {
    loading: 'Загрузка…',
  },
  links: {
    back: '← Назад',
    home: '← Домой',
  },
  form: {
    fields: {
      email: 'почта',
      password: 'пароль',
      newEmail: 'новая почта',
      oldPassword: 'старый пароль',
      newPassword: 'новый пароль',
    },
  },
  auth: {
    signIn: {
      heading: 'Здравствуйте! Войдите, чтобы продолжить',
    },
    createAccount: {
      heading: 'Создать аккаунт',
    },
    resetPassword: {
      heading: 'Сбросить пароль',
    },
    links: {
      createAccount: 'Создать аккаунт',
      resetPassword: 'Сбросить пароль',
      submit: {
        ariaLabel: 'Готово',
      },
    },
  },
  account: {
    heading: 'Аккаунт',
    email: {
      label: 'Почта: {{email}}',
      notVerified: '(не подтверждена)',
    },
    links: {
      resendEmail: 'Отправить ссылку для подтверждения',
      signOut: 'Выйти',
      changeEmail: 'Сменить почту',
      changePassword: 'Сменить пароль',
      deleteAccount: 'Удалить аккаунт',
    },
  },
  accountActions: {
    changeEmail: {
      heading: 'Сменить почту',
    },
    changePassword: {
      heading: 'Сменить пароль',
    },
    deleteAccount: {
      heading: 'Удалить аккаунт',
      text: 'Это действие необратимо. Введите пароль, чтобы продолжить.',
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
        account: 'Управлять аккаунтом',
      },
    },
  },
  entry: {
    rate: {
      prompt: 'Как прошел этот день?',
      values: {
        none: 'Без оценки',
        any: '{{rate}} из {{max}}',
      },
    },
    text: {
      prompt: 'Что-то, что вам запомнилось…',
    },
  },
  alert: {
    info: {
      accountCreated: {
        heading: 'Аккаунт создан',
        text: 'Перейдите по ссылке из письма, чтобы подтвердить почту',
      },
      accountDeleted: {
        heading: 'Аккаунт удален',
      },
      emailUpdated: {
        heading: 'Почта изменена',
        text: 'Перейдите по ссылке из письма, чтобы подтвердить почту',
      },
      passwordUpdated: { heading: 'Пароль изменен' },
      linkSent: {
        heading: 'Ссылка отправлена',
        text: 'Перейдите по ссылке из письма, чтобы подтвердить почту',
      },
    },
    error: {
      userNotFound: { heading: 'Пользовательн не найден' },
      invalidCredential: { heading: 'Неправильная почта или пароль' },
      emailInUse: { heading: 'Почта уже используется' },
      invalidEmail: { heading: 'Недействительный адрес' },
      weakPassword: {
        heading: 'Пароль слишком слабый',
        text: 'Минимум 6 символов. Пожалуйста, попробуйте еще раз',
      },
      unknown: {
        heading: 'Произошла неизвестная ошибка',
        text: 'Пожалуйста, попробуйте еще раз',
        errorCode: 'Код ошибки: {{code}}',
      },
      tryAgain: 'Пожалуйста, попробуйте еще раз',
    },
    actions: {
      info: {
        leave: 'Готово',
      },
      error: {
        leave: '← Назад',
        reloadPage: 'Перезагрузить страницу',
        signOut: 'Выйти из аккаунта',
      },
    },
  },
};
export default ru;
