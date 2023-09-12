import { act, renderHook } from '@testing-library/react';
import { ChangeEvent, FormEvent } from 'react';
import Provider from '../../contexts/cacheContext';
import useSearch from '../../hooks/useSearch';
import { getKeywords } from '../../services/api';
import Cache from '../../utils/Cache';

jest.mock('../../services/api');

describe('useSearch', () => {
  let cache = new Cache();
  let mockGetKeywords = getKeywords as jest.MockedFunction<typeof getKeywords>;

  beforeEach(() => {
    cache = new Cache();
    mockGetKeywords.mockResolvedValueOnce([
      { sickCd: 'sickCd1', sickNm: 'keyword1' },
      { sickCd: 'sickCd2', sickNm: 'keyword2' },
    ]);
    jest.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    mockGetKeywords.mockClear();
    jest.useRealTimers();
  });

  it('입력이 변경될 때 API에서 키워드를 가져와야 합니다', async () => {
    const { result } = renderHook(() => useSearch({ getKeywords, search: jest.fn() }), {
      wrapper: ({ children }) => <Provider cache={cache}>{children}</Provider>,
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.items).toEqual([]);
    await act(async () => {
      result.current.handleChangeInput({ target: { value: 'sick' } } as ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.loading).toBe(true);
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.items).toEqual([
      { sickCd: 'sickCd1', sickNm: 'keyword1' },
      { sickCd: 'sickCd2', sickNm: 'keyword2' },
    ]);
    expect(mockGetKeywords).toHaveBeenCalledWith('sick');
  });

  it('입력이 비어 있을 때 API에서 키워드를 가져오지 않아야 합니다', async () => {
    const { result } = renderHook(() => useSearch({ getKeywords, search: jest.fn() }), {
      wrapper: ({ children }) => <Provider cache={cache}>{children}</Provider>,
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.items).toEqual([]);
    await act(async () => {
      result.current.handleChangeInput({ target: { value: '' } } as ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.loading).toBe(false);
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.items).toEqual([]);
    expect(mockGetKeywords).not.toHaveBeenCalled();
  });

  it('입력 변경을 디바운스 처리해야 합니다', async () => {
    const { result } = renderHook(() => useSearch({ getKeywords, search: jest.fn() }), {
      wrapper: ({ children }) => <Provider cache={cache}>{children}</Provider>,
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.items).toEqual([]);
    await act(async () => {
      result.current.handleChangeInput({ target: { value: 'sick' } } as ChangeEvent<HTMLInputElement>);
    });
    await act(async () => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current.loading).toBe(true);
    expect(result.current.items).toEqual([]);
    expect(mockGetKeywords).not.toHaveBeenCalledWith('sick');
    act(() => {
      result.current.handleChangeInput({ target: { value: 'sickn' } } as ChangeEvent<HTMLInputElement>);
    });
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.items).toEqual([
      { sickCd: 'sickCd1', sickNm: 'keyword1' },
      { sickCd: 'sickCd2', sickNm: 'keyword2' },
    ]);
    expect(mockGetKeywords).toHaveBeenCalledWith('sickn');
  });

  it('최근 항목을 클릭할 때 입력 및 트리거 입력을 설정해야 합니다', async () => {
    const { result } = renderHook(() => useSearch({ getKeywords, search: jest.fn() }), {
      wrapper: ({ children }) => <Provider cache={cache}>{children}</Provider>,
    });
    expect(result.current.input).toBe('');
    expect(result.current.triggerInput).toBe('');
    await act(async () => {
      result.current.handleClickRecentItem('recent item');
    });
    expect(result.current.input).toBe('recent item');
    expect(result.current.triggerInput).toBe('recent item');
  });

  it('항목을 클릭할 때 입력 및 트리거 입력을 설정해야 합니다', async () => {
    const { result } = renderHook(() => useSearch({ getKeywords, search: jest.fn() }), {
      wrapper: ({ children }) => <Provider cache={cache}>{children}</Provider>,
    });
    expect(result.current.input).toBe('');
    expect(result.current.triggerInput).toBe('');
    await act(async () => {
      result.current.handleClickItem('item');
    });
    expect(result.current.input).toBe('item');
    expect(result.current.triggerInput).toBe('item');
  });

  it('양식을 제출할 때 최근 항목을 생성해야 합니다', async () => {
    const { result } = renderHook(() => useSearch({ getKeywords, search: jest.fn() }), {
      wrapper: ({ children }) => <Provider cache={cache}>{children}</Provider>,
    });
    expect(result.current.recentItems).toEqual([]);
    await act(async () => {
      result.current.handleChangeInput({ target: { value: 'sick' } } as ChangeEvent<HTMLInputElement>);
    });
    await act(async () => {
      result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as FormEvent<HTMLFormElement>);
    });
    expect(result.current.recentItems).toEqual([{ id: 1, name: 'sick' }]);
  });

  it('입력 후 삭제하면 항목 리스트가 비어야 합니다', async () => {
    const { result } = renderHook(() => useSearch({ getKeywords, search: jest.fn() }), {
      wrapper: ({ children }) => <Provider cache={cache}>{children}</Provider>,
    });
    expect(result.current.items).toEqual([]);
    await act(async () => {
      result.current.handleChangeInput({ target: { value: 'sick' } } as ChangeEvent<HTMLInputElement>);
    });
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.items).toEqual([
      { sickCd: 'sickCd1', sickNm: 'keyword1' },
      { sickCd: 'sickCd2', sickNm: 'keyword2' },
    ]);
    await act(async () => {
      result.current.handleChangeInput({ target: { value: '' } } as ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.items).toEqual([]);
  });
});
