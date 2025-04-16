import { useEffect, useState, ReactNode } from 'react';
import { ContentContext, ContentContextType } from './ContentContext';
import { contentApi } from '../api/contentApi';

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

  const value = {
    pages,
    loading,
    reviews
  }

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}
