/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `testuser` table. All the data in the column will be lost.
  - Added the required column `fotoBase64` to the `testUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `testuser` DROP COLUMN `photoUrl`,
    ADD COLUMN `fotoBase64` LONGTEXT NOT NULL;
