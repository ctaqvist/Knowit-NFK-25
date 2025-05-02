import { Inject, Injectable, Param } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { ApiResponse, Page, Review, Pages } from 'src/types/types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PageService {
  constructor(
    private readonly supabaseService: SupabaseService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getPages(): Promise<ApiResponse<Pages>> {
    try {
      const PAGES = ['hero', 'product', 'support'];
      const CACHED_PAGES = await this.cacheManager.get('pages');
      console.log('Cached pages: ', CACHED_PAGES)
      if (CACHED_PAGES)
        return {
          data: CACHED_PAGES as Pages,
          error: null,
        };

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
      // Set cache expiration to an hour
      await this.cacheManager.set('pages', ALLPAGES, 3600);

      return {
        data: ALLPAGES as Pages,
        error: null,
      };
    } catch (error) {
      console.error('Error when fetching pages: ', error);
      throw new Error(`Error when fetching pages`);
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
        throw new Error(`Error when fetching ${page} page`);
      }

      //Convert the blob to JSON
      const parsedBlob = JSON.parse(await data.text());

      return {
        data: parsedBlob as Page,
        error: null,
      };
    } catch (error) {
      console.error('Error when fetching page: ', error);
      throw new Error(`Error when fetching ${page} page`);
    }
  }

  async getReviews(): Promise<ApiResponse<Review[]>> {
    try {
      const CACHED_REVIEWS = await this.cacheManager.get('reviews');
      console.log('Cached reviews: ', CACHED_REVIEWS)

      if (CACHED_REVIEWS)
        return { data: CACHED_REVIEWS as Review[], error: null };

      const CLIENT = this.supabaseService.supabase;
      const { data, error } = await CLIENT.from('reviews').select(`
        content,
        clients(company_name)`);

      if (error) {
        console.error('Error when fetching reviews: ', error);
        throw new Error(`Error when fetching reviews`);
      }

      const formattedReview = data?.map((review) => ({
        content: review.content,
        client: review.clients['company_name'],
      }));

      // Set cache expiration to an hour
      await this.cacheManager.set('reviews', formattedReview, 3600)

      return {
        data: formattedReview,
        error: null,
      };
    } catch (error) {
      console.error('Error when fetching reviews: ', error);
      throw new Error(`Error when fetching reviews`);
    }
  }
}
