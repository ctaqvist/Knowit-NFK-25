import { Inject, Injectable, Param } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { ApiResponse, Page, Review, Pages, ContactForm } from 'src/types/types';
import { DownloadableFiles } from 'src/controllers/files.controller';
import { Response } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { isCacheFresh } from 'src/utils/calc';
import { Tables } from 'src/types/supabase.types';
import { File } from 'node:buffer';

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

      // Check when last updated and if it's within the last hour
      const LAST_UPDATED = await this.getLastUpdated('pages');
      const MAX_AGE = 60 * 60 * 1000;

      if (CACHED_PAGES && isCacheFresh(LAST_UPDATED, MAX_AGE))
        return {
          data: CACHED_PAGES as Pages,
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
      };
    } catch (error) {
      console.error('Error when fetching pages: ', error);
      throw new Error(`Error when fetching pages`);
    }
  }

  async getPage(page: string): Promise<ApiResponse<Page>> {
    try {
      // Retrieve from DB bucket
      const CLIENT = this.supabaseService.supabase;
      const PAGEFILE = `${page}.json`;
      const { data, error } = await CLIENT.storage
        .from('pages')
        .download(PAGEFILE);

      if (error) {
        throw new Error(`Error when fetching ${page} page`);
      }

      //Convert the blob to JSON
      const parsedBlob = JSON.parse(await data.text());

      return {
        data: parsedBlob as Page,
      };
    } catch (error) {
      console.error('Error when fetching page: ', error);
      throw new Error(`Error when fetching ${page} page`);
    }
  }

  async getReviews(): Promise<ApiResponse<Review[]>> {
    try {
      const CACHED_REVIEWS = await this.cacheManager.get('reviews');

      // Check when last updated and if it's within the last hour
      const LAST_UPDATED = await this.getLastUpdated('reviews');
      const MAX_AGE = 60 * 60 * 1000;

      if (CACHED_REVIEWS && isCacheFresh(LAST_UPDATED, MAX_AGE))
        return { data: CACHED_REVIEWS as Review[] };

      const CLIENT = this.supabaseService.supabase;
      const { data, error } = await CLIENT.from('reviews').select(`
        content,
        clients(company_name)`);

      if (error) throw error;

      const formattedReview = data?.map((review) => ({
        content: review.content,
        client: review.clients['company_name'],
      }));

      // Set cache expiration to an hour
      await this.cacheManager.set('reviews', formattedReview, 3600);

      return {
        data: formattedReview,
      };
    } catch (error) {
      console.error('Error when fetching reviews: ', error);
      return {
        data: null,
        error: error,
        message: 'Something went wrong when fetching reviews',
      };
    }
  }

  async getFile(file: string): Promise<Buffer> {
    const { data, error } = await this.supabaseService.supabase.storage
      .from('files')
      .download(`${file}.pdf`);

    if (error || !data) {
      throw new Error(`Error fetching ${file}: ${error}`);
    }

    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  async updateFile(fileName: string, newFile: any): Promise<ApiResponse<null>> {
    try {
      const VALID_FILES = ['Instruction_Manual', 'GPSR'];
      if (!VALID_FILES.includes(fileName))
        throw new Error(
          'Invalid file, new file must be either an Instruction Manual or GPSR pdf',
        );

      const CLIENT = this.supabaseService.supabase;

      const { data, error } = await CLIENT.storage
        .from('files')
        .upload(`${fileName}.pdf`, newFile, {
          upsert: true,
        });

      if (error || !data) throw error;

      await this.updateLastUpdated('pages');

      return {
        message: 'Successfully updated file!',
        data: null,
      };
    } catch (error) {
      console.error(error);
      return {
        message: 'Failed to update file',
        error,
        data: null,
      };
    }
  }

  async updateLastUpdated(table: string) {
    try {
      const CLIENT = this.supabaseService.supabase;
      const now = new Date().toISOString().slice(0, 10);
      const { error } = await CLIENT.from(table).update({ updated_at: now });

      if (error) throw error;
    } catch (error) {
      console.error('Error when updating "Last updated": ', error);
      throw new Error(`Error when updating ${table}`);
    }
  }

  async getLastUpdated(table: string): Promise<string> {
    try {
      const CLIENT = this.supabaseService.supabase;
      const { data, error } = await CLIENT.from(table)
        .select(`updated_at`)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data.updated_at;
    } catch (error) {
      console.error('Error when fetching last updated: ', error);
      throw new Error(`Error when fetching last updated`);
    }
  }

  /*
   * Get booked times of a certain date
   */
  async getBookedTimes(
    date: string,
  ): Promise<ApiResponse<Tables<'booked_times_public_view'>[]>> {
    try {
      const CLIENT = this.supabaseService.supabase;
      const { data, error } = await CLIENT.from('booked_times_public_view')
        .select(`*`)
        .eq('date', date);

      if (error || !data) throw error;

      return {
        data: data,
        message: `Successfully retrieved booked_times of date: ${date}`,
      };
    } catch (error) {
      console.error(`Error when retrieving booked times: `, error);
      return {
        data: null,
        error: error,
        message: `Unable to retrieve booked times`,
      };
    }
  }

  async createBooking(formData: ContactForm) {
    try {
      const CLIENT = this.supabaseService.supabase;
    } catch (error) {
      console.error(`Error when retrieving booked times: `, error);
      return {
        data: null,
        error: error,
        message: `Unable to create new booking`,
      };
    }
  }
}
