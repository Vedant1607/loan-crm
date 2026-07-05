import { prisma } from "@loan-crm/db";
import crypto from "crypto";

// Generates a 6-digit OTP and saves it to DB
export async function generateAndSaveOtp(phone: string): Promise<string> {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Invalidate any previous OTPs for this phone
  await prisma.otpRecord.updateMany({
    where: { phone, verified: false },
    data: { verified: true },
  });

  await prisma.otpRecord.create({
    data: {
      phone,
      otp, // store plain in dev — hash in prod
      purpose: "LOGIN",
      expiresAt,
    },
  });

  return otp;
}

// Send OTP — currently MOCK (logs to console), swap for real provider later
export async function sendOtp(phone: string, otp: string): Promise<void> {
  const provider = process.env.OTP_PROVIDER ?? "MOCK";

  if (provider === "MOCK") {
    console.log(`\n📱 OTP for ${phone}: ${otp}\n`);
    return;
  }

  // TODO: plug in MSG91 or 2Factor here
  throw new Error(`OTP provider ${provider} not yet implemented`);
}
