/*
  Warnings:

  - You are about to drop the column `lienGithub` on the `projets_portfolio` table. All the data in the column will be lost.
  - You are about to drop the column `lienProjet` on the `projets_portfolio` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TypeDocument" AS ENUM ('CV', 'LETTRE_MOTIVATION', 'CONVENTION', 'ATTESTATION', 'CERTIFICAT', 'AUTRE');

-- CreateEnum
CREATE TYPE "StatutSessionMentorat" AS ENUM ('PLANIFIEE', 'TERMINEE', 'ANNULEE');

-- AlterTable
ALTER TABLE "projets_portfolio" DROP COLUMN "lienGithub",
DROP COLUMN "lienProjet",
ADD COLUMN     "tags" TEXT[];

-- CreateTable
CREATE TABLE "cv" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "titre" TEXT,
    "resume" TEXT,
    "formationResume" TEXT,
    "experienceResume" TEXT,
    "urlPdf" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences_professionnelles" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "titrePoste" TEXT NOT NULL,
    "entrepriseNom" TEXT NOT NULL,
    "description" TEXT,
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experiences_professionnelles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competences" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "categorie" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "utilisateurs_competences" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "competenceId" TEXT NOT NULL,
    "niveau" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "utilisateurs_competences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offres_sauvegardees" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "offreStageId" TEXT,
    "offreEmploiId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "offres_sauvegardees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modules_formation" (
    "id" TEXT NOT NULL,
    "formationId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modules_formation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progressions_module" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "estTermine" BOOLEAN NOT NULL DEFAULT false,
    "termineLe" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "progressions_module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "objectifs_mentorat" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'pending',
    "creePar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "objectifs_mentorat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions_mentorat" (
    "id" TEXT NOT NULL,
    "stagiaireId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "sujet" TEXT NOT NULL,
    "commenceLe" TIMESTAMP(3) NOT NULL,
    "termineLe" TIMESTAMP(3),
    "statut" "StatutSessionMentorat" NOT NULL DEFAULT 'PLANIFIEE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_mentorat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluations_mentorat" (
    "id" TEXT NOT NULL,
    "stagiaireId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "communication" INTEGER,
    "resolutionProblemes" INTEGER,
    "adaptabilite" INTEGER,
    "travailEquipe" INTEGER,
    "commentaires" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluations_mentorat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "typeMime" TEXT NOT NULL,
    "typeDocument" "TypeDocument" NOT NULL DEFAULT 'AUTRE',
    "url" TEXT,
    "tailleOctets" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "signatures_convention" (
    "id" TEXT NOT NULL,
    "conventionId" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "documentId" TEXT,
    "roleSignataire" TEXT NOT NULL,
    "estSignee" BOOLEAN NOT NULL DEFAULT false,
    "signeeLe" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "signatures_convention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "titre" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants_conversation" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "dernierLuLe" TIMESTAMP(3),

    CONSTRAINT "participants_conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages_conversation" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "expediteurId" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "estSysteme" BOOLEAN NOT NULL DEFAULT false,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_conversation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cv_utilisateurId_key" ON "cv"("utilisateurId");

-- CreateIndex
CREATE INDEX "experiences_professionnelles_utilisateurId_dateDebut_idx" ON "experiences_professionnelles"("utilisateurId", "dateDebut");

-- CreateIndex
CREATE UNIQUE INDEX "competences_nom_key" ON "competences"("nom");

-- CreateIndex
CREATE INDEX "utilisateurs_competences_competenceId_idx" ON "utilisateurs_competences"("competenceId");

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_competences_utilisateurId_competenceId_key" ON "utilisateurs_competences"("utilisateurId", "competenceId");

-- CreateIndex
CREATE INDEX "offres_sauvegardees_utilisateurId_createdAt_idx" ON "offres_sauvegardees"("utilisateurId", "createdAt");

-- CreateIndex
CREATE INDEX "offres_sauvegardees_offreStageId_idx" ON "offres_sauvegardees"("offreStageId");

-- CreateIndex
CREATE INDEX "offres_sauvegardees_offreEmploiId_idx" ON "offres_sauvegardees"("offreEmploiId");

-- CreateIndex
CREATE INDEX "modules_formation_formationId_ordre_idx" ON "modules_formation"("formationId", "ordre");

-- CreateIndex
CREATE INDEX "progressions_module_moduleId_idx" ON "progressions_module"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "progressions_module_utilisateurId_moduleId_key" ON "progressions_module"("utilisateurId", "moduleId");

-- CreateIndex
CREATE INDEX "objectifs_mentorat_utilisateurId_statut_idx" ON "objectifs_mentorat"("utilisateurId", "statut");

-- CreateIndex
CREATE INDEX "sessions_mentorat_stagiaireId_commenceLe_idx" ON "sessions_mentorat"("stagiaireId", "commenceLe");

-- CreateIndex
CREATE INDEX "sessions_mentorat_mentorId_commenceLe_idx" ON "sessions_mentorat"("mentorId", "commenceLe");

-- CreateIndex
CREATE INDEX "evaluations_mentorat_stagiaireId_createdAt_idx" ON "evaluations_mentorat"("stagiaireId", "createdAt");

-- CreateIndex
CREATE INDEX "evaluations_mentorat_mentorId_createdAt_idx" ON "evaluations_mentorat"("mentorId", "createdAt");

-- CreateIndex
CREATE INDEX "documents_utilisateurId_typeDocument_idx" ON "documents"("utilisateurId", "typeDocument");

-- CreateIndex
CREATE INDEX "signatures_convention_conventionId_roleSignataire_idx" ON "signatures_convention"("conventionId", "roleSignataire");

-- CreateIndex
CREATE INDEX "signatures_convention_utilisateurId_idx" ON "signatures_convention"("utilisateurId");

-- CreateIndex
CREATE INDEX "participants_conversation_utilisateurId_idx" ON "participants_conversation"("utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "participants_conversation_conversationId_utilisateurId_key" ON "participants_conversation"("conversationId", "utilisateurId");

-- CreateIndex
CREATE INDEX "messages_conversation_conversationId_creeLe_idx" ON "messages_conversation"("conversationId", "creeLe");

-- CreateIndex
CREATE INDEX "messages_conversation_expediteurId_idx" ON "messages_conversation"("expediteurId");

-- AddForeignKey
ALTER TABLE "cv" ADD CONSTRAINT "cv_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiences_professionnelles" ADD CONSTRAINT "experiences_professionnelles_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "utilisateurs_competences" ADD CONSTRAINT "utilisateurs_competences_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "utilisateurs_competences" ADD CONSTRAINT "utilisateurs_competences_competenceId_fkey" FOREIGN KEY ("competenceId") REFERENCES "competences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offres_sauvegardees" ADD CONSTRAINT "offres_sauvegardees_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offres_sauvegardees" ADD CONSTRAINT "offres_sauvegardees_offreStageId_fkey" FOREIGN KEY ("offreStageId") REFERENCES "offres_stage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offres_sauvegardees" ADD CONSTRAINT "offres_sauvegardees_offreEmploiId_fkey" FOREIGN KEY ("offreEmploiId") REFERENCES "offres_emploi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modules_formation" ADD CONSTRAINT "modules_formation_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "formations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progressions_module" ADD CONSTRAINT "progressions_module_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progressions_module" ADD CONSTRAINT "progressions_module_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules_formation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objectifs_mentorat" ADD CONSTRAINT "objectifs_mentorat_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions_mentorat" ADD CONSTRAINT "sessions_mentorat_stagiaireId_fkey" FOREIGN KEY ("stagiaireId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions_mentorat" ADD CONSTRAINT "sessions_mentorat_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations_mentorat" ADD CONSTRAINT "evaluations_mentorat_stagiaireId_fkey" FOREIGN KEY ("stagiaireId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations_mentorat" ADD CONSTRAINT "evaluations_mentorat_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signatures_convention" ADD CONSTRAINT "signatures_convention_conventionId_fkey" FOREIGN KEY ("conventionId") REFERENCES "conventions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signatures_convention" ADD CONSTRAINT "signatures_convention_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signatures_convention" ADD CONSTRAINT "signatures_convention_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants_conversation" ADD CONSTRAINT "participants_conversation_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants_conversation" ADD CONSTRAINT "participants_conversation_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages_conversation" ADD CONSTRAINT "messages_conversation_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages_conversation" ADD CONSTRAINT "messages_conversation_expediteurId_fkey" FOREIGN KEY ("expediteurId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
