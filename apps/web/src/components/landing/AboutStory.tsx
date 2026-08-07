const WHY_CHOOSE_US = [
  {
    title: "Lowest Interest Rates",
    description: "Competitive rates sourced from leading banks and NBFCs.",
  },
  {
    title: "Fast & Easy Processing",
    description: "Quick turnaround with minimal documentation.",
  },
  {
    title: "Pan India Presence",
    description: "Serving clients across the length and breadth of India.",
  },
  {
    title: "150+ Lending Partners",
    description: "A strong network of banks, NBFCs, and financial institutions.",
  },
  {
    title: "Dedicated Relationship Manager",
    description: "Personalized guidance at every step of your journey.",
  },
  {
    title: "Transparent Advisory",
    description: "Honest advice and transparent dealings you can rely on.",
  },
];

export default function AboutStory() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-14 items-start">
          {/* Left — Story */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-gold mb-3">
              Our Story
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-brand-navy font-semibold leading-tight mb-6">
              Financial Advisory &amp; Capital Solutions
            </h2>
            <p className="text-brand-slate leading-relaxed mb-4">
              Sareen Powerz Ltd is a financial advisory and capital solutions
              firm helping individuals, MSMEs, and businesses across India
              access the right financing — from business finance and property
              finance to project funding and specialised restructuring for
              low-CIBIL and NPA/SMA cases.
            </p>
            <p className="text-brand-slate leading-relaxed mb-8">
              Every application is matched to the lending partner best suited
              to it, and guided by a dedicated relationship manager from
              submission to disbursal — built on trusted expertise, tailored
              solutions, and sustainable growth.
            </p>

            {/* Leadership / Contact card */}
            <div className="rounded-2xl border border-brand-navy/10 bg-brand-cream/60 p-6">
              <p className="text-xs font-semibold tracking-widest uppercase text-brand-slate mb-4">
                Leadership
              </p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-brand-navy font-semibold">Rohin Agarwal</p>
                  <p className="text-brand-slate">Director</p>
                </div>
                <div className="flex items-center gap-2 text-brand-ink/80">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-gold)" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  +91 8881111299
                </div>
                <div className="flex items-start gap-2 text-brand-ink/80">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-gold)" strokeWidth="2" className="mt-0.5 shrink-0">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Office No. 410, 4th Floor, DDA Building, Nirman Vihar, New Delhi – 110092
                </div>
              </div>
            </div>
          </div>

          {/* Right — Why Choose Us */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-gold mb-3">
              Why Choose Us
            </p>
            <div className="space-y-5">
              {WHY_CHOOSE_US.map((item) => {
                return (
                  <div key={item.title} className="flex gap-4">
                    <div className="mt-0.5 h-8 w-8 rounded-full bg-brand-navy/5 border border-brand-navy/10 flex items-center justify-center shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-navy)" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-brand-navy font-semibold text-sm mb-0.5">
                        {item.title}
                      </p>
                      <p className="text-brand-slate text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}