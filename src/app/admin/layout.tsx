import type { Metadata } from "next";
import { AdminIdleSessionGuard } from "@/components/admin/AdminIdleSessionGuard";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-app">
      <AdminIdleSessionGuard />
      <div className="admin-shell">{children}</div>
    </div>
  );
}
