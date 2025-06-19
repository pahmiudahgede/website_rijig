import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, Users } from "lucide-react";

export default function LandingPageShow() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center space-y-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              RIJIK Management System
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl">
              Sistem manajemen terintegrasi untuk pengelolaan sampah yang
              efisien dan berkelanjutan
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button asChild size="lg" className="min-w-[200px]">
                <Link href="/sys-rijig-adminpanel/login">
                  <Shield className="mr-2 h-5 w-5" />
                  Admin Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="min-w-[200px]"
              >
                <Link href="/pengelola/login">
                  <Users className="mr-2 h-5 w-5" />
                  Pengelola Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Test Connection Link */}
            <div className="pt-8">
              <Link
                href="/test-connection"
                className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
              >
                Test API Connection
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Optional: Feature Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Administrator</h3>
              <p className="text-muted-foreground">
                Kelola seluruh sistem, approve pengelola, dan monitor aktivitas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Pengelola</h3>
              <p className="text-muted-foreground">
                Kelola operasional harian, transaksi, dan laporan pengelolaan
                sampah
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
