-- CreateTable
CREATE TABLE `usuariosSESTSENAT` (
    `idUsuario_SCOND` INTEGER NOT NULL,
    `criarUsuario` BOOLEAN NOT NULL DEFAULT false,
    `nome` VARCHAR(255) NOT NULL,
    `sobrenome` INTEGER NOT NULL,
    `matricula` INTEGER NOT NULL,
    `dataNascimento` VARCHAR(255) NOT NULL,
    `sociedade` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `nomeTratamento` VARCHAR(255) NOT NULL,
    `telefone` VARCHAR(255) NOT NULL,
    `telefone2` VARCHAR(255) NOT NULL,
    `profissao` VARCHAR(191) NOT NULL DEFAULT 'Aluno',
    `grupoPessoa` VARCHAR(191) NOT NULL DEFAULT 'Aluno',
    `fotoFacial` MEDIUMTEXT NOT NULL,
    `situacao` VARCHAR(255) NULL DEFAULT 'AGUARDANDO',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuariosSESTSENAT_idUsuario_SCOND_key`(`idUsuario_SCOND`),
    UNIQUE INDEX `usuariosSESTSENAT_sobrenome_key`(`sobrenome`),
    PRIMARY KEY (`idUsuario_SCOND`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsuariosSESTSENATDocumentoDTO` (
    `idDocumentoDTO` INTEGER NOT NULL AUTO_INCREMENT,
    `tipoDocumento` VARCHAR(191) NOT NULL,
    `documento` VARCHAR(191) NOT NULL,
    `usuariosSESTSENATidUsuario_SCOND` INTEGER NULL,

    PRIMARY KEY (`idDocumentoDTO`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UsuariosSESTSENATDocumentoDTO` ADD CONSTRAINT `UsuariosSESTSENATDocumentoDTO_usuariosSESTSENATidUsuario_SC_fkey` FOREIGN KEY (`usuariosSESTSENATidUsuario_SCOND`) REFERENCES `usuariosSESTSENAT`(`idUsuario_SCOND`) ON DELETE SET NULL ON UPDATE CASCADE;
