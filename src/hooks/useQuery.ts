import { useEffect, useMemo, useRef, useState } from 'react';
import { useCache } from '../contexts/cacheContext';

type Options<T> = {
  initialData: T;
  enabled: boolean;
  debounceDelay?: number;
};

function useQuery<T>(queryKey: any[], queryFn: () => Promise<T>, options: Options<T>) {
  const { cache } = useCache<T>();
  const { initialData, enabled, debounceDelay = 0 } = options;
  const key = useMemo(() => JSON.stringify(queryKey), [queryKey]);
  const [data, setData] = useState<T>(initialData);
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const fn = useRef(queryFn);
  const timer = useRef<NodeJS.Timeout>();
  const currentKey = useRef<string>(key);
  const initialDataRef = useRef(initialData);

  useEffect(() => {
    fn.current = queryFn;
  }, [queryFn]);

  useEffect(() => {
    currentKey.current = key;
    if (!enabled) {
      setData(initialDataRef.current);
      return;
    }
    if (cache.has(key)) {
      setData(cache.get(key)!);
      return;
    }
    setLoading(true);
    timer.current = setTimeout(() => {
      fn.current()
        .then((data) => {
          cache.set(key, data);
          if (currentKey.current === key) {
            setData(data);
          }
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }, debounceDelay);

    return () => {
      clearTimeout(timer.current);
      setLoading(false);
    };
  }, [cache, debounceDelay, enabled, key]);

  return { data, error, loading };
}
export default useQuery;
