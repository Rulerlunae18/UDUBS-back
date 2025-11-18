-- CreateTable
CREATE TABLE `GameProfile` (
    `id` VARCHAR(191) NOT NULL,
    `playerId` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NULL,
    `platform` VARCHAR(191) NULL,
    `safeMode` BOOLEAN NULL DEFAULT false,
    `totalPlaytime` INTEGER NULL DEFAULT 0,
    `city` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `lastOnline` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `GameProfile_playerId_key`(`playerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GameEvent` (
    `id` VARCHAR(191) NOT NULL,
    `gameProfileId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NULL,
    `payload` JSON NULL,
    `totalPlaytime` INTEGER NULL,
    `collectedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GameProfile` ADD CONSTRAINT `GameProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameEvent` ADD CONSTRAINT `GameEvent_gameProfileId_fkey` FOREIGN KEY (`gameProfileId`) REFERENCES `GameProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
