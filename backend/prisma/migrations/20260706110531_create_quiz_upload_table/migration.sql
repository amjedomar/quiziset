-- CreateTable
CREATE TABLE `QuizUpload` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bucket` VARCHAR(64) NOT NULL,
    `fileName` VARCHAR(255) NOT NULL,
    `ownerId` INTEGER NOT NULL,
    `quizId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `QuizUpload_quizId_idx`(`quizId`),
    INDEX `QuizUpload_ownerId_idx`(`ownerId`),
    UNIQUE INDEX `QuizUpload_bucket_fileName_key`(`bucket`, `fileName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QuizUpload` ADD CONSTRAINT `QuizUpload_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizUpload` ADD CONSTRAINT `QuizUpload_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
