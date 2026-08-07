import LoanProductTemplate from "@/components/landing/LoanProductTemplate";

export default function HomeLoanPage() {
  return (
    <LoanProductTemplate
      calculator={{
        minAmount: 500000,
        maxAmount: 10000000,
        defaultAmount: 3500000,
        minTenure: 12,
        maxTenure: 240,
        defaultTenure: 180,
        minRate: 8.5,
        maxRate: 10.5,
        defaultRate: 8.5,
      }}
      eyebrow="Home Loan"
      title="Own your home with the right financing"
      description="Purchase, construction, or loan against property — matched to the lending partner offering you the best terms."
      rateBadge="Starting at 8.5% p.a."
      highlights={["Loans up to ₹1 Crore+", "Tenure up to 20 years", "High Loan-to-Value Ratio"]}
      features={[
        { title: "Competitive Interest Rates", description: "Rates sourced from multiple banks and NBFCs, compared for you." },
        { title: "High Loan-to-Value Ratio", description: "Finance up to 80-90% of the property value." },
        { title: "Flexible Repayment Tenure", description: "Choose a tenure that fits your monthly budget, up to 20 years." },
        { title: "Balance Transfer Option", description: "Move your existing home loan to a lower interest rate." },
      ]}
      eligibility={[
        "Indian resident aged 21–65 years",
        "Stable income source (salaried or self-employed)",
        "Credit score of 700 or above",
        "Property with clear and marketable title",
      ]}
      documents={[
        "PAN Card & Aadhaar Card",
        "Bank statements (last 6 months)",
        "Income Tax Returns (last 2 years)",
        "Salary slips (last 3 months, if salaried)",
        "Property documents",
        "Passport-size photograph",
      ]}
    />
  );
}