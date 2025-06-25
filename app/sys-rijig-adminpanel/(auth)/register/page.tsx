'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingState } from '@/components/ui/loading-spinner';
import { FormErrorSummary, InlineFormError } from '@/components/ui/form-error-display';
import { useAdminAuth } from '@/hooks';
import { useFormValidation } from '@/hooks/use-form-validation';
import { 
  createAdminRegistrationValidator,
  validatePassword,
  calculatePasswordStrength,
  getPasswordStrengthColor,
} from '@/utils/validators';
import { Badge } from '@/components/ui/badge';

export default function AdminRegisterPage() {
  const router = useRouter();
  const { register, isRegistering, registerError, clearRegisterError } = useAdminAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dateofbirth: '',
    placeofbirth: '',
    phone: '',
    email: '',
    password: '',
    password_confirm: '',
  });

  const validator = createAdminRegistrationValidator();
  const { validateForm, getFieldError, hasFieldError } = useFormValidation(validator);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearRegisterError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateForm(formData);
    if (!validation.isValid) return;

    try {
      const result = await register(formData as any);
      if (result.success) {
        router.push('/sys-rijig-adminpanel/login?registered=true');
      }
    } catch (error) {
      // Error sudah di-handle oleh hook
    }
  };

  const passwordStrength = calculatePasswordStrength(formData.password);
  const passwordValidation = validatePassword(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Registration</CardTitle>
          <CardDescription>
            Create your administrator account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {registerError && (
              <FormErrorSummary 
                errors={{ register: registerError }} 
                dismissible
                onDismiss={clearRegisterError}
              />
            )}

            {/* Name */}
            <div className="space-y-1">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={hasFieldError('name') ? 'border-red-500' : ''}
              />
              <InlineFormError error={getFieldError('name') || null} />
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger className={hasFieldError('gender') ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
              <InlineFormError error={getFieldError('gender') || null} />
            </div>

            {/* Date of Birth */}
            <div className="space-y-1">
              <Label htmlFor="dateofbirth">Date of Birth</Label>
              <Input
                id="dateofbirth"
                type="text"
                placeholder="DD-MM-YYYY"
                value={formData.dateofbirth}
                onChange={(e) => handleInputChange('dateofbirth', e.target.value)}
                className={hasFieldError('dateofbirth') ? 'border-red-500' : ''}
              />
              <InlineFormError error={getFieldError('dateofbirth') || null} />
            </div>

            {/* Place of Birth */}
            <div className="space-y-1">
              <Label htmlFor="placeofbirth">Place of Birth</Label>
              <Input
                id="placeofbirth"
                type="text"
                value={formData.placeofbirth}
                onChange={(e) => handleInputChange('placeofbirth', e.target.value)}
                className={hasFieldError('placeofbirth') ? 'border-red-500' : ''}
              />
              <InlineFormError error={getFieldError('placeofbirth') || null} />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="628123456789"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={hasFieldError('phone') ? 'border-red-500' : ''}
              />
              <InlineFormError error={getFieldError('phone') || null} />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={hasFieldError('email') ? 'border-red-500' : ''}
              />
              <InlineFormError error={getFieldError('email') || null} />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={hasFieldError('password') ? 'border-red-500' : ''}
              />
              {formData.password && (
                <div className="flex items-center justify-between text-xs">
                  <span>Strength:</span>
                  <Badge className={getPasswordStrengthColor(passwordStrength)}>
                    {passwordStrength}
                  </Badge>
                </div>
              )}
              <InlineFormError error={getFieldError('password') || null} />
              {!passwordValidation.isValid && passwordValidation.suggestions && (
                <div className="text-xs text-muted-foreground">
                  <p>Requirements:</p>
                  <ul className="list-disc list-inside">
                    {passwordValidation.suggestions.map((suggestion, i) => (
                      <li key={i}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <Label htmlFor="password_confirm">Confirm Password</Label>
              <Input
                id="password_confirm"
                type="password"
                value={formData.password_confirm}
                onChange={(e) => handleInputChange('password_confirm', e.target.value)}
                className={hasFieldError('password_confirm') ? 'border-red-500' : ''}
              />
              <InlineFormError error={getFieldError('password_confirm') || null} />
            </div>

            {/* Submit Button */}
            <LoadingState isLoading={isRegistering} loadingText="Creating account...">
              <Button type="submit" className="w-full" disabled={isRegistering}>
                Create Account
              </Button>
            </LoadingState>

            {/* Login Link */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/sys-rijig-adminpanel/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}