import { FormEvent, useCallback, useState } from 'react';
import { Recent } from '../types';
import { createRecentItem, deleteRecentItem, readRecentItem } from '../utils/localStorageUtils';

function useRecentItems(inputRef: React.RefObject<HTMLInputElement>) {
  const [recentItems, setRecentItems] = useState<Recent[]>(readRecentItem());

  const handleDeleteRecentItem = useCallback(
    (id: number) => {
      const recentItems = deleteRecentItem(id);
      setRecentItems(recentItems);
      inputRef.current?.focus();
    },
    [inputRef]
  );

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>, input: string) => {
    e.preventDefault();
    const recentItems = createRecentItem(input);
    setRecentItems(recentItems);
  }, []);

  return { recentItems, handleDeleteRecentItem, handleSubmit };
}

export default useRecentItems;
