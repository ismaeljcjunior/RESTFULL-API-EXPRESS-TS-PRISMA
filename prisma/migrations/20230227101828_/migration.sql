/*
  Warnings:

  - You are about to drop the column `grupo_pessoa` on the `usuariossestsenat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `usuariossestsenat` DROP COLUMN `grupo_pessoa`,
    ADD COLUMN `grupoPessoa` VARCHAR(191) NOT NULL DEFAULT 'Aluno';
