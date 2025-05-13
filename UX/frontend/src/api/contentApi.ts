import { Tables } from '@/types/supabase.types';
import { api } from './axios';
import { Page, Review, ApiResponse, Pages, DownloadableFiles } from '@/types/types';
import { supabase } from '@/config/supabase';

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
  updateFile: (fileName: DownloadableFiles, newFile: File): Promise<ApiResponse<string>> => api.post(`/files/${fileName}`, newFile),

  updatePage: async (page: keyof Pages, content: Page): Promise<ApiResponse<{
    page: string,
    content: Page
  }>> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  return api.patch(`/admin/${page}`, content, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
}