import { useEffect, useState, ReactNode } from 'react';
import { ContentContext, ContentContextType } from './ContentContext';
import { contentApi } from '../api/contentApi';
import { Page } from '@/types/types';

export function ContentProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<ContentContextType['pages']>(null);
  const [reviews, setReviews] = useState<ContentContextType['reviews']>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentApi.getPages()
      .then((result) => setPages(result.data))
      .finally(() => setLoading(false))

    contentApi.getReviews()
      .then(result => setReviews(result.data))
      .finally(() => setLoading(false))
  }, []);

  function updatePage(page: string, content: Page) {
    if (!pages) return
    setPages({ ...pages, [page]: content })
  }

  const value = {
    pages,
    loading,
    reviews,
    updatePage
  }

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}
