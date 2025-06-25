// 'use client';

// import { useState } from 'react';
// import { usePengelolaAuth } from '@/hooks/usePengelolaAuth';
// import { useAuthStore } from '@/store/authStore';
// import Link from 'next/link';
// import { validatePhone } from '@/utils/validation';

// export default function PengelolaRegisterPage() {
//   const { requestOTP } = usePengelolaAuth();
//   const { isLoading, error } = useAuthStore();
  
//   const [phone, setPhone] = useState('');
//   const [validationError, setValidationError] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Clear previous errors
//     setValidationError('');
    
//     // Format phone number
//     let formattedPhone = phone.replace(/\D/g, '');
//     if (formattedPhone.startsWith('0')) {
//       formattedPhone = '62' + formattedPhone.substring(1);
//     } else if (!formattedPhone.startsWith('62')) {
//       formattedPhone = '62' + formattedPhone;
//     }
    
//     // Validate
//     if (!validatePhone(formattedPhone)) {
//       setValidationError('Nomor telepon tidak valid. Format: 08xx atau 62xxx (8-14 digit)');
//       return;
//     }
    
//     // Request OTP
//     await requestOTP(formattedPhone, false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Daftar Pengelola
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Masukkan nomor telepon untuk mendapatkan kode OTP
//           </p>
//         </div>
        
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {error && (
//             <div className="rounded-md bg-red-50 p-4">
//               <p className="text-sm text-red-800">{error}</p>
//             </div>
//           )}
          
//           <div>
//             <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
//               Nomor Telepon
//             </label>
//             <input
//               id="phone"
//               name="phone"
//               type="tel"
//               placeholder="081234567890"
//               required
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//             />
//             {validationError && (
//               <p className="mt-1 text-sm text-red-600">{validationError}</p>
//             )}
//             <p className="mt-1 text-sm text-gray-500">
//               Kode OTP akan dikirim melalui WhatsApp
//             </p>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? 'Loading...' : 'Kirim OTP'}
//             </button>
//           </div>
          
//           <div className="text-center">
//             <Link
//               href="/pengelola/login"
//               className="font-medium text-green-600 hover:text-green-500"
//             >
//               Sudah punya akun? Login
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingState } from '@/components/ui/loading-spinner';
import { FormErrorSummary, InlineFormError } from '@/components/ui/form-error-display';
import { usePengelolaAuth } from '@/hooks';
import { validatePhone, formatPhoneDisplay } from '@/utils/validators';

export default function PengelolaRegisterPage() {
  const router = useRouter();
  const { requestOtpRegister, isRequestingOtp, otpRequestError, clearOtpError } = usePengelolaAuth();
  
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    setPhoneError(null);
    clearOtpError();
  };

  const validatePhoneInput = () => {
    const validation = validatePhone(phone);
    if (!validation.isValid) {
      setPhoneError(validation.error || 'Invalid phone number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhoneInput()) return;

    try {
      const result = await requestOtpRegister(phone);
      if (result.success) {
        router.push('/pengelola/otp?type=register');
      }
    } catch (error) {
      // Error sudah di-handle oleh hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Pengelola Registration</CardTitle>
          <CardDescription>
            Register as a waste management provider
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {otpRequestError && (
              <FormErrorSummary 
                errors={{ phone: otpRequestError }} 
                dismissible
                onDismiss={clearOtpError}
              />
            )}

            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="628123456789"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={phoneError ? 'border-red-500' : ''}
              />
              <InlineFormError error={phoneError} />
              {phone && !phoneError && (
                <p className="text-xs text-muted-foreground">
                  Format: {formatPhoneDisplay(phone)}
                </p>
              )}
            </div>

            <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded">
              <p className="font-medium mb-1">Registration Process:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Enter your phone number</li>
                <li>Verify OTP sent to WhatsApp</li>
                <li>Fill company information</li>
                <li>Wait for admin approval</li>
                <li>Create your PIN</li>
              </ol>
            </div>

            <LoadingState isLoading={isRequestingOtp} loadingText="Sending OTP...">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isRequestingOtp || !phone}
              >
                Send OTP
              </Button>
            </LoadingState>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/pengelola/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}