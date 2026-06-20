-- CreateTable
CREATE TABLE `QuizSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expireTime` DATETIME(3) NULL,
    `finishTime` DATETIME(3) NULL,
    `questions` JSON NOT NULL,
    `questionsCount` INTEGER NOT NULL,
    `successfulAnswersCount` INTEGER NOT NULL DEFAULT 0,
    `currentQuestionIndex` INTEGER NOT NULL DEFAULT 0,
    `isAnalyticsShared` BOOLEAN NOT NULL DEFAULT false,
    `quizId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QuizSession` ADD CONSTRAINT `QuizSession_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizSession` ADD CONSTRAINT `QuizSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
