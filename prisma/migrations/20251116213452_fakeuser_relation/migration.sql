/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `FakeUser` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `fakeuser` ADD COLUMN `userId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `FakeUser_userId_key` ON `FakeUser`(`userId`);

-- AddForeignKey
ALTER TABLE `FakeUser` ADD CONSTRAINT `FakeUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
