-- CreateTable
CREATE TABLE "ErrorCode" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "applianceType" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "altCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortMeaning" TEXT NOT NULL,
    "severityLevel" INTEGER NOT NULL DEFAULT 2,
    "canUserTrySafeChecks" BOOLEAN NOT NULL DEFAULT false,
    "safeChecks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "likelyCauses" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "whenToStopAndCallService" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "relatedSymptoms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "relatedCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "possibleParts" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "faq" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "sourceType" TEXT NOT NULL DEFAULT 'manual',
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ErrorCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Symptom" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "relatedCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "applianceTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Symptom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ErrorCode_slug_key" ON "ErrorCode"("slug");

-- CreateIndex
CREATE INDEX "ErrorCode_brand_idx" ON "ErrorCode"("brand");

-- CreateIndex
CREATE INDEX "ErrorCode_applianceType_idx" ON "ErrorCode"("applianceType");

-- CreateIndex
CREATE INDEX "ErrorCode_code_idx" ON "ErrorCode"("code");

-- CreateIndex
CREATE INDEX "ErrorCode_brand_applianceType_idx" ON "ErrorCode"("brand", "applianceType");

-- CreateIndex
CREATE UNIQUE INDEX "Symptom_slug_key" ON "Symptom"("slug");
