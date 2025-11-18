-- AlterTable
ALTER TABLE `post` ADD COLUMN `fakeAuthorId` INTEGER NULL;

-- CreateTable
CREATE TABLE `FakeUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codename` VARCHAR(191) NOT NULL,
    `rank` VARCHAR(191) NULL,
    `clearance` VARCHAR(191) NULL,
    `bio` VARCHAR(191) NULL,
    `avatarUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_fakeAuthorId_fkey` FOREIGN KEY (`fakeAuthorId`) REFERENCES `FakeUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
