import { ChangeEvent, FormEvent, useCallback, useRef, useState } from 'react';
import useKeywords from './useKeywords';
import usePopup from './usePopup';
import useQuery from './useQuery';
import useRecentItems from './useRecentItems';
import useScroll from './useScroll';
import { Item, Recent } from '../types';

type Props = { getKeywords: (name: string) => Promise<Item[]>; search: (name: string) => Promise<Recent[]> };

function useSearch({ getKeywords, search }: Props) {
  const [input, setInput] = useState('');
  const [triggerInput, setTriggerInput] = useState('');
  const [index, setIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const { data: items, loading } = useQuery(['sick', triggerInput], () => getKeywords(triggerInput), {
    initialData: [],
    enabled: !!triggerInput,
    debounceDelay: 300,
  });

  const getRecommendKeywords = useCallback((name: string) => {
    setInput(name);
    setTriggerInput(name);
    setIndex(-1);
    inputRef.current?.focus();
  }, []);

  const handleChangeInput = useCallback((e: ChangeEvent<HTMLInputElement>) => getRecommendKeywords(e.target.value), [getRecommendKeywords]);
  const handleClickRecentItem = useCallback((name: string) => getRecommendKeywords(name), [getRecommendKeywords]);
  const handleClickItem = useCallback((sickNm: string) => getRecommendKeywords(sickNm), [getRecommendKeywords]);

  const { recentItems, handleDeleteRecentItem, handleCreateRecentItem } = useRecentItems();

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      search(input);
      handleCreateRecentItem(input);
    },
    [input, handleCreateRecentItem, search]
  );

  const handleClickDelete = useCallback(
    (id: number) => {
      handleDeleteRecentItem(id);
      inputRef.current?.focus();
    },
    [handleDeleteRecentItem]
  );

  const { isShowPopup, showPopup } = usePopup([inputRef, popupRef]);

  const handleScroll = useScroll({ popupRef, selectors: ':scope > ul > li' });

  const changeIndex = useCallback(
    (name: string, index: number) => {
      setInput(name);
      setIndex(index);
      handleScroll(index);
    },
    [handleScroll]
  );

  const handleKeyDown = useKeywords({
    Enter: (e) => {
      if (index === -1) return;
      e.preventDefault();
      getRecommendKeywords(items[index].sickNm);
    },
    ArrowDown: (e) => {
      if (e.nativeEvent.isComposing) return;
      e.preventDefault();
      if (items.length === 0) return;
      const newIndex = index >= items.length - 1 ? 0 : index + 1;
      changeIndex(items[newIndex].sickNm, newIndex);
    },
    ArrowUp: (e) => {
      if (e.nativeEvent.isComposing) return;
      e.preventDefault();
      if (items.length === 0) return;
      const newIndex = index <= 0 ? items.length - 1 : index - 1;
      changeIndex(items[newIndex].sickNm, newIndex);
    },
  });

  return {
    triggerInput,
    input,
    index,
    items,
    loading,
    inputRef,
    popupRef,
    recentItems,
    isShowPopup,
    handleChangeInput,
    handleClickItem,
    handleClickRecentItem,
    handleSubmit,
    handleClickDelete,
    handleKeyDown,
    showPopup,
  };
}

export default useSearch;
