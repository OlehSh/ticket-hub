-- CreateTable
CREATE TABLE "settings" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "numeric_value" DECIMAL(10,2),
    "percentage_value" INTEGER DEFAULT 0,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_tiers" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "service_fee" DECIMAL(10,2) NOT NULL,
    "buyer_price" DECIMAL(10,2) NOT NULL,
    "promoter_receives_rice" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "ticket_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ticket_tiers_title_key" ON "ticket_tiers"("title");
