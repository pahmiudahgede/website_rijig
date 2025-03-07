import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  identifier: string;
  setIdentifier: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  onSubmit: (event: React.FormEvent) => void;
  className?: string;
}

export function LoginForm({
  identifier,
  setIdentifier,
  password,
  setPassword,
  loading,
  onSubmit,
  className
}: LoginFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={onSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Halo Warga!</h1>
                <p className="text-muted-foreground text-balance">
                  Login dulu sebelum mengakses aplikasi
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="identifier">Email or Username or Phone</Label>
                <Input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="m@example.com"
                  required
                  aria-label="Email, username, or phone"
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {/* <a
                    href="#"
                    className="text-sm underline-offset-2 hover:underline"
                    aria-label="Forgot password"
                  >
                    Lupa password?
                  </a> */}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-label="Password"
                />
              </div>
              <Button type="submit" className="w-full mt-8" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              <div className="text-center text-sm">
                Belum memiliki akun?{" "}
                <a
                  href="#"
                  className="underline underline-offset-4"
                  aria-label="Sign up"
                >
                  Daftar
                </a>
              </div>
            </div>
          </form>
          {/* Bagian gambar hanya akan muncul pada layar besar */}
          <div className="bg-muted relative hidden md:block">
            <img
              src="/assets/Auluv.png"
              alt="Auluv logo"
              className="object-cover inset-0 h-full w-full"
              aria-hidden="true" // Tidak dibutuhkan untuk screen reader
            />
          </div>
        </CardContent>
      </Card>
      {/* Terms of Service and Privacy Policy */}
      <div className="text-muted-foreground text-center text-xs text-balance">
        By clicking continue, you agree to our{" "}
        <a
          href="#"
          className="underline underline-offset-4"
          aria-label="Terms of Service"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="underline underline-offset-4"
          aria-label="Privacy Policy"
        >
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
