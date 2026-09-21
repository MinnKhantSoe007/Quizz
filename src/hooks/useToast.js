import { useState, useCallback, useRef } from 'react';

/**
 * useToast — local toast state for a screen. Pair with the Toast component.
 * Not a global queue: each screen that needs one owns its own instance.
 */
export function useToast(duration = 2500) {
  const [message, setMessage] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback(
    (text) => {
      setMessage(text);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setMessage(null), duration);
    },
    [duration]
  );

  return { toastMessage: message, showToast };
}
