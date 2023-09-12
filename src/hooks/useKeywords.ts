import { KeyboardEvent, useCallback } from 'react';

type Key = 'Enter' | 'ArrowDown' | 'ArrowUp';
type Handler = (e: React.KeyboardEvent<HTMLInputElement>) => void;

function useKeywords(onKeyDown: Record<Key, Handler>) {
  const handleKeyDownInput = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key in onKeyDown) {
        onKeyDown[e.key as Key](e);
      }
    },
    [onKeyDown]
  );

  return handleKeyDownInput;
}

export default useKeywords;
