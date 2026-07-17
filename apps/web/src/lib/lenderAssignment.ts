import { prisma } from "@loan-crm/db";
import type { LoanType } from "@loan-crm/shared";

export async function assignLender(
  loanType: LoanType,
  stateCode: string,
  amountRequested: number,
): Promise<string> {
  // Find all active lenders that match loan type, region, and amount range
  const lenders = await prisma.lender.findMany({
    where: {
      isActive: true,
      loanTypes: { has: loanType },
      minAmount: { lte: amountRequested },
      maxAmount: { gte: amountRequested },
      OR: [{ isPanIndia: true }, { regions: { has: stateCode } }],
    },
    include: {
      _count: {
        select: {
          // Count active (non-closed) applications to measure load
          applications: {
            where: {
              status: {
                notIn: ["REJECTED", "CLOSED", "DRAFT"],
              },
            },
          },
        },
      },
    },
  });

  if (lenders.length === 0) {
    throw new Error(
      `No lender available for ${loanType} loan of ₹${amountRequested} in ${stateCode}`,
    );
  }

  // Pick the lender with the lowest current application load
  const sorted = lenders.sort(
    (a, b) => a._count.applications - b._count.applications,
  );

  return sorted[0].id;
}
