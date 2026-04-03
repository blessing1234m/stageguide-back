-- CreateTable
CREATE TABLE "partners" (
    "id" TEXT NOT NULL,
    "nomEntreprise" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "lienSiteWeb" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "partners_email_key" ON "partners"("email");

-- CreateIndex
CREATE INDEX "partners_nomEntreprise_idx" ON "partners"("nomEntreprise");

-- CreateIndex
CREATE INDEX "partners_ville_idx" ON "partners"("ville");
