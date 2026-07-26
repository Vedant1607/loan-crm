import { auth } from "@/lib/auth";
import { prisma } from "@loan-crm/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import type { LoanApplication, User } from "@prisma/client";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

type ApplicationWithRelations = LoanApplication & {
  applicant: User;
  lender: { name: string };
};

type ClientEntry = {
  applicant: User;
  applications: ApplicationWithRelations[];
  totalBorrowed: number;
  activeLoans: number;
};

const ACTIVE_STATUSES = ["APPROVED", "CONDITIONALLY_APPROVED", "DISBURSED", "ACTIVE"];

export default async function ClientsPage({ searchParams }: Props) {
  const { q } = await searchParams;

  const session = await auth();
  if (!session) redirect("/login");

  const officerProfile = await prisma.lenderOfficer.findUnique({
    where: { userId: session.user.id },
  });

  const appWhere =
    session.user.role === "SUPER_ADMIN"
      ? {}
      : officerProfile
      ? { lenderId: officerProfile.lenderId }
      : { officerId: session.user.id };

  const applications: ApplicationWithRelations[] = await prisma.loanApplication.findMany({
    where: appWhere,
    include: {
      applicant: true,
      lender:    { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const clientMap = new Map<string, ClientEntry>();

  for (const app of applications) {
    const isActive = ACTIVE_STATUSES.includes(app.status);
    const existing = clientMap.get(app.applicantId);

    if (existing) {
      existing.applications.push(app);
      if (isActive) {
        existing.totalBorrowed += app.sanctionedAmount ?? app.loanAmount;
        existing.activeLoans += 1;
      }
    } else {
      clientMap.set(app.applicantId, {
        applicant:     app.applicant,
        applications:  [app],
        totalBorrowed: isActive ? (app.sanctionedAmount ?? app.loanAmount) : 0,
        activeLoans:   isActive ? 1 : 0,
      });
    }
  }

  let clients = Array.from(clientMap.values());

  if (q) {
    const query = q.toLowerCase();
    clients = clients.filter(
      (c) =>
        c.applicant.name.toLowerCase().includes(query) ||
        c.applicant.phone.includes(query)
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {clients.length} borrower{clients.length !== 1 && "s"} with applications
        </p>
      </div>

      <form className="flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by name or phone number"
          className="border border-slate-200 rounded-md px-3 py-1.5 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
        <button
          type="submit"
          className="bg-slate-900 text-white text-sm px-4 py-1.5 rounded-md hover:bg-slate-700 transition-colors"
        >
          Search
        </button>
        {q && (
          <Link
            href="/lender/clients"
            className="text-sm text-slate-500 underline underline-offset-2 self-center"
          >
            Clear
          </Link>
        )}
      </form>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-400 uppercase">Borrower</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">Phone</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">Applications</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">Active Loans</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">Amount Borrowed</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">Since</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-slate-400 py-12">
                    No clients found
                  </td>
                </tr>
              ) : (
                clients.map((client) => {
                  const firstApp = client.applications[client.applications.length - 1];
                  return (
                    <tr key={client.applicant.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-5 py-3">
                        <p className="font-medium text-slate-900">{client.applicant.name}</p>
                        {client.applicant.city && (
                          <p className="text-xs text-slate-400">
                            {client.applicant.city}, {client.applicant.state}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{client.applicant.phone}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {client.applications.slice(0, 3).map((a) => (
                            <Link
                              key={a.id}
                              href={`/lender/applications/${a.id}`}
                              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded transition-colors"
                            >
                              {a.applicationNo}
                            </Link>
                          ))}
                          {client.applications.length > 3 && (
                            <span className="text-xs text-slate-400">
                              +{client.applications.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {client.activeLoans > 0 ? (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">
                            {client.activeLoans} active
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">None</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {client.totalBorrowed > 0
                          ? `₹${client.totalBorrowed.toLocaleString("en-IN")}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {format(new Date(firstApp.createdAt), "dd MMM yyyy")}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}