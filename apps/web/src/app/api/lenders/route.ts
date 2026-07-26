import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@loan-crm/db";
import { generateLenderReferenceId } from "@/lib/lenderReferenceId";
import { z } from "zod";
import type { LoanType } from "@prisma/client";

const schema = z.object({
  name: z.string().min(3),
  shortCode: z
    .string()
    .min(2)
    .max(20)
    .regex(/^[A-Z0-9-]+$/, "Uppercase letters, numbers, hyphens only"),
  loanTypes: z
    .array(z.enum(["PERSONAL", "MSME_BUSINESS", "HOME", "VEHICLE"]))
    .min(1),
  regions: z.array(z.string()).min(1),
  isPanIndia: z.boolean().default(false),
  minAmount: z.number().positive(),
  maxAmount: z.number().positive(),
  minTenureMonths: z.number().int().positive(),
  maxTenureMonths: z.number().int().positive(),
  interestRateMin: z.number().positive(),
  interestRateMax: z.number().positive(),
  processingFeePercent: z.number().min(0).default(1),
  grievanceEmail: z.string().email().optional().or(z.literal("")),
});

export async function GET() {
  const lenders = await prisma.lender.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ lenders });
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    const referenceId = await generateLenderReferenceId(
      data.loanTypes[0] as LoanType,
      data.isPanIndia ? "PAN" : data.regions[0],
    );

    const lender = await prisma.lender.create({
      data: {
        ...data,
        referenceId,
        grievanceEmail: data.grievanceEmail || undefined,
        isActive: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "LENDER_CREATED",
        entity: "Lender",
        entityId: lender.id,
        newValue: { name: lender.name, referenceId: lender.referenceId },
      },
    });

    return NextResponse.json({ success: true, lender });
  } catch (err: any) {
    console.error("[POST /api/lenders]", err);
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "A lender with this short code already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create lender" },
      { status: 500 },
    );
  }
}
