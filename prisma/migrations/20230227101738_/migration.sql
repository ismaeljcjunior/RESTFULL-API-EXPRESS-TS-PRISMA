-- CreateTable
CREATE TABLE `usuariosSESTSENAT` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `criarUsuario` BOOLEAN NOT NULL DEFAULT false,
    `nome` VARCHAR(255) NOT NULL,
    `sobrenome` VARCHAR(255) NOT NULL,
    `dataNascimento` VARCHAR(255) NOT NULL,
    `sociedade` VARCHAR(255) NOT NULL,
    `tipoDocumento1` VARCHAR(255) NOT NULL,
    `documento1` VARCHAR(191) NOT NULL,
    `tipoDocumento2` VARCHAR(255) NOT NULL,
    `documento2` VARCHAR(191) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `nomeTratamento` VARCHAR(255) NOT NULL,
    `telefone` VARCHAR(255) NOT NULL,
    `telefone2` VARCHAR(255) NOT NULL,
    `profissao` VARCHAR(255) NOT NULL,
    `grupo_pessoa` VARCHAR(191) NOT NULL DEFAULT 'Aluno',
    `fotoFacial` LONGTEXT NOT NULL,
    `situacao` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuariosSESTSENAT_documento1_key`(`documento1`),
    UNIQUE INDEX `usuariosSESTSENAT_documento2_key`(`documento2`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
