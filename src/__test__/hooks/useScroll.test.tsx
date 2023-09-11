import { renderHook } from '@testing-library/react';
import useScroll from '../../hooks/useScroll';
import { RefObject } from 'react';

describe('useScroll', () => {
  it('함수를 반환해야 함', () => {
    const { result } = renderHook(() => useScroll({ popupRef: { current: null }, selectors: '' }));
    expect(typeof result.current).toBe('function');
  });

  it('popupRef가 정의되지 않은 경우 스크롤하지 않아야 함', () => {
    const { result } = renderHook(() => useScroll({ popupRef: { current: null }, selectors: '' }));
    const handleScroll = result.current;
    expect(() => handleScroll(0)).not.toThrow();
  });

  it('handleScroll이 호출될 때 가장 가까운 아이템으로 스크롤해야 함', () => {
    const scrollIntoViewMock = jest.fn();
    const scrollItems = [{ scrollIntoView: scrollIntoViewMock }, { scrollIntoView: scrollIntoViewMock }, { scrollIntoView: scrollIntoViewMock }];
    const popupRef = { current: { querySelectorAll: jest.fn().mockReturnValue(scrollItems) } } as unknown as RefObject<HTMLElement>;
    const { result } = renderHook(() => useScroll({ popupRef, selectors: '' }));
    const handleScroll = result.current;
    handleScroll(1);
    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
  });

  it('인덱스가 범위를 벗어난 경우 스크롤하지 않아야 함', () => {
    const scrollIntoViewMock = jest.fn();
    const scrollItems = [{ scrollIntoView: scrollIntoViewMock }, { scrollIntoView: scrollIntoViewMock }, { scrollIntoView: scrollIntoViewMock }];
    const popupRef = { current: { querySelectorAll: jest.fn().mockReturnValue(scrollItems) } } as unknown as RefObject<HTMLElement>;
    const { result } = renderHook(() => useScroll({ popupRef, selectors: '' }));
    const handleScroll = result.current;
    handleScroll(3);
    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });
});
