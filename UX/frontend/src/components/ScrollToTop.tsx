import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This component listens for changes to the URL hash and scrolls to the matching element
export default function ScrollToHash() {
  const { hash, pathname } = useLocation();
  console.log(hash)

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

    let title = `TerraX9 `;
    if (pathname === '/') title += ''
    if (hash) {
      title += `| ${hash?.[1]?.toUpperCase()}${hash?.slice(2)}`
    } else if (!hash && pathname !== '/') {
      title += `| ${pathname?.[1]?.toUpperCase()}${pathname?.slice(2)}`
    }
    document.title = title;

  }, [hash, pathname]);

  return null;
}