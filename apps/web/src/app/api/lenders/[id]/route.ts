import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@loan-crm/db";
import { z } from "zod";

interface Params {
  params: Promise<{ id: string }>;
}

const patchSchema = z.object({
  isActive: z.boolean(),
});

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const lender = await prisma.lender.findUnique({ where: { id } });
  if (!lender) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ lender });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const session = await auth();
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = patchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 },
      );
    }

    const lender = await prisma.lender.update({
      where: { id },
      data: { isActive: parsed.data.isActive },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: parsed.data.isActive
          ? "LENDER_ACTIVATED"
          : "LENDER_DEACTIVATED",
        entity: "Lender",
        entityId: id,
        newValue: { isActive: parsed.data.isActive },
      },
    });

    return NextResponse.json({ success: true, lender });
  } catch (err) {
    console.error("[PATCH /api/lenders/[id]]", err);
    return NextResponse.json(
      { error: "Failed to update lender" },
      { status: 500 },
    );
  }
}
