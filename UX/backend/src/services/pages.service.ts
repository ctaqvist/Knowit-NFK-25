import { Injectable, Param } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { ApiResponse, Page, Review, Pages } from 'src/types/types';

@Injectable()
export class PageService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getPages(): Promise<ApiResponse<Pages>> {
    try {
      const PAGES = ['hero', 'product', 'support'];

      // Get all pages, assign them to ALLPAGES object
      const getAllPages = async () => {
        const ALLPAGES = {};

        const pageDataArray = await Promise.all(
          PAGES.map(async (page) => {
            const data = (await this.getPage(page)).data;
            return { page, data };
          }),
        );

        pageDataArray.forEach(({ page, data }) => {
          ALLPAGES[page] = data;
        });

        return ALLPAGES;
      };

      const ALLPAGES = await getAllPages();

      return {
        data: ALLPAGES as Pages,
        error: null,
      };
    } catch (error) {
      console.error('Error when fetching pages: ', error);
      throw new Error('Error when fetching pages: ', error);
    }
  }

  async getPage(@Param('page') page: string): Promise<ApiResponse<Page>> {
    try {
      // Retrieve from DB bucket
      const CLIENT = this.supabaseService.supabase;
      const PAGEFILE = `${page}.json`;
      const { data, error } = await CLIENT.storage
        .from('pages')
        .download(PAGEFILE);

      if (error) {
        console.error('Error when fetching page: ', error);
        throw new Error('Error when fetching page: ', error);
      }

      //Convert the blob to JSON
      const parsedBlob = JSON.parse(await data.text());

      return {
        data: parsedBlob as Page,
        error: null,
      };
    } catch (error) {
      console.error('Error when fetching page: ', error);
      throw new Error('Error when fetching page: ', error);
    }
  }

  async getReviews(): Promise<ApiResponse<Review[]>> {
    try {
      const CLIENT = this.supabaseService.supabase;
      const { data, error } = await CLIENT.from('reviews').select(`
        content,
        clients(company_name)`);

      if (error) {
        console.error('Error when fetching reviews: ', error);
        throw new Error('Error when fetching reviews', error);
      }

      const formattedReview = data?.map((review) => ({
        content: review.content,
        client: review.clients['company_name'],
      }));

      return {
        data: formattedReview,
        error: null,
      };
    } catch (error) {
      console.error('Error when fetching reviews: ', error);
      throw new Error('Error when fetching reviews: ', error);
    }
  }
}
