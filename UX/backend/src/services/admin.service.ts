import { Body, Injectable, Param, Patch } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { PageData } from 'src/types/types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  private readonly _supabase: SupabaseClient;
 
  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!url || !key ) {
      throw new Error('Supabase URL and key must be provided');
    }

    this._supabase = createClient(url, key);
  }
    
  async updatePage(page: string, @Body() updatedData: PageData) {
    try {

      const { data, error } = await this._supabase
      .from('pages')
      .update({ content: updatedData })
      .eq('name', page)
      .select()

      if (error) {
        throw new Error('Error when updating page: ', error)
      }

      return data
    } catch (error) {
      console.error('Something went wrong in the AdminService: ', error)
    }  
  }

}