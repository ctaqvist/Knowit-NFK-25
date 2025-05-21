import { Inject, Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { ApiResponse, Page, Review, Pages, ContactForm } from 'src/types/types';
import { DownloadableFiles } from 'src/controllers/files.controller';
import { Response } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { isCacheFresh } from 'src/utils/calc';
import { Tables } from 'src/types/supabase.types';
import { File } from 'node:buffer';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class PageService {
  constructor(
    private readonly supabaseService: SupabaseService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getPages(): Promise<ApiResponse<Pages>> {
    try {
      console.log('Received request for PAGES')
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
      if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return
      const CLIENT = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
      const {companyName, firstName, surName, businessField, email, message, booking, telephone} = formData

      const { data: clientData, error: clientError } =
        await CLIENT.from('clients')
        .insert({company_name: companyName, })
        .select()
        .single()

      if (clientError || !clientData) {
        console.error(clientError)
        throw new Error(`Unable to create new client`)}

      const {data: contactData, error: contactError} = 
      await CLIENT.from('client_contacts').insert({
        name: `${firstName} ${surName}`,
        phone_number: telephone.number ? `${telephone.phone}${telephone.number}` : 'No number given',
        client_id: clientData.id
      })
      .select()
      .single()

      if (contactError || !contactData) {
                console.error(contactError)
        throw new Error(`Unable to create new contact`)
      }

      
      if (booking) {
        const {data: bookingData, error: bookingError} =
        await CLIENT.from('booked_times').insert({
          date: booking.date,
          time_slot: booking.time,
          company_id: clientData.id,
          contact_person: contactData.id
        })
        .select()
        .single();

        if (bookingError) throw new Error(`Unable to create booking`)
        return {
          message: 'Successfully created new booking!',
          data: bookingData.id
        }
      }

    } catch (error) {
      console.error(`Error when creating booking: `, error);
      return {
        data: null,
        error: error,
        message: `Unable to create new booking`,
      };
    }
  }
}
