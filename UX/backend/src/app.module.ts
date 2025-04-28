import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PageController } from './controllers/pages.controller';
import { PageService } from './services/pages.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SupabaseService } from './services/supabase.service';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { FileController } from './controllers/files.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, PageController, AdminController, FileController],
  providers: [AppService, PageService, ConfigService, SupabaseService, AdminService],
})
export class AppModule {}
