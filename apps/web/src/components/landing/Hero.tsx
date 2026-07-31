import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroChart from "./HeroChart";

const TRUST_BADGES = [
  { label: "Trusted Expertise" },
  { label: "Tailored Solutions" },
  { label: "Sustainable Growth" },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative bg-brand-cream pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-brand-gold mb-4">
            Financial Advisory &amp; Capital Solutions
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.08] text-brand-navy font-semibold">
            Breaking barriers
            <br />
            in <span className="italic text-brand-gold">financial</span> success
          </h1>
          <p className="mt-6 text-base md:text-lg text-brand-slate max-w-md leading-relaxed">
            Sareen Powerz Ltd connects individuals, MSMEs, and businesses
            across India with the right lending partner — home loans,
            personal loans, and business finance, backed by a network of
            150+ banks and NBFCs.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-brand-gold hover:bg-brand-gold-light text-brand-navy font-semibold"
            >
              <Link href="/login">Request a Loan</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-brand-navy/20 text-brand-navy hover:bg-brand-navy/5"
            >
              <a href="#services">Explore Services</a>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
            {TRUST_BADGES.map((badge) => {
              return (
                <div
                  key={badge.label}
                  className="flex items-center gap-1.5 text-xs font-medium text-brand-slate"
                >
                  <svg
                    width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="var(--color-brand-gold)" strokeWidth="2.5"
                  >
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {badge.label}
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <HeroChart />
        </div>
      </div>
    </section>
  );
}