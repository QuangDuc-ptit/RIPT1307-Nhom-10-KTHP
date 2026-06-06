-- Migration: add_movie_multilang_genre
-- Adds Movie translations, Genre, MovieGenre, and extends Movie table

-- CreateEnum for MovieStatus
CREATE TYPE "MovieStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- AlterTable: extend Movie with new columns
ALTER TABLE "Movie" ADD COLUMN "poster" TEXT;
ALTER TABLE "Movie" ADD COLUMN "backdrop" TEXT;
ALTER TABLE "Movie" ADD COLUMN "overview" TEXT;
ALTER TABLE "Movie" ADD COLUMN "duration" INTEGER;
ALTER TABLE "Movie" ADD COLUMN "releaseDate" TIMESTAMP(3);
ALTER TABLE "Movie" ADD COLUMN "status" "MovieStatus" NOT NULL DEFAULT 'DRAFT';
ALTER TABLE "Movie" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable for MovieTranslation
CREATE TABLE "MovieTranslation" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT,

    CONSTRAINT "MovieTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Genre
CREATE TABLE "Genre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable for MovieGenre
CREATE TABLE "MovieGenre" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "MovieGenre_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for MovieTranslation
CREATE UNIQUE INDEX "MovieTranslation_movieId_locale_key" ON "MovieTranslation"("movieId", "locale");
CREATE INDEX "MovieTranslation_locale_idx" ON "MovieTranslation"("locale");

-- CreateIndex for Genre
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");
CREATE UNIQUE INDEX "Genre_slug_key" ON "Genre"("slug");

-- CreateIndex for MovieGenre
CREATE UNIQUE INDEX "MovieGenre_movieId_genreId_key" ON "MovieGenre"("movieId", "genreId");

-- AddForeignKey for MovieTranslation
ALTER TABLE "MovieTranslation" ADD CONSTRAINT "MovieTranslation_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey for MovieGenre movieId
ALTER TABLE "MovieGenre" ADD CONSTRAINT "MovieGenre_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey for MovieGenre genreId
ALTER TABLE "MovieGenre" ADD CONSTRAINT "MovieGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
