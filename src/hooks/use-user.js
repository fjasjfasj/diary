import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

const auth = getAuth();

function useUser() {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setUser(null);
    setLoading(true);
    setError(null);

    return onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      },
    );
  }, []);

  return [user, loading, error];
}

export default useUser;
