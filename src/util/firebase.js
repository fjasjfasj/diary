import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

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

if (import.meta.env.DEV) {
  const auth = getAuth();
  const db = getDatabase();
  const { connectAuthEmulator } = await import('firebase/auth');
  const { connectDatabaseEmulator } = await import('firebase/database');
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectDatabaseEmulator(db, 'localhost', 9000);
}
