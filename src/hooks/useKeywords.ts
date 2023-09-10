import { useCallback, useMemo } from 'react';
import { Item } from '../types';

function useKeywords(getRecommendKeywords: (name: string) => void, setOnlyInput: (index: number, name: string) => void) {
  const keyEvent: Record<string, (e: React.KeyboardEvent<HTMLInputElement>, index: number, items: Item[]) => void> = useMemo(
    () => ({
      Enter: (e, index, items) => {
        if (index === -1) return;
        e.preventDefault();
        getRecommendKeywords(items[index].sickNm);
      },
      ArrowDown: (e, index, items) => {
        e.preventDefault();
        if (items.length === 0) return;
        const newIndex = index >= items.length - 1 ? 0 : index + 1;
        setOnlyInput(newIndex, items[newIndex].sickNm);
      },
      ArrowUp: (e, index, items) => {
        e.preventDefault();
        if (items.length === 0) return;
        const newIndex = index <= 0 ? items.length - 1 : index - 1;
        setOnlyInput(newIndex, items[newIndex].sickNm);
      },
    }),
    [getRecommendKeywords, setOnlyInput]
  );

  const handleKeyDownInput = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, index: number, items: Item[]) => {
      if (e.nativeEvent.isComposing) return;
      if (!(e.key in keyEvent)) return;
      keyEvent[e.key](e, index, items);
    },
    [keyEvent]
  );

  return { handleKeyDownInput };
}

export default useKeywords;
