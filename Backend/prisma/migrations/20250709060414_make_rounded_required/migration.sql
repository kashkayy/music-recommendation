/*
  Warnings:

  - Made the column `roundedLat` on table `SavedSong` required. This step will fail if there are existing NULL values in that column.
  - Made the column `roundedLng` on table `SavedSong` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "SavedSong" ALTER COLUMN "roundedLat" SET NOT NULL,
ALTER COLUMN "roundedLng" SET NOT NULL;
