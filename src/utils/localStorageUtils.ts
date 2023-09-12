import { Recent } from '../types';

export function createRecentItem(name: string): Recent[] {
  const recentItems: Recent[] = JSON.parse(localStorage.getItem('recent') || '[]');
  if (!name) return recentItems;
  const index = recentItems.findIndex((item) => item.name === name);
  if (index !== -1) {
    recentItems.splice(index, 1);
  }
  recentItems.unshift({ id: recentItems.length ? recentItems[0].id + 1 : 1, name });
  if (recentItems.length > 5) {
    const deleted = recentItems.pop()!;
    recentItems[0].id = deleted.id;
  }
  localStorage.setItem('recent', JSON.stringify(recentItems));
  return recentItems;
}

export function readRecentItem(): Recent[] {
  return JSON.parse(localStorage.getItem('recent') || '[]');
}

export function deleteRecentItem(id: number): Recent[] {
  const recentItems: Recent[] = JSON.parse(localStorage.getItem('recent') || '[]');
  const index = recentItems.findIndex((item) => item.id === id);
  if (index !== -1) recentItems.splice(index, 1);
  localStorage.setItem('recent', JSON.stringify(recentItems));
  return recentItems;
}
