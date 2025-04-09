import { api } from './axios';
import { PageData, FormattedReview, ApiResponse } from '../types/types';

// Api gets content from the backend
export const contentApi = {
  getPages: (): Promise<ApiResponse<PageData[]>> => api.get('pages'),
  getReviews: (): Promise<ApiResponse<FormattedReview[]>> => api.get('pages/reviews')
}