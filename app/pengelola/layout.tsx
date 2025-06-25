import { AdminLayoutWrapper } from "@/components/dashboardadmin/layout-wrapper";
import ProgressBarProvider from "@/components/ProgressBarProvider";

export default function PengelolaLayout({
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
