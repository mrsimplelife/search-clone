import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getKeywords } from '../services/api';
import { Recent } from '../types';
import { createRecentItem, deleteRecentItem, readRecentItem } from '../utils/localStorageUtils';
import useQuery from './useQuery';

function useSearch() {
  const [input, setInput] = useState('');
  const [triggerInput, setTriggerInput] = useState('');
  const [index, setIndex] = useState(-1);
  const [show, setShow] = useState(false);
  const [recentItems, setRecentItems] = useState<Recent[]>(readRecentItem());

  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const { data: items, loading } = useQuery(['sick', triggerInput], () => getKeywords(triggerInput), {
    initialData: [],
    enabled: !!triggerInput,
    debounceDelay: 300,
  });

  const handleChangeInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInput(value);
    setTriggerInput(value);
  }, []);

  const handleFocusInput = useCallback(() => {
    setShow(true);
  }, []);

  const handleSubmit = useCallback(() => {
    const recentItems = createRecentItem(triggerInput);
    setRecentItems(recentItems);
  }, [triggerInput]);

  const keyEvent: Record<string, () => void> = useMemo(() => {
    return {
      Enter: () => {
        if (index === -1) {
          handleSubmit();
          return;
        }
        const { sickNm } = items[index];
        setTriggerInput(sickNm);
      },
      ArrowDown: () => {
        const { length } = items;
        if (length === 0) return;
        setIndex((prev) => (prev >= length - 1 ? 0 : prev + 1));
      },
      ArrowUp: () => {
        const { length } = items;
        if (length === 0) return;
        setIndex((prev) => (prev <= 0 ? length - 1 : prev - 1));
      },
    };
  }, [handleSubmit, index, items]);

  const handleKeyDownInput = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = e;
      if (e.nativeEvent.isComposing) return;
      if (!(key in keyEvent)) {
        return;
      }
      e.preventDefault();
      keyEvent[key]();
    },
    [keyEvent]
  );

  const handleClickItem = useCallback(
    (id: string) => {
      const { sickNm } = items.find(({ sickCd }) => sickCd === id)!;
      setInput(sickNm);
      setTriggerInput(sickNm);
      inputRef.current?.focus();
    },
    [items]
  );

  const handleChangeIndex = () => {
    const { length } = items;
    if (index === -1 || index >= length) return;
    const { sickNm } = items[index];
    setInput(sickNm);

    if (!popupRef.current) return;
    const scrollItems = popupRef.current.querySelectorAll(':scope > ul > li');
    const currentItem = scrollItems[index];
    if (currentItem) {
      currentItem.scrollIntoView({ block: 'nearest' });
    }
  };

  useEffect(handleChangeIndex, [index, items]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const { target } = event;
    if (
      inputRef.current &&
      !inputRef.current.contains(target as HTMLInputElement) &&
      popupRef.current &&
      !popupRef.current.contains(target as HTMLDivElement)
    ) {
      setShow(false);
    }
  }, []);

  const addMouseDownEvent = () => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  };

  useEffect(addMouseDownEvent, [handleClickOutside]);

  const handleTriigerInput = () => {
    setIndex(-1);
  };

  useEffect(handleTriigerInput, [triggerInput]);

  const handleDeleteRecentItem = useCallback((id: number) => {
    const recentItems = deleteRecentItem(id);
    setRecentItems(recentItems);
    inputRef.current?.focus();
  }, []);

  const handleClickRecentItem = useCallback(
    (id: number) => {
      const { name } = recentItems.find(({ id: recentId }) => recentId === id)!;
      setInput(name);
      setTriggerInput(name);
      inputRef.current?.focus();
    },
    [recentItems]
  );

  return {
    input,
    index,
    show,
    items,
    loading,
    handleChangeInput,
    handleFocusInput,
    handleKeyDownInput,
    handleClickItem,
    inputRef,
    popupRef,
    recentItems,
    handleDeleteRecentItem,
    handleClickRecentItem,
  };
}

export default useSearch;
