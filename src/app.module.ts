import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { TicketTireModule } from './ticket-tire/ticket-tire.module';
import { AdminModule } from './admin/admin.module';
import config from '../config/config';
@Global()
@Module({
  imports: [ ConfigModule.forRoot({ isGlobal: true,  load: [config] }), TicketTireModule, AdminModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
