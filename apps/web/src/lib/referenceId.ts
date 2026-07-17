import { prisma } from "@loan-crm/db";

export async function generateApplicationNo(
  lenderShortCode: string,
): Promise<string> {
  const year = new Date().getFullYear();

  // Count existing applications for this lender this year
  const count = await prisma.loanApplication.count({
    where: {
      applicationNo: {
        startsWith: `APP-${lenderShortCode.toUpperCase()}-${year}`,
      },
    },
  });

  const seq = String(count + 1).padStart(6, "0");
  return `APP-${lenderShortCode.toUpperCase()}-${year}-${seq}`;
}
