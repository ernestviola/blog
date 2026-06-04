/*
  Warnings:

  - You are about to drop the column `userId` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `comment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usernameId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usernameId` to the `comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_userId_fkey";

-- AlterTable
ALTER TABLE "comment" DROP COLUMN "userId",
DROP COLUMN "username",
ADD COLUMN     "usernameId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "usernameId" TEXT;

-- CreateTable
CREATE TABLE "username" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "username_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_usernameId_key" ON "user"("usernameId");

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_usernameId_fkey" FOREIGN KEY ("usernameId") REFERENCES "username"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_usernameId_fkey" FOREIGN KEY ("usernameId") REFERENCES "username"("id") ON DELETE SET NULL ON UPDATE CASCADE;
