import { PrismaClient, LoanType, UserRole } from "@prisma/client";
import "dotenv/config"

const prisma = new PrismaClient();

function generateLenderRefId(loanType: string, stateCode: string, seq: number) {
  const codes: Record<string, string> = {
    PERSONAL: "PERS",
    MSME_BUSINESS: "MSME",
    HOME: "HOME",
    VEHICLE: "VEHI",
  };
  return `LDR-${codes[loanType]}-${stateCode}-${String(seq).padStart(4, "0")}`;
}

async function main() {
  console.log("🌱 Seeding database...");

  // Super Admin
  const admin = await prisma.user.upsert({
    where: { phone: "9999999999" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@loanflow.in",
      phone: "9999999999",
      phoneVerified: true,
      role: UserRole.SUPER_ADMIN,
    },
  });
  console.log("✅ Super admin:", admin.id);

  // Lenders
  const lenderData = [
    {
      name: "Bajaj Finance NBFC",
      shortCode: "BAJAJ-FIN",
      loanTypes: [LoanType.PERSONAL, LoanType.MSME_BUSINESS],
      regions: ["MH", "GJ", "RJ"],
      isPanIndia: false,
      minAmount: 50000,
      maxAmount: 2500000,
      minTenureMonths: 12,
      maxTenureMonths: 60,
      interestRateMin: 11.0,
      interestRateMax: 18.0,
      processingFeePercent: 1.5,
      refType: "PERSONAL",
      refState: "MH",
      refSeq: 1,
    },
    {
      name: "HDFC NBFC Capital",
      shortCode: "HDFC-NBFC",
      loanTypes: [LoanType.HOME, LoanType.VEHICLE, LoanType.PERSONAL],
      regions: ["DL", "MH", "KA", "TN"],
      isPanIndia: true,
      minAmount: 100000,
      maxAmount: 10000000,
      minTenureMonths: 12,
      maxTenureMonths: 240,
      interestRateMin: 8.5,
      interestRateMax: 14.0,
      processingFeePercent: 0.5,
      refType: "HOME",
      refState: "DL",
      refSeq: 1,
    },
    {
      name: "Shriram Finance",
      shortCode: "SHRIRAM",
      loanTypes: [LoanType.VEHICLE, LoanType.MSME_BUSINESS],
      regions: ["TN", "AP", "KA", "KL"],
      isPanIndia: false,
      minAmount: 25000,
      maxAmount: 1500000,
      minTenureMonths: 6,
      maxTenureMonths: 48,
      interestRateMin: 12.0,
      interestRateMax: 20.0,
      processingFeePercent: 2.0,
      refType: "VEHICLE",
      refState: "TN",
      refSeq: 1,
    },
  ];

  for (const l of lenderData) {
    const { refType, refState, refSeq, ...rest } = l;
    const referenceId = generateLenderRefId(refType, refState, refSeq);

    await prisma.lender.upsert({
      where: { shortCode: rest.shortCode },
      update: {},
      create: {
        ...rest,
        referenceId,
        grievanceEmail: `grievance@${rest.shortCode.toLowerCase().replace("-", "")}.in`,
        isActive: true,
      },
    });
    console.log(`✅ Lender: ${rest.name} (${referenceId})`);
  }

  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
