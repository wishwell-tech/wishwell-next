-- AlterTable
ALTER TABLE "users" ADD COLUMN     "invitedAt" TIMESTAMP(3),
ADD COLUMN     "invitedBy" TEXT,
ADD COLUMN     "isPending" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "supabaseId" DROP NOT NULL,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL;
