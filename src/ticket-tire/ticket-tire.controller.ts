import { Body, Controller, Get, Post } from '@nestjs/common';
import { TicketTireService } from './ticket-tire.service';
import { TicketTier } from '@prisma/client';
import { TicketTireDto } from './ticketTire.dto';

@Controller('ticket-tire')
export class TicketTireController {
  constructor(private ticketTireService: TicketTireService) {
  }
  @Get()
  findAll(): Promise<TicketTier[]> {
    return this.ticketTireService.findAll();
  }

  @Post()
  create(@Body() ticketTireDto: TicketTireDto): Promise<TicketTier> {
    return this.ticketTireService.create(ticketTireDto);
  }
}
