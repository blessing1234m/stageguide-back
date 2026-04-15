-- CreateEnum
CREATE TYPE "StatutDemandeMentorat" AS ENUM ('EN_ATTENTE', 'ACCEPTEE', 'REFUSEE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "StatutCandidature" AS ENUM ('EN_ATTENTE', 'EN_COURS', 'ACCEPTEE', 'REFUSEE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "StatutConvention" AS ENUM ('BROUILLON', 'EN_ATTENTE_SIGNATURE', 'SIGNEE', 'REFUSEE', 'ANNULEE');

-- CreateTable
CREATE TABLE "projets_portfolio" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "lienProjet" TEXT,
    "lienGithub" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projets_portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demandes_mentorat" (
    "id" TEXT NOT NULL,
    "stagiaireId" TEXT NOT NULL,
    "mentorId" TEXT,
    "message" TEXT,
    "statut" "StatutDemandeMentorat" NOT NULL DEFAULT 'EN_ATTENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "demandes_mentorat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offres_stage" (
    "id" TEXT NOT NULL,
    "partenaireId" TEXT,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "domaine" TEXT,
    "typeContrat" TEXT,
    "datePublication" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateExpiration" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offres_stage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offres_emploi" (
    "id" TEXT NOT NULL,
    "partenaireId" TEXT,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "domaine" TEXT,
    "typeContrat" TEXT,
    "datePublication" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateExpiration" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offres_emploi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidatures" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "offreStageId" TEXT,
    "offreEmploiId" TEXT,
    "message" TEXT,
    "statut" "StatutCandidature" NOT NULL DEFAULT 'EN_ATTENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conventions" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "partenaireId" TEXT,
    "entrepriseNom" TEXT NOT NULL,
    "mentorNom" TEXT,
    "statut" "StatutConvention" NOT NULL DEFAULT 'BROUILLON',
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conventions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formations" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "estActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "formations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscriptions_formations" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "formationId" TEXT NOT NULL,
    "progression" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inscriptions_formations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificats" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "hashVerification" TEXT NOT NULL,
    "urlDocument" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "estLue" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "projets_portfolio_utilisateurId_createdAt_idx" ON "projets_portfolio"("utilisateurId", "createdAt");

-- CreateIndex
CREATE INDEX "demandes_mentorat_stagiaireId_statut_idx" ON "demandes_mentorat"("stagiaireId", "statut");

-- CreateIndex
CREATE INDEX "demandes_mentorat_mentorId_statut_idx" ON "demandes_mentorat"("mentorId", "statut");

-- CreateIndex
CREATE INDEX "offres_stage_ville_domaine_idx" ON "offres_stage"("ville", "domaine");

-- CreateIndex
CREATE INDEX "offres_stage_partenaireId_idx" ON "offres_stage"("partenaireId");

-- CreateIndex
CREATE INDEX "offres_emploi_ville_domaine_idx" ON "offres_emploi"("ville", "domaine");

-- CreateIndex
CREATE INDEX "offres_emploi_partenaireId_idx" ON "offres_emploi"("partenaireId");

-- CreateIndex
CREATE INDEX "candidatures_utilisateurId_statut_idx" ON "candidatures"("utilisateurId", "statut");

-- CreateIndex
CREATE INDEX "candidatures_offreStageId_idx" ON "candidatures"("offreStageId");

-- CreateIndex
CREATE INDEX "candidatures_offreEmploiId_idx" ON "candidatures"("offreEmploiId");

-- CreateIndex
CREATE INDEX "conventions_utilisateurId_statut_idx" ON "conventions"("utilisateurId", "statut");

-- CreateIndex
CREATE INDEX "conventions_partenaireId_idx" ON "conventions"("partenaireId");

-- CreateIndex
CREATE INDEX "formations_titre_idx" ON "formations"("titre");

-- CreateIndex
CREATE INDEX "inscriptions_formations_formationId_idx" ON "inscriptions_formations"("formationId");

-- CreateIndex
CREATE UNIQUE INDEX "inscriptions_formations_utilisateurId_formationId_key" ON "inscriptions_formations"("utilisateurId", "formationId");

-- CreateIndex
CREATE UNIQUE INDEX "certificats_hashVerification_key" ON "certificats"("hashVerification");

-- CreateIndex
CREATE INDEX "certificats_utilisateurId_createdAt_idx" ON "certificats"("utilisateurId", "createdAt");

-- CreateIndex
CREATE INDEX "notifications_utilisateurId_estLue_createdAt_idx" ON "notifications"("utilisateurId", "estLue", "createdAt");

-- AddForeignKey
ALTER TABLE "projets_portfolio" ADD CONSTRAINT "projets_portfolio_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demandes_mentorat" ADD CONSTRAINT "demandes_mentorat_stagiaireId_fkey" FOREIGN KEY ("stagiaireId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demandes_mentorat" ADD CONSTRAINT "demandes_mentorat_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offres_stage" ADD CONSTRAINT "offres_stage_partenaireId_fkey" FOREIGN KEY ("partenaireId") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offres_emploi" ADD CONSTRAINT "offres_emploi_partenaireId_fkey" FOREIGN KEY ("partenaireId") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidatures" ADD CONSTRAINT "candidatures_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidatures" ADD CONSTRAINT "candidatures_offreStageId_fkey" FOREIGN KEY ("offreStageId") REFERENCES "offres_stage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidatures" ADD CONSTRAINT "candidatures_offreEmploiId_fkey" FOREIGN KEY ("offreEmploiId") REFERENCES "offres_emploi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conventions" ADD CONSTRAINT "conventions_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conventions" ADD CONSTRAINT "conventions_partenaireId_fkey" FOREIGN KEY ("partenaireId") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions_formations" ADD CONSTRAINT "inscriptions_formations_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions_formations" ADD CONSTRAINT "inscriptions_formations_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "formations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificats" ADD CONSTRAINT "certificats_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
