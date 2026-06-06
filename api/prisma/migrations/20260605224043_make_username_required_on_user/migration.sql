/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `username` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "username_username_key" ON "username"("username");
