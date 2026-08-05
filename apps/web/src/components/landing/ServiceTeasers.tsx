import Link from "next/link";

const SERVICES = [
  {
    title: "Home Loans",
    description: "Purchase, construction, or loan against property.",
    href: "/services/home-loan",
  },
  {
    title: "Personal Loans",
    description: "Quick, minimal-documentation finance for your needs.",
    href: "/services/personal-loan",
  },
  {
    title: "Business Loans",
    description: "Working capital and term loans to fuel growth.",
    href: "/services/business-loan",
  },
];

export default function ServiceTeasers() {
  return (
    <section id="services" className="bg-brand-cream py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-gold mb-3">
              Our Services
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-brand-navy font-semibold leading-tight">
              Three ways we put capital to work for you
            </h2>
          </div>
          <Link
            href="/services"
            className="text-sm font-medium text-brand-navy underline underline-offset-4 shrink-0"
          >
            View all services →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {SERVICES.map((service) => {
            return (
              <Link
                key={service.href}
                href={service.href}
                className="group rounded-2xl border border-brand-navy/10 bg-white p-7 hover:border-brand-gold/40 hover:shadow-[0_8px_30px_-12px_rgba(15,34,71,0.15)] transition-all duration-300"
              >
                <h3 className="font-display text-xl text-brand-navy font-semibold mb-2.5">
                  {service.title}
                </h3>
                <p className="text-sm text-brand-slate leading-relaxed mb-4">
                  {service.description}
                </p>
                <span className="text-sm font-medium text-brand-gold group-hover:underline underline-offset-4">
                  Learn more →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}