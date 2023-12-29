-- AlterTable
ALTER TABLE `jargon` ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `portofolio` MODIFY `description` TEXT NULL,
    MODIFY `thumbnail` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `description` TEXT NULL;
