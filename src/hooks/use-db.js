import { useEffect, useRef, useState } from 'react';
import { getDatabase, onValue, ref } from 'firebase/database';

const db = getDatabase();

function useDb(path) {
  const pathRef = useRef();
  const [data, _setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    _setData(null);
    setLoading(true);
    setError(null);

    pathRef.current = ref(db, path);
    return onValue(
      pathRef.current,
      (snapshot) => {
        _setData(snapshot.val());
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );
  }, [path]);

  return [data, loading, error];
}

export default useDb;
