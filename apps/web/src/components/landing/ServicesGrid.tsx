const CATEGORIES = [
  {
    icon: "building",
    title: "Business Finance",
    points: ["Working Capital", "Cash Credit / OD", "Term Loans", "Bill Discounting"],
  },
  {
    icon: "home",
    title: "Property Finance",
    points: ["Loan Against Property", "Home Loan", "Commercial Property", "Construction Finance"],
  },
  {
    icon: "crane",
    title: "Project Funding",
    points: ["Infrastructure Projects", "Real Estate Projects", "Industrial Projects", "Project Finance"],
  },
  {
    icon: "rocket",
    title: "MSME & Startup",
    points: ["MSME Loans", "Startup Funding", "Mudra Loans", "Govt. Schemes Support"],
  },
  {
    icon: "gear",
    title: "Equipment Finance",
    points: ["Machinery Loan", "Equipment Financing", "Fleet Financing", "Technology Upgradation"],
  },
  {
    icon: "shield",
    title: "Special Cases",
    points: ["NPA / SMA Cases", "Low CIBIL Cases", "Balance Transfer", "Restructuring Solutions"],
  },
];

function CategoryIcon({ type }: { type: string }) {
  const stroke = "var(--color-brand-navy)";
  const props = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth: 2 } as const;

  switch (type) {
    case "building":
      return (
        <svg {...props}>
          <rect x="4" y="3" width="16" height="18" rx="1" />
          <path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" strokeLinecap="round" />
        </svg>
      );
    case "home":
      return (
        <svg {...props}>
          <path d="M3 11l9-7 9 7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 10v10h14V10" strokeLinejoin="round" />
        </svg>
      );
    case "crane":
      return (
        <svg {...props}>
          <path d="M4 21h9M6 21V8l10-4v6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 10h4l-2 5h-3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="15" cy="18" r="2" />
        </svg>
      );
    case "rocket":
      return (
        <svg {...props}>
          <path d="M12 2c3 2 5 6 5 10-2 1-3 3-3 5H10c0-2-1-4-3-5 0-4 2-8 5-10z" strokeLinejoin="round" />
          <circle cx="12" cy="9" r="1.5" />
          <path d="M8 17l-2 4M16 17l2 4" strokeLinecap="round" />
        </svg>
      );
    case "gear":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" strokeLinecap="round" />
        </svg>
      );
    case "shield":
      return (
        <svg {...props}>
          <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ServicesGrid() {
  return (
    <section className="bg-brand-cream py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-brand-gold mb-3">
            Specialised Solutions
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-brand-navy font-semibold leading-tight">
            Financing for every stage of business
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => {
            return (
              <div
                key={category.title}
                className="bg-white rounded-2xl border border-brand-navy/10 p-6"
              >
                <div className="h-11 w-11 rounded-full bg-brand-navy/5 flex items-center justify-center mb-4">
                  <CategoryIcon type={category.icon} />
                </div>
                <h3 className="font-display text-lg text-brand-navy font-semibold mb-3">
                  {category.title}
                </h3>
                <ul className="space-y-1.5">
                  {category.points.map((point) => {
                    return (
                      <li key={point} className="text-sm text-brand-slate">
                        {point}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}