/*
  Warnings:

  - You are about to drop the column `idUsuario_SCONSD` on the `usuariossestsenat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `usuariossestsenat` DROP COLUMN `idUsuario_SCONSD`,
    ADD COLUMN `idUsuario_SCOND` INTEGER NULL;
