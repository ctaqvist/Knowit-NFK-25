import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { Tables } from 'src/types/supabase.types';
import { ApiResponse, FormattedReview } from 'src/types/types';


@Injectable() 
export class PageService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getPages(): Promise<ApiResponse<Tables<'pages'>[]>> {
    try {
      const supabase = this.supabaseService.supabase
      const {error, data} = await supabase.from('pages')
      .select('*')

      if (error) {
        throw new Error('Error when fetching pages: ', error)
      }

      return {
        data: data,
        error: null
      }
    } catch (error) {
      console.error('Error in pageService or supabaseService')
      throw new Error('Error in pageService or supabaseService')
    }
  }

  async getReviews(): Promise<ApiResponse<FormattedReview[]>> {
    try {
      const supabase = this.supabaseService.supabase
      const {error, data} = await supabase.from('reviews')
      .select(`
        content,
        clients(company_name)`)

      if (error) {
        throw new Error('Error when fetching reviews', error)
      }

      const formattedReview = data?.map(review => ({
        content: review.content,
        client: review.clients['company_name']
      }));

      return {
        data: formattedReview,
        error: null
      };
      
    } catch (error) {
      console.error('Error in reviews', error)
      throw new Error('Error in reviews', error)
    }
  }
}