/*
  Warnings:

  - You are about to drop the `gameevent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `gameevent` DROP FOREIGN KEY `GameEvent_gameProfileId_fkey`;

-- AlterTable
ALTER TABLE `gameprofile` ADD COLUMN `realUserId` INTEGER NULL;

-- DropTable
DROP TABLE `gameevent`;

-- CreateTable
CREATE TABLE `RealUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL DEFAULT 'user@center.local',
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'RESEARCHER',
    `avatarUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastSeen` DATETIME(3) NULL,
    `isOnline` BOOLEAN NOT NULL DEFAULT false,
    `userId` INTEGER NULL,

    UNIQUE INDEX `RealUser_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RealUser` ADD CONSTRAINT `RealUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameProfile` ADD CONSTRAINT `GameProfile_realUserId_fkey` FOREIGN KEY (`realUserId`) REFERENCES `RealUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
