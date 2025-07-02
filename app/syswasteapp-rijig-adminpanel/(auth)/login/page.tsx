// 'use client';

// import { useState } from 'react';
// import { useAdminAuth } from '@/hooks/useAdminAuth';
// import { useAuthStore } from '@/store/authStore';
// import Link from 'next/link';
// import { validateEmail, validatePassword } from '@/utils/validation';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Loader2, AlertCircle } from 'lucide-react';

// export default function AdminLoginPage() {
//   const { login, fieldErrors } = useAdminAuth();
//   const { isLoading, error } = useAuthStore();
  
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
  
//   const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     setValidationErrors({});
    
//     const errors: Record<string, string> = {};
    
//     if (!validateEmail(formData.email)) {
//       errors.email = 'Email tidak valid';
//     }
    
//     const passwordValidation = validatePassword(formData.password);
//     if (!passwordValidation.isValid) {
//       errors.password = passwordValidation.errors[0];
//     }
    
//     if (Object.keys(errors).length > 0) {
//       setValidationErrors(errors);
//       return;
//     }
    
//     await login(formData.email, formData.password);
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
//           <CardDescription className="text-center">
//             Masuk ke panel administrator RIJIK
//           </CardDescription>
//         </CardHeader>
//         <form onSubmit={handleSubmit}>
//           <CardContent className="space-y-4">
//             {error && (
//               <Alert variant="destructive">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}
            
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="admin@example.com"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 className={validationErrors.email || fieldErrors.email ? "border-destructive" : ""}
//               />
//               {(validationErrors.email || fieldErrors.email) && (
//                 <p className="text-sm text-destructive">
//                   {validationErrors.email || fieldErrors.email?.[0]}
//                 </p>
//               )}
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="••••••••"
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 className={validationErrors.password || fieldErrors.password ? "border-destructive" : ""}
//               />
//               {(validationErrors.password || fieldErrors.password) && (
//                 <p className="text-sm text-destructive">
//                   {validationErrors.password || fieldErrors.password?.[0]}
//                 </p>
//               )}
//             </div>
//           </CardContent>
//           <CardFooter className="flex flex-col space-y-4">
//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Loading...
//                 </>
//               ) : (
//                 'Masuk'
//               )}
//             </Button>
//             <div className="text-sm text-center text-muted-foreground">
//               Belum punya akun?{' '}
//               <Link href="/sys-rijig-adminpanel/register" className="text-primary hover:underline">
//                 Daftar
//               </Link>
//             </div>
//           </CardFooter>
//         </form>
//       </Card>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingState } from '@/components/ui/loading-spinner';
import { FormErrorSummary } from '@/components/ui/form-error-display';
import { CheckCircle } from 'lucide-react';
import { useAdminAuth, useAuthPageRedirect } from '@/hooks';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoggingIn, loginError, clearLoginError } = useAdminAuth();
  
  // Redirect if already authenticated
  useAuthPageRedirect('administrator');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const isRegistered = searchParams.get('registered') === 'true';

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearLoginError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }

    try {
      const result = await login(formData);
      if (result.success) {
        router.push('/sys-rijig-adminpanel/dashboard');
      }
    } catch (error) {
      // Error sudah di-handle oleh hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Sign in to your administrator account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Registration Success Alert */}
          {isRegistered && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Registration successful! Please login with your credentials.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {loginError && (
              <FormErrorSummary 
                errors={{ login: loginError }} 
                dismissible
                onDismiss={clearLoginError}
              />
            )}

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {/* Submit Button */}
            <LoadingState isLoading={isLoggingIn} loadingText="Signing in...">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoggingIn || !formData.email || !formData.password}
              >
                Sign In
              </Button>
            </LoadingState>

            {/* Register Link */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/sys-rijig-adminpanel/register" className="text-primary hover:underline">
                Create one
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}