import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PageController } from './controllers/pages.controller';
import { PageService } from './services/pages.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SupabaseService } from './services/supabase.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, PageController],
  providers: [AppService, PageService, ConfigService, SupabaseService],
})
export class AppModule {}
