import { useEffect } from 'react';

/**
 * Custom hook to update document title dynamically for each page.
 * Keeps browser tabs clear and improves accessibility.
 *
 * @param {string} title - The title prefix for the page
 */
export default function useDocumentTitle(title) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) {
      document.title = `${title} | EventPortal`;
    } else {
      document.title = 'EventPortal — Campus Event Management';
    }

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}
