/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `testUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `testUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fotoUrl` to the `testUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `testuser` ADD COLUMN `cpf` VARCHAR(191) NOT NULL,
    ADD COLUMN `fotoUrl` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `testUser_cpf_key` ON `testUser`(`cpf`);
