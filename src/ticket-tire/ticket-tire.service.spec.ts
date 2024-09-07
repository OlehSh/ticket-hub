import { Test, TestingModule } from '@nestjs/testing';
import { TicketTireService } from './ticket-tire.service';

describe('TicketTireService', () => {
  let service: TicketTireService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketTireService],
    }).compile();

    service = module.get<TicketTireService>(TicketTireService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
