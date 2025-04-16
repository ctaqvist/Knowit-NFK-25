import { createContext } from 'react';
import { Review, Pages } from '@/types/types';

export interface ContentContextType {
  pages: Pages | null,
  reviews: Review[] | null
}

export const ContentContext = createContext<ContentContextType | undefined>(undefined);