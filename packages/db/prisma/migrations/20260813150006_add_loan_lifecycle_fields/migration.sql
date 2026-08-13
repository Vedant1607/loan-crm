-- AlterTable
ALTER TABLE "loan_applications" ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "lifecycleNote" TEXT;
