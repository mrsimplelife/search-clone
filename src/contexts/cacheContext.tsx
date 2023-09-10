import { PropsWithChildren, createContext, useContext, useRef } from 'react';
import Cache from '../utils/Cache';

type ContextValue<T> = {
  cache: Cache<T>;
};

const Context = createContext<ContextValue<unknown> | null>(null);

function Provider<T>({ children, cache }: PropsWithChildren<ContextValue<T>>) {
  const value = useRef(cache).current;
  return <Context.Provider value={{ cache: value }}>{children}</Context.Provider>;
}

export function useCache<T>() {
  return useContext(Context) as ContextValue<T>;
}

export default Provider;
