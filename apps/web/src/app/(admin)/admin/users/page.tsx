import { prisma } from "@loan-crm/db";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import ChangeUserRoleButton from "@/components/dashboard/ChangeUserRoleButton";

const ROLE_STYLES: Record<string, string> = {
  APPLICANT: "bg-slate-100 text-slate-600",
  LOAN_OFFICER: "bg-blue-100 text-blue-700",
  LENDER_ADMIN: "bg-indigo-100 text-indigo-700",
  SUPER_ADMIN: "bg-amber-100 text-amber-700",
};

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: {
      lenderProfile: { include: { lender: { select: { name: true } } } },
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {users.length} registered users on the platform
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-400 uppercase">
                  Name
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">
                  Phone
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">
                  Role
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">
                  Lender
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">
                  Applications
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">
                  Joined
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-50 hover:bg-slate-50"
                >
                  <td className="px-5 py-3 font-medium text-slate-800">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{user.phone}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_STYLES[user.role]}`}
                    >
                      {user.role.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs">
                    {user.lenderProfile?.lender.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {user._count.applications}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {format(new Date(user.createdAt), "dd MMM yyyy")}
                  </td>
                  <td className="px-4 py-3">
                    <ChangeUserRoleButton
                      userId={user.id}
                      currentRole={user.role}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
