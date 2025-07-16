-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'regionAdmin';

-- AlterTable
ALTER TABLE "SavedSong" ADD COLUMN     "region" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "region" TEXT;
