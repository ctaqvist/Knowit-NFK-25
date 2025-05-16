import { Body, Controller, Get, Header, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { File } from 'node:buffer';
import { PageService } from 'src/services/pages.service';

export type DownloadableFiles = 'GPSR' | 'Instruction_Manual';

// These are the routes for the pages
@Controller('files')
export class FileController {
  constructor(private readonly pageService: PageService) {}

  @Get(':file')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=:file.pdf')
  async getFile(@Param('file') file: DownloadableFiles, @Res() res: Response) {
    const buffer = await this.pageService.getFile(file);
    res.send(buffer);
  }
}
