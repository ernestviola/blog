/*
  Warnings:

  - You are about to drop the column `likes` on the `comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "comment" DROP COLUMN "likes";

-- CreateTable
CREATE TABLE "commentLike" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "usernameId" TEXT NOT NULL,
    "added" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commentLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "commentLike_commentId_usernameId_key" ON "commentLike"("commentId", "usernameId");

-- AddForeignKey
ALTER TABLE "commentLike" ADD CONSTRAINT "commentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentLike" ADD CONSTRAINT "commentLike_usernameId_fkey" FOREIGN KEY ("usernameId") REFERENCES "username"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
