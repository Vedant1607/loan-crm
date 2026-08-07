import Link from "next/link";

const PRIMARY_SERVICES = [
  {
    title: "Home Loans",
    description:
      "Purchase, construction, or loan against property — competitive rates from our banking partners across India.",
    points: ["Home Purchase & Construction", "Loan Against Property", "Balance Transfer & Top-up"],
    href: "/services/home-loan",
  },
  {
    title: "Personal Loans",
    description:
      "Quick, minimal-documentation personal finance for life's immediate needs — approved fast, disbursed faster.",
    points: ["Minimal Documentation", "Fast Approval", "Flexible Tenure"],
    href: "/services/personal-loan",
  },
  {
    title: "Business Loans",
    description:
      "Working capital, term loans, and cash credit to fuel your business — structured around your cash flow.",
    points: ["Working Capital & OD", "Term Loans", "Bill Discounting"],
    href: "/services/business-loan",
  },
];

export default function ServicesPrimary() {
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-brand-gold mb-3">
            Primary Loan Products
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-brand-navy font-semibold leading-tight">
            Our most requested financing options
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PRIMARY_SERVICES.map((service) => {
            return (
              <Link
                key={service.href}
                href={service.href}
                className="group rounded-2xl border border-brand-navy/10 p-7 hover:border-brand-gold/40 hover:shadow-[0_8px_30px_-12px_rgba(15,34,71,0.15)] transition-all duration-300 bg-brand-cream/40"
              >
                <h3 className="font-display text-xl text-brand-navy font-semibold mb-2.5">
                  {service.title}
                </h3>
                <p className="text-sm text-brand-slate leading-relaxed mb-5">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-5">
                  {service.points.map((point) => {
                    return (
                      <li key={point} className="flex items-start gap-2 text-sm text-brand-ink/80">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-gold)" strokeWidth="2.5" className="mt-0.5 shrink-0">
                          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {point}
                      </li>
                    );
                  })}
                </ul>
                <span className="text-sm font-medium text-brand-gold group-hover:underline underline-offset-4">
                  View details →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}