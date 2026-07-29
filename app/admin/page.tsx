import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/admin-session";

export default async function AdminRootPage() {
  const admin = await getAdminSession();
  redirect(admin ? "/admin/dashboard" : "/admin/login");
}
