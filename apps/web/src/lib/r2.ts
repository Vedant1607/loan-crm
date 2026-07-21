import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// R2 is S3-compatible so we use the AWS S3 client
export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// Generate a unique R2 key for a document
export function generateR2Key(
  applicationId: string,
  documentType: string,
  fileName: string,
): string {
  const ext = fileName.split(".").pop();
  const timestamp = Date.now();
  return `applications/${applicationId}/${documentType}_${timestamp}.${ext}`;
}

// Upload a file buffer directly to R2
export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<string> {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
  return key;
}

// Generate a short-lived signed URL to view a private document
export async function getSignedDocumentUrl(key: string): Promise<string> {
  // In dev with no R2 configured, return a placeholder
  if (!process.env.R2_ACCOUNT_ID) {
    return `/api/documents/mock?key=${key}`;
  }

  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
  });

  // URL valid for 15 minutes
  return getSignedUrl(r2Client, command, { expiresIn: 900 });
}
