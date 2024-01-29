/*
  Warnings:

  - You are about to alter the column `platform` on the `socialmedia` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- DropForeignKey
ALTER TABLE `socialmedia` DROP FOREIGN KEY `SocialMedia_user_id_fkey`;

-- AlterTable
ALTER TABLE `socialmedia` MODIFY `platform` ENUM('Youtube', 'Instagram', 'Twitter') NOT NULL;

-- AddForeignKey
ALTER TABLE `SocialMedia` ADD CONSTRAINT `SocialMedia_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
