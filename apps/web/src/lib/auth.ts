import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@loan-crm/db";
import { z } from "zod";

const phoneSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  otp: z.string().length(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "Phone OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        const parsed = phoneSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { phone, otp } = parsed.data;

        // Find the most recent valid OTP for this phone
        const otpRecord = await prisma.otpRecord.findFirst({
          where: {
            phone,
            verified: false,
            expiresAt: { gt: new Date() },
          },
          orderBy: { createdAt: "desc" },
        });

        if (!otpRecord) return null;

        // In dev (MOCK mode) accept "123456", in prod compare hashed OTP
        const isValid =
          process.env.OTP_PROVIDER === "MOCK"
            ? otp === "123456"
            : otpRecord.otp === otp; // will add bcrypt here later

        if (!isValid) {
          // Increment failed attempts
          await prisma.otpRecord.update({
            where: { id: otpRecord.id },
            data: { attempts: { increment: 1 } },
          });
          return null;
        }

        // Mark OTP as verified
        await prisma.otpRecord.update({
          where: { id: otpRecord.id },
          data: { verified: true },
        });

        // Get or create user
        const user = await prisma.user.upsert({
          where: { phone },
          update: { phoneVerified: true },
          create: {
            phone,
            name: "User",
            phoneVerified: true,
          },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email ?? undefined,
          phone: user.phone,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = (user as any).phone;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.phone = token.phone as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
