import { Tables } from '@/types/supabase.types';
import { api } from './axios';
import { Page, Review, ApiResponse, Pages, DownloadableFiles } from '@/types/types';

// Api gets content from the backend
export const contentApi = {
  getPages: (): Promise<ApiResponse<Pages>> => api.get('pages'),
  getPage: (page: string): Promise<ApiResponse<Page>> => api.get(`pages/${page}`),
  getReviews: (): Promise<ApiResponse<Review[]>> => api.get('pages/reviews'),
  getFile: (file: DownloadableFiles): Promise<Blob> => api.get(`files/${file}`, {
    responseType: 'blob'
  }),
  getBookedTimes: (date: string): Promise<ApiResponse<Tables<'booked_times_public_view'>[]>> => api.get(`/pages/booked-times/${date}`),
  sendSupportForm: () => {},
  createBooking: () => {},

}