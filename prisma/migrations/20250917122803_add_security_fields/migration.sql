-- AlterTable
ALTER TABLE `properties` ADD COLUMN `rejectionReason` TEXT NULL,
    ADD COLUMN `reviewStatus` ENUM('PENDING', 'APPROVED', 'REJECTED', 'NEEDS_EDIT') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `reviewedAt` DATETIME(3) NULL,
    ADD COLUMN `reviewedBy` VARCHAR(191) NULL,
    MODIFY `status` ENUM('ACTIVE', 'SOLD', 'RENTED', 'PENDING', 'INACTIVE') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `users` ADD COLUMN `lastPasswordChange` DATETIME(3) NULL,
    ADD COLUMN `loginNotifications` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `passwordHistory` JSON NULL,
    ADD COLUMN `securityAlerts` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `sessionTimeout` INTEGER NOT NULL DEFAULT 30,
    ADD COLUMN `twoFactorEnabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `twoFactorSecret` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `listing_categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `nameAr` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `icon` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `listing_categories_name_key`(`name`),
    UNIQUE INDEX `listing_categories_nameAr_key`(`nameAr`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `listing_favorites` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `listingId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `listing_favorites_listingId_fkey`(`listingId`),
    UNIQUE INDEX `listing_favorites_userId_listingId_key`(`userId`, `listingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `listing_images` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `publicId` VARCHAR(191) NULL,
    `alt` VARCHAR(191) NULL,
    `isMain` BOOLEAN NOT NULL DEFAULT false,
    `order` INTEGER NOT NULL DEFAULT 0,
    `listingId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `listing_images_listingId_fkey`(`listingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `listing_stats` (
    `id` VARCHAR(191) NOT NULL,
    `listingId` VARCHAR(191) NOT NULL,
    `totalViews` INTEGER NOT NULL DEFAULT 0,
    `uniqueViews` INTEGER NOT NULL DEFAULT 0,
    `todayViews` INTEGER NOT NULL DEFAULT 0,
    `weekViews` INTEGER NOT NULL DEFAULT 0,
    `monthViews` INTEGER NOT NULL DEFAULT 0,
    `totalInquiries` INTEGER NOT NULL DEFAULT 0,
    `totalFavorites` INTEGER NOT NULL DEFAULT 0,
    `phoneClicks` INTEGER NOT NULL DEFAULT 0,
    `whatsappClicks` INTEGER NOT NULL DEFAULT 0,
    `emailClicks` INTEGER NOT NULL DEFAULT 0,
    `sourceData` JSON NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `listing_stats_listingId_key`(`listingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `listing_videos` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `publicId` VARCHAR(191) NULL,
    `title` VARCHAR(191) NULL,
    `duration` INTEGER NULL,
    `thumbnail` VARCHAR(191) NULL,
    `listingId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `listing_videos_listingId_fkey`(`listingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `listings` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL,
    `currency` ENUM('EGP', 'USD') NOT NULL DEFAULT 'EGP',
    `priceType` ENUM('FIXED', 'NEGOTIABLE', 'AUCTION') NOT NULL DEFAULT 'FIXED',
    `propertyType` ENUM('APARTMENT', 'VILLA', 'OFFICE', 'COMMERCIAL', 'LAND') NOT NULL,
    `purpose` ENUM('SALE', 'RENT') NOT NULL,
    `area` INTEGER NOT NULL,
    `bedrooms` INTEGER NULL,
    `bathrooms` INTEGER NULL,
    `floors` INTEGER NULL,
    `floor` INTEGER NULL,
    `age` INTEGER NULL,
    `furnished` BOOLEAN NOT NULL DEFAULT false,
    `parking` BOOLEAN NOT NULL DEFAULT false,
    `elevator` BOOLEAN NOT NULL DEFAULT false,
    `balcony` BOOLEAN NOT NULL DEFAULT false,
    `garden` BOOLEAN NOT NULL DEFAULT false,
    `swimmingPool` BOOLEAN NOT NULL DEFAULT false,
    `security` BOOLEAN NOT NULL DEFAULT false,
    `airConditioning` BOOLEAN NOT NULL DEFAULT false,
    `governorate` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `address` TEXT NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `nearbyPlaces` JSON NULL,
    `virtualTour` VARCHAR(191) NULL,
    `contactName` VARCHAR(191) NOT NULL,
    `contactPhone` VARCHAR(191) NOT NULL,
    `contactEmail` VARCHAR(191) NULL,
    `whatsappNumber` VARCHAR(191) NULL,
    `showContactInfo` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'EXPIRED', 'SOLD', 'RENTED', 'SUSPENDED') NOT NULL DEFAULT 'PENDING',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `urgent` BOOLEAN NOT NULL DEFAULT false,
    `views` INTEGER NOT NULL DEFAULT 0,
    `favoritesCount` INTEGER NOT NULL DEFAULT 0,
    `inquiries` INTEGER NOT NULL DEFAULT 0,
    `adminNotes` TEXT NULL,
    `rejectionReason` TEXT NULL,
    `approvedAt` DATETIME(3) NULL,
    `approvedBy` VARCHAR(191) NULL,
    `expiresAt` DATETIME(3) NULL,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,

    INDEX `listings_categoryId_fkey`(`categoryId`),
    INDEX `listings_createdAt_status_idx`(`createdAt`, `status`),
    INDEX `listings_governorate_city_district_idx`(`governorate`, `city`, `district`),
    INDEX `listings_price_currency_idx`(`price`, `currency`),
    INDEX `listings_propertyType_purpose_status_idx`(`propertyType`, `purpose`, `status`),
    INDEX `listings_userId_status_idx`(`userId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messages` (
    `id` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NULL,
    `content` TEXT NOT NULL,
    `messageType` ENUM('INQUIRY', 'OFFER', 'COMPLAINT', 'SUPPORT', 'GENERAL') NOT NULL DEFAULT 'INQUIRY',
    `status` ENUM('UNREAD', 'READ', 'REPLIED', 'ARCHIVED') NOT NULL DEFAULT 'UNREAD',
    `attachments` JSON NULL,
    `senderId` VARCHAR(191) NOT NULL,
    `receiverId` VARCHAR(191) NOT NULL,
    `listingId` VARCHAR(191) NULL,
    `parentId` VARCHAR(191) NULL,
    `readAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `messages_listingId_createdAt_idx`(`listingId`, `createdAt`),
    INDEX `messages_parentId_fkey`(`parentId`),
    INDEX `messages_receiverId_status_createdAt_idx`(`receiverId`, `status`, `createdAt`),
    INDEX `messages_senderId_createdAt_idx`(`senderId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reports` (
    `id` VARCHAR(191) NOT NULL,
    `reason` ENUM('SPAM', 'FAKE', 'INAPPROPRIATE', 'DUPLICATE', 'FRAUD', 'WRONG_CATEGORY', 'CONTACT_ISSUE', 'OTHER') NOT NULL,
    `description` TEXT NULL,
    `status` ENUM('PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED') NOT NULL DEFAULT 'PENDING',
    `evidence` JSON NULL,
    `adminNotes` TEXT NULL,
    `reporterId` VARCHAR(191) NOT NULL,
    `listingId` VARCHAR(191) NULL,
    `handledBy` VARCHAR(191) NULL,
    `handledAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `reports_listingId_status_idx`(`listingId`, `status`),
    INDEX `reports_reporterId_fkey`(`reporterId`),
    INDEX `reports_status_createdAt_idx`(`status`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NULL,
    `reviewType` ENUM('USER', 'AGENT', 'TRANSACTION') NOT NULL DEFAULT 'USER',
    `communication` DOUBLE NULL,
    `reliability` DOUBLE NULL,
    `professionalism` DOUBLE NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `targetId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `reviews_targetId_fkey`(`targetId`),
    UNIQUE INDEX `reviews_authorId_targetId_key`(`authorId`, `targetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_activities` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `activityType` ENUM('LOGIN', 'LOGOUT', 'REGISTER', 'PROPERTY_CREATE', 'PROPERTY_UPDATE', 'PROPERTY_DELETE', 'PROPERTY_VIEW', 'PROPERTY_FAVORITE', 'PROPERTY_UNFAVORITE', 'INQUIRY_CREATE', 'PROFILE_UPDATE', 'PASSWORD_CHANGE', 'EMAIL_VERIFY', 'PHONE_VERIFY') NOT NULL,
    `entityType` ENUM('USER', 'PROPERTY', 'PROJECT', 'PORTFOLIO', 'INQUIRY', 'MESSAGE') NOT NULL,
    `entityId` VARCHAR(191) NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `metadata` JSON NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `user_activities_userId_createdAt_idx`(`userId`, `createdAt`),
    INDEX `user_activities_activityType_idx`(`activityType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `listing_favorites` ADD CONSTRAINT `listing_favorites_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `listings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listing_favorites` ADD CONSTRAINT `listing_favorites_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listing_images` ADD CONSTRAINT `listing_images_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `listings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listing_videos` ADD CONSTRAINT `listing_videos_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `listings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listings` ADD CONSTRAINT `listings_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `listing_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listings` ADD CONSTRAINT `listings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `listings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `messages`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `listings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_reporterId_fkey` FOREIGN KEY (`reporterId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_targetId_fkey` FOREIGN KEY (`targetId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_activities` ADD CONSTRAINT `user_activities_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
