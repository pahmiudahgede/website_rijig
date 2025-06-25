'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  useAuth, 
  useAdminAuth, 
  usePengelolaAuth, 
  useLoading 
} from '@/hooks';

export function AuthFlowTester() {
  const [adminForm, setAdminForm] = useState({
    name: 'Test Admin',
    gender: 'laki-laki',
    dateofbirth: '01-01-1990',
    placeofbirth: 'Jakarta',
    phone: '628123456789',
    email: 'admin@test.com',
    password: 'Test123!',
    password_confirm: 'Test123!',
  });

  const [adminLoginForm, setAdminLoginForm] = useState({
    email: 'admin@test.com',
    password: 'Test123!',
  });

  const [pengelolaForm, setPengelolaForm] = useState({
    phone: '628987654321',
    otp: '1234',
    pin: '123456',
  });

  const [companyForm, setCompanyForm] = useState({
    companyname: 'PT Test Company',
    companyaddress: 'Jl. Test No. 123, Jakarta Selatan',
    companyphone: '6281234567890',
    companyemail: 'info@testcompany.com',
    companywebsite: 'https://testcompany.com',
    taxid: '123456789012345',
    foundeddate: '01-01-2020',
    companytype: 'Technology',
    companydescription: 'Test company for waste management system',
  });

  const [testResults, setTestResults] = useState<string[]>([]);
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);

  const auth = useAuth();
  const adminAuth = useAdminAuth();
  const pengelolaAuth = usePengelolaAuth();
  const loading = useLoading();

  const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    setTestResults(prev => [...prev, logMessage]);
  };

  const clearLogs = () => {
    setTestResults([]);
  };

  // Admin Registration Test
  const testAdminRegistration = async () => {
    addLog('Starting admin registration test...');
    try {
      const result = await adminAuth.register(adminForm as any);
      if (result.success) {
        addLog('Admin registration successful!', 'success');
        addLog(`Response: ${JSON.stringify(result.data, null, 2)}`);
      } else {
        addLog(`Admin registration failed: ${result.error}`, 'error');
      }
    } catch (error: any) {
      addLog(`Admin registration error: ${error.message}`, 'error');
    }
  };

  // Admin Login Test
  const testAdminLogin = async () => {
    addLog('Starting admin login test...');
    try {
      const result = await adminAuth.login(adminLoginForm);
      if (result.success) {
        addLog('Admin login successful!', 'success');
        addLog(`Response: ${JSON.stringify(result.data, null, 2)}`);
      } else {
        addLog(`Admin login failed: ${result.error}`, 'error');
      }
    } catch (error: any) {
      addLog(`Admin login error: ${error.message}`, 'error');
    }
  };

  // Pengelola OTP Request Test
  const testPengelolaOTPRequest = async () => {
    addLog('Requesting OTP for pengelola registration...');
    try {
      const result = await pengelolaAuth.requestOtpRegister(pengelolaForm.phone);
      if (result.success) {
        addLog('OTP request successful!', 'success');
        addLog(`Response: ${JSON.stringify(result.data, null, 2)}`);
      } else {
        addLog(`OTP request failed: ${result.error}`, 'error');
      }
    } catch (error: any) {
      addLog(`OTP request error: ${error.message}`, 'error');
    }
  };

  // Pengelola OTP Verify Test
  const testPengelolaOTPVerify = async () => {
    addLog('Verifying OTP for pengelola registration...');
    try {
      const result = await pengelolaAuth.verifyOtpRegister(pengelolaForm.phone, pengelolaForm.otp);
      if (result.success) {
        addLog('OTP verification successful!', 'success');
        addLog(`Response: ${JSON.stringify(result.data, null, 2)}`);
      } else {
        addLog(`OTP verification failed: ${result.error}`, 'error');
      }
    } catch (error: any) {
      addLog(`OTP verification error: ${error.message}`, 'error');
    }
  };

  // Company Profile Test
  const testCompanyProfile = async () => {
    if (!companyLogo) {
      addLog('Please select a company logo file first', 'error');
      return;
    }

    addLog('Creating company profile...');
    try {
      const result = await pengelolaAuth.createCompanyProfile({
        ...companyForm,
        company_logo: companyLogo,
      } as any);
      
      if (result.success) {
        addLog('Company profile created successfully!', 'success');
        addLog(`Response: ${JSON.stringify(result.data, null, 2)}`);
      } else {
        addLog(`Company profile creation failed: ${result.error}`, 'error');
      }
    } catch (error: any) {
      addLog(`Company profile error: ${error.message}`, 'error');
    }
  };

  // Check Approval Status Test
  const testCheckApproval = async () => {
    addLog('Checking approval status...');
    try {
      const result = await pengelolaAuth.checkApprovalStatus();
      if (result.success) {
        addLog('Approval status check successful!', 'success');
        addLog(`Response: ${JSON.stringify(result.data, null, 2)}`);
      } else {
        addLog(`Approval status check failed: ${result.error}`, 'error');
      }
    } catch (error: any) {
      addLog(`Approval status error: ${error.message}`, 'error');
    }
  };

  // Create PIN Test
  const testCreatePIN = async () => {
    addLog('Creating PIN...');
    try {
      const result = await pengelolaAuth.createPin(pengelolaForm.pin);
      if (result.success) {
        addLog('PIN created successfully!', 'success');
        addLog(`Response: ${JSON.stringify(result.data, null, 2)}`);
      } else {
        addLog(`PIN creation failed: ${result.error}`, 'error');
      }
    } catch (error: any) {
      addLog(`PIN creation error: ${error.message}`, 'error');
    }
  };

  // Pengelola Login OTP Request Test
  const testPengelolaLoginOTP = async () => {
    addLog('Requesting OTP for pengelola login...');
    try {
      const result = await pengelolaAuth.requestOtpLogin(pengelolaForm.phone);
      if (result.success) {
        addLog('Login OTP request successful!', 'success');
        addLog(`Response: ${JSON.stringify(result.data, null, 2)}`);
      } else {
        addLog(`Login OTP request failed: ${result.error}`, 'error');
      }
    } catch (error: any) {
      addLog(`Login OTP request error: ${error.message}`, 'error');
    }
  };

  // Pengelola Login OTP Verify Test
  const testPengelolaLoginOTPVerify = async () => {
    addLog('Verifying OTP for pengelola login...');
    try {
      const result = await pengelolaAuth.verifyOtpLogin(pengelolaForm.phone, pengelolaForm.otp);
      if (result.success) {
        addLog('Login OTP verification successful!', 'success');
        addLog(`Response: ${JSON.stringify(result.data, null, 2)}`);
      } else {
        addLog(`Login OTP verification failed: ${result.error}`, 'error');
      }
    } catch (error: any) {
      addLog(`Login OTP verification error: ${error.message}`, 'error');
    }
  };

  // Verify PIN Test
  const testVerifyPIN = async () => {
    addLog('Verifying PIN...');
    try {
      const result = await pengelolaAuth.verifyPin(pengelolaForm.pin);
      if (result.success) {
        addLog('PIN verification successful!', 'success');
        addLog(`Response: ${JSON.stringify(result.data, null, 2)}`);
      } else {
        addLog(`PIN verification failed: ${result.error}`, 'error');
      }
    } catch (error: any) {
      addLog(`PIN verification error: ${error.message}`, 'error');
    }
  };

  // Logout Test
  const testLogout = async () => {
    addLog('Logging out...');
    try {
      const result = await auth.logout();
      if (result.success) {
        addLog('Logout successful!', 'success');
      } else {
        addLog(`Logout failed: ${result.error}`, 'error');
      }
    } catch (error: any) {
      addLog(`Logout error: ${error.message}`, 'error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCompanyLogo(file);
    if (file) {
      addLog(`Company logo selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Authentication Flow Tester</h2>
        <p className="text-muted-foreground">
          Test complete authentication flows for both Administrator and Pengelola roles.
        </p>
      </div>

      {/* Current Auth State */}
      <Alert>
        <AlertDescription>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <strong>Authenticated:</strong>{' '}
              <Badge variant={auth.isAuthenticated ? 'default' : 'secondary'}>
                {auth.isAuthenticated ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div>
              <strong>Role:</strong> {auth.userRole || 'None'}
            </div>
            <div>
              <strong>Status:</strong> {auth.registrationStatus || 'None'}
            </div>
            <div>
              <strong>Next Step:</strong> {auth.nextStep || 'None'}
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Controls */}
        <div className="space-y-6">
          {/* Administrator Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Administrator Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Admin Email</Label>
                <Input
                  value={adminLoginForm.email}
                  onChange={(e) => setAdminLoginForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Admin Password</Label>
                <Input
                  type="password"
                  value={adminLoginForm.password}
                  onChange={(e) => setAdminLoginForm(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={testAdminRegistration}
                  disabled={loading.register}
                  size="sm"
                >
                  Register Admin
                </Button>
                <Button 
                  onClick={testAdminLogin}
                  disabled={loading.login}
                  size="sm"
                >
                  Login Admin
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pengelola Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Pengelola Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  value={pengelolaForm.phone}
                  onChange={(e) => setPengelolaForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>OTP Code</Label>
                <Input
                  value={pengelolaForm.otp}
                  onChange={(e) => setPengelolaForm(prev => ({ ...prev, otp: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>PIN Code</Label>
                <Input
                  value={pengelolaForm.pin}
                  onChange={(e) => setPengelolaForm(prev => ({ ...prev, pin: e.target.value }))}
                />
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={testPengelolaOTPRequest}
                  disabled={loading.otpRequest}
                  size="sm"
                >
                  Request OTP (Reg)
                </Button>
                <Button 
                  onClick={testPengelolaOTPVerify}
                  disabled={loading.otpVerify}
                  size="sm"
                >
                  Verify OTP (Reg)
                </Button>
                <Button 
                  onClick={testPengelolaLoginOTP}
                  disabled={loading.otpRequest}
                  size="sm"
                >
                  Request OTP (Login)
                </Button>
                <Button 
                  onClick={testPengelolaLoginOTPVerify}
                  disabled={loading.otpVerify}
                  size="sm"
                >
                  Verify OTP (Login)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Company Profile Test */}
          <Card>
            <CardHeader>
              <CardTitle>Company Profile Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Company Logo</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  value={companyForm.companyname}
                  onChange={(e) => setCompanyForm(prev => ({ ...prev, companyname: e.target.value }))}
                />
              </div>
              <Button 
                onClick={testCompanyProfile}
                disabled={loading.companyProfile || !companyLogo}
                className="w-full"
              >
                Create Company Profile
              </Button>
            </CardContent>
          </Card>

          {/* Flow Control Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Flow Control Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                onClick={testCheckApproval}
                disabled={loading.approvalCheck}
                size="sm"
                className="w-full"
              >
                Check Approval Status
              </Button>
              <Button 
                onClick={testCreatePIN}
                disabled={loading.pinCreate}
                size="sm"
                className="w-full"
              >
                Create PIN
              </Button>
              <Button 
                onClick={testVerifyPIN}
                disabled={loading.pinVerify}
                size="sm"
                className="w-full"
              >
                Verify PIN
              </Button>
              <Button 
                onClick={testLogout}
                disabled={loading.logout}
                size="sm"
                variant="outline"
                className="w-full"
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Test Results Log */}
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Test Results Log</CardTitle>
              <Button onClick={clearLogs} variant="outline" size="sm">
                Clear Log
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded font-mono text-xs h-96 overflow-y-auto">
                {testResults.length === 0 ? (
                  <div className="text-gray-500">No test results yet. Run some tests to see logs here.</div>
                ) : (
                  testResults.map((result, index) => (
                    <div key={index} className="mb-1">
                      {result}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}