const INFO_ITEMS = [
  {
    icon: "phone",
    label: "Phone",
    value: "+91 8881111299",
  },
  {
    icon: "mail",
    label: "Email",
    value: "info@sareenpowerz.com",
  },
  {
    icon: "map",
    label: "Office Address",
    value: "Office No. 410, 4th Floor, DDA Building, Nirman Vihar, New Delhi – 110092",
  },
  {
    icon: "clock",
    label: "Working Hours",
    value: "Mon – Sat: 9:45 AM – 6:15 PM · Sunday: Closed",
  },
];

function InfoIcon({ type }: { type: string }) {
  const stroke = "var(--color-brand-gold)";
  const props = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth: 2 } as const;

  switch (type) {
    case "phone":
      return (
        <svg {...props}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case "mail":
      return (
        <svg {...props}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 7l10 6 10-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "map":
      return (
        <svg {...props}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "clock":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ContactInfo() {
  return (
    <div className="space-y-5">
      {INFO_ITEMS.map((item) => {
        return (
          <div key={item.label} className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-brand-navy/5 flex items-center justify-center shrink-0">
              <InfoIcon type={item.icon} />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide uppercase text-brand-slate mb-0.5">
                {item.label}
              </p>
              <p className="text-sm text-brand-navy font-medium">{item.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}