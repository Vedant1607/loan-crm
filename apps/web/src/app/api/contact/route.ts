import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@loan-crm/db";
import { z } from "zod";

const schema = z.object({
  name:     z.string().min(2, "Name is required"),
  email:    z.string().email("Enter a valid email"),
  phone:    z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  loanType: z.enum(["PERSONAL", "MSME_BUSINESS", "HOME", "VEHICLE"]).optional(),
  message:  z.string().min(10, "Please share a few more details"),
});

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const inquiry = await prisma.contactInquiry.create({
      data: parsed.data,
    });

    return NextResponse.json({ success: true, id: inquiry.id });
  } catch (err) {
    console.error("[POST /api/contact]", err);
    return NextResponse.json(
      { error: "Failed to submit inquiry. Please try again." },
      { status: 500 }
    );
  }
}