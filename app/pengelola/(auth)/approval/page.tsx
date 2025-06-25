'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Clock, CheckCircle, RefreshCw, Building, Phone, Mail } from 'lucide-react';
import { usePengelolaAuth, useRegistrationFlowRedirect } from '@/hooks';

export default function ApprovalPage() {
  const router = useRouter();
  const { 
    checkApprovalStatus, 
    isCheckingApproval, 
    approvalError, 
    registrationStatus,
    nextStep,
  } = usePengelolaAuth();
  
  // Protect route
  useRegistrationFlowRedirect();
  
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [autoCheck, setAutoCheck] = useState(true);

  // Auto-check approval status every 30 seconds
  useEffect(() => {
    if (!autoCheck) return;

    const checkStatus = async () => {
      try {
        const result = await checkApprovalStatus();
        setLastChecked(new Date());
        
        if (result.success && result.data?.data?.registration_status === 'approved') {
          router.push('/pengelola/pin?type=create');
        }
      } catch (error) {
        console.error('Auto-check error:', error);
      }
    };

    // Check immediately
    checkStatus();

    // Then check every 30 seconds
    const interval = setInterval(checkStatus, 30000);

    return () => clearInterval(interval);
  }, [autoCheck, checkApprovalStatus, router]);

  const handleManualCheck = async () => {
    try {
      const result = await checkApprovalStatus();
      setLastChecked(new Date());
      
      if (result.success && result.data?.data?.registration_status === 'approved') {
        router.push('/pengelola/pin?type=create');
      }
    } catch (error) {
      // Error handled by hook
    }
  };

  const isApproved = registrationStatus === 'approved';
  const isAwaitingApproval = registrationStatus === 'awaiting_approval';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              {isApproved ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <Clock className="w-8 h-8 text-yellow-600" />
              )}
            </div>
            <CardTitle className="text-xl font-bold">
              {isApproved ? 'Application Approved!' : 'Pending Approval'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {isApproved ? (
              <>
                <div className="text-center text-green-600">
                  <p className="mb-4">
                    Congratulations! Your company registration has been approved.
                  </p>
                  <Button 
                    onClick={() => router.push('/pengelola/pin?type=create')}
                    className="w-full"
                  >
                    Continue to PIN Setup
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center text-muted-foreground">
                  <p className="mb-4">
                    Your company information is being reviewed by our admin team. 
                    This typically takes 1-24 hours.
                  </p>
                </div>

                {/* Status Check */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <LoadingSpinner size="sm" />
                      <span className="text-sm">
                        {isCheckingApproval ? 'Checking status...' : 'Auto-checking every 30s'}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAutoCheck(!autoCheck)}
                    >
                      {autoCheck ? 'Disable' : 'Enable'}
                    </Button>
                  </div>

                  {lastChecked && (
                    <p className="text-xs text-muted-foreground text-center">
                      Last checked: {lastChecked.toLocaleTimeString()}
                    </p>
                  )}

                  <Button
                    variant="outline"
                    onClick={handleManualCheck}
                    disabled={isCheckingApproval}
                    className="w-full"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isCheckingApproval ? 'animate-spin' : ''}`} />
                    Check Status Now
                  </Button>

                  {approvalError && (
                    <div className="text-sm text-red-600 text-center p-3 bg-red-50 rounded">
                      {approvalError}
                    </div>
                  )}
                </div>

                {/* What you can do while waiting */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">While you wait:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Prepare your business documents</li>
                    <li>• Review our terms and conditions</li>
                    <li>• Contact support if you have questions</li>
                  </ul>
                </div>

                {/* Contact Info */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Need help?</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>+62 21 1234 5678</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>support@rijig.com</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Progress Indicator */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Progress</span>
                <span>3/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Registration</span>
                <span>Review</span>
                <span>PIN Setup</span>
              </div>
            </div>

            {/* Logout Option */}
            <div className="text-center pt-4 border-t">
              <Button
                variant="ghost"
                onClick={() => router.push('/pengelola/login')}
                className="text-sm text-muted-foreground"
              >
                Sign out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}