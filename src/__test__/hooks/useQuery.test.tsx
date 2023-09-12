import { act, renderHook } from '@testing-library/react';
import Provider from '../../contexts/cacheContext';
import useQuery from '../../hooks/useQuery';
import Cache from '../../utils/Cache';

describe('useQuery', () => {
  let cache: Cache<string>;
  let queryFn: jest.Mock;
  const queryKey = ['key1', 'key2'];
  const options = { initialData: 'initial', enabled: true };

  beforeEach(() => {
    cache = new Cache<string>();
    queryFn = jest.fn().mockResolvedValue('data');
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('캐시에 데이터가 있으면 캐시에서 데이터를 가져와야 합니다', () => {
    cache.set(JSON.stringify(queryKey), 'cached data');
    const { result } = renderHook(() => useQuery(queryKey, queryFn, options), {
      wrapper: ({ children }) => <Provider cache={cache}>{children}</Provider>,
    });
    expect(result.current.data).toBe('cached data');
    expect(queryFn).not.toHaveBeenCalled();
  });

  it('캐시에 데이터가 없으면 queryFn을 호출해야 합니다', async () => {
    const { result } = renderHook(() => useQuery(queryKey, queryFn, options), {
      wrapper: ({ children }) => <Provider cache={cache}>{children}</Provider>,
    });
    expect(result.current.data).toBe('initial');
    await act(async () => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current.data).toBe('data');
    expect(queryFn).toHaveBeenCalled();
    expect(cache.get(JSON.stringify(queryKey))).toBe('data');
  });

  it('비활성화된 경우 queryFn을 호출하지 않아야 합니다', async () => {
    const { result } = renderHook(() => useQuery(queryKey, queryFn, { ...options, enabled: false }), {
      wrapper: ({ children }) => <Provider cache={cache}>{children}</Provider>,
    });
    expect(result.current.data).toBe('initial');
    expect(queryFn).not.toHaveBeenCalled();
    await act(async () => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current.data).toBe('initial');
    expect(queryFn).not.toHaveBeenCalled();
  });

  it('debounceDelay가 설정된 경우 queryFn에 디바운스를 적용해야 합니다', async () => {
    const { result } = renderHook(() => useQuery(queryKey, queryFn, { ...options, debounceDelay: 100 }), {
      wrapper: ({ children }) => <Provider cache={cache}>{children}</Provider>,
    });
    expect(result.current.data).toBe('initial');
    expect(queryFn).not.toHaveBeenCalled();
    await act(async () => {
      jest.advanceTimersByTime(50);
    });
    expect(queryFn).not.toHaveBeenCalled();
    await act(async () => {
      jest.advanceTimersByTime(50);
    });
    expect(queryFn).toHaveBeenCalled();
    expect(result.current.data).toBe('data');
    expect(cache.get(JSON.stringify(queryKey))).toBe('data');
  });

  it('queryFn이 실행 중일 때 로딩 상태를 반환해야 합니다', async () => {
    const { result } = renderHook(() => useQuery(queryKey, queryFn, options), {
      wrapper: ({ children }) => <Provider cache={cache}>{children}</Provider>,
    });
    expect(result.current.loading).toBe(true);
    await act(async () => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current.loading).toBe(false);
  });

  it('queryFn에서 오류가 발생하면 오류 상태를 반환해야 합니다', async () => {
    const error = new Error('error');
    queryFn.mockRejectedValueOnce(error);
    const { result } = renderHook(() => useQuery(queryKey, queryFn, options), {
      wrapper: ({ children }) => <Provider cache={cache}>{children}</Provider>,
    });
    expect(result.current.error).toBeUndefined();
    await act(async () => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current.error).toBe(error);
  });

  it('queryKey가 바뀌때마다 queryFn을 실행해야 합니다', async () => {
    const { result, rerender } = renderHook(({ queryKey }) => useQuery(queryKey, queryFn, options), {
      wrapper: ({ children }) => <Provider cache={cache}>{children}</Provider>,
      initialProps: { queryKey },
    });
    expect(result.current.data).toBe('initial');
    await act(async () => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current.data).toBe('data');
    expect(queryFn).toHaveBeenCalledTimes(1);
    rerender({ queryKey: ['key1', 'key3'] });
    queryFn.mockResolvedValueOnce('data2');
    await act(async () => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current.data).toBe('data2');
    expect(queryFn).toHaveBeenCalledTimes(2);
  });

  it('queryKey가 바뀌지 않으면 queryFn을 실행하지 않아야 합니다', async () => {
    const { result, rerender } = renderHook(({ queryKey }) => useQuery(queryKey, queryFn, options), {
      wrapper: ({ children }) => <Provider cache={cache}>{children}</Provider>,
      initialProps: { queryKey },
    });
    expect(result.current.data).toBe('initial');
    await act(async () => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current.data).toBe('data');
    expect(queryFn).toHaveBeenCalledTimes(1);
    rerender({ queryKey });
    await act(async () => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current.data).toBe('data');
    expect(queryFn).toHaveBeenCalledTimes(1);
  });
  it('queryKey가 바뀐 이후에 queryFn이 완료되면 이전 데이터를 반환해야 합니다', async () => {
    const { result, rerender } = renderHook(({ queryKey }) => useQuery(queryKey, queryFn, options), {
      wrapper: ({ children }) => <Provider cache={cache}>{children}</Provider>,
      initialProps: { queryKey },
    });
    expect(result.current.data).toBe('initial');
    await act(async () => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current.data).toBe('data');
    expect(queryFn).toHaveBeenCalledTimes(1);
    queryFn.mockResolvedValueOnce(new Promise((resolve) => setTimeout(() => resolve('data2'), 100)));
    rerender({ queryKey: ['key1', 'key3'] });
    await act(async () => {
      jest.advanceTimersByTime(0);
    });
    rerender({ queryKey: ['key1', 'key2'] });
    await act(async () => {
      jest.advanceTimersByTime(0);
    });
    await act(async () => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current.data).toBe('data');
  });
});
