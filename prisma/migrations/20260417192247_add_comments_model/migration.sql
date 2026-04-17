-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "authorName" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "errorCodeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Comment_errorCodeId_idx" ON "Comment"("errorCodeId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_errorCodeId_fkey" FOREIGN KEY ("errorCodeId") REFERENCES "ErrorCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
