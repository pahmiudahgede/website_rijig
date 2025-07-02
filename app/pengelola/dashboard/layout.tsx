import { PengelolaLayoutWrapper } from "@/components/dashboardpengelola/layout-wrapper";
import ProgressBarProvider from "@/components/ProgressBarProvider";

export default function PengelolaLayout({
  children
}: {
  children: React.ReactNode;
}) {
 return (
    <ProgressBarProvider>
      <PengelolaLayoutWrapper>{children}</PengelolaLayoutWrapper>
    </ProgressBarProvider>
  );
}
