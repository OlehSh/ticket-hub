/*
  Warnings:

  - You are about to drop the column `promoter_receives_rice` on the `ticket_tiers` table. All the data in the column will be lost.
  - Added the required column `promoter_receives_price` to the `ticket_tiers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ticket_tiers" DROP COLUMN "promoter_receives_rice",
ADD COLUMN     "promoter_receives_price" DECIMAL(10,2) NOT NULL;
