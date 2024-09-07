import { Test, TestingModule } from '@nestjs/testing';
import { TicketTireController } from './ticket-tire.controller';

describe('TicketTireController', () => {
  let controller: TicketTireController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketTireController],
    }).compile();

    controller = module.get<TicketTireController>(TicketTireController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
