import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, LoanType } from "@loan-crm/db";
import { z } from "zod";

const createLenderSchema = z.object({
  name: z.string().min(2, "Name is required"),
  shortCode: z.string().min(2, "Short code is required"),
  referenceId: z.string().min(2, "Reference ID is required"),
  loanTypes: z.array(z.nativeEnum(LoanType)).min(1, "Select at least one loan type"),
  minAmount: z.number().positive(),
  maxAmount: z.number().positive(),
  minTenureMonths: z.number().int().positive(),
  maxTenureMonths: z.number().int().positive(),
  interestRateMin: z.number().nonnegative(),
  interestRateMax: z.number().nonnegative(),
  isPanIndia: z.boolean().default(false),
  regions: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createLenderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const lender = await prisma.lender.create({
      data: parsed.data,
    });

    return NextResponse.json({ success: true, lender });
  } catch (err) {
    console.error("[POST /api/admin/lenders]", err);
    return NextResponse.json(
      { error: "Failed to create lender" },
      { status: 500 }
    );
  }
}
