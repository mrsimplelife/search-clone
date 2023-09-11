import { renderHook, act } from '@testing-library/react';
import { RefObject } from 'react';
import usePopup from '../../hooks/usePopup';

describe('usePopup hook', () => {
  let refs: RefObject<HTMLElement>[];
  let outerElement: HTMLElement;
  let innerElement: HTMLElement;

  beforeEach(() => {
    outerElement = document.createElement('div');
    innerElement = document.createElement('div');
    outerElement.appendChild(innerElement);
    document.body.appendChild(outerElement);
    const ref = { current: innerElement };
    refs = [ref];
  });

  afterEach(() => {
    document.body.removeChild(outerElement);
  });

  it('팝업이 기본적으로 보이지 않아야 합니다.', () => {
    const { result } = renderHook(() => usePopup(refs));
    expect(result.current.isShowPopup).toBe(false);
  });

  it('showPopup 함수가 호출되었을 때 팝업이 보이도록 구현되어야 합니다.', () => {
    const { result } = renderHook(() => usePopup(refs));

    act(() => {
      result.current.showPopup();
    });

    expect(result.current.isShowPopup).toBe(true);
  });

  it('팝업 바깥을 클릭했을 때 팝업이 숨겨져야 합니다.', () => {
    const { result } = renderHook(() => usePopup(refs));

    act(() => {
      result.current.showPopup();
    });

    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(result.current.isShowPopup).toBe(false);
  });

  it('팝업 안쪽을 클릭했을 때 팝업이 숨겨지지 않아야 합니다.', () => {
    const { result } = renderHook(() => usePopup(refs));

    act(() => {
      result.current.showPopup();
    });

    act(() => {
      innerElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(result.current.isShowPopup).toBe(true);
  });
});
