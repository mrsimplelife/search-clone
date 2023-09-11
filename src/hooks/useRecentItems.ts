import { useCallback, useState } from 'react';
import { Recent } from '../types';
import { createRecentItem, deleteRecentItem, readRecentItem } from '../utils/localStorageUtils';

function useRecentItems() {
  const [recentItems, setRecentItems] = useState<Recent[]>(readRecentItem());

  const handleDeleteRecentItem = useCallback((id: number) => {
    const recentItems = deleteRecentItem(id);
    setRecentItems(recentItems);
  }, []);

  const handleCreateRecentItem = useCallback((input: string) => {
    const recentItems = createRecentItem(input);
    setRecentItems(recentItems);
  }, []);

  return { recentItems, handleDeleteRecentItem, handleCreateRecentItem };
}

export default useRecentItems;
