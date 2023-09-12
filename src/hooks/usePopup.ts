import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

function usePopup(refs: RefObject<HTMLElement>[]) {
  const _refs = useRef(refs);
  const [isShowPopup, setIsShowPopup] = useState(false);

  const showPopup = useCallback(() => {
    setIsShowPopup(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = ({ target }: MouseEvent) => {
      if (
        _refs.current.every(({ current }) => {
          return !current?.contains(target as Node);
        })
      ) {
        setIsShowPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return { isShowPopup, showPopup };
}

export default usePopup;
