import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@loan-crm/db";
import { z } from "zod";

const schema = z
  .object({
    status:          z.enum(["VERIFIED", "REJECTED"]),
    rejectionReason: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === "REJECTED" && !data.rejectionReason?.trim()) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        path:    ["rejectionReason"],
        message: "A reason is required when rejecting a document",
      });
    }
  });

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const { id, docId } = await params;

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

    const document = await prisma.loanDocument.findUnique({
      where: { id: docId },
    });

    if (!document || document.applicationId !== id) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const updated = await prisma.loanDocument.update({
      where: { id: docId },
      data: {
        status:          parsed.data.status,
        rejectionReason: parsed.data.status === "REJECTED" ? parsed.data.rejectionReason : null,
        verifiedAt:      parsed.data.status === "VERIFIED" ? new Date() : null,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId:   session.user.id,
        action:   parsed.data.status === "VERIFIED" ? "DOCUMENT_VERIFIED" : "DOCUMENT_REJECTED",
        entity:   "LoanDocument",
        entityId: docId,
        metadata: {
          applicationId: id,
          documentType:  document.type,
          rejectionReason: parsed.data.rejectionReason ?? null,
        },
      },
    });

    return NextResponse.json({ success: true, document: updated });
  } catch (err) {
    console.error("[PATCH /api/applications/[id]/documents/[docId]]", err);
    return NextResponse.json({ error: "Failed to update document status" }, { status: 500 });
  }
}