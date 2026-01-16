-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('NOT_SUBMITTED', 'PENDING', 'APPROVED', 'REJECTED');

-- AlterTable: Add createdAt and updatedAt to students if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='createdAt') THEN
        ALTER TABLE "students" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='updatedAt') THEN
        ALTER TABLE "students" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- AlterTable: Rename credenicalNumber to credentialNumber in instructors
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='instructors' AND column_name='credenicalNumber') THEN
        ALTER TABLE "instructors" RENAME COLUMN "credenicalNumber" TO "credentialNumber";
    END IF;
END $$;

-- AlterTable: Add verification fields to instructors
ALTER TABLE "instructors" ADD COLUMN IF NOT EXISTS "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'NOT_SUBMITTED';
ALTER TABLE "instructors" ADD COLUMN IF NOT EXISTS "rejectionReason" TEXT;
ALTER TABLE "instructors" ADD COLUMN IF NOT EXISTS "rejectionNotes" TEXT;
ALTER TABLE "instructors" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "instructors" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable: Update foreign keys to use CASCADE
ALTER TABLE "instructors" DROP CONSTRAINT IF EXISTS "instructors_userId_fkey";
ALTER TABLE "instructors" ADD CONSTRAINT "instructors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "students" DROP CONSTRAINT IF EXISTS "students_userId_fkey";
ALTER TABLE "students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
