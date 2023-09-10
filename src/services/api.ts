import { Item } from '../types';

export async function getKeywords(q: string): Promise<Item[]> {
  console.info('calling api');
  return (await fetch(`https://search-back-mrsimplelife.vercel.app/api/sick?q=${q}`)).json();
}
