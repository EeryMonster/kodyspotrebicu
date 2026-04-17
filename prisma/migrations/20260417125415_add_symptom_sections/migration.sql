-- AlterTable
ALTER TABLE "Symptom" ADD COLUMN     "intro" TEXT,
ADD COLUMN     "sections" JSONB[] DEFAULT ARRAY[]::JSONB[];
