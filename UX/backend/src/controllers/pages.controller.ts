import { CacheInterceptor } from '@nestjs/cache-manager';
import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { PageService } from 'src/services/pages.service';
import { ContactForm } from 'src/types/types';

// These are the routes for the pages
@Controller('pages')
@UseInterceptors(CacheInterceptor)
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

  @Get('booked-times/:date')
  getBookedTimes(@Param('date') date: string) {
    return this.pageService.getBookedTimes(date)
  }
  
  @Get() 
   getPages() {
     return this.pageService.getPages()
   }

   @Post('booked-times') 
   createBooking(
    @Body() formData: ContactForm
   ) {
    console.log('Contact form in controller: ', formData)
    return this.pageService.createBooking(formData)
   }
}