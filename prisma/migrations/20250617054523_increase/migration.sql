-- AlterTable
ALTER TABLE `dechet` ADD COLUMN `latitude` DOUBLE NULL,
    ADD COLUMN `longitude` DOUBLE NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `photoUrl` VARCHAR(191) NOT NULL DEFAULT 'https://www.gravatar.com/avatar/?d=identicon';
