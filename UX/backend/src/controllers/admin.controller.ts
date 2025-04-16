import { Body, Controller, Param, Patch, Req } from '@nestjs/common';
import { Request } from 'express';
import { AdminService } from 'src/services/admin.service';
import { ApiResponse, Page } from 'src/types/types';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
 
  @Patch(':page') 
  updatePage(@Param('page') page: string, @Body() updatedPage: Page) {
    return this.adminService.updatePage(page, updatedPage)
  }
}
