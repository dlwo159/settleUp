import { useEffect, useState } from 'react';

export function useSmartLoading(visible: boolean, delay = 180, min = 250) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let t1: any,
      t2: any,
      shownAt = 0;
    if (visible) {
      t1 = setTimeout(() => {
        setShow(true);
        shownAt = Date.now();
      }, delay);
    } else {
      if (show) {
        const remain = Math.max(0, min - (Date.now() - shownAt));
        t2 = setTimeout(() => setShow(false), remain);
      } else {
        clearTimeout(t1);
      }
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [visible, delay, min, show]);
  return show;
}
