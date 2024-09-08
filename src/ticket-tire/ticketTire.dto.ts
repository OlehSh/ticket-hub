import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class TicketTireDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ValidateIf(
    (o) => !o.promoter_receives_price && o.promoter_receives_price !== 0,
  )
  @IsNumber()
  @Min(0)
  buyer_price?: number;

  @ValidateIf((o) => !o.buyer_price && o.buyer_price !== 0)
  @IsNumber()
  @Min(0)
  promoter_receives_price?: number;
}
