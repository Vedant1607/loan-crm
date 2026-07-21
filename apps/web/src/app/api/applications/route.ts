import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@loan-crm/db";
import { z } from "zod";
import { assignLender } from "@/lib/lenderAssignment";
import { generateApplicationNo } from "@/lib/referenceId";

const schema = z.object({
  // Step 1
  name: z.string().min(3),
  dob: z.string(),
  gender: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
  employmentType: z.string(),
  pan: z.string(),
  aadhaarLast4: z.string().length(4),
  // Step 2
  loanType: z.string(),
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
  // Step 4 — document r2Keys
  documentKeys: z.record(z.string()),
  documentMeta: z.record(
    z.object({
      fileName: z.string(),
      fileSize: z.number(),
      mimeType: z.string(),
    }),
  ),
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
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // 1. Assign lender
    const lenderId = await assignLender(
      data.loanType as any,
      data.state,
      data.loanAmount,
    );

    const lender = await prisma.lender.findUnique({
      where: { id: lenderId },
    });

    if (!lender) {
      return NextResponse.json(
        { error: "No lender available for this loan type and region" },
        { status: 422 },
      );
    }

    // 2. Generate application number
    const applicationNo = await generateApplicationNo(lender.shortCode);

    // 3. Encrypt PAN (basic in dev — replace with AES-256 in prod)
    const panEncrypted = Buffer.from(data.pan).toString("base64");

    // 4. Create application + documents in a transaction
    const application = await prisma.$transaction(async (tx) => {
      const app = await tx.loanApplication.create({
        data: {
          applicationNo,
          applicantId: session.user.id,
          lenderId,
          loanType: data.loanType as any,
          loanAmount: data.loanAmount,
          tenureMonths: data.tenure,
          purpose: data.purpose,
          status: "SUBMITTED",
          applicantName: data.name,
          dob: new Date(data.dob),
          gender: data.gender as any,
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          panEncrypted,
          aadhaarLast4: data.aadhaarLast4,
          employmentType: data.employmentType as any,
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

      // Create document records
      const docEntries = Object.entries(data.documentKeys);
      for (const [docType, r2Key] of docEntries) {
        const meta = data.documentMeta[docType];
        if (!meta) continue;

        await tx.loanDocument.create({
          data: {
            applicationId: app.id,
            type: docType as any,
            fileName: meta.fileName,
            fileSize: meta.fileSize,
            mimeType: meta.mimeType,
            r2Key,
            status: "UPLOADED",
          },
        });
      }

      // Audit log
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: "APPLICATION_SUBMITTED",
          entity: "LoanApplication",
          entityId: app.id,
          newValue: { applicationNo, lenderId, loanType: data.loanType },
        },
      });

      return app;
    });

    return NextResponse.json({
      id: application.id,
      applicationNo: application.applicationNo,
    });
  } catch (err: any) {
    console.error("[applications/POST]", err);

    if (err.message?.includes("No lender available")) {
      return NextResponse.json({ error: err.message }, { status: 422 });
    }

    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const applications = await prisma.loanApplication.findMany({
      where: { applicantId: session.user.id },
      include: { lender: { select: { name: true, referenceId: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(applications);
  } catch (err) {
    console.error("[applications/GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 },
    );
  }
}
