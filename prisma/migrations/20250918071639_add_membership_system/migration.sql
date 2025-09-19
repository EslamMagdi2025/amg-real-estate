/*
  Warnings:

  - You are about to drop the column `activityType` on the `user_activities` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `user_activities` table. All the data in the column will be lost.
  - You are about to drop the column `entityId` on the `user_activities` table. All the data in the column will be lost.
  - You are about to drop the column `entityType` on the `user_activities` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `user_activities` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `user_activities` table. All the data in the column will be lost.
  - Added the required column `action` to the `user_activities` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user_activities` DROP FOREIGN KEY `user_activities_userId_fkey`;

-- DropIndex
DROP INDEX `user_activities_activityType_idx` ON `user_activities`;

-- DropIndex
DROP INDEX `user_activities_userId_createdAt_idx` ON `user_activities`;

-- AlterTable
ALTER TABLE `user_activities` DROP COLUMN `activityType`,
    DROP COLUMN `description`,
    DROP COLUMN `entityId`,
    DROP COLUMN `entityType`,
    DROP COLUMN `metadata`,
    DROP COLUMN `title`,
    ADD COLUMN `action` VARCHAR(191) NOT NULL,
    ADD COLUMN `details` VARCHAR(191) NULL,
    ADD COLUMN `location` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `addressProofVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `averageRating` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `completedTransactions` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `experienceLevel` ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT') NOT NULL DEFAULT 'BEGINNER',
    ADD COLUMN `identityDocumentVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `membershipLevel` ENUM('BASIC', 'PREMIUM', 'VIP', 'ENTERPRISE') NOT NULL DEFAULT 'BASIC',
    ADD COLUMN `premiumUntil` DATETIME(3) NULL,
    ADD COLUMN `reviewCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `trustScore` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `user_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `deviceName` VARCHAR(191) NULL,
    `deviceType` VARCHAR(191) NULL,
    `browser` VARCHAR(191) NULL,
    `os` VARCHAR(191) NULL,
    `ipAddress` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `lastActivity` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NULL,

    UNIQUE INDEX `user_sessions_sessionToken_key`(`sessionToken`),
    INDEX `user_sessions_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `user_activities_userId_fkey` ON `user_activities`(`userId`);

-- AddForeignKey
ALTER TABLE `user_activities` ADD CONSTRAINT `user_activities_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_sessions` ADD CONSTRAINT `user_sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
