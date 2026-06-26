/*
  Warnings:

  - You are about to drop the column `likes` on the `blog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "blog" DROP COLUMN "likes";

-- CreateTable
CREATE TABLE "blogLike" (
    "id" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "usernameId" TEXT NOT NULL,
    "added" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blogLike_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "blogLike" ADD CONSTRAINT "blogLike_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blogLike" ADD CONSTRAINT "blogLike_usernameId_fkey" FOREIGN KEY ("usernameId") REFERENCES "username"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
