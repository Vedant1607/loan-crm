const BENEFITS = [
  { title: "Easy Onboarding",       icon: "handshake" },
  { title: "Multiple Products",     icon: "grid" },
  { title: "Fast Approvals",        icon: "check-circle" },
  { title: "Secure Data",           icon: "shield" },
  { title: "Transparent Advisory",  icon: "eye" },
  { title: "Pan India Reach",       icon: "map" },
];

function BenefitIcon({ type }: { type: string }) {
  const stroke = "var(--color-brand-gold)";
  const props = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth: 2 } as const;

  switch (type) {
    case "handshake":
      return (
        <svg {...props}>
          <path d="M8.5 14.5l-3-3 4-4a2.5 2.5 0 0 1 3.5 0l1 1 1-1a2.5 2.5 0 0 1 3.5 0l3 3-4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "grid":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "check-circle":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8.5 12.5l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "shield":
      return (
        <svg {...props}>
          <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" strokeLinejoin="round" />
        </svg>
      );
    case "eye":
      return (
        <svg {...props}>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "map":
      return (
        <svg {...props}>
          <path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z" strokeLinejoin="round" />
          <path d="M9 4v14M15 6v14" />
        </svg>
      );
    default:
      return null;
  }
}

export default function TrustGrid() {
  return (
    <section className="bg-brand-cream py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-brand-gold mb-3">
            Why Customers Trust Us
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-brand-navy font-semibold leading-tight">
            Built for a smooth borrowing experience
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {BENEFITS.map((benefit) => {
            return (
              <div
                key={benefit.title}
                className="flex items-center gap-3 bg-white rounded-xl border border-brand-navy/10 px-5 py-4"
              >
                <div className="h-10 w-10 rounded-full bg-brand-navy/5 flex items-center justify-center shrink-0">
                  <BenefitIcon type={benefit.icon} />
                </div>
                <p className="text-sm font-medium text-brand-navy">
                  {benefit.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}