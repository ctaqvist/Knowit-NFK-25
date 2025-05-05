import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This component listens for changes to the URL hash and scrolls to the matching element
export default function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      // Remove the leading '#' for querySelector compatibility
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash, pathname]);

  return null;
}