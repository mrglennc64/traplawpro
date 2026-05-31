-- CreateTable
CREATE TABLE "Attorney" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "firm" TEXT NOT NULL,
    "barNumber" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attorney_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttorneyCase" (
    "id" TEXT NOT NULL,
    "caseRef" TEXT NOT NULL,
    "signToken" TEXT,
    "isrc" TEXT NOT NULL,
    "recordingTitle" TEXT NOT NULL,
    "primaryArtist" TEXT NOT NULL,
    "performerName" TEXT NOT NULL,
    "performerRole" TEXT NOT NULL,
    "share" DOUBLE PRECISION NOT NULL,
    "performerLegalName" TEXT,
    "performerStageName" TEXT,
    "ipiNumbers" TEXT,
    "ipiNote" TEXT,
    "claimBasis" TEXT,
    "rsrReviewDate" TIMESTAMP(3),
    "rsrRegistryResult" TEXT,
    "rsrCommercialStatus" TEXT,
    "rsrCredited" TEXT,
    "status" TEXT NOT NULL DEFAULT 'handshake_pending',
    "artistViewEnabled" BOOLEAN NOT NULL DEFAULT true,
    "artistEmail" TEXT,
    "attorneyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttorneyCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttorneyHandshake" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "stageName" TEXT,
    "email" TEXT NOT NULL,
    "biometricStatus" TEXT NOT NULL DEFAULT 'pending',
    "signature" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "signedAt" TIMESTAMP(3),
    "hashAnchor" TEXT,
    "payload" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttorneyHandshake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "storageUrl" TEXT NOT NULL,
    "hashAnchor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtistNotification" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArtistNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtistAuthToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArtistAuthToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttorneyCase_caseRef_key" ON "AttorneyCase"("caseRef");

-- CreateIndex
CREATE UNIQUE INDEX "AttorneyCase_signToken_key" ON "AttorneyCase"("signToken");

-- CreateIndex
CREATE UNIQUE INDEX "ArtistAuthToken_tokenHash_key" ON "ArtistAuthToken"("tokenHash");

-- AddForeignKey
ALTER TABLE "AttorneyCase" ADD CONSTRAINT "AttorneyCase_attorneyId_fkey" FOREIGN KEY ("attorneyId") REFERENCES "Attorney"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttorneyHandshake" ADD CONSTRAINT "AttorneyHandshake_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "AttorneyCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "AttorneyCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistNotification" ADD CONSTRAINT "ArtistNotification_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "AttorneyCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

