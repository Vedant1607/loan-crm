import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@loan-crm/db";
import { calculateEmiSchedule } from "@/lib/emiCalculator";
import { z } from "zod";

const schema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  sanctionedAmount: z.number().optional(),
  sanctionedRate: z.number().optional(),
  sanctionedTenure: z.number().optional(),
  notes: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only officers and admins can make decisions
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

    const {
      action,
      sanctionedAmount,
      sanctionedRate,
      sanctionedTenure,
      notes,
    } = parsed.data;

    // Fetch application
    const application = await prisma.loanApplication.findUnique({
      where: { id: params.id },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    // Guard — don't allow re-decision
    const alreadyDecided = [
      "APPROVED",
      "CONDITIONALLY_APPROVED",
      "REJECTED",
      "DISBURSED",
      "ACTIVE",
      "CLOSED",
    ].includes(application.status);

    if (alreadyDecided) {
      return NextResponse.json(
        { error: "Decision already recorded for this application" },
        { status: 409 },
      );
    }

    if (action === "APPROVE") {
      if (!sanctionedAmount || !sanctionedRate || !sanctionedTenure) {
        return NextResponse.json(
          {
            error:
              "sanctionedAmount, sanctionedRate and sanctionedTenure are required for approval",
          },
          { status: 400 },
        );
      }

      // Generate EMI schedule
      const schedule = calculateEmiSchedule(
        sanctionedAmount,
        sanctionedRate,
        sanctionedTenure,
      );

      // Update application + create EMI schedule in a transaction
      await prisma.$transaction([
        prisma.loanApplication.update({
          where: { id: params.id },
          data: {
            status: "APPROVED",
            sanctionedAmount,
            sanctionedRate,
            sanctionedTenure,
            officerNotes: notes,
            officerId: session.user.id,
            decisionAt: new Date(),
          },
        }),
        prisma.emiSchedule.createMany({
          data: schedule.map((inst) => ({
            applicationId: params.id,
            installmentNo: inst.installmentNo,
            dueDate: inst.dueDate,
            principalAmount: inst.principalAmount,
            interestAmount: inst.interestAmount,
            totalAmount: inst.totalAmount,
            status: "UPCOMING",
          })),
        }),
        prisma.auditLog.create({
          data: {
            userId: session.user.id,
            action: "LOAN_APPROVED",
            entity: "LoanApplication",
            entityId: params.id,
            newValue: {
              sanctionedAmount,
              sanctionedRate,
              sanctionedTenure,
            },
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        message: "Loan approved and EMI schedule generated",
        emiCount: schedule.length,
      });
    }

    // REJECT
    await prisma.$transaction([
      prisma.loanApplication.update({
        where: { id: params.id },
        data: {
          status: "REJECTED",
          rejectionReason: notes,
          officerId: session.user.id,
          decisionAt: new Date(),
        },
      }),
      prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "LOAN_REJECTED",
          entity: "LoanApplication",
          entityId: params.id,
          newValue: { rejectionReason: notes },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Application rejected",
    });
  } catch (err) {
    console.error("[POST /api/applications/[id]/decision]", err);
    return NextResponse.json(
      { error: "Failed to process decision" },
      { status: 500 },
    );
  }
}
