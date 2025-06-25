// import LandingLayout from "./(landingpage)/layout";
// import LandingContent from "./(landingpage)/page";

// export default function HomePage() {
//   return (
//     <LandingLayout>
//       <LandingContent />
//     </LandingLayout>
//   );
// }

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuthStore } from "@/store/authStore";
import LandingPage from "./(landingpage)/page";
import LandingPageLayout from "./(landingpage)/layout";

export default function RootPage() {
  // const router = useRouter();
  // const { isAuthenticated, isRegistrationComplete, userRole } = useAuth();
  // const { isInitialized } = useAuthStore();

  // useEffect(() => {
  //   if (!isInitialized) return;

  //   // If user is authenticated and registration is complete, redirect to dashboard
  //   if (isAuthenticated && isRegistrationComplete) {
  //     const dashboardPath =
  //       userRole === "administrator"
  //         ? "/sys-rijig-adminpanel/dashboard"
  //         : "/pengelola/dashboard";
  //     router.replace(dashboardPath);
  //     return;
  //   }

  //   // Otherwise, redirect to landing page
  //   router.replace("/");
  // }, [
  //   isAuthenticated,
  //   isRegistrationComplete,
  //   userRole,
  //   isInitialized,
  //   router
  // ]);

  // Show loading while redirecting
  return (
    <LandingPageLayout>
      <LandingPage />
    </LandingPageLayout>
    // <div className="min-h-screen flex items-center justify-center bg-gray-50">
    //   <div className="text-center">
    //     <LoadingSpinner size="lg" />
    //     <p className="mt-4 text-gray-600">Loading...</p>
    //   </div>
    // </div>
  );
}
