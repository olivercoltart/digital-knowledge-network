-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('PROJECT_DOCUMENTATION', 'CLIENT_DATA', 'TECHNICAL_RESOURCE');

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "resourceType" "ResourceType";
