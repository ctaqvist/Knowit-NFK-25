import { Body, Controller, Get, Injectable, Param, Patch, Res } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Response } from 'express';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { PageData } from 'src/types/types';
import { AdminService } from 'src/services/admin.service';
import { ConfigService } from '@nestjs/config';

@Controller('pages')
export class AdminController {
    private readonly _supabase: SupabaseClient;
  
  constructor(private readonly adminService: AdminService) {}

  @Patch('/:page')
  async updatePage(@Param('page') params: any, @Body() updatedData: PageData, @Res() res: Response) {
    try {
      const data = await this.adminService.updatePage(params, updatedData)
      res.send(data)

    } catch (error) {
      console.error('Error in update page controller: ', error)
      throw new Error
    }
  }

  @Get(':page')
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
      console.error('Somethign went wrong in adminService getPage: ', error);
    }
  }
}