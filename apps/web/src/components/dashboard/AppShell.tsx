"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export interface AppShellNavItem {
  href:  string;
  label: string;
  icon:  string;
}

interface AppShellProps {
  portalLabel: string;
  navItems:    AppShellNavItem[];
  userLabel:   string;
  roleLabel:   string;
  children:    React.ReactNode;
}

function NavIcon({ type }: { type: string }) {
  const props = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2 } as const;

  switch (type) {
    case "dashboard":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      );
    case "file":
      return (
        <svg {...props}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinejoin="round" />
          <path d="M14 2v6h6" strokeLinejoin="round" />
        </svg>
      );
    case "users":
      return (
        <svg {...props}>
          <circle cx="9" cy="8" r="3.5" />
          <path d="M2.5 20c0-3.6 3-6.5 6.5-6.5s6.5 2.9 6.5 6.5" strokeLinecap="round" />
          <path d="M16 4.5c1.7.4 3 2 3 3.9 0 1.9-1.3 3.5-3 3.9" />
          <path d="M18.5 13.8c1.9.7 3.3 2.5 3.3 4.6" strokeLinecap="round" />
        </svg>
      );
    case "credit-card":
      return (
        <svg {...props}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
        </svg>
      );
    case "building":
      return (
        <svg {...props}>
          <rect x="4" y="3" width="16" height="18" rx="1" />
          <path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" strokeLinecap="round" />
        </svg>
      );
    case "user":
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" strokeLinecap="round" />
        </svg>
      );
    case "mail":
      return (
        <svg {...props}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 7l10 6 10-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "chart":
      return (
        <svg {...props}>
          <path d="M3 3v18h18" strokeLinecap="round" />
          <path d="M7 15l4-5 3 3 5-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "plus-circle":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8M8 12h8" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

function SidebarContent({
  portalLabel,
  navItems,
  userLabel,
  roleLabel,
  pathname,
  onNavigate,
}: {
  portalLabel: string;
  navItems:    AppShellNavItem[];
  userLabel:   string;
  roleLabel:   string;
  pathname:    string;
  onNavigate?: () => void;
}) {
  const initials = userLabel.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase() || "SP";

  return (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-white/10 shrink-0">
        <Image src="/brand/logo.png" alt="Sareen Powerz" width={30} height={30} className="h-[30px] w-[30px] object-contain" />
        <div>
          <p className="font-display text-sm font-semibold text-white leading-none">Sareen Powerz</p>
          <p className="text-[11px] text-brand-gold mt-1">{portalLabel}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-white/10 text-white font-medium border-l-2 border-brand-gold pl-[10px]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <NavIcon type={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10 shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
          <div className="h-8 w-8 rounded-full bg-brand-gold text-brand-navy flex items-center justify-center text-xs font-semibold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-white truncate">{userLabel}</p>
            <p className="text-[11px] text-white/40">{roleLabel}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ redirectTo: "/login" })}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function AppShell({ portalLabel, navItems, userLabel, roleLabel, children }: AppShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-brand-navy flex-col z-30">
        <SidebarContent
          portalLabel={portalLabel}
          navItems={navItems}
          userLabel={userLabel}
          roleLabel={roleLabel}
          pathname={pathname}
        />
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-14 bg-brand-navy flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <Image src="/brand/logo.png" alt="Sareen Powerz" width={26} height={26} className="h-[26px] w-[26px] object-contain" />
          <span className="font-display text-sm font-semibold text-white">{portalLabel}</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-white"
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-brand-navy">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
              aria-label="Close menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
            <SidebarContent
              portalLabel={portalLabel}
              navItems={navItems}
              userLabel={userLabel}
              roleLabel={roleLabel}
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="lg:ml-64 pt-14 lg:pt-0">
        <div className="p-5 md:p-8">{children}</div>
      </main>
    </div>
  );
}