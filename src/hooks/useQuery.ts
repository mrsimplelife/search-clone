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
  const _initialData = useRef(initialData);
  const _enabled = useRef(enabled);

  useEffect(() => {
    fn.current = queryFn;
  }, [queryFn]);

  useEffect(() => {
    _enabled.current = enabled;
  }, [enabled]);

  useEffect(() => {
    if (!_enabled.current) {
      setData(_initialData.current);
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
          if (!_enabled.current) return;
          setData(data);
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
  }, [cache, debounceDelay, key]);

  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  return { data, loading, error };
}

export default useQuery;
