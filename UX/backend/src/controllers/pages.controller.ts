import { Controller, Get } from '@nestjs/common';
import { PageService } from 'src/services/pages.service';

// These are the routes for the pages
@Controller('pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

 @Get() 
  getPages() {
    return this.pageService.getPages()
  }

  @Get('reviews')
  getReviews() {
    return this.pageService.getReviews()
  }
}