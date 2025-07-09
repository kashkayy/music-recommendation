-- AlterTable
ALTER TABLE "SavedSong" ADD COLUMN     "roundedLat" DOUBLE PRECISION,
ADD COLUMN     "roundedLng" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "SavedSong_roundedLat_roundedLng_idx" ON "SavedSong"("roundedLat", "roundedLng");
