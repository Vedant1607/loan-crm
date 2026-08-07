const SCHEMES = [
  { no: 1,  name: "Cluster Development Program",  amount: "₹50 Crore",  type: "Equity" },
  { no: 2,  name: "CGSS",                          amount: "₹20 Crore",  type: "Loan" },
  { no: 3,  name: "Financial Assistance – SC and OBC", amount: "₹15 Crore", type: "Loan" },
  { no: 4,  name: "CGTMSE",                         amount: "₹10 Crore",  type: "Debt/Equity" },
  { no: 5,  name: "Equity Elevator",                amount: "₹4 Crore",   type: "Equity" },
  { no: 6,  name: "Horizon Fund",                   amount: "₹2 Crore",   type: "Equity" },
  { no: 7,  name: "Impact Edge Grant 2025",         amount: "₹1.5 Crore", type: "Grant" },
  { no: 8,  name: "Seed Support Scheme",            amount: "₹1 Crore",   type: "Debt/Equity" },
  { no: 9,  name: "Seed Fund",                      amount: "₹50 Lakh",   type: "Loan" },
  { no: 10, name: "PMEGP",                          amount: "₹50 Lakh",   type: "Loan" },
  { no: 11, name: "MUDRA",                          amount: "₹20 Lakh",   type: "Loan" },
  { no: 12, name: "Young Innovators Grant",         amount: "₹20 Lakh",   type: "Grant" },
];

const TYPE_STYLES: Record<string, string> = {
  Equity:        "bg-brand-gold/15 text-brand-navy",
  Loan:          "bg-brand-navy/10 text-brand-navy",
  Grant:         "bg-green-100 text-green-800",
  "Debt/Equity": "bg-brand-navy/5 text-brand-navy",
};

export default function FundingSchemesTable() {
  return (
    <section className="bg-brand-cream py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6">
        <div className="max-w-xl mb-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-brand-gold mb-3">
            MSME Funding Schemes
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-brand-navy font-semibold leading-tight">
            Best funding schemes for all businesses
          </h2>
        </div>
        <p className="text-brand-slate text-sm mb-10 max-w-xl">
          Beyond conventional loans, we help eligible MSMEs and startups
          access government and institutional funding schemes — equity,
          grants, and subsidised debt.
        </p>

        <div className="rounded-2xl border border-brand-navy/10 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-navy text-white">
                <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wide w-14">
                  #
                </th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                  Scheme Name
                </th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                  Funding Upto
                </th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                  Funding Type
                </th>
              </tr>
            </thead>
            <tbody>
              {SCHEMES.map((scheme) => {
                return (
                  <tr key={scheme.no} className="border-b border-brand-navy/5 last:border-0">
                    <td className="px-5 py-3 text-brand-slate">{scheme.no}</td>
                    <td className="px-4 py-3 font-medium text-brand-navy">{scheme.name}</td>
                    <td className="px-4 py-3 font-mono-data text-brand-navy">{scheme.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_STYLES[scheme.type]}`}>
                        {scheme.type}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-brand-slate mt-4">
          Funding amounts and eligibility vary by scheme and applicant profile. Contact us to check your eligibility.
        </p>
      </div>
    </section>
  );
}