import Link from "next/link";
import Image from "next/image";

const QUICK_LINKS = [
  { href: "#home",     label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#about",    label: "About" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <Image
                src="/brand/logo.svg"
                alt="Sareen Powerz"
                width={32}
                height={32}
                className="h-8 w-8 object-contain brightness-0 invert"
              />
              <span className="font-display text-lg font-semibold">
                Sareen Powerz
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm">
              Financial advisory and capital solutions connecting individuals,
              MSMEs, and businesses across India with the right lending
              partner — backed by a network of 150+ banks and NBFCs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-4">
              Quick Links
            </p>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => {
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-white/70 hover:text-brand-gold transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
              <li>
                <Link
                  href="/login"
                  className="text-sm text-white/70 hover:text-brand-gold transition-colors"
                >
                  Request a Loan
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-4">
              Customer Support
            </p>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                +91 8881111299
              </li>
              <li className="flex items-start gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>
                  Office No. 410, 4th Floor, DDA Building,
                  <br />
                  Nirman Vihar, New Delhi – 110092
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Sareen Powerz Ltd. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Loans are sanctioned solely at the discretion of the partner lender.
          </p>
        </div>
      </div>
    </footer>
  );
}