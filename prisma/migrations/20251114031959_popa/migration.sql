/*
  Warnings:

  - You are about to alter the column `scarlettTaunts` on the `gameprofile` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.
  - You are about to alter the column `silvairRickroll` on the `gameprofile` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `gameprofile` MODIFY `scarlettTaunts` BOOLEAN NULL DEFAULT false,
    MODIFY `silvairRickroll` BOOLEAN NULL DEFAULT false;
