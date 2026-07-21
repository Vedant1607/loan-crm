import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateR2Key, uploadToR2 } from "@/lib/r2";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const documentType = formData.get("documentType") as string | null;
    const applicationId = formData.get("applicationId") as string | null;

    if (!file || !documentType) {
      return NextResponse.json(
        { error: "file and documentType are required" },
        { status: 400 },
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size must be under 5MB" },
        { status: 400 },
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES[file.type]) {
      return NextResponse.json(
        { error: "Only PDF, JPG, PNG, and WEBP files are allowed" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const appId = applicationId ?? "draft";
    const r2Key = generateR2Key(appId, documentType, file.name);

    // In dev with no R2 configured — skip actual upload
    if (!process.env.R2_ACCOUNT_ID) {
      console.log(`[DEV] Skipping R2 upload for key: ${r2Key}`);
      return NextResponse.json({
        r2Key,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        mock: true,
      });
    }

    await uploadToR2(r2Key, buffer, file.type);

    return NextResponse.json({
      r2Key,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    });
  } catch (err) {
    console.error("[document-upload]", err);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 },
    );
  }
}
