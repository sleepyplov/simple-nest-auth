/*
  Warnings:

  - You are about to drop the column `nextTokenId` on the `refresh_tokens` table. All the data in the column will be lost.
  - Added the required column `familyId` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_nextTokenId_fkey";

-- DropIndex
DROP INDEX "refresh_tokens_nextTokenId_key";

-- AlterTable
ALTER TABLE "refresh_tokens" DROP COLUMN "nextTokenId",
ADD COLUMN     "familyId" UUID NOT NULL,
ADD COLUMN     "userId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "RefreshTokenFamily" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefreshTokenFamily_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "RefreshTokenFamily"("id") ON DELETE CASCADE ON UPDATE CASCADE;
