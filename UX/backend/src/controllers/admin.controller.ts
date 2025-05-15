import { Body, Controller, Headers, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AdminService } from 'src/services/admin.service';
import { Page } from 'src/types/types';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
 
  @Patch(':page')
  updatePage(
    @Param('page') page: string,
    @Body() content: any,
    @Headers('authorization') accessToken: string
  ) {
    return this.adminService.updatePage(page, content, accessToken)
  }

 @Post('files/:fileName')
  async uploadFile(
    @Param('fileName') fileName: string,
    @Req() req: Request,
    @Res() res: Response,
    @Headers('content-type') contentType: string
  ) {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', async () => {
      const buffer = Buffer.concat(chunks);

      await this.adminService.updateFile(fileName, buffer)
      res.status(200).json({ message: 'File uploaded!', data: fileName });
    });
  }
}
