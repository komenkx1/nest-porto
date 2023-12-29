/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `jargon` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `jargon_user_id_key` ON `jargon`(`user_id`);
