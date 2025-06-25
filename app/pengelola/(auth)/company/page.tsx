'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LoadingState } from '@/components/ui/loading-spinner';
import { FormErrorSummary, InlineFormError } from '@/components/ui/form-error-display';
import { Building, Upload } from 'lucide-react';
import { usePengelolaAuth, useRegistrationFlowRedirect } from '@/hooks';
import { useFormValidation } from '@/hooks/use-form-validation';
import { 
  createCompanyProfileValidator,
  validateCompanyPhone,
  validateEmail,
  validateWebsite,
  validateTaxID,
  validateImageFile,
} from '@/utils/validators';

export default function CompanyProfilePage() {
  const router = useRouter();
  const { createCompanyProfile, isCreatingCompany, companyError, clearCompanyError } = usePengelolaAuth();
  
  // Protect route - harus sudah verify OTP
  useRegistrationFlowRedirect();
  
  const [formData, setFormData] = useState({
    companyname: '',
    companyaddress: '',
    companyphone: '',
    companyemail: '',
    companywebsite: '',
    taxid: '',
    foundeddate: '',
    companytype: '',
    companydescription: '',
  });

  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  const validator = createCompanyProfileValidator();
  const { validateForm, getFieldError, hasFieldError } = useFormValidation(validator);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearCompanyError();
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCompanyLogo(file);
    setLogoError(null);
    clearCompanyError();

    if (file) {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        setLogoError(validation.error || 'Invalid file');
        setCompanyLogo(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate logo
    if (!companyLogo) {
      setLogoError('Company logo is required');
      return;
    }

    const validation = validateForm(formData);
    if (!validation.isValid) return;

    try {
      const result = await createCompanyProfile({
        ...formData,
        company_logo: companyLogo,
      } as any);
      
      if (result.success) {
        router.push('/pengelola/approval');
      }
    } catch (error) {
      // Error sudah di-handle oleh hook
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Building className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Company Information</CardTitle>
            <CardDescription>
              Please provide your company details for verification
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {companyError && (
                <FormErrorSummary 
                  errors={{ company: companyError }} 
                  dismissible
                  onDismiss={clearCompanyError}
                />
              )}

              {/* Company Logo */}
              <div className="space-y-2">
                <Label htmlFor="logo">Company Logo *</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className={logoError ? 'border-red-500' : ''}
                    />
                    <InlineFormError error={logoError} />
                    <p className="text-xs text-muted-foreground mt-1">
                      Max 2MB, JPG/PNG/WebP format
                    </p>
                  </div>
                  {companyLogo && (
                    <div className="w-16 h-16 border rounded-lg overflow-hidden">
                      <img 
                        src={URL.createObjectURL(companyLogo)} 
                        alt="Logo preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Company Name */}
              <div className="space-y-1">
                <Label htmlFor="companyname">Company Name *</Label>
                <Input
                  id="companyname"
                  type="text"
                  value={formData.companyname}
                  onChange={(e) => handleInputChange('companyname', e.target.value)}
                  className={hasFieldError('companyname') ? 'border-red-500' : ''}
                  placeholder="PT. Your Company Name"
                />
                <InlineFormError error={getFieldError('companyname') || null} />
              </div>

              {/* Company Address */}
              <div className="space-y-1">
                <Label htmlFor="companyaddress">Company Address *</Label>
                <Textarea
                  id="companyaddress"
                  value={formData.companyaddress}
                  onChange={(e) => handleInputChange('companyaddress', e.target.value)}
                  className={hasFieldError('companyaddress') ? 'border-red-500' : ''}
                  placeholder="Full company address including city and postal code"
                  rows={3}
                />
                <InlineFormError error={getFieldError('companyaddress') || null} />
              </div>

              {/* Company Phone & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="companyphone">Company Phone *</Label>
                  <Input
                    id="companyphone"
                    type="tel"
                    value={formData.companyphone}
                    onChange={(e) => handleInputChange('companyphone', e.target.value)}
                    className={hasFieldError('companyphone') ? 'border-red-500' : ''}
                    placeholder="6281234567890"
                  />
                  <InlineFormError error={getFieldError('companyphone') || null} />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="companyemail">Company Email *</Label>
                  <Input
                    id="companyemail"
                    type="email"
                    value={formData.companyemail}
                    onChange={(e) => handleInputChange('companyemail', e.target.value)}
                    className={hasFieldError('companyemail') ? 'border-red-500' : ''}
                    placeholder="info@company.com"
                  />
                  <InlineFormError error={getFieldError('companyemail') || null} />
                </div>
              </div>

              {/* Website & Tax ID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="companywebsite">Company Website</Label>
                  <Input
                    id="companywebsite"
                    type="url"
                    value={formData.companywebsite}
                    onChange={(e) => handleInputChange('companywebsite', e.target.value)}
                    className={hasFieldError('companywebsite') ? 'border-red-500' : ''}
                    placeholder="https://company.com"
                  />
                  <InlineFormError error={getFieldError('companywebsite') || null} />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="taxid">Tax ID (NPWP) *</Label>
                  <Input
                    id="taxid"
                    type="text"
                    value={formData.taxid}
                    onChange={(e) => handleInputChange('taxid', e.target.value)}
                    className={hasFieldError('taxid') ? 'border-red-500' : ''}
                    placeholder="123456789012345"
                  />
                  <InlineFormError error={getFieldError('taxid') || null} />
                </div>
              </div>

              {/* Founded Date & Company Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="foundeddate">Founded Date *</Label>
                  <Input
                    id="foundeddate"
                    type="text"
                    value={formData.foundeddate}
                    onChange={(e) => handleInputChange('foundeddate', e.target.value)}
                    className={hasFieldError('foundeddate') ? 'border-red-500' : ''}
                    placeholder="DD-MM-YYYY"
                  />
                  <InlineFormError error={getFieldError('foundeddate') || null} />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="companytype">Company Type *</Label>
                  <Input
                    id="companytype"
                    type="text"
                    value={formData.companytype}
                    onChange={(e) => handleInputChange('companytype', e.target.value)}
                    className={hasFieldError('companytype') ? 'border-red-500' : ''}
                    placeholder="e.g., Waste Management, Recycling"
                  />
                  <InlineFormError error={getFieldError('companytype') || null} />
                </div>
              </div>

              {/* Company Description */}
              <div className="space-y-1">
                <Label htmlFor="companydescription">Company Description *</Label>
                <Textarea
                  id="companydescription"
                  value={formData.companydescription}
                  onChange={(e) => handleInputChange('companydescription', e.target.value)}
                  className={hasFieldError('companydescription') ? 'border-red-500' : ''}
                  placeholder="Describe your company's main business, services, and experience in waste management..."
                  rows={4}
                />
                <InlineFormError error={getFieldError('companydescription') || null} />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Your information will be reviewed by our admin team</li>
                  <li>• Verification typically takes 1-24 hours</li>
                  <li>• You'll be notified once approved</li>
                  <li>• After approval, you can create your PIN and start using the platform</li>
                </ul>
              </div>

              {/* Submit Button */}
              <LoadingState isLoading={isCreatingCompany} loadingText="Submitting information...">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isCreatingCompany}
                  size="lg"
                >
                  Submit for Review
                </Button>
              </LoadingState>

              {/* Back Button */}
              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                  className="text-sm text-muted-foreground"
                >
                  ← Back
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}