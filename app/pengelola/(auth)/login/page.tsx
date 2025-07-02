
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
import { usePengelolaAuth, useAuthPageRedirect } from '@/hooks';
import { validatePhone, formatPhoneDisplay } from '@/utils/validators';

export default function PengelolaLoginPage() {
  const router = useRouter();
  const { requestOtpLogin, isRequestingOtp, otpRequestError, clearOtpError } = usePengelolaAuth();
  
  useAuthPageRedirect('pengelola');
  
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
      const result = await requestOtpLogin(phone);
      if (result.success) {
        router.push('/pengelola/otp?type=login');
      }
    } catch (error) {
      // Error sudah di-handle oleh hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Pengelola Login</CardTitle>
          <CardDescription>
            Sign in to your waste management account
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
                autoComplete="tel"
              />
              <InlineFormError error={phoneError} />
              {phone && !phoneError && (
                <p className="text-xs text-muted-foreground">
                  Format: {formatPhoneDisplay(phone)}
                </p>
              )}
            </div>

            <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded">
              <p className="font-medium mb-1">Login Process:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Enter your registered phone number</li>
                <li>Verify OTP sent to WhatsApp</li>
                <li>Enter your PIN</li>
                <li>Access your dashboard</li>
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
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/pengelola/register" className="text-primary hover:underline">
                Register here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}