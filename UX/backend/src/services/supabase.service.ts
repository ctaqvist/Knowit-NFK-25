import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/types/supabase.types';

@Injectable()
export class SupabaseService {
  private readonly _supabase: SupabaseClient;
 
  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!url || !key) {
      throw new Error('Supabase URL and key must be provided');
    }
    
    // Create a client with the anonymous key for public operations
    this._supabase = createClient<Database>(url, key);

  }

  get supabase() {
    return this._supabase;
  }
}
