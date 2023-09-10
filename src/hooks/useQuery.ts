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
  const fn = useRef(queryFn);
  const timer = useRef<NodeJS.Timeout>();

  const updateFn = () => {
    fn.current = queryFn;
  };
  useEffect(updateFn, [queryFn]);

  useEffect(() => {
    if (!enabled) return;
    if (cache.has(key)) {
      setData(cache.get(key)!);
      return;
    }
    timer.current = setTimeout(() => {
      setLoading(true);
      fn.current()
        .then((data) => {
          setData(data);
          cache.set(key, data);
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
    };
  }, [cache, debounceDelay, enabled, key]);

  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  return { data, loading, error };
}

export default useQuery;
