"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { LoginRequest } from "@/services/authService";

const Login = () => {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const searchParams = useSearchParams();
  const roleid = searchParams.get("roleid") as string;

  const handleSubmit = async () => {
    if (!identifier || !password) return;

    setLoading(true);
    const loginData: LoginRequest = {
      roleid,
      identifier,
      password
    };

    try {
      await login(loginData);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md space-y-4">
        <h2 className="text-center text-2xl font-semibold">Login</h2>
        <div>
          <label className="block mb-2">Identifier</label>
          <Input
            type="text"
            placeholder="Enter identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-2">Password</label>
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
        </div>
        <Button onClick={handleSubmit} className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </div>
  );
};

export default Login;
