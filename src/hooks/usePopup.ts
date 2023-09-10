import { useCallback, useEffect, useState } from 'react';

function usePopup(inputRef: React.RefObject<HTMLInputElement>, popupRef: React.RefObject<HTMLDivElement>) {
  const [show, setShow] = useState(false);

  const handleFocusInput = useCallback(() => {
    setShow(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const { target } = event;
      if (
        inputRef.current &&
        !inputRef.current.contains(target as HTMLInputElement) &&
        popupRef.current &&
        !popupRef.current.contains(target as HTMLDivElement)
      ) {
        setShow(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [inputRef, popupRef]);

  return { show, handleFocusInput };
}

export default usePopup;
