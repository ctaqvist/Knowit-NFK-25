import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { ApiResponse, Page } from 'src/types/types';

/*
// This service is for admins to use,
// Update content, reviews etc.
*/
@Injectable()
export class AdminService {
  constructor(private readonly supabaseService: SupabaseService) {}


  async updatePage(
    page: string,
    updatedPage: Page,
  ): Promise<ApiResponse<string>> {
    try {
      const CLIENT = this.supabaseService.supabase
      const {data, error} = await CLIENT.storage
      .from('pages')
      .upload(`${page}.json`, JSON.stringify(updatedPage), {
        upsert: true
      })
      
      if (error) {
        console.error(error)
        throw new Error('Error when updating data: ', error);
      }

      return {
        message: 'File was successfully uploaded!',
        data: data.path,
      };

    } catch (error) {
      throw new Error(`Error when updating page: `, error);
    }
  }
}
