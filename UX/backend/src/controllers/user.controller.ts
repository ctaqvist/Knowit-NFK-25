import { Controller, Get, Param, ParamData, Res } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Response } from 'express';
import { UserService } from 'src/services/user.service';

@Controller('pages')
export class UserController {
  private readonly _supabase: SupabaseClient;

  constructor(private readonly userService: UserService) {}

  @Get('/:page')
  async getPage(@Res() res: Response, @Param() params: Record<string, string>) {
    try {

      const data = await this.userService.getPage(params.page);
      res.send(data);
    
    } catch (error) {
      console.error('Error in getHero', error);
      throw new Error();
    }
  }
}
