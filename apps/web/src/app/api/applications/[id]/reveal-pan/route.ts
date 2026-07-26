import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@loan-crm/db";
import { decrypt } from "@/lib/encryption";

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

    const application = await prisma.loanApplication.findUnique({
      where: { id },
      select: { panEncrypted: true },
    });

    if (!application) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const pan = decrypt(application.panEncrypted);

    // Audit log every PAN reveal — required for compliance traceability
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "PAN_REVEALED",
        entity: "LoanApplication",
        entityId: id,
        metadata: { revealedAt: new Date().toISOString() },
      },
    });

    return NextResponse.json({ pan });
  } catch (err) {
    console.error("[POST /api/applications/[id]/reveal-pan]", err);
    return NextResponse.json(
      { error: "Failed to decrypt PAN" },
      { status: 500 },
    );
  }
}
