/*
  Warnings:

  - You are about to drop the column `typeContrat` on the `offres_stage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "formations" ADD COLUMN     "domaine" TEXT,
ADD COLUMN     "dureeHeures" INTEGER,
ADD COLUMN     "niveau" TEXT,
ADD COLUMN     "thumbnailUrl" TEXT;

-- AlterTable
ALTER TABLE "offres_emploi" ADD COLUMN     "experience" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "remote" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "offres_stage" DROP COLUMN "typeContrat",
ADD COLUMN     "duree" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "remote" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "projets_portfolio" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "lienProjet" TEXT;
