import { createContext } from 'react';
import { Review, Pages } from '@/types/types';

export interface ContentContextType {
  pages: Pages | null,
  reviews: Review[] | null,
  getContent: () => void
}

export const ContentContext = createContext<ContentContextType | undefined>(undefined);