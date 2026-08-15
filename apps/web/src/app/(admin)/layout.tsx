import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "SUPER_ADMIN") redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="fixed inset-y-0 left-0 w-56 bg-slate-950 flex flex-col">
        <div className="h-14 flex items-center px-5 border-b border-slate-800">
          <span className="text-white font-bold text-lg">Sareen Powerz</span>
          <span className="ml-2 text-xs text-amber-400 font-medium">ADMIN</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { href: "/admin/dashboard", icon: "📊", label: "Dashboard" },
            { href: "/admin/lenders", icon: "🏦", label: "Lenders" },
            { href: "/admin/users", icon: "👤", label: "Users" },
            { href: "/admin/inquiries",  icon: "✉️", label: "Inquiries" },
            { href: "/admin/reports", icon: "📈", label: "Reports" },
          ].map((item) => {
            return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-slate-400 truncate">
              {session.user.email ?? session.user.phone}
            </p>
            <p className="text-xs text-amber-400">Super Admin</p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              type="submit"
              className="w-full text-slate-400 hover:text-white hover:bg-slate-800 justify-start"
            >
              Sign out
            </Button>
          </form>
        </div>
      </div>

      <div className="ml-56">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
