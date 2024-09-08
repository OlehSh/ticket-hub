import { Module } from '@nestjs/common';
import { TicketTireController } from './ticket-tire.controller';
import { TicketTireService } from './ticket-tire.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [TicketTireController],
  providers: [TicketTireService, PrismaService]
})
export class TicketTireModule {}
