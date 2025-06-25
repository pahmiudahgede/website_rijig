// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { usePengelolaAuth } from '@/hooks/usePengelolaAuth';
// import { useAuthStore } from '@/store/authStore';
// import { useAuth } from '@/hooks/useAuth';
// import { validatePIN } from '@/utils/validation';

// export default function PengelolaPINPage() {
//   const { createPIN, verifyPIN } = usePengelolaAuth();
//   const { isLoading, error } = useAuthStore();
//   const { user } = useAuth({
//     requireAuth: true,
//     requireRole: 'pengelola',
//   });
  
//   const [isCreating, setIsCreating] = useState(true);
//   const [pin, setPin] = useState(['', '', '', '', '', '']);
//   const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
//   const [validationError, setValidationError] = useState('');
  
//   const pinRefs = [
//     useRef<HTMLInputElement>(null),
//     useRef<HTMLInputElement>(null),
//     useRef<HTMLInputElement>(null),
//     useRef<HTMLInputElement>(null),
//     useRef<HTMLInputElement>(null),
//     useRef<HTMLInputElement>(null),
//   ];
  
//   const confirmPinRefs = [
//     useRef<HTMLInputElement>(null),
//     useRef<HTMLInputElement>(null),
//     useRef<HTMLInputElement>(null),
//     useRef<HTMLInputElement>(null),
//     useRef<HTMLInputElement>(null),
//     useRef<HTMLInputElement>(null),
//   ];

//   useEffect(() => {
//     // Determine if creating or verifying based on user status and next_step
//     if (user) {
//       const needsToCreate = user.registration_status === 'approved' || 
//                            (user.registration_status === 'complete' && user.token_type === 'partial');
//       setIsCreating(needsToCreate);
//     }
//   }, [user]);

//   const handlePinChange = (index: number, value: string, isConfirm = false) => {
//     if (value.length > 1) return;
    
//     const refs = isConfirm ? confirmPinRefs : pinRefs;
//     const currentPin = isConfirm ? [...confirmPin] : [...pin];
//     currentPin[index] = value;
    
//     if (isConfirm) {
//       setConfirmPin(currentPin);
//     } else {
//       setPin(currentPin);
//     }
    
//     // Auto focus to next input
//     if (value && index < 5) {
//       refs[index + 1].current?.focus();
//     }
//   };

//   const handleKeyDown = (index: number, e: React.KeyboardEvent, isConfirm = false) => {
//     const refs = isConfirm ? confirmPinRefs : pinRefs;
//     const currentPin = isConfirm ? confirmPin : pin;
    
//     if (e.key === 'Backspace' && !currentPin[index] && index > 0) {
//       refs[index - 1].current?.focus();
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setValidationError('');
    
//     const pinString = pin.join('');
    
//     if (!validatePIN(pinString)) {
//       setValidationError('PIN harus 6 digit angka');
//       return;
//     }
    
//     if (isCreating) {
//       const confirmPinString = confirmPin.join('');
//       if (pinString !== confirmPinString) {
//         setValidationError('PIN tidak sama');
//         return;
//       }
      
//       await createPIN(pinString);
//     } else {
//       await verifyPIN(pinString);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             {isCreating ? 'Buat PIN' : 'Verifikasi PIN'}
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             {isCreating 
//               ? 'Buat PIN 6 digit untuk keamanan akun Anda' 
//               : 'Masukkan PIN 6 digit Anda untuk melanjutkan'}
//           </p>
//         </div>
        
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {error && (
//             <div className="rounded-md bg-red-50 p-4">
//               <p className="text-sm text-red-800">{error}</p>
//             </div>
//           )}
          
//           {validationError && (
//             <div className="rounded-md bg-red-50 p-4">
//               <p className="text-sm text-red-800">{validationError}</p>
//             </div>
//           )}
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 text-center mb-4">
//               {isCreating ? 'PIN Baru' : 'PIN'}
//             </label>
//             <div className="flex justify-center space-x-2">
//               {pin.map((digit, index) => (
//                 <input
//                   key={`pin-${index}`}
//                   ref={pinRefs[index]}
//                   type="password"
//                   inputMode="numeric"
//                   maxLength={1}
//                   className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-md focus:border-green-500 focus:outline-none"
//                   value={digit}
//                   onChange={(e) => handlePinChange(index, e.target.value)}
//                   onKeyDown={(e) => handleKeyDown(index, e)}
//                 />
//               ))}
//             </div>
//           </div>
          
//           {isCreating && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 text-center mb-4">
//                 Konfirmasi PIN
//               </label>
//               <div className="flex justify-center space-x-2">
//                 {confirmPin.map((digit, index) => (
//                   <input
//                     key={`confirm-${index}`}
//                     ref={confirmPinRefs[index]}
//                     type="password"
//                     inputMode="numeric"
//                     maxLength={1}
//                     className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-md focus:border-green-500 focus:outline-none"
//                     value={digit}
//                     onChange={(e) => handlePinChange(index, e.target.value, true)}
//                     onKeyDown={(e) => handleKeyDown(index, e, true)}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}

//           <div>
//             <button
//               type="submit"
//               disabled={isLoading || pin.join('').length !== 6}
//               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? 'Loading...' : (isCreating ? 'Buat PIN' : 'Verifikasi')}
//             </button>
//           </div>
          
//           <div className="text-center text-sm text-gray-600">
//             <p>PIN ini akan digunakan untuk login di masa mendatang</p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingState } from '@/components/ui/loading-spinner';
import { FormErrorSummary, InlineFormError } from '@/components/ui/form-error-display';
import { Shield, Lock } from 'lucide-react';
import { usePengelolaAuth, useRegistrationFlowRedirect } from '@/hooks';
import { validatePIN } from '@/utils/validators';

export default function PinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    createPin,
    verifyPin,
    isCreatingPin,
    isVerifyingPin,
    pinCreateError,
    pinVerifyError,
    clearPinError,
  } = usePengelolaAuth();
  
  // Protect route
  useRegistrationFlowRedirect();
  
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  
  const type = searchParams.get('type') || 'create'; // 'create' or 'verify'
  const isCreate = type === 'create';
  const isVerify = type === 'verify';

  const handlePinChange = (value: string, isConfirm = false) => {
    // Only allow numbers and limit to 6 digits
    const cleaned = value.replace(/\D/g, '').slice(0, 6);
    
    if (isConfirm) {
      setConfirmPin(cleaned);
    } else {
      setPin(cleaned);
    }
    
    setPinError(null);
    clearPinError();
  };

  const validatePinInput = () => {
    const validation = validatePIN(pin);
    if (!validation.isValid) {
      setPinError(validation.error || 'Invalid PIN');
      return false;
    }

    if (isCreate && pin !== confirmPin) {
      setPinError('PIN confirmation does not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePinInput()) return;

    try {
      let result;
      if (isCreate) {
        result = await createPin(pin);
      } else {
        result = await verifyPin(pin);
      }
      
      if (result.success) {
        if (isCreate) {
          router.push('/pengelola/dashboard');
        } else {
          router.push('/pengelola/dashboard');
        }
      }
    } catch (error) {
      // Error sudah di-handle oleh hook
    }
  };

  const currentError = isCreate ? pinCreateError : pinVerifyError;
  const isLoading = isCreate ? isCreatingPin : isVerifyingPin;
  const loadingText = isCreate ? 'Creating PIN...' : 'Verifying PIN...';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            {isCreate ? (
              <Shield className="w-6 h-6 text-green-600" />
            ) : (
              <Lock className="w-6 h-6 text-green-600" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {isCreate ? 'Create Your PIN' : 'Enter Your PIN'}
          </CardTitle>
          <CardDescription>
            {isCreate 
              ? 'Create a 6-digit PIN to secure your account'
              : 'Enter your 6-digit PIN to continue'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {currentError && (
              <FormErrorSummary 
                errors={{ pin: currentError }} 
                dismissible
                onDismiss={clearPinError}
              />
            )}

            <div className="space-y-1">
              <Label htmlFor="pin">
                {isCreate ? 'Create PIN' : 'Enter PIN'}
              </Label>
              <Input
                id="pin"
                type="password"
                inputMode="numeric"
                placeholder="••••••"
                value={pin}
                onChange={(e) => handlePinChange(e.target.value)}
                className={`text-center text-lg tracking-widest ${pinError ? 'border-red-500' : ''}`}
                maxLength={6}
              />
              <InlineFormError error={pinError} />
            </div>

            {isCreate && (
              <div className="space-y-1">
                <Label htmlFor="confirmPin">Confirm PIN</Label>
                <Input
                  id="confirmPin"
                  type="password"
                  inputMode="numeric"
                  placeholder="••••••"
                  value={confirmPin}
                  onChange={(e) => handlePinChange(e.target.value, true)}
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                />
              </div>
            )}

            {isCreate && (
              <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded">
                <p className="font-medium mb-1">PIN Security Tips:</p>
                <ul className="text-xs space-y-1">
                  <li>• Use 6 unique digits</li>
                  <li>• Avoid common sequences (123456, 111111)</li>
                  <li>• Don't use your birth date or phone number</li>
                  <li>• Keep your PIN confidential</li>
                </ul>
              </div>
            )}

            <LoadingState isLoading={isLoading} loadingText={loadingText}>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || pin.length !== 6 || (isCreate && confirmPin.length !== 6)}
              >
                {isCreate ? 'Create PIN' : 'Verify PIN'}
              </Button>
            </LoadingState>

            {isVerify && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Forgot your PIN?
                </p>
                <Button 
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    // This would typically involve some reset flow
                    // For now, just redirect to login
                    router.push('/pengelola/login');
                  }}
                  className="text-sm"
                >
                  Reset PIN
                </Button>
              </div>
            )}

            {/* Progress Indicator for Create Flow */}
            {isCreate && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>Almost done!</span>
                  <span>4/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <div className="text-center text-xs text-muted-foreground mt-2">
                  Final step: PIN setup
                </div>
              </div>
            )}

            <div className="text-center text-sm">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                ← Back
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}