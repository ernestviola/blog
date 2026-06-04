/*
  Warnings:

  - Made the column `usernameId` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_usernameId_fkey";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "usernameId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_usernameId_fkey" FOREIGN KEY ("usernameId") REFERENCES "username"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
