import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';

function useLoading() {
  const [loadingStates, setLoadingStates] = useContext(LoadingContext);
  const loadingStateId = useRef(-1);

  useEffect(() => {
    loadingStateId.current = loadingStates.length;

    // return () =>
    //   setLoadingStates((prev) => {
    //     const copy = [...prev];
    //     delete copy[loadingStateId.current];
    //     return copy;
    //   });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading = loadingStates.some((state) => !!state);

  const setLoadingState = useCallback(
    (value) => {
      setLoadingStates((prev) => {
        const copy = [...prev];
        copy[loadingStateId.current] = value;
        return copy;
      });
    },
    [setLoadingStates],
  );

  return [isLoading, setLoadingState];
}

export const LoadingContext = createContext([[], () => {}]);

export default useLoading;
