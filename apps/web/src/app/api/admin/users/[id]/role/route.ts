import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@loan-crm/db";
import { z } from "zod";

const schema = z.object({
  role: z.enum(["APPLICANT", "LOAN_OFFICER", "LENDER_ADMIN", "SUPER_ADMIN"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

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

    const user = await prisma.user.update({
      where: { id },
      data: { role: parsed.data.role },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "USER_ROLE_CHANGED",
        entity: "User",
        entityId: id,
        newValue: { role: parsed.data.role },
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error("[PATCH /api/admin/users/[id]/role]", err);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 },
    );
  }
}
