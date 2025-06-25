'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ValidationTester } from '@/components/test/validation-tester';
import { AuthFlowTester } from '@/components/test/auth-flow-tester';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  useAuth, 
  useLoading 
} from '@/hooks';
import { generateDeviceId } from '@/utils/device';

export default function TestConnectionPage() {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const auth = useAuth();
  const loading = useLoading();

  const addResult = (test: string, result: any) => {
    setTestResults(prev => ({
      ...prev,
      [test]: {
        timestamp: new Date().toISOString(),
        ...result,
      },
    }));
  };

  // Environment tests
  const testEnvironment = () => {
    const result = {
      baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL,
      apiKey: process.env.NEXT_PUBLIC_API_KEY ? '***HIDDEN***' : 'NOT_SET',
      deviceId: generateDeviceId(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'SERVER',
      nodeEnv: process.env.NODE_ENV,
    };
    
    addResult('environment', { success: true, data: result });
  };

  // Auth state tests
  const testAuthState = () => {
    const result = {
      isAuthenticated: auth.isAuthenticated,
      userRole: auth.userRole,
      registrationStatus: auth.registrationStatus,
      nextStep: auth.nextStep,
      canAccessAdminRoutes: auth.canAccessAdminRoutes,
      canAccessPengelolaRoutes: auth.canAccessPengelolaRoutes,
      redirectPath: auth.getRedirectPath(),
    };
    
    addResult('authState', { success: true, data: result });
  };

  // API Connection test
  const testAPIConnection = async () => {
    try {
      // Test basic connection
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_API_URL + '/health', {
        method: 'GET',
        headers: {
          'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '',
          'ngrok-skip-browser-warning': 'true',
        },
      });
      
      let data = null;
      try {
        data = await response.json();
      } catch (e) {
        data = await response.text();
      }
      
      addResult('apiConnection', {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: data,
      });
    } catch (error: any) {
      addResult('apiConnection', {
        success: false,
        error: error.message,
      });
    }
  };

  const clearResults = () => {
    setTestResults({});
  };

  const runQuickTests = async () => {
    clearResults();
    testEnvironment();
    testAuthState();
    await testAPIConnection();
  };

  const renderTestResult = (testName: string, result: any) => {
    if (!result) return null;
    
    return (
      <Card key={testName} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{testName}</CardTitle>
            <Badge variant={result.success ? "default" : "destructive"}>
              {result.success ? "PASS" : "FAIL"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(result.timestamp).toLocaleTimeString()}
          </p>
        </CardHeader>
        <CardContent className="pt-2">
          <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(result, null, 2)}
          </pre>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">System Test Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive testing suite for authentication system, validation functions, and API connectivity.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="validation">Validation Tests</TabsTrigger>
          <TabsTrigger value="auth-flow">Auth Flow Tests</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Tests */}
            <Card>
              <CardHeader>
                <CardTitle>Quick System Tests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={runQuickTests} className="w-full">
                    Run Quick Tests
                  </Button>
                  <Button onClick={clearResults} variant="outline" className="w-full">
                    Clear Results
                  </Button>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 gap-2">
                  <Button onClick={testEnvironment} variant="outline" size="sm">
                    Test Environment
                  </Button>
                  <Button onClick={testAuthState} variant="outline" size="sm">
                    Test Auth State
                  </Button>
                  <Button onClick={testAPIConnection} variant="outline" size="sm">
                    Test API Connection
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Current System State */}
            <Card>
              <CardHeader>
                <CardTitle>Current System State</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Environment:</span>
                    <Badge variant="secondary">{process.env.NODE_ENV}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">API URL:</span>
                    <span className="text-xs text-muted-foreground">
                      {process.env.NEXT_PUBLIC_BASE_API_URL ? '✓ Set' : '✗ Not Set'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">API Key:</span>
                    <span className="text-xs text-muted-foreground">
                      {process.env.NEXT_PUBLIC_API_KEY ? '✓ Set' : '✗ Not Set'}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Authenticated:</span>
                    <Badge variant={auth.isAuthenticated ? "default" : "secondary"}>
                      {auth.isAuthenticated ? "Yes" : "No"}
                    </Badge>
                  </div>
                  
                  {auth.isAuthenticated && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Role:</span>
                        <Badge variant="outline">{auth.userRole}</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Status:</span>
                        <Badge variant="outline">{auth.registrationStatus}</Badge>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Loading States */}
            <Card>
              <CardHeader>
                <CardTitle>Loading States</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {Object.entries(loading).map(([key, isLoading]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <Badge variant={isLoading ? "default" : "secondary"} className="text-xs">
                        {isLoading ? "Loading..." : "Idle"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Info */}
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Next.js Version:</span>
                    <span className="text-muted-foreground">15.x</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TypeScript:</span>
                    <span className="text-muted-foreground">✓ Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span>App Router:</span>
                    <span className="text-muted-foreground">✓ Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tailwind CSS:</span>
                    <span className="text-muted-foreground">✓ Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zustand Store:</span>
                    <span className="text-muted-foreground">✓ Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Middleware:</span>
                    <span className="text-muted-foreground">✓ Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="validation">
          <ValidationTester />
        </TabsContent>

        <TabsContent value="auth-flow">
          <AuthFlowTester />
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>All Test Results</CardTitle>
              <Button onClick={clearResults} variant="outline" size="sm">
                Clear All Results
              </Button>
            </CardHeader>
            <CardContent>
              {Object.keys(testResults).length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No test results yet. Run some tests to see results here.
                </p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(testResults).map(([testName, result]) =>
                    renderTestResult(testName, result)
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}