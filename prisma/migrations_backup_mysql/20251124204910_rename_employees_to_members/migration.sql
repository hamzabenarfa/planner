/*
  Warnings:

  - You are about to drop the `employees` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[memberId,projectId]` on the table `project_members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `memberId` to the `project_members` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `employees` DROP FOREIGN KEY `employees_managerId_fkey`;

-- DropForeignKey
ALTER TABLE `employees` DROP FOREIGN KEY `employees_teamId_fkey`;

-- DropForeignKey
ALTER TABLE `project_members` DROP FOREIGN KEY `project_members_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `project_members` DROP FOREIGN KEY `project_members_userId_fkey`;

-- DropIndex
DROP INDEX `project_members_userId_projectId_key` ON `project_members`;

-- AlterTable
ALTER TABLE `project_members` ADD COLUMN `memberId` INTEGER NOT NULL,
    MODIFY `userId` INTEGER NULL;

-- DropTable
DROP TABLE `employees`;

-- CreateTable
CREATE TABLE `members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `level` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `teamId` INTEGER NOT NULL,
    `managerId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `members_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `project_members_memberId_projectId_key` ON `project_members`(`memberId`, `projectId`);

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_members` ADD CONSTRAINT `project_members_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `members`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_members` ADD CONSTRAINT `project_members_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_members` ADD CONSTRAINT `project_members_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
