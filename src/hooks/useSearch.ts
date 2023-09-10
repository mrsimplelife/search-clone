import { useCallback, useRef, useState } from 'react';
import { getKeywords } from '../services/api';
import useKeywords from './useKeywords';
import usePopup from './usePopup';
import useQuery from './useQuery';
import useRecentItems from './useRecentItems';
import useScroll from './useScroll';

function useSearch() {
  const [input, setInput] = useState('');
  const [triggerInput, setTriggerInput] = useState('');
  const [index, setIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const getRecommendKeywords = useCallback((name: string) => {
    setInput(name);
    setTriggerInput(name);
    setIndex(-1);
    inputRef.current?.focus();
  }, []);

  const handleChangeInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => getRecommendKeywords(e.target.value), [getRecommendKeywords]);
  const handleClickRecentItem = useCallback((name: string) => getRecommendKeywords(name), [getRecommendKeywords]);
  const handleClickItem = useCallback((sickNm: string) => getRecommendKeywords(sickNm), [getRecommendKeywords]);

  const { handleScroll } = useScroll(popupRef);

  const setOnlyInput = useCallback(
    (index: number, name: string) => {
      setIndex(index);
      setInput(name);
      handleScroll(index);
    },
    [handleScroll]
  );

  const { handleKeyDownInput } = useKeywords(getRecommendKeywords, setOnlyInput);

  const { recentItems, handleDeleteRecentItem, handleSubmit } = useRecentItems(inputRef);

  const { show, handleFocusInput } = usePopup(inputRef, popupRef);

  const { data: items, loading } = useQuery(['sick', triggerInput], () => getKeywords(triggerInput), {
    initialData: [],
    enabled: !!triggerInput,
    debounceDelay: 300,
  });

  return {
    input,
    index,
    items,
    loading,
    handleChangeInput,
    handleKeyDownInput,
    handleClickItem,
    inputRef,
    popupRef,
    recentItems,
    handleDeleteRecentItem,
    handleClickRecentItem,
    handleSubmit,
    show,
    handleFocusInput,
  };
}

export default useSearch;
