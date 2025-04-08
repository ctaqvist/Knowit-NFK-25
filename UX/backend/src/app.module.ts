import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './controllers/user.controller';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './services/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, UserController, AdminController],
  providers: [AppService, AdminService, UserService],
})
export class AppModule {}
