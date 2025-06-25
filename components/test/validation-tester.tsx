'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  validatePhone,
  validatePassword,
  validateEmail,
  validateOTP,
  validatePIN,
  validateDate,
  validateBirthDate,
  validateFoundedDate,
  validateWebsite,
  validateTaxID,
  getPasswordSuggestions,
  calculatePasswordStrength,
  formatPhoneDisplay,
  calculateAge,
} from '@/utils/validators';

interface TestCase {
  name: string;
  validator: (value: string) => any;
  testValues: string[];
  formatter?: (value: string) => string;
}

const testCases: TestCase[] = [
  {
    name: 'Phone Number',
    validator: validatePhone,
    testValues: [
      '628123456789',
      '6281234567890',
      '62812345',
      '081234567890',
      '628123456789012345',
      '62abcd123456',
    ],
    formatter: formatPhoneDisplay,
  },
  {
    name: 'Password',
    validator: validatePassword,
    testValues: [
      'Test123!',
      'password',
      'PASSWORD',
      'Pass123',
      'Test!',
      'VerySecurePassword123!',
      '12345678',
    ],
  },
  {
    name: 'Email',
    validator: validateEmail,
    testValues: [
      'test@example.com',
      'user@domain.co.id',
      'invalid-email',
      'test@',
      '@domain.com',
      'test.email+tag@domain.com',
    ],
  },
  {
    name: 'OTP Code',
    validator: validateOTP,
    testValues: [
      '1234',
      '0000',
      '123',
      '12345',
      'abcd',
      '1a2b',
    ],
  },
  {
    name: 'PIN Code',
    validator: validatePIN,
    testValues: [
      '123456',
      '000000',
      '12345',
      '1234567',
      'abc123',
      '1a2b3c',
    ],
  },
  {
    name: 'Birth Date',
    validator: validateBirthDate,
    testValues: [
      '01-01-1990',
      '31-12-2000',
      '29-02-2000',
      '29-02-2001',
      '32-01-1990',
      '01-13-1990',
      '01-01-2030',
      '01-01-1900',
    ],
  },
  {
    name: 'Website',
    validator: validateWebsite,
    testValues: [
      'https://example.com',
      'http://domain.co.id',
      'www.example.com',
      'example.com',
      'ftp://example.com',
      'https://',
      '',
    ],
  },
  {
    name: 'Tax ID',
    validator: validateTaxID,
    testValues: [
      '123456789012345',
      '12.345.678.9-012.345',
      '1234567890123456',
      '12345678901234',
      'abcd1234567890e',
      '123-456-789-012-345',
    ],
  },
];

export function ValidationTester() {
  const [customInput, setCustomInput] = useState('');
  const [selectedValidator, setSelectedValidator] = useState(0);
  const [customResults, setCustomResults] = useState<any>(null);

  const testCustomInput = () => {
    const testCase = testCases[selectedValidator];
    const result = testCase.validator(customInput);
    
    // Add extra info for specific validators
    let extraInfo = {};
    
    if (testCase.name === 'Password') {
      extraInfo = {
        strength: calculatePasswordStrength(customInput),
        suggestions: getPasswordSuggestions(customInput),
      };
    }
    
    if (testCase.name === 'Birth Date' && result.isValid) {
      extraInfo = {
        age: calculateAge(customInput),
      };
    }
    
    if (testCase.name === 'Phone Number' && testCase.formatter) {
      extraInfo = {
        formatted: testCase.formatter(customInput),
      };
    }
    
    setCustomResults({ ...result, ...extraInfo });
  };

  const renderTestResult = (result: any, testValue: string) => {
    return (
      <div className="flex items-center gap-2 p-2 border rounded">
        <Badge variant={result.isValid ? "default" : "destructive"} className="text-xs">
          {result.isValid ? "✓" : "✗"}
        </Badge>
        <code className="text-xs flex-1 bg-muted px-2 py-1 rounded">
          {testValue}
        </code>
        {result.error && (
          <span className="text-xs text-destructive flex-1">
            {result.error}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Validation Function Tester</h2>
        <p className="text-muted-foreground">
          Test all validation functions with predefined test cases and custom inputs.
        </p>
      </div>

      {/* Predefined Test Cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testCases.map((testCase, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{testCase.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {testCase.testValues.map((testValue, valueIndex) => {
                  const result = testCase.validator(testValue);
                  return (
                    <div key={valueIndex}>
                      {renderTestResult(result, testValue)}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Input Tester */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Input Tester</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="validator-select">Select Validator</Label>
              <select
                id="validator-select"
                className="w-full p-2 border rounded"
                value={selectedValidator}
                onChange={(e) => setSelectedValidator(Number(e.target.value))}
              >
                {testCases.map((testCase, index) => (
                  <option key={index} value={index}>
                    {testCase.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="custom-input">Test Value</Label>
              <Input
                id="custom-input"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter value to test..."
              />
            </div>
            
            <div className="flex items-end">
              <Button onClick={testCustomInput} className="w-full">
                Test Input
              </Button>
            </div>
          </div>

          {customResults && (
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">Result</CardTitle>
                  <Badge variant={customResults.isValid ? "default" : "destructive"}>
                    {customResults.isValid ? "Valid" : "Invalid"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-muted p-3 rounded overflow-auto">
                  {JSON.stringify(customResults, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Password Strength Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Password Strength Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="password-demo">Type a password to see strength analysis</Label>
            <Input
              id="password-demo"
              type="password"
              placeholder="Enter password..."
              onChange={(e) => {
                const value = e.target.value;
                const result = validatePassword(value);
                const strength = calculatePasswordStrength(value);
                const suggestions = getPasswordSuggestions(value);
                
                setCustomResults({
                  password: value,
                  ...result,
                  strength,
                  suggestions,
                });
              }}
            />
          </div>
          
          {customResults?.password && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Strength:</span>
                <Badge variant={
                  customResults.strength === 'strong' ? 'default' :
                  customResults.strength === 'medium' ? 'secondary' : 'destructive'
                }>
                  {customResults.strength}
                </Badge>
              </div>
              
              {customResults.suggestions?.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Suggestions:</span>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                    {customResults.suggestions.map((suggestion: string, index: number) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}