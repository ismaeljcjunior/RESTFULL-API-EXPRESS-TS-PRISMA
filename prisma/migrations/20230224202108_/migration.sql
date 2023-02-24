/*
  Warnings:

  - You are about to drop the column `grupoPessoa` on the `usuariossestsenat` table. All the data in the column will be lost.
  - You are about to drop the column `nomeTratemento` on the `usuariossestsenat` table. All the data in the column will be lost.
  - Added the required column `nomeTratamento` to the `usuariosSESTSENAT` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usuariossestsenat` DROP COLUMN `grupoPessoa`,
    DROP COLUMN `nomeTratemento`,
    ADD COLUMN `grupo_pessoa` VARCHAR(191) NOT NULL DEFAULT 'Aluno',
    ADD COLUMN `nomeTratamento` VARCHAR(255) NOT NULL;
