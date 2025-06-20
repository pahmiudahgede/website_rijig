'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Menu, 
  X, 
  Search, 
  ChevronDown,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

interface LayoutProps {
  children: React.ReactNode;
}

const LandingLayout = ({ children }: LayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm dark:bg-black/95">
        <div className="container mx-auto max-w-[1400px] px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-black dark:text-white">
                Appline
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="#features" className="text-base font-medium text-black dark:text-white hover:text-blue-600 transition-colors">
                Features
              </a>
              <a href="#about" className="text-base font-medium text-black dark:text-white hover:text-blue-600 transition-colors">
                About
              </a>
              <a href="#work-process" className="text-base font-medium text-black dark:text-white hover:text-blue-600 transition-colors">
                How It Works
              </a>
              <a href="#support" className="text-base font-medium text-black dark:text-white hover:text-blue-600 transition-colors">
                Support
              </a>
              
              {/* Dropdown Menu */}
              <div className="relative group">
                <Button variant="ghost" className="flex items-center space-x-1">
                  <span>Pages</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200 dark:border-gray-700">
                  <div className="py-2">
                    <a href="/blog" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Blog Grids</a>
                    <a href="/docs" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Docs</a>
                    <a href="/error" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">404 Error</a>
                    <a href="/auth/signin" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Sign In</a>
                    <a href="/auth/signup" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Sign Up</a>
                  </div>
                </div>
              </div>
            </nav>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button variant="ghost" size="icon" aria-label="Search">
                <Search className="h-4 w-4" />
              </Button>
              <ModeToggle />
              <Button variant="ghost">Sign In</Button>
              <Button>Sign Up</Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? 'max-h-96 opacity-100 pb-4' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
            <nav className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <a 
                href="#features" 
                className="block text-base font-medium text-black dark:text-white hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#about" 
                className="block text-base font-medium text-black dark:text-white hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <a 
                href="#work-process" 
                className="block text-base font-medium text-black dark:text-white hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </a>
              <a 
                href="#support" 
                className="block text-base font-medium text-black dark:text-white hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </a>
              
              {/* Mobile Dropdown */}
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-base font-medium text-black dark:text-white">
                  <span>Pages</span>
                  <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-2 ml-4 space-y-2">
                  <a href="/blog" className="block text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">Blog Grids</a>
                  <a href="/docs" className="block text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">Docs</a>
                  <a href="/error" className="block text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">404 Error</a>
                  <a href="/auth/signin" className="block text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">Sign In</a>
                  <a href="/auth/signup" className="block text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">Sign Up</a>
                </div>
              </details>
              
              <Separator className="my-4" />
              
              {/* Mobile Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="icon" aria-label="Search">
                    <Search className="h-4 w-4" />
                  </Button>
                  <ModeToggle />
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">Sign In</Button>
                  <Button size="sm">Sign Up</Button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto max-w-[1390px] px-4 py-16">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <div className="mb-8">
                <div className="text-2xl font-bold text-black dark:text-white mb-4">
                  Appline
                </div>
                <p className="text-gray-600 dark:text-gray-300 max-w-[320px]">
                  This membership will help you plan and execute a variety of projects.
                </p>
              </div>
            </div>
            
            <div className="lg:col-span-7">
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-xl font-medium text-black dark:text-white mb-6">Home</h3>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Product</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Business</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Enterprise</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-black dark:text-white mb-6">About Us</h3>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Company</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Leadership</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Diversity</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-black dark:text-white mb-6">Resources</h3>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Andy Guide</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Forum</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Support</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">App Directory</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-black dark:text-white mb-6">Tutorial</h3>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li><a href="#" className="hover:text-blue-600 transition-colors">10 Leadership Styles</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Executive Summary Tips</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Prevent Team Burnout</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">What are OKRs?</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-600 dark:bg-black py-6">
          <div className="container mx-auto max-w-[1390px] px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white text-center md:text-left mb-4 md:mb-0">
                © 2025 Appline. All rights reserved
              </p>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
                    <Linkedin className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
                    <Instagram className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-6 text-white text-sm">
                  <a href="#" className="hover:text-white/80 transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-white/80 transition-colors">Terms and conditions</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;