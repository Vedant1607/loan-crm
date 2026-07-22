import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, EmploymentType } from "@loan-crm/db";
import { assignLender } from "@/lib/lenderAssignment";
import { generateApplicationNo } from "@/lib/referenceId";
import { z } from "zod";

const schema = z.object({
  // Step 1
  name: z.string().min(3),
  dob: z.string(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
  employmentType: z.string(),
  pan: z.string(),
  aadhaarLast4: z.string().length(4),
  // Step 2
  loanType: z.enum(["PERSONAL", "MSME_BUSINESS", "HOME", "VEHICLE"]),
  loanAmount: z.number(),
  tenure: z.number(),
  purpose: z.string(),
  monthlyIncome: z.number(),
  existingEmiObligations: z.number(),
  // Step 3 (optional)
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  gstNumber: z.string().optional(),
  businessVintage: z.number().optional(),
  annualTurnover: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // 1. Assign lender
    const lenderId = await assignLender(
      data.loanType,
      data.state,
      data.loanAmount,
    );

    // 2. Get lender short code for application number
    const lender = await prisma.lender.findUnique({
      where: { id: lenderId },
      select: { shortCode: true },
    });

    if (!lender) {
      return NextResponse.json(
        { error: "No lender available for this loan type and region" },
        { status: 400 },
      );
    }

    // 3. Generate application number
    const applicationNo = await generateApplicationNo(lender.shortCode);

    // 4. Simple encryption placeholder — replace with real AES-256 in prod
    const panEncrypted = Buffer.from(data.pan).toString("base64");

    // 5. Create application in DB
    const application = await prisma.loanApplication.create({
      data: {
        applicationNo,
        applicantId: session.user.id,
        lenderId,
        loanType: data.loanType,
        loanAmount: data.loanAmount,
        tenureMonths: data.tenure,
        purpose: data.purpose,
        status: "SUBMITTED",
        applicantName: data.name,
        dob: new Date(data.dob),
        gender: data.gender,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        panEncrypted,
        aadhaarLast4: data.aadhaarLast4,
        employmentType: data.employmentType as EmploymentType,
        monthlyIncome: data.monthlyIncome,
        existingEmiObligations: data.existingEmiObligations,
        businessName: data.businessName,
        businessType: data.businessType,
        gstNumber: data.gstNumber,
        businessVintage: data.businessVintage,
        annualTurnover: data.annualTurnover,
        submittedAt: new Date(),
      },
    });

    // 6. Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "APPLICATION_SUBMITTED",
        entity: "LoanApplication",
        entityId: application.id,
        newValue: {
          applicationNo,
          loanType: data.loanType,
          loanAmount: data.loanAmount,
        },
      },
    });

    return NextResponse.json({
      success: true,
      applicationId: application.id,
      applicationNo: application.applicationNo,
    });
  } catch (err) {
    const error = err as Error;
    console.error("[POST /api/applications]", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to submit application" },
      { status: 500 },
    );
  }
}
