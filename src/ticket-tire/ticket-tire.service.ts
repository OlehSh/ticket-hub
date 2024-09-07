import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TicketTier } from '@prisma/client';
import { TicketTireDto } from './ticketTire.dto';
import { settings } from '.prisma/client';

@Injectable()
export class TicketTireService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<TicketTier[]> {
    return this.prisma.ticketTier.findMany();
  }

  private calculateBuyerPrice(
    promoterReceivesPrice: number,
    serviceFeeRate: settings,
    minimumFee: settings,
  ): {
    buyer_price: number;
    promoter_receives_price: number;
    service_fee: number;
  } {
    let serviceFee: number =
      (serviceFeeRate.percentage_value * promoterReceivesPrice) /
      (100 - serviceFeeRate.percentage_value);
    if (serviceFee < Number(minimumFee.numeric_value)) {
      serviceFee = Number(minimumFee.numeric_value);
    }
    return {
      buyer_price: promoterReceivesPrice + serviceFee,
      service_fee: serviceFee,
      promoter_receives_price: promoterReceivesPrice,
    };
  }

  private calculatePromoterReceivesPrice(
    buyerPrice: number,
    serviceFeeRate: settings,
    minimumFee: settings,
  ): {
    buyer_price: number;
    promoter_receives_price: number;
    service_fee: number;
  } {
    const serviceFee: number =
      (buyerPrice * serviceFeeRate.percentage_value) / 100;
    return {
      buyer_price: buyerPrice,
      service_fee:
        serviceFee > Number(minimumFee.numeric_value)
          ? serviceFee
          : Number(minimumFee.numeric_value),
      promoter_receives_price: buyerPrice - serviceFee,
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
        serviceFeeRate,
        minimumFee,
      );
    }
    if (data.promoter_receives_price >= 0) {
      return this.calculateBuyerPrice(
        data.promoter_receives_price,
        serviceFeeRate,
        minimumFee,
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
