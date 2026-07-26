import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, DocumentType } from "@loan-crm/db";
import { put } from "@vercel/blob";

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
    const docType = formData.get("docType") as DocumentType;

    if (!file || !docType) {
      return NextResponse.json(
        { error: "File and docType are required" },
        { status: 400 },
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Max 5MB." },
        { status: 400 },
      );
    }

    const ext = file.name.split(".").pop();
    const blobPath = `applications/${id}/${docType}-${Date.now()}.${ext}`;

    // Upload to Vercel Blob — returns a public HTTPS URL
    const blob = await put(blobPath, file, {
      access: "public",
    });

    // Remove any previous document of the same type for this application
    await prisma.loanDocument.deleteMany({
      where: { applicationId: id, type: docType },
    });

    const doc = await prisma.loanDocument.create({
      data: {
        applicationId: id,
        type: docType,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        r2Key: blob.url, // storing the full blob URL here
        status: "UPLOADED",
      },
    });

    return NextResponse.json({
      success: true,
      documentId: doc.id,
      url: blob.url,
    });
  } catch (err) {
    console.error("[POST /api/applications/[id]/documents]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
