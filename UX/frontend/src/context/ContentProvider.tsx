import { useEffect, useState, ReactNode } from 'react';
import { ContentContext, ContentContextType } from './ContentContext';
import { contentApi } from '../api/contentApi';
import { FormattedPageData } from '../types/types';

export function ContentProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<ContentContextType['pages']>(null);
  const [reviews, setReviews] = useState<ContentContextType['reviews']>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentApi.getPages()
      .then((result) => {
        const formattedData: FormattedPageData = result.data.reduce((acc, page) => {
          acc[page.name] = {
            content: page.content
          };
          return acc;
        }, {} as FormattedPageData);
        setPages(formattedData)
      });

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
