/*
  Warnings:

  - A unique constraint covering the columns `[blogId,usernameId]` on the table `blogLike` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "blogLike_blogId_usernameId_key" ON "blogLike"("blogId", "usernameId");
