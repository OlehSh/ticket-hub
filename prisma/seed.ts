import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.ticketTier.createMany({
    data: [
      {
        title: 'ticketTier 1',
        buyer_price: 100,
        service_fee: 10,
        promoter_receives_price: 90,
      },
      {
        title: 'ticketTier 2',
        buyer_price: 150,
        service_fee: 10,
        promoter_receives_price: 135,
      },
    ],
  });
  await prisma.settings.createMany({
    data: [
      {
        key: 'service_fee_rate',
        percentage_value: 10,
      },
      {
        key: 'minimum_fee',
        numeric_value: 15,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
