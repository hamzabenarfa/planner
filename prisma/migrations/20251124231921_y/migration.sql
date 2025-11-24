/*
  Warnings:

  - You are about to drop the column `userId` on the `diagrams` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,projectId]` on the table `diagrams` will be added. If there are existing duplicate values, this will fail.
  - Made the column `projectId` on table `diagrams` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `diagrams` DROP FOREIGN KEY `diagrams_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `diagrams` DROP FOREIGN KEY `diagrams_userId_fkey`;

-- AlterTable
ALTER TABLE `diagrams` DROP COLUMN `userId`,
    MODIFY `projectId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `diagrams_name_projectId_key` ON `diagrams`(`name`, `projectId`);

-- AddForeignKey
ALTER TABLE `diagrams` ADD CONSTRAINT `diagrams_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
