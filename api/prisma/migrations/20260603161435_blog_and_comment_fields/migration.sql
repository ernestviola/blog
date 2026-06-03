/*
  Warnings:

  - Added the required column `body` to the `blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `published` to the `blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `body` to the `comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `likes` to the `comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_blogId_fkey";

-- AlterTable
ALTER TABLE "blog" ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "published" BOOLEAN NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "comment" ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "likes" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
