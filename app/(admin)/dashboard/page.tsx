// "use client";

// import { useAuthStore } from "@/store/authStore";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// const Dashboard = () => {
//   const { role, isAuthenticated, logout } = useAuthStore();
//   const router = useRouter();

//   useEffect(() => {
//     if (!isAuthenticated) {
//       router.push("/login");
//     }
//   }, [isAuthenticated, router]);

//   const handleLogout = () => {
//     logout();
//     router.push("/");
//   };

//   if (!isAuthenticated) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <div className="text-center space-y-4">
//         <h1 className="text-2xl font-semibold">
//           Welcome, {role === "admin" ? "Administrator" : "Pengelola"}
//         </h1>
//         <Button onClick={handleLogout} className="w-full mt-4">
//           Logout
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}