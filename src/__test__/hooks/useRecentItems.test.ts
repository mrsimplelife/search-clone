import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import useRecentItems from '../../hooks/useRecentItems';
import { createRecentItem, deleteRecentItem, readRecentItem } from '../../utils/localStorageUtils';

jest.mock('../../utils/localStorageUtils');

describe('useRecentItems', () => {
  beforeEach(() => {
    (readRecentItem as jest.Mock).mockReturnValue([]);
  });

  it('빈 배열로 초기화되어야 함', () => {
    const { result } = renderHook(() => useRecentItems());
    expect(result.current.recentItems).toEqual([]);
  });

  it('마운트 시 readRecentItem 함수를 호출해야 함', () => {
    renderHook(() => useRecentItems());
    expect(readRecentItem).toHaveBeenCalledTimes(1);
  });

  it('handleCreateRecentItem 함수가 호출되었을 때 createRecentItem 함수를 호출해야 함', () => {
    const { result } = renderHook(() => useRecentItems());
    const name = 'test';
    (createRecentItem as jest.Mock).mockReturnValue([{ id: 1, name }]);
    act(() => {
      result.current.handleCreateRecentItem(name);
    });
    expect(createRecentItem).toHaveBeenCalledWith(name);
    expect(result.current.recentItems).toEqual([{ id: 1, name }]);
  });

  it('handleDeleteRecentItem 함수가 호출되었을 때 deleteRecentItem 함수를 호출해야 함', () => {
    const { result } = renderHook(() => useRecentItems());
    const id = 1;
    (deleteRecentItem as jest.Mock).mockReturnValue([]);
    act(() => {
      result.current.handleDeleteRecentItem(id);
    });
    expect(deleteRecentItem).toHaveBeenCalledWith(id);
    expect(result.current.recentItems).toEqual([]);
  });
});
