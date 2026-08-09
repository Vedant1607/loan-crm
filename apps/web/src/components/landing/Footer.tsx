import Link from "next/link";
import Image from "next/image";

const QUICK_LINKS = [
  { href: "/",         label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about",    label: "About" },
  { href: "/contact",  label: "Contact" },
];

const LEGAL_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms",          label: "Terms & Conditions" },
];

// TODO: replace "#" with real social profile URLs when available
const SOCIAL_LINKS = [
  { icon: "facebook",  href: "#", label: "Facebook" },
  { icon: "instagram", href: "#", label: "Instagram" },
  { icon: "linkedin",  href: "#", label: "LinkedIn" },
];

function SocialIcon({ type }: { type: string }) {
  const props = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "currentColor" } as const;

  switch (type) {
    case "facebook":
      return (
        <svg {...props}>
          <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14C17.17 2.1 15.9 2 14.55 2 11.73 2 9.75 3.66 9.75 6.7v2.8H6.5v4h3.25V22h4.25V13.5z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...props}>
          <rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="17.2" cy="6.8" r="1.2" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...props}>
          <rect x="2" y="2" width="20" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M7 10v7M7 7v.01M12 17v-4.5a2 2 0 0 1 4 0V17M12 12.5V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <Image
                src="/brand/logo.png"
                alt="Sareen Powerz"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <span className="font-display text-lg font-semibold">
                Sareen Powerz
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm mb-6">
              Financial advisory and capital solutions connecting individuals,
              MSMEs, and businesses across India with the right lending
              partner — backed by a network of 150+ banks and NBFCs.
            </p>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-3">
                Follow Us
              </p>
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map((social) => {
                  return (
                    <a
                      key={social.icon}
                      href={social.href}
                      aria-label={social.label}
                      className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-brand-gold hover:text-brand-navy transition-colors"
                    >
                      <SocialIcon type={social.icon} />
                    </a>
                  );
                })}
              </div>
            </div>
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
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-brand-gold transition-colors"
                    >
                      {link.label}
                    </Link>
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
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 7l10 6 10-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                info@sareenpowerz.com
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
              <li className="flex items-start gap-2 pt-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>
                  Mon – Sat: 9:45 AM – 6:15 PM
                  <br />
                  Sunday: Closed
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Sareen Powerz Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {LEGAL_LINKS.map((link) => {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-white/40 hover:text-brand-gold transition-colors"
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
        <p className="text-xs text-white/30 mt-4">
          Loans are sanctioned solely at the discretion of the partner lender.
        </p>
      </div>
    </footer>
  );
}