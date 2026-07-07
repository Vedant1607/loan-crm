import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const session = await auth();

  if (!session) redirect("/login");

  const role = session.user.role;

  if (role === "SUPER_ADMIN") redirect("/admin/dashboard");
  if (role === "LOAN_OFFICER" || role === "LENDER_ADMIN")
    redirect("/lender/dashboard");
  redirect("/apply");
}
