import { Header, Injectable } from '@nestjs/common';
import { ApiResponse, Page } from 'src/types/types';
import { createClient } from '@supabase/supabase-js';

/*
// This service is for admins to use,
// Update content, reviews etc.
*/
@Injectable()
export class AdminService {
  constructor() {}

  async updatePage(
    page: string,
    updatedPage: Page,
    token: string,
  ): Promise<ApiResponse<{
    page: string,
    content: Page
  }>> {
    try {
      if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY)
        throw new Error('Missing supabase env variables!');

      const CLIENT = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
          global: {
            headers: {
              Authorization: token,
            },
          },
        },
      );

      const { data, error } = await CLIENT.storage
        .from('pages')
        .upload(`${page}.json`, JSON.stringify(updatedPage), {
          upsert: true,
        });

      if (error) throw error;

      const now = new Date().toISOString().slice(0, 10);
      const { error: updateError } = await CLIENT.from('pages')
        .update({
          updated_at: now,
        })
        .eq('id', 1);
      if (updateError) throw updateError;

      return {
        message: 'Content was successfully updated!',
        data: {
          page: page,
          content: updatedPage
        },
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Error when updating page: `, error);
    }
  }
}
