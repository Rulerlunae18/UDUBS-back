/*
  Warnings:

  - You are about to drop the column `isOnline` on the `realuser` table. All the data in the column will be lost.
  - You are about to drop the column `lastSeen` on the `realuser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `realuser` DROP COLUMN `isOnline`,
    DROP COLUMN `lastSeen`,
    ADD COLUMN `is_online` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `last_seen` DATETIME(3) NULL;
