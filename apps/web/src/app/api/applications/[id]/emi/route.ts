import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@loan-crm/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const application = await prisma.loanApplication.findUnique({
      where: { id: params.id },
      select: { applicantId: true, lenderId: true },
    });

    if (!application) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Applicant can only see their own EMIs
    if (
      session.user.role === "APPLICANT" &&
      application.applicantId !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const schedule = await prisma.emiSchedule.findMany({
      where: { applicationId: params.id },
      orderBy: { installmentNo: "asc" },
    });

    // Auto-mark overdue EMIs
    const now = new Date();
    const updates = schedule
      .filter((e) => e.status === "UPCOMING" && new Date(e.dueDate) < now)
      .map((e) =>
        prisma.emiSchedule.update({
          where: { id: e.id },
          data: { status: "OVERDUE" },
        }),
      );

    if (updates.length > 0) await prisma.$transaction(updates);

    // Re-fetch after status updates
    const updated = await prisma.emiSchedule.findMany({
      where: { applicationId: params.id },
      orderBy: { installmentNo: "asc" },
    });

    const totalAmount = updated.reduce((s, e) => s + e.totalAmount, 0);
    const totalPaid = updated.reduce((s, e) => s + e.paidAmount, 0);
    const totalPending = totalAmount - totalPaid;
    const overdueCount = updated.filter((e) => e.status === "OVERDUE").length;
    const paidCount = updated.filter((e) => e.status === "PAID").length;

    return NextResponse.json({
      schedule: updated,
      summary: {
        totalInstallments: updated.length,
        paidCount,
        overdueCount,
        totalAmount,
        totalPaid,
        totalPending,
      },
    });
  } catch (err) {
    console.error("[GET /api/applications/[id]/emi]", err);
    return NextResponse.json(
      { error: "Failed to fetch EMI schedule" },
      { status: 500 },
    );
  }
}
