/*
  Warnings:

  - Added the required column `situacao` to the `usuariosSESTSENAT` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usuariossestsenat` ADD COLUMN `situacao` VARCHAR(255) NOT NULL;
