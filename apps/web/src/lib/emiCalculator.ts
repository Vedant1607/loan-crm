interface EmiInstallment {
  installmentNo: number;
  dueDate: Date;
  principalAmount: number;
  interestAmount: number;
  totalAmount: number;
}

export function calculateEmiSchedule(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  startDate: Date = new Date(),
): EmiInstallment[] {
  const monthlyRate = annualRate / 100 / 12;

  // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const emi =
    monthlyRate === 0
      ? principal / tenureMonths
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  const schedule: EmiInstallment[] = [];
  let balance = principal;

  for (let i = 1; i <= tenureMonths; i++) {
    const interestAmount = parseFloat((balance * monthlyRate).toFixed(2));
    const principalAmount = parseFloat((emi - interestAmount).toFixed(2));
    balance = parseFloat((balance - principalAmount).toFixed(2));

    // Due date is 1st of each subsequent month
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);
    dueDate.setDate(1);

    schedule.push({
      installmentNo: i,
      dueDate,
      principalAmount: Math.max(0, principalAmount),
      interestAmount,
      totalAmount: parseFloat(emi.toFixed(2)),
    });
  }

  return schedule;
}
