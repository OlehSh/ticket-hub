import { Test, TestingModule } from '@nestjs/testing';
import { TicketTireService } from './ticket-tire.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { SETTING_KEY } from '../admin/enums';

describe('TicketTireService', () => {
  let service: TicketTireService;
  let prismaService: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketTireService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<TicketTireService>(TicketTireService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('calculatePromoterReceivesPrice', () => {
    it('should return promoter_receives_price if service_fee_rate more than minimum_fee', () => {
      expect.assertions(1);
      const result = service['calculatePromoterReceivesPrice'](200, 10, 5);
      expect(result).toStrictEqual({
        buyer_price: 200,
        service_fee: 20,
        promoter_receives_price: 180,
      });
    });
    it('should return promoter_receives_price if service_fee_rate less than minimum_fee', () => {
      expect.assertions(1);
      const result = service['calculatePromoterReceivesPrice'](200, 10, 30);
      expect(result).toStrictEqual({
        buyer_price: 200,
        service_fee: 30,
        promoter_receives_price: 170,
      });
    });
    it('should return promoter_receives_price if buyerPrice = 0', () => {
      expect.assertions(1);
      const result = service['calculatePromoterReceivesPrice'](0, 10, 5);
      expect(result).toStrictEqual({
        buyer_price: 0,
        service_fee: 5,
        promoter_receives_price: 0,
      });
    });
  });
  describe('calculateBuyerPrice', () => {
    it('should calculate buyer_price by promoter_receives_price if service_fee_rate more than minimum_fee', () => {
      expect.assertions(1);
      const result = service['calculateBuyerPrice'](180, 10, 5);
      expect(result).toStrictEqual({
        buyer_price: 200,
        service_fee: 20,
        promoter_receives_price: 180,
      });
    });
    it('should calculate buyer_price by promoter_receives_price if service_fee_rate less than minimum_fee', () => {
      expect.assertions(1);
      const result = service['calculateBuyerPrice'](170, 10, 30);
      expect(result).toStrictEqual({
        buyer_price: 200,
        service_fee: 30,
        promoter_receives_price: 170,
      });
    });
    it('should calculate buyer_price  by promoter_receives_price = 0', () => {
      expect.assertions(1);
      const result = service['calculateBuyerPrice'](0, 10, 5);
      expect(result).toStrictEqual({
        buyer_price: 5,
        service_fee: 5,
        promoter_receives_price: 0,
      });
    });
  });
  describe('calculateTicketPrice', () => {
    it('should return buyer_price, service_fee, promoter_receives_price if buyer_price is set and service_fee more than minimum_fee', async () => {
      expect.assertions(2);
      const settingsFindFirstSpy = jest.spyOn(prismaService.settings, 'findFirst');
      prismaService.settings.findFirst
        .mockResolvedValueOnce({
          id: 1,
          key: SETTING_KEY.SERVICE_FEE_RATE,
          percentage_value: 10,
          numeric_value: null,
        })
        .mockResolvedValueOnce({
          id: 2,
          key: SETTING_KEY.MINIMUM_FEE,
          percentage_value: null,
          numeric_value: new Prisma.Decimal(5),
        });
      const result = await service['calculateTicketPrice']({ buyer_price: 200 });
      expect(settingsFindFirstSpy).toHaveBeenCalledTimes(2);
      expect(result).toStrictEqual({
        buyer_price: 200,
        service_fee: 20,
        promoter_receives_price:180,
      });
    });
    it('should return buyer_price, service_fee, promoter_receives_price if buyer_price is set  and service_fee less than minimum_fee', async () => {
      expect.assertions(2);
      const settingsFindFirstSpy = jest.spyOn(prismaService.settings, 'findFirst');
      prismaService.settings.findFirst
        .mockResolvedValueOnce({
          id: 1,
          key: SETTING_KEY.SERVICE_FEE_RATE,
          percentage_value: 10,
          numeric_value: null,
        })
        .mockResolvedValueOnce({
          id: 2,
          key: SETTING_KEY.MINIMUM_FEE,
          percentage_value: null,
          numeric_value: new Prisma.Decimal(30),
        });
      const result = await service['calculateTicketPrice']({ buyer_price: 200 });
      expect(settingsFindFirstSpy).toHaveBeenCalledTimes(2);
      expect(result).toStrictEqual({
        buyer_price: 200,
        service_fee: 30,
        promoter_receives_price: 170,
      });
    });
    it('should return buyer_price, service_fee, promoter_receives_price if promoter_receives_price is set  and service_fee more than minimum_fee', async () => {
      expect.assertions(2);
      const settingsFindFirstSpy = jest.spyOn(prismaService.settings, 'findFirst');
      prismaService.settings.findFirst
        .mockResolvedValueOnce({
          id: 1,
          key: SETTING_KEY.SERVICE_FEE_RATE,
          percentage_value: 10,
          numeric_value: null,
        })
        .mockResolvedValueOnce({
          id: 2,
          key: SETTING_KEY.MINIMUM_FEE,
          percentage_value: null,
          numeric_value: new Prisma.Decimal(5),
        });
      const result = await service['calculateTicketPrice']({ promoter_receives_price: 180 });
      expect(settingsFindFirstSpy).toHaveBeenCalledTimes(2);
      expect(result).toStrictEqual({
        buyer_price: 200,
        service_fee: 20,
        promoter_receives_price: 180,
      });
    });
    it('should return buyer_price, service_fee, promoter_receives_price if promoter_receives_price is set  and service_fee less than minimum_fee', async () => {
      expect.assertions(2);
      const settingsFindFirstSpy = jest.spyOn(prismaService.settings, 'findFirst');
      prismaService.settings.findFirst
        .mockResolvedValueOnce({
          id: 1,
          key: SETTING_KEY.SERVICE_FEE_RATE,
          percentage_value: 10,
          numeric_value: null,
        })
        .mockResolvedValueOnce({
          id: 2,
          key: SETTING_KEY.MINIMUM_FEE,
          percentage_value: null,
          numeric_value: new Prisma.Decimal(30),
        });
      const result = await service['calculateTicketPrice']({ promoter_receives_price: 170 });
      expect(settingsFindFirstSpy).toHaveBeenCalledTimes(2);
      expect(result).toStrictEqual({
        buyer_price: 200,
        service_fee: 30,
        promoter_receives_price: 170,
      });
    });
  });
});
