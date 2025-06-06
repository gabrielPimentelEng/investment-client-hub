/*
  Warnings:

  - You are about to alter the column `quantity` on the `ClientAsset` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - A unique constraint covering the columns `[clientId,assetId]` on the table `ClientAsset` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `ClientAsset` MODIFY `quantity` DECIMAL(10, 2) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ClientAsset_clientId_assetId_key` ON `ClientAsset`(`clientId`, `assetId`);
