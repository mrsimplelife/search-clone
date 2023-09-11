import { renderHook } from '@testing-library/react';
import useKeywords from '../../hooks/useKeywords';
import { KeyboardEvent } from 'react';

describe('useKeywords', () => {
  it('"Enter" 키가 눌렸을 때 "Enter" 핸들러를 호출해야 합니다.', () => {
    const onKeyDown = {
      Enter: jest.fn(),
      ArrowDown: jest.fn(),
      ArrowUp: jest.fn(),
    };
    const { result } = renderHook(() => useKeywords(onKeyDown));
    const handleKeyDownInput = result.current;
    handleKeyDownInput({ key: 'Enter' } as KeyboardEvent<HTMLInputElement>);
    expect(onKeyDown.Enter).toHaveBeenCalledTimes(1);
  });

  it('"ArrowDown" 키가 눌렸을 때 "ArrowDown" 핸들러를 호출해야 합니다.', () => {
    const onKeyDown = {
      Enter: jest.fn(),
      ArrowDown: jest.fn(),
      ArrowUp: jest.fn(),
    };
    const { result } = renderHook(() => useKeywords(onKeyDown));
    const handleKeyDownInput = result.current;
    handleKeyDownInput({ key: 'ArrowDown' } as KeyboardEvent<HTMLInputElement>);
    expect(onKeyDown.ArrowDown).toHaveBeenCalledTimes(1);
  });

  it('"ArrowUp" 키가 눌렸을 때 "ArrowUp" 핸들러를 호출해야 합니다.', () => {
    const onKeyDown = {
      Enter: jest.fn(),
      ArrowDown: jest.fn(),
      ArrowUp: jest.fn(),
    };
    const { result } = renderHook(() => useKeywords(onKeyDown));
    const handleKeyDownInput = result.current;
    handleKeyDownInput({ key: 'ArrowUp' } as KeyboardEvent<HTMLInputElement>);
    expect(onKeyDown.ArrowUp).toHaveBeenCalledTimes(1);
  });

  it('다른 키가 눌렸을 때는 어떤 핸들러도 호출되지 않아야 합니다.', () => {
    const onKeyDown = {
      Enter: jest.fn(),
      ArrowDown: jest.fn(),
      ArrowUp: jest.fn(),
    };
    const { result } = renderHook(() => useKeywords(onKeyDown));
    const handleKeyDownInput = result.current;
    handleKeyDownInput({ key: 'Escape' } as KeyboardEvent<HTMLInputElement>);
    expect(onKeyDown.Enter).not.toHaveBeenCalled();
    expect(onKeyDown.ArrowDown).not.toHaveBeenCalled();
    expect(onKeyDown.ArrowUp).not.toHaveBeenCalled();
  });
});
