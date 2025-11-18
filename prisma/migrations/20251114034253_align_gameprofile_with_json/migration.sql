/*
  Warnings:

  - You are about to drop the column `collectedAt` on the `gameprofile` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `gameprofile` table. All the data in the column will be lost.
  - You are about to drop the column `firstPlaythroughDone` on the `gameprofile` table. All the data in the column will be lost.
  - You are about to drop the column `kassiNamed` on the `gameprofile` table. All the data in the column will be lost.
  - You are about to drop the column `kassiSaid` on the `gameprofile` table. All the data in the column will be lost.
  - You are about to drop the column `lastOnline` on the `gameprofile` table. All the data in the column will be lost.
  - You are about to drop the column `openedGame` on the `gameprofile` table. All the data in the column will be lost.
  - You are about to drop the column `safeMode` on the `gameprofile` table. All the data in the column will be lost.
  - You are about to drop the column `scarlettTaunts` on the `gameprofile` table. All the data in the column will be lost.
  - You are about to drop the column `sessionTime` on the `gameprofile` table. All the data in the column will be lost.
  - You are about to drop the column `silvairRickroll` on the `gameprofile` table. All the data in the column will be lost.
  - You are about to drop the column `totalPlaytime` on the `gameprofile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `gameprofile` DROP COLUMN `collectedAt`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `firstPlaythroughDone`,
    DROP COLUMN `kassiNamed`,
    DROP COLUMN `kassiSaid`,
    DROP COLUMN `lastOnline`,
    DROP COLUMN `openedGame`,
    DROP COLUMN `safeMode`,
    DROP COLUMN `scarlettTaunts`,
    DROP COLUMN `sessionTime`,
    DROP COLUMN `silvairRickroll`,
    DROP COLUMN `totalPlaytime`,
    ADD COLUMN `collected_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `first_playthrough_done` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `kassi_named` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `kassi_said` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `last_online` DATETIME(3) NULL,
    ADD COLUMN `opened_game` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `safe_mode` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `scarlett_taunts` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `session_time` INTEGER NULL DEFAULT 0,
    ADD COLUMN `silvair_rickroll` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `total_playtime` INTEGER NULL DEFAULT 0;
