/*
  Warnings:

  - A unique constraint covering the columns `[password]` on the table `RealUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `RealUser_password_key` ON `RealUser`(`password`);
