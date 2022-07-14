import { initializeApp } from 'firebase/app';
import {
  deleteUser,
  EmailAuthProvider,
  getAuth,
  linkWithCredential,
  reauthenticateWithCredential,
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from 'firebase/auth';
import { getDatabase, ref, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyC4Ztemku1Q8M-8v3lT8cw8kaDU9BotPbQ',
  authDomain: 'diary-re.firebaseapp.com',
  databaseURL:
    'https://diary-re-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'diary-re',
  storageBucket: 'diary-re.appspot.com',
  messagingSenderId: '980668437577',
  appId: '1:980668437577:web:0f0a74343c86da8bfd5b98',
};

initializeApp(firebaseConfig);

const auth = getAuth();
const db = getDatabase();

if (import.meta.env.DEV) {
  const { connectAuthEmulator } = await import('firebase/auth');
  const { connectDatabaseEmulator } = await import('firebase/database');
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectDatabaseEmulator(db, 'localhost', 9000);
}

export async function sendEmailLink(email, action) {
  const url = new URL(window.location);

  if (action === 'sign-in') {
    url.pathname = '/auth';
  } else {
    url.pathname = `/auth/${action}`;
  }

  url.searchParams.set('email', email);

  const actionCodeSettings = {
    url: url.href,
    handleCodeInApp: true,
  };

  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
}

export async function deleteAccount() {
  try {
    await remove(ref(db, `users/${auth.currentUser.uid}`));
    await deleteUser(auth.currentUser);
  } catch (error) {
    if (error.code === 'auth/requires-recent-login') {
      await sendEmailLink(auth.currentUser.email, 'delete-account');
    }
    throw error;
  }
}

export async function handleEmailLink(email, action) {
  try {
    if (action === 'upgrade-account') {
      const credential = EmailAuthProvider.credentialWithLink(
        email,
        window.location.href
      );
      await linkWithCredential(auth.currentUser, credential);
    }
    if (action === 'delete-account') {
      const credential = EmailAuthProvider.credentialWithLink(
        email,
        window.location.href
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await deleteAccount();
    }
    if (action === 'sign-in') {
      await signInWithEmailLink(auth, email, window.location.href);
    }
  } finally {
    const url = new URL(window.location);
    url.search = '';
    window.history.replaceState(null, null, url.href);
  }
}
