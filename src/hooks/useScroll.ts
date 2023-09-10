import { useCallback } from 'react';

function useScroll(popupRef: React.RefObject<HTMLDivElement>) {
  const handleScroll = useCallback(
    (index: number) => {
      if (!popupRef.current) return;
      const scrollItems = popupRef.current.querySelectorAll(':scope > ul > li');
      const currentItem = scrollItems[index];
      if (currentItem) {
        currentItem.scrollIntoView({ block: 'nearest' });
      }
    },
    [popupRef]
  );
  return { handleScroll };
}

export default useScroll;
