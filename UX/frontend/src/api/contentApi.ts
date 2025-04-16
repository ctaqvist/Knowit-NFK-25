import { api } from './axios';
import { Page, Review, ApiResponse, Pages } from '@/types/types';

// Api gets content from the backend
export const contentApi = {
  getPages: (): Promise<ApiResponse<Pages>> => api.get('pages'),
  getPage: (page: string): Promise<ApiResponse<Page>> => api.get(`pages/${page}`),
  getReviews: (): Promise<ApiResponse<Review[]>> => api.get('pages/reviews')
}