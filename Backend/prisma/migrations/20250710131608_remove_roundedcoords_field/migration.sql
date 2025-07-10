/*
  Warnings:

  - You are about to drop the column `roundedLat` on the `SavedSong` table. All the data in the column will be lost.
  - You are about to drop the column `roundedLng` on the `SavedSong` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "SavedSong_roundedLat_roundedLng_idx";

-- AlterTable
ALTER TABLE "SavedSong" DROP COLUMN "roundedLat",
DROP COLUMN "roundedLng";
