import { Recent } from '../types';

export function createRecentItem(name: string): Recent[] {
  const recentItems = localStorage.getItem('recent');
  if (!recentItems) {
    const newRecentItems = [{ id: 1, name }];
    localStorage.setItem('recent', JSON.stringify(newRecentItems));
    return newRecentItems;
  }
  const parsedRecentItems: Recent[] = JSON.parse(recentItems);
  if (!name) return parsedRecentItems;
  const index = parsedRecentItems.findIndex((item) => item.name === name);
  if (index !== -1) {
    const newRecentItems = [{ id: parsedRecentItems[index].id, name }, ...parsedRecentItems.slice(0, index), ...parsedRecentItems.slice(index + 1)];
    localStorage.setItem('recent', JSON.stringify(newRecentItems));
    return newRecentItems;
  }
  const { length } = parsedRecentItems;
  if (length >= 5) {
    const lastItem = parsedRecentItems[length - 1];
    const newRecentItems = [{ id: lastItem.id, name }, ...parsedRecentItems.slice(0, 4)];
    localStorage.setItem('recent', JSON.stringify(newRecentItems));
    return newRecentItems;
  }
  const lastItem = parsedRecentItems[0];
  const newRecentItems = [{ id: lastItem ? lastItem.id + 1 : 1, name }, ...parsedRecentItems];
  localStorage.setItem('recent', JSON.stringify(newRecentItems));
  return newRecentItems;
}

export function readRecentItem(): Recent[] {
  const recentItems = localStorage.getItem('recent');
  if (!recentItems) return [];
  return JSON.parse(recentItems);
}

export function deleteRecentItem(id: number): Recent[] {
  const recentItems = localStorage.getItem('recent');
  if (!recentItems) return [];
  const parsedRecentItems: Recent[] = JSON.parse(recentItems);
  const index = parsedRecentItems.findIndex((item) => item.id === id);
  if (index === -1) return parsedRecentItems;
  const newRecentItems = [...parsedRecentItems.slice(0, index), ...parsedRecentItems.slice(index + 1)];
  localStorage.setItem('recent', JSON.stringify(newRecentItems));
  return newRecentItems;
}
