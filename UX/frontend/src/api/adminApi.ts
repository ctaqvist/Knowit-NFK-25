import { ApiResponse, DownloadableFiles, Page, Pages } from '@/types/types';
import { api } from './axios';

export const adminApi = {
  updateFile: (
    fileName: DownloadableFiles,
    newFile: File
  ): Promise<ApiResponse<string>> => api.post(`/admin/files/${fileName}`, newFile, {
    headers: {
      'Content-Type': newFile.type
    }
  }),

  updatePage: async (
    page: keyof Pages,
    content: Page
  ): Promise<
    ApiResponse<{
      page: string;
      content: Page;
    }>
  > => {
    return api.patch(`/admin/${page}`, content);
  },
};
