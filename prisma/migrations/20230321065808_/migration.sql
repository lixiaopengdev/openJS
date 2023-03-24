-- CreateTable
CREATE TABLE `OpenGptApp` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `coverImage` TEXT NOT NULL,
    `hint` VARCHAR(191) NULL,
    `demoInput` VARCHAR(10000) NOT NULL,
    `prompt` VARCHAR(10000) NOT NULL,
    `filePath` VARCHAR(2550) NOT NULL,
    `fileContent` LONGTEXT NOT NULL,
    `owner` VARCHAR(255) NOT NULL,
    `usedCount` BIGINT NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `OpenGptApp_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
