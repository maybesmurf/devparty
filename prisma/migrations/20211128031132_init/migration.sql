-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(64) NOT NULL,
    `email` VARCHAR(191) NULL,
    `hashedPassword` VARCHAR(191) NULL,
    `spammy` BOOLEAN NOT NULL DEFAULT false,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `isStaff` BOOLEAN NOT NULL DEFAULT false,
    `inWaitlist` BOOLEAN NOT NULL DEFAULT true,
    `onboarded` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `featuredAt` DATETIME(3) NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` VARCHAR(191) NOT NULL,
    `isStaff` BOOLEAN NOT NULL DEFAULT false,
    `masquerading` BOOLEAN NOT NULL DEFAULT false,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profiles` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `avatar` VARCHAR(191) NOT NULL,
    `nftSource` VARCHAR(191) NULL,
    `cover` VARCHAR(191) NOT NULL,
    `coverBg` VARCHAR(191) NOT NULL,
    `bio` VARCHAR(280) NULL,
    `location` VARCHAR(32) NULL,
    `website` VARCHAR(191) NULL,
    `discord` VARCHAR(32) NULL,
    `github` VARCHAR(32) NULL,
    `twitter` VARCHAR(32) NULL,
    `readme` TEXT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `profiles_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `status` (
    `id` VARCHAR(191) NOT NULL,
    `emoji` VARCHAR(191) NOT NULL,
    `text` VARCHAR(64) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `status_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invites` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NULL,
    `usedTimes` INTEGER NOT NULL DEFAULT 0,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `invites_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tips` (
    `id` VARCHAR(191) NOT NULL,
    `cash` VARCHAR(32) NULL,
    `paypal` VARCHAR(32) NULL,
    `github` VARCHAR(32) NULL,
    `buymeacoffee` VARCHAR(32) NULL,
    `bitcoin` VARCHAR(64) NULL,
    `ethereum` VARCHAR(64) NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tips_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tip_tiers` (
    `id` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `name` VARCHAR(64) NOT NULL,
    `description` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tipId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tippings` (
    `id` VARCHAR(191) NOT NULL,
    `dispatcherAddress` VARCHAR(191) NOT NULL,
    `receiverAddress` VARCHAR(191) NOT NULL,
    `txHash` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tierId` VARCHAR(191) NOT NULL,
    `receiverId` VARCHAR(191) NOT NULL,
    `dispatcherId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `posts` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(280) NULL,
    `body` TEXT NOT NULL,
    `done` BOOLEAN NOT NULL DEFAULT false,
    `type` ENUM('POST', 'TASK', 'QUESTION', 'POLL', 'ISSUE', 'REPLY') NOT NULL DEFAULT 'POST',
    `hidden` BOOLEAN NOT NULL DEFAULT false,
    `ipfsHash` VARCHAR(46) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NULL,
    `communityId` VARCHAR(191) NULL,
    `parentId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attachments` (
    `id` VARCHAR(191) NOT NULL,
    `index` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nfts` (
    `id` VARCHAR(191) NOT NULL,
    `tokenId` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `network` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `nfts_postId_key`(`postId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `poll` (
    `id` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NULL,

    UNIQUE INDEX `poll_postId_key`(`postId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `poll_answers` (
    `id` VARCHAR(191) NOT NULL,
    `index` INTEGER NOT NULL,
    `title` VARCHAR(64) NOT NULL,
    `pollId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookmarks` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `postId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `bookmarks_userId_postId_key`(`userId`, `postId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_topics` (
    `id` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NULL,
    `topicId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `topics` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(64) NOT NULL,
    `image` VARCHAR(191) NULL,
    `description` VARCHAR(280) NULL,
    `featuredAt` DATETIME(3) NULL,

    UNIQUE INDEX `topics_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `likes` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NULL,

    UNIQUE INDEX `likes_userId_postId_key`(`userId`, `postId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(64) NOT NULL,
    `slug` VARCHAR(32) NOT NULL,
    `description` VARCHAR(280) NULL,
    `avatar` VARCHAR(191) NULL,
    `hidden` BOOLEAN NOT NULL DEFAULT false,
    `website` VARCHAR(191) NULL,
    `producthunt` VARCHAR(32) NULL,
    `discord` VARCHAR(32) NULL,
    `github` VARCHAR(32) NULL,
    `twitter` VARCHAR(32) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `ownerId` VARCHAR(191) NULL,

    UNIQUE INDEX `products_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `communities` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(64) NOT NULL,
    `slug` VARCHAR(32) NOT NULL,
    `description` VARCHAR(280) NULL,
    `avatar` VARCHAR(191) NULL,
    `hidden` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ownerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `communities_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `community_rules` (
    `id` VARCHAR(191) NOT NULL,
    `index` INTEGER NOT NULL,
    `name` VARCHAR(64) NOT NULL,
    `description` VARCHAR(280) NULL,
    `communityId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `badges` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(64) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `description` VARCHAR(280) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `message` VARCHAR(280) NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `entityId` VARCHAR(191) NOT NULL,
    `type` ENUM('POST_LIKE', 'POST_REPLY', 'USER_MENTION', 'USER_FOLLOW', 'USER_INVITE_FOLLOW', 'PRODUCT_SUBSCRIBE') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `receiverId` VARCHAR(191) NOT NULL,
    `dispatcherId` VARCHAR(191) NOT NULL,
    `likeId` VARCHAR(191) NULL,
    `productId` VARCHAR(191) NULL,
    `postId` VARCHAR(191) NULL,

    UNIQUE INDEX `notifications_entityId_key`(`entityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `integrations` (
    `id` VARCHAR(191) NOT NULL,
    `wakatimeAPIKey` VARCHAR(191) NULL,
    `spotifyRefreshToken` VARCHAR(191) NULL,
    `githubId` VARCHAR(64) NULL,
    `ethAddress` VARCHAR(64) NULL,
    `ensAddress` VARCHAR(191) NULL,
    `ethNonce` VARCHAR(6) NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `integrations_githubId_key`(`githubId`),
    UNIQUE INDEX `integrations_ethAddress_key`(`ethAddress`),
    UNIQUE INDEX `integrations_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logs` (
    `id` VARCHAR(191) NOT NULL,
    `action` ENUM('LOGIN', 'LOGOUT', 'SETTINGS_UPDATE', 'PASSWORD_UPDATE') NOT NULL,
    `entityId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reports` (
    `id` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `type` ENUM('POST', 'USER', 'PRODUCT', 'COMMUNITY') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProductToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ProductToUser_AB_unique`(`A`, `B`),
    INDEX `_ProductToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_communityModerator` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_communityModerator_AB_unique`(`A`, `B`),
    INDEX `_communityModerator_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_communityMember` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_communityMember_AB_unique`(`A`, `B`),
    INDEX `_communityMember_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BadgeToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_BadgeToUser_AB_unique`(`A`, `B`),
    INDEX `_BadgeToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_TopicToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_TopicToUser_AB_unique`(`A`, `B`),
    INDEX `_TopicToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PollAnswerToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PollAnswerToUser_AB_unique`(`A`, `B`),
    INDEX `_PollAnswerToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_follows` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_follows_AB_unique`(`A`, `B`),
    INDEX `_follows_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
