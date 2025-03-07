"use client"; // Menandakan ini adalah file client-side

import { useAuthStore } from "@/store/authStore"; 
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Hook untuk mengecek apakah pengguna terautentikasi
export const useAuthGuard = () => {
  const { isAuthenticated } = useAuthStore(); // Ambil status autentikasi dari store
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login"); // Jika tidak terautentikasi, alihkan ke halaman login
    }
  }, [isAuthenticated, router]);

  return isAuthenticated; // Kembalikan status autentikasi
};
