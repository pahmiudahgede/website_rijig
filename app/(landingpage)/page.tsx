"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Recycle,
  Users,
  Shield,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Leaf,
  Building,
  Globe
} from "lucide-react";
import { useAuth } from "@/hooks";

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, isRegistrationComplete, userRole, getRedirectPath } =
    useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated && isRegistrationComplete) {
      const dashboardPath =
        userRole === "administrator"
          ? "/sys-rijig-adminpanel/dashboard"
          : "/pengelola/dashboard";
      router.push(dashboardPath);
    } else if (isAuthenticated && !isRegistrationComplete) {
      const redirectPath = getRedirectPath();
      router.push(redirectPath);
    } else {
      router.push("/pengelola/register");
    }
  };

  const handleAdminLogin = () => {
    router.push("/sys-rijig-adminpanel/login");
  };

  const getButtonText = () => {
    if (isAuthenticated && isRegistrationComplete) {
      return "Go to Dashboard";
    } else {
      return "Get Started";
    }
  };

  const features = [
    {
      icon: Recycle,
      title: "Smart Waste Collection",
      description:
        "Efficient routing and scheduling for optimal waste pickup operations"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description:
        "Track performance metrics and generate comprehensive reports"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Enterprise-grade security with role-based access control"
    },
    {
      icon: Users,
      title: "Multi-user Support",
      description:
        "Separate interfaces for administrators and waste management providers"
    }
  ];

  const benefits = [
    "Streamlined waste collection operations",
    "Reduced operational costs",
    "Improved environmental impact tracking",
    "Better compliance with regulations",
    "Enhanced customer satisfaction",
    "Data-driven decision making"
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Recycle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">RIJIG</span>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  {userRole === "administrator" ? "Admin" : "Pengelola"}
                </Badge>
              )}

              <Button variant="ghost" onClick={handleAdminLogin}>
                Admin Login
              </Button>

              <Button
                onClick={handleGetStarted}
                className="bg-green-600 hover:bg-green-700"
              >
                {getButtonText()}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="bg-green-100 text-green-800 mb-4">
              🌱 Sustainable Waste Management
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Smart Waste Management
              <span className="text-green-600"> Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Revolutionize your waste collection operations with our
              comprehensive platform. Connect administrators and waste
              management providers for efficient, data-driven environmental
              solutions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3"
            >
              {getButtonText()}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={handleAdminLogin}
              className="text-lg px-8 py-3"
            >
              Admin Access
            </Button>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Active Collections</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">50k+</div>
              <div className="text-gray-600">Tons Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Efficiency Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Waste Management
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to optimize your waste collection operations
              and make data-driven environmental decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Transform Your Waste Management Operations
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join hundreds of organizations already using RIJIG to optimize
                their waste collection processes and reduce environmental
                impact.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                onClick={handleGetStarted}
                className="mt-8 bg-green-600 hover:bg-green-700"
              >
                {getButtonText()}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <Building className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  200+
                </div>
                <div className="text-sm text-gray-600">Companies</div>
              </Card>

              <Card className="p-6 text-center">
                <Globe className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 mb-1">15</div>
                <div className="text-sm text-gray-600">Cities</div>
              </Card>

              <Card className="p-6 text-center">
                <Leaf className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 mb-1">85%</div>
                <div className="text-sm text-gray-600">CO₂ Reduction</div>
              </Card>

              <Card className="p-6 text-center">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  1000+
                </div>
                <div className="text-sm text-gray-600">Active Users</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Waste Management Journey?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join our platform today and start making a positive environmental
            impact while optimizing your operations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-3"
            >
              {getButtonText()}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={handleAdminLogin}
              className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-3"
            >
              Admin Login
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Recycle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">RIJIG</span>
              </div>
              <p className="text-gray-400 text-sm">
                Smart waste management solutions for a sustainable future.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>For Administrators</li>
                <li>For Pengelola</li>
                <li>API Documentation</li>
                <li>Support</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>support@rijig.com</li>
                <li>+62 21 1234 5678</li>
                <li>Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 RIJIG. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
