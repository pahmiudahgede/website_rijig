"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, LoginRequest } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { ROLES } from "@/constants/role";
import { LoginForm } from "@/components/login-form";

const LoginPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { login } = useAuthStore();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const loginData: LoginRequest = {
      roleid: ROLES.ADMIN,
      identifier,
      password
    };

    try {
      const response = await loginUser(loginData);
      const { user_id, role_name, token } = response;

      login(user_id, role_name, token);

      router.push("/dashboard");
    } catch (error: any) {
      setErrorMessage(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm
          className="space-y-4"
          onSubmit={handleSubmit}
          identifier={identifier}
          setIdentifier={setIdentifier}
          password={password}
          setPassword={setPassword}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default LoginPage;
