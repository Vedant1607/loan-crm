import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@loan-crm/db";
import { z } from "zod";
import type { ApplicationStatus } from "@prisma/client";

const schema = z
  .object({
    action: z.enum(["DISBURSE", "ACTIVATE", "CLOSE", "MARK_NPA", "REACTIVATE"]),
    note:   z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.action === "MARK_NPA" && !data.note?.trim()) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        path:    ["note"],
        message: "A reason is required when marking a loan as NPA",
      });
    }
  });

const TRANSITIONS: Record<
  string,
  { from: ApplicationStatus[]; to: ApplicationStatus }
> = {
  DISBURSE:   { from: ["APPROVED", "CONDITIONALLY_APPROVED"], to: "DISBURSED" },
  ACTIVATE:   { from: ["DISBURSED"],                          to: "ACTIVE" },
  CLOSE:      { from: ["ACTIVE"],                             to: "CLOSED" },
  MARK_NPA:   { from: ["ACTIVE"],                             to: "NPA" },
  REACTIVATE: { from: ["NPA"],                                to: "ACTIVE" },
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const body   = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { action, note } = parsed.data;
    const transition = TRANSITIONS[action];

    const application = await prisma.loanApplication.findUnique({
      where:  { id },
      select: { status: true },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (!transition.from.includes(application.status)) {
      return NextResponse.json(
        { error: `Cannot perform "${action}" from current status "${application.status}"` },
        { status: 409 }
      );
    }

    const updateData: Record<string, unknown> = { status: transition.to };
    if (action === "DISBURSE") updateData.disbursedAt = new Date();
    if (action === "CLOSE")    updateData.closedAt = new Date();
    if (note?.trim())          updateData.lifecycleNote = note.trim();

    const updated = await prisma.loanApplication.update({
      where: { id },
      data:  updateData,
    });

    await prisma.auditLog.create({
      data: {
        userId:   session.user.id,
        action:   `LOAN_${action}`,
        entity:   "LoanApplication",
        entityId: id,
        oldValue: { status: application.status },
        newValue: { status: transition.to },
        metadata: note ? { note } : undefined,
      },
    });

    return NextResponse.json({ success: true, application: updated });
  } catch (err) {
    console.error("[POST /api/applications/[id]/lifecycle]", err);
    return NextResponse.json({ error: "Failed to update loan status" }, { status: 500 });
  }
}