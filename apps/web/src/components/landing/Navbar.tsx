"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const SERVICE_LINKS = [
  { href: "/services",               label: "All Services" },
  { href: "/services/home-loan",     label: "Home Loan" },
  { href: "/services/personal-loan", label: "Personal Loan" },
  { href: "/services/business-loan", label: "Business Loan" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled]                     = useState(false);
  const [mobileOpen, setMobileOpen]                 = useState(false);
  const [servicesOpen, setServicesOpen]             = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  const isServicesActive = pathname.startsWith("/services");

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-brand-cream/90 backdrop-blur-md border-b border-brand-navy/10 py-3"
          : "bg-brand-cream/60 backdrop-blur-sm py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/brand/logo.png"
            alt="Sareen Powerz"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
            priority
          />
          <span className="font-display text-lg font-semibold text-brand-navy tracking-tight">
            Sareen Powerz
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              pathname === "/" ? "text-brand-navy" : "text-brand-ink/70 hover:text-brand-navy"
            }`}
          >
            Home
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <Link
              href="/services"
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                isServicesActive ? "text-brand-navy" : "text-brand-ink/70 hover:text-brand-navy"
              }`}
            >
              Services
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            {servicesOpen && (
              <div className="absolute top-full left-0 pt-3 w-56">
                <div className="rounded-xl border border-brand-navy/10 bg-white shadow-lg py-2">
                  {SERVICE_LINKS.map((link) => {
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          pathname === link.href
                            ? "text-brand-navy font-medium bg-brand-navy/5"
                            : "text-brand-ink/70 hover:bg-brand-navy/5 hover:text-brand-navy"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/about"
            className={`text-sm font-medium transition-colors ${
              pathname === "/about" ? "text-brand-navy" : "text-brand-ink/70 hover:text-brand-navy"
            }`}
          >
            About
          </Link>

          <Link
            href="/contact"
            className={`text-sm font-medium transition-colors ${
              pathname === "/contact" ? "text-brand-navy" : "text-brand-ink/70 hover:text-brand-navy"
            }`}
          >
            Contact
          </Link>
        </nav>

        <div className="hidden md:block">
          <Button asChild className="bg-brand-gold hover:bg-brand-gold-light text-brand-navy font-semibold">
            <Link href="/login">Request a Loan</Link>
          </Button>
        </div>

        <button
          className="md:hidden p-2 text-brand-navy"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-brand-cream border-t border-brand-navy/10 px-6 py-4 space-y-1">
          <Link href="/" className="block py-2 text-sm font-medium text-brand-ink/80">
            Home
          </Link>

          <button
            className="w-full flex items-center justify-between py-2 text-sm font-medium text-brand-ink/80"
            onClick={() => setMobileServicesOpen((o) => !o)}
          >
            Services
            <svg
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              className={`transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`}
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {mobileServicesOpen && (
            <div className="pl-4 space-y-1 pb-1">
              {SERVICE_LINKS.map((link) => {
                return (
                  <Link key={link.href} href={link.href} className="block py-1.5 text-sm text-brand-ink/70">
                    {link.label}
                  </Link>
                );
              })}
            </div>
          )}

          <Link href="/about" className="block py-2 text-sm font-medium text-brand-ink/80">
            About
          </Link>
          <Link href="/contact" className="block py-2 text-sm font-medium text-brand-ink/80">
            Contact
          </Link>

          <Button asChild className="w-full mt-3 bg-brand-gold text-brand-navy font-semibold">
            <Link href="/login">Request a Loan</Link>
          </Button>
        </div>
      )}
    </header>
  );
}