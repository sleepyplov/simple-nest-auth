-- AlterTable
ALTER TABLE "refresh_tokens" ADD COLUMN     "blacklisted" BOOLEAN NOT NULL DEFAULT false;
