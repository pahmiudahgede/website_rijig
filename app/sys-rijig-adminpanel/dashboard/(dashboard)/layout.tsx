import { AdminLayoutWrapper } from "@/components/dashboard/layout-wrapper";
import ProgressBarProvider from "@/components/ProgressBarProvider";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
 return (
    <ProgressBarProvider>
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </ProgressBarProvider>
  );
}
