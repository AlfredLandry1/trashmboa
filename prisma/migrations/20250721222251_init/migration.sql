-- CreateEnum
CREATE TYPE "dechet_type" AS ENUM ('ORGANIQUE', 'PLASTIQUE', 'PAPIER', 'METAL', 'VERRE', 'DANGEREUX');

-- CreateEnum
CREATE TYPE "dechet_statut" AS ENUM ('EN_ATTENTE', 'COLLECTE', 'TRAITE');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('USER', 'COLLECTOR', 'ADMIN');

-- CreateTable
CREATE TABLE "dechet" (
    "id" SERIAL NOT NULL,
    "type" "dechet_type" NOT NULL,
    "quantite" DOUBLE PRECISION NOT NULL,
    "adresse" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "statut" "dechet_statut" NOT NULL DEFAULT 'EN_ATTENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "photo" TEXT,

    CONSTRAINT "dechet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "signalement" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'en_attente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "description" TEXT,
    "photo" TEXT,

    CONSTRAINT "signalement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "role" "user_role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "photoUrl" TEXT NOT NULL DEFAULT 'https://www.gravatar.com/avatar/?d=identicon',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Dechet_userId_idx" ON "dechet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Session_refreshToken_key" ON "session"("refreshToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "Signalement_userId_idx" ON "signalement"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "dechet" ADD CONSTRAINT "Dechet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signalement" ADD CONSTRAINT "Signalement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
