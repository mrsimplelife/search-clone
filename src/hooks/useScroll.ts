import { useCallback } from 'react';

type Option = {
  popupRef: React.RefObject<HTMLElement>;
  selectors: string;
};

function useScroll({ popupRef, selectors }: Option) {
  const handleScroll = useCallback(
    (index: number) => {
      if (!popupRef.current) return;
      const scrollItems = popupRef.current.querySelectorAll(selectors);
      const currentItem = scrollItems[index];
      if (currentItem) {
        currentItem.scrollIntoView({ block: 'nearest' });
      }
    },
    [popupRef, selectors]
  );
  return handleScroll;
}

export default useScroll;
