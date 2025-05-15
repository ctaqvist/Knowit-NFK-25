import { Header, Injectable } from '@nestjs/common';
import { ApiResponse, Page } from 'src/types/types';
import { createClient } from '@supabase/supabase-js';

/*
// This service is for admins to use,
// Update content, reviews etc.
*/
@Injectable()
export class AdminService {
  private readonly client;

  constructor() {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase env variables!');
    }

    this.client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );
  }
  async updatePage(
    page: string,
    updatedPage: Page,
    token: string,
  ): Promise<
    ApiResponse<{
      page: string;
      content: Page;
    }>
  > {
    try {
      if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY)
        throw new Error('Missing supabase env variables!');

      const { error } = await this.client.storage
        .from('pages')
        .upload(`${page}.json`, JSON.stringify(updatedPage), {
          upsert: true,
        });

      if (error) throw error;

      const now = new Date().toISOString();
      const { error: updateError } = await this.client
        .from('pages')
        .update({
          updated_at: now,
        })
        .eq('id', 1);
      if (updateError) throw updateError;

      return {
        message: 'Content was successfully updated!',
        data: {
          page: page,
          content: updatedPage,
        },
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Error when updating page: `, error);
    }
  }

  async updateFile(fileName: string, buffer: Buffer): Promise<ApiResponse<null>> {
    try {
      const VALID_FILES = ['Instruction_Manual', 'GPSR'];
      if (!VALID_FILES.includes(fileName))
        throw new Error(
          'Invalid file, new file must be either an Instruction Manual or GPSR pdf',
        );

      const { data, error } = await this.client.storage
        .from('files')
        .upload(`${fileName}.pdf`, buffer, {
          upsert: true,
        });

      if (error || !data) throw error;

      await this.updateLastUpdated('pages');

      console.log('Successfully updated file!')
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
      const now = new Date().toISOString().slice(0, 10);
      const { error } = await this.client
        .from(table)
        .update({ updated_at: now })
        .eq('id', 1)

      if (error) throw error;
    } catch (error) {
      console.error('Error when updating "Last updated": ', error);
      throw new Error(`Error when updating ${table}`);
    }
  }
}
