'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingState } from '@/components/ui/loading-spinner';
import { FormErrorSummary, InlineFormError } from '@/components/ui/form-error-display';
import { usePengelolaAuth } from '@/hooks';
import { validateOTP } from '@/utils/validators';

export default function PengelolaOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    verifyOtpRegister,
    verifyOtpLogin,
    requestOtpRegister,
    requestOtpLogin,
    isVerifyingOtp,
    isRequestingOtp,
    otpVerifyError,
    otpRequestError,
    clearOtpError,
    tempData,
  } = usePengelolaAuth();
  
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  
  const type = searchParams.get('type') || 'register'; // 'register' or 'login'
  const isRegister = type === 'register';
  const phone = tempData.phone || '';

  useEffect(() => {
    // Redirect if no phone in temp data
    if (!phone) {
      router.push(isRegister ? '/pengelola/register' : '/pengelola/login');
    }
  }, [phone, isRegister, router]);

  const handleOtpChange = (value: string) => {
    // Only allow numbers and limit to 4 digits
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    setOtp(cleaned);
    setOtpError(null);
    clearOtpError();
  };

  const validateOtpInput = () => {
    const validation = validateOTP(otp);
    if (!validation.isValid) {
      setOtpError(validation.error || 'Invalid OTP');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateOtpInput()) return;

    try {
      let result;
      if (isRegister) {
        result = await verifyOtpRegister(phone, otp);
      } else {
        result = await verifyOtpLogin(phone, otp);
      }
      
      if (result.success) {
        if (isRegister) {
          router.push('/pengelola/company');
        } else {
          router.push('/pengelola/pin?type=verify');
        }
      }
    } catch (error) {
      // Error sudah di-handle oleh hook
    }
  };

  const handleResendOtp = async () => {
    try {
      let result;
      if (isRegister) {
        result = await requestOtpRegister(phone);
      } else {
        result = await requestOtpLogin(phone);
      }
      
      if (result.success) {
        setOtp('');
        setOtpError(null);
      }
    } catch (error) {
      // Error sudah di-handle oleh hook
    }
  };

  if (!phone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Verify OTP</CardTitle>
          <CardDescription>
            Enter the 4-digit code sent to your WhatsApp
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {(otpVerifyError || otpRequestError) && (
              <FormErrorSummary 
                errors={{ otp: (otpVerifyError || otpRequestError) || '' }} 
                dismissible
                onDismiss={clearOtpError}
              />
            )}

            <div className="text-sm text-center text-muted-foreground mb-4">
              Code sent to: <span className="font-medium">{phone}</span>
            </div>

            <div className="space-y-1">
              <Label htmlFor="otp">OTP Code</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="1234"
                value={otp}
                onChange={(e) => handleOtpChange(e.target.value)}
                className={`text-center text-lg tracking-widest ${otpError ? 'border-red-500' : ''}`}
                maxLength={4}
              />
              <InlineFormError error={otpError} />
            </div>

            <LoadingState isLoading={isVerifyingOtp} loadingText="Verifying OTP...">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isVerifyingOtp || otp.length !== 4}
              >
                Verify OTP
              </Button>
            </LoadingState>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Didn't receive the code?
              </p>
              <LoadingState isLoading={isRequestingOtp} loadingText="Resending...">
                <Button 
                  type="button"
                  variant="ghost"
                  onClick={handleResendOtp}
                  disabled={isRequestingOtp}
                  className="text-sm"
                >
                  Resend OTP
                </Button>
              </LoadingState>
            </div>

            <div className="text-center text-sm">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push(isRegister ? '/pengelola/register' : '/pengelola/login')}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                ← Back to {isRegister ? 'registration' : 'login'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}