/*
  Warnings:

  - You are about to drop the column `matricula` on the `usuariossestsenat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sobrenome]` on the table `usuariosSESTSENAT` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sobrenome` to the `usuariosSESTSENAT` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `usuariosSESTSENAT_matricula_key` ON `usuariossestsenat`;

-- AlterTable
ALTER TABLE `usuariossestsenat` DROP COLUMN `matricula`,
    ADD COLUMN `sobrenome` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `usuariosSESTSENAT_sobrenome_key` ON `usuariosSESTSENAT`(`sobrenome`);
