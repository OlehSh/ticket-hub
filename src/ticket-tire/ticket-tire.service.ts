import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TicketTier } from '@prisma/client';
import { TicketTireDto } from './ticketTire.dto';

@Injectable()
export class TicketTireService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<TicketTier[]> {
    return this.prisma.ticketTier.findMany();
  }

  private calculateBuyerPrice(
    promoterReceivesPrice: number,
    serviceFeeRate: number,
    minimumFee: number,
  ): {
    buyer_price: number;
    promoter_receives_price: number;
    service_fee: number;
  } {
    const serviceFee: number = Math.max(
      (serviceFeeRate * promoterReceivesPrice) / (100 - serviceFeeRate),
      minimumFee,
    );
    return {
      buyer_price: promoterReceivesPrice + serviceFee,
      service_fee: serviceFee,
      promoter_receives_price: promoterReceivesPrice,
    };
  }

  private calculatePromoterReceivesPrice(
    buyerPrice: number,
    serviceFeeRatePercentage: number,
    minimumFee: number,
  ): {
    buyer_price: number;
    promoter_receives_price: number;
    service_fee: number;
  } {
    const serviceFee: number = Math.max(
      (buyerPrice * serviceFeeRatePercentage) / 100,
      minimumFee,
    );
    return {
      buyer_price: buyerPrice,
      service_fee: serviceFee,
      promoter_receives_price:
        buyerPrice === 0 ? buyerPrice : buyerPrice - serviceFee,
    };
  }

  private async calculateTicketPrice(data: {
    buyer_price?: number;
    promoter_receives_price?: number;
  }): Promise<{
    buyer_price: number;
    service_fee: number;
    promoter_receives_price: number;
  }> {
    const serviceFeeRate = await this.prisma.settings.findFirst({
      where: {
        key: 'service_fee_rate',
      },
    });
    const minimumFee = await this.prisma.settings.findFirst({
      where: {
        key: 'minimum_fee',
      },
    });
    if (data.buyer_price >= 0) {
      return this.calculatePromoterReceivesPrice(
        data.buyer_price,
        serviceFeeRate.percentage_value,
        Number(minimumFee.numeric_value),
      );
    }
    if (data.promoter_receives_price >= 0) {
      return this.calculateBuyerPrice(
        data.promoter_receives_price,
        serviceFeeRate.percentage_value,
        Number(minimumFee.numeric_value),
      );
    }
  }

  public async create(data: TicketTireDto): Promise<TicketTier> {
    const { buyer_price, promoter_receives_price, title } = data;
    const ticketTireObject = await this.calculateTicketPrice({
      buyer_price,
      promoter_receives_price,
    });
    return this.prisma.ticketTier.create({
      data: {
        title: title,
        ...ticketTireObject,
      },
    });
  }
}
