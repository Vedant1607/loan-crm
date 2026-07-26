import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@loan-crm/db";
import { z } from "zod";

const updateLenderSchema = z.object({
  isActive: z.boolean().optional(),
  name: z.string().optional(),
  interestRateMin: z.number().optional(),
  interestRateMax: z.number().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await auth();
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateLenderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const lender = await prisma.lender.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, lender });
  } catch (err) {
    console.error("[PATCH /api/admin/lenders/[id]]", err);
    return NextResponse.json(
      { error: "Failed to update lender" },
      { status: 500 }
    );
  }
}
