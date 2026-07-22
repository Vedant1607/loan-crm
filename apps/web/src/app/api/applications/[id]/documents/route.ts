import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, DocumentType } from "@loan-crm/db";

// Temporary local storage for dev — we'll swap for R2 in a later step
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

    const application = await prisma.loanApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    if (application.applicantId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const docType = formData.get("docType") as string;

    if (!file || !docType) {
      return NextResponse.json(
        { error: "File and docType are required" },
        { status: 400 },
      );
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Max 5MB." },
        { status: 400 },
      );
    }

    // Save locally in dev (uploads/applicationId/docType.ext)
    const ext = file.name.split(".").pop();
    const r2Key = `uploads/${id}/${docType}.${ext}`;
    const localDir = path.join(process.cwd(), "public", "uploads", id);

    await mkdir(localDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path.join(localDir, `${docType}.${ext}`), buffer);

    // Save document record in DB
    const doc = await prisma.loanDocument.create({
      data: {
        applicationId: id,
        type: docType as DocumentType,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        r2Key,
        status: "UPLOADED",
      },
    });

    return NextResponse.json({ success: true, documentId: doc.id });
  } catch (err) {
    console.error("[POST /api/applications/[id]/documents]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
