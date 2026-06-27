-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('APPLICANT', 'LOAN_OFFICER', 'LENDER_ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "LoanType" AS ENUM ('PERSONAL', 'MSME_BUSINESS', 'HOME', 'VEHICLE');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'DOCUMENT_PENDING', 'UNDER_AI_REVIEW', 'UNDER_OFFICER_REVIEW', 'APPROVED', 'CONDITIONALLY_APPROVED', 'REJECTED', 'DISBURSED', 'ACTIVE', 'CLOSED', 'NPA');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PAN_CARD', 'AADHAAR_FRONT', 'AADHAAR_BACK', 'BANK_STATEMENT_3M', 'BANK_STATEMENT_6M', 'ITR_1_YEAR', 'ITR_2_YEAR', 'SALARY_SLIP_1M', 'SALARY_SLIP_3M', 'BUSINESS_PROOF', 'GST_RETURNS', 'PROPERTY_DOCUMENT', 'VEHICLE_QUOTATION', 'PHOTO', 'SIGNATURE', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'UPLOADED', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "EmiStatus" AS ENUM ('UPCOMING', 'DUE', 'PAID', 'OVERDUE', 'PARTIAL', 'WAIVED');

-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('SALARIED', 'SELF_EMPLOYED', 'BUSINESS_OWNER', 'PROFESSIONAL', 'AGRICULTURIST', 'RETIRED', 'OTHER');

-- CreateEnum
CREATE TYPE "OtpPurpose" AS ENUM ('LOGIN', 'VERIFY_PHONE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" "UserRole" NOT NULL DEFAULT 'APPLICANT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "dob" TIMESTAMP(3),
    "gender" "GenderType",
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "employmentType" "EmploymentType",
    "panEncrypted" TEXT,
    "aadhaarLast4" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "phone" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "purpose" "OtpPurpose" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lenders" (
    "id" TEXT NOT NULL,
    "referenceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "logoUrl" TEXT,
    "loanTypes" "LoanType"[],
    "regions" TEXT[],
    "isPanIndia" BOOLEAN NOT NULL DEFAULT false,
    "minAmount" DOUBLE PRECISION NOT NULL,
    "maxAmount" DOUBLE PRECISION NOT NULL,
    "minTenureMonths" INTEGER NOT NULL,
    "maxTenureMonths" INTEGER NOT NULL,
    "interestRateMin" DOUBLE PRECISION NOT NULL,
    "interestRateMax" DOUBLE PRECISION NOT NULL,
    "processingFeePercent" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "registrationNo" TEXT,
    "gstin" TEXT,
    "grievanceEmail" TEXT,
    "grievancePhone" TEXT,
    "websiteUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lenders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lender_officers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lenderId" TEXT NOT NULL,

    CONSTRAINT "lender_officers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_applications" (
    "id" TEXT NOT NULL,
    "applicationNo" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "lenderId" TEXT NOT NULL,
    "officerId" TEXT,
    "loanType" "LoanType" NOT NULL,
    "loanAmount" DOUBLE PRECISION NOT NULL,
    "tenureMonths" INTEGER NOT NULL,
    "purpose" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'DRAFT',
    "applicantName" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "gender" "GenderType",
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "panEncrypted" TEXT NOT NULL,
    "aadhaarLast4" TEXT NOT NULL,
    "employmentType" "EmploymentType" NOT NULL,
    "employerName" TEXT,
    "monthlyIncome" DOUBLE PRECISION NOT NULL,
    "existingEmiObligations" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "businessName" TEXT,
    "businessType" TEXT,
    "gstNumber" TEXT,
    "businessVintage" INTEGER,
    "annualTurnover" DOUBLE PRECISION,
    "propertyAddress" TEXT,
    "propertyValue" DOUBLE PRECISION,
    "vehicleMake" TEXT,
    "vehicleModel" TEXT,
    "vehicleYear" INTEGER,
    "vehiclePrice" DOUBLE PRECISION,
    "sanctionedAmount" DOUBLE PRECISION,
    "sanctionedTenure" INTEGER,
    "sanctionedRate" DOUBLE PRECISION,
    "officerNotes" TEXT,
    "rejectionReason" TEXT,
    "conditionsForApproval" TEXT,
    "aiAnalysisMongoId" TEXT,
    "aiRiskScore" DOUBLE PRECISION,
    "aiRecommendation" TEXT,
    "aiAnalyzedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "decisionAt" TIMESTAMP(3),
    "disbursedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_documents" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "r2Key" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "loan_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emi_schedules" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "installmentNo" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "principalAmount" DOUBLE PRECISION NOT NULL,
    "interestAmount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "EmiStatus" NOT NULL DEFAULT 'UPCOMING',
    "penaltyAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "penaltyRate" DOUBLE PRECISION NOT NULL DEFAULT 2.0,
    "paidAt" TIMESTAMP(3),
    "paymentRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emi_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "lenders_referenceId_key" ON "lenders"("referenceId");

-- CreateIndex
CREATE UNIQUE INDEX "lenders_shortCode_key" ON "lenders"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "lender_officers_userId_key" ON "lender_officers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "loan_applications_applicationNo_key" ON "loan_applications"("applicationNo");

-- CreateIndex
CREATE UNIQUE INDEX "emi_schedules_applicationId_installmentNo_key" ON "emi_schedules"("applicationId", "installmentNo");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_entityId_idx" ON "audit_logs"("entityId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- AddForeignKey
ALTER TABLE "otp_records" ADD CONSTRAINT "otp_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lender_officers" ADD CONSTRAINT "lender_officers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lender_officers" ADD CONSTRAINT "lender_officers_lenderId_fkey" FOREIGN KEY ("lenderId") REFERENCES "lenders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_lenderId_fkey" FOREIGN KEY ("lenderId") REFERENCES "lenders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_documents" ADD CONSTRAINT "loan_documents_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emi_schedules" ADD CONSTRAINT "emi_schedules_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "loan_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
