import { Controller, Get, Param } from '@nestjs/common';
import { PageService } from 'src/services/pages.service';

// These are the routes for the pages
@Controller('pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Get('reviews')
  getReviews() {
    return this.pageService.getReviews()
  }
  
  @Get(':page') 
  getPage(@Param('page') page: string) {
    return this.pageService.getPage(page)
  }
  
  @Get() 
   getPages() {
     return this.pageService.getPages()
   }
}