import { createContext } from 'react';
import { FormattedPageData, FormattedReview } from '../types/types';

export interface ContentContextType {
  pages: FormattedPageData | null,
  reviews: FormattedReview[] | null
}

export const ContentContext = createContext<ContentContextType | undefined>(undefined);