import { useState, useCallback } from 'react';

/**
 * Small hook that syncs a piece of state to localStorage.
 * Useful for UI preferences and future auth/token management.
 *
 * @param {string} key
 * @param {*} initialValue
 */
export default function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      setStored((prev) => {
        const next = typeof value === 'function' ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch (error) {
          // Ignore write failures (e.g. private mode).
        }
        return next;
      });
    },
    [key]
  );

  return [stored, setValue];
}
