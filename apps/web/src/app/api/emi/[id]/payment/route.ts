import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@loan-crm/db";
import { z } from "zod";

const schema = z.object({
  amountPaid: z.number().positive("Amount must be positive"),
  paymentRef: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allowedRoles = ["LOAN_OFFICER", "LENDER_ADMIN", "SUPER_ADMIN"];
    if (!allowedRoles.includes(session.user.role)) {
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

    const { amountPaid, paymentRef } = parsed.data;

    const emi = await prisma.emiSchedule.findUnique({
      where: { id },
    });

    if (!emi) {
      return NextResponse.json(
        { error: "EMI record not found" },
        { status: 404 },
      );
    }

    if (emi.status === "PAID") {
      return NextResponse.json(
        { error: "EMI already fully paid" },
        { status: 409 },
      );
    }

    const newPaidAmount = emi.paidAmount + amountPaid;
    const isFullyPaid = newPaidAmount >= emi.totalAmount + emi.penaltyAmount;

    const updated = await prisma.emiSchedule.update({
      where: { id },
      data: {
        paidAmount: newPaidAmount,
        paymentRef: paymentRef ?? null,
        status: isFullyPaid ? "PAID" : "PARTIAL",
        paidAt: isFullyPaid ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      status: updated.status,
      message: isFullyPaid ? "EMI fully paid" : "Partial payment recorded",
    });
  } catch (err) {
    console.error("[POST /api/emi/[id]/payment]", err);
    return NextResponse.json(
      { error: "Failed to record payment" },
      { status: 500 },
    );
  }
}
