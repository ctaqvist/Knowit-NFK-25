import { createContext } from 'react';
import { Review, Pages, Page } from '@/types/types';

export interface ContentContextType {
  pages: Pages | null,
  reviews: Review[] | null,
  updatePage: (page: string, content: Page) => void
}

export const ContentContext = createContext<ContentContextType | undefined>(undefined);