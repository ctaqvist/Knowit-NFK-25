import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UserService {
  private readonly _supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!url || !key) {
      throw new Error('Supabase URL and key must be provided');
    }

    this._supabase = createClient(url, key);
  }

  async getPage(page: string) {
    try {
      const { data, error } = await this._supabase
        .from('pages')
        .select('*')
        .eq('name', page)
        .single()

      if (error) {
        throw new Error('Error when fetching from db', error);
      }

      return data.content;
    } catch (error) {
      console.error('Somethign went wrong in userService getPage: ', error);
    }
  }
}
