import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@loan-crm/db";
import { z } from "zod";

const schema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CLOSED"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await auth();
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body   = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const inquiry = await prisma.contactInquiry.update({
      where: { id },
      data:  { status: parsed.data.status },
    });

    return NextResponse.json({ success: true, inquiry });
  } catch (err) {
    console.error("[PATCH /api/admin/inquiries/[id]]", err);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}