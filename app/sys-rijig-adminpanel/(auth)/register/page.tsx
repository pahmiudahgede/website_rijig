'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { validateEmail, validatePassword, validatePhone, formatPhoneNumber } from '@/utils/validation';
import { AdminRegisterData } from '@/types/auth.types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { EnhancedDatePicker } from '@/components/date-picker';
import { format } from 'date-fns';

export default function AdminRegisterPage() {
  const { register, fieldErrors } = useAdminAuth();
  const { isLoading, error } = useAuthStore();
  
  const [formData, setFormData] = useState<AdminRegisterData>({
    name: '',
    gender: 'laki-laki',
    dateofbirth: '',
    placeofbirth: '',
    phone: '',
    email: '',
    password: '',
    password_confirm: '',
  });
  
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setValidationErrors({});
    
    const errors: Record<string, string> = {};
    
    if (!formData.name || formData.name.length < 3) {
      errors.name = 'Nama minimal 3 karakter';
    }
    
    if (!formData.dateofbirth) {
      errors.dateofbirth = 'Tanggal lahir harus diisi';
    }
    
    if (!validateEmail(formData.email)) {
      errors.email = 'Email tidak valid';
    }
    
    const formattedPhone = formatPhoneNumber(formData.phone);
    if (!validatePhone(formattedPhone)) {
      errors.phone = 'Nomor telepon tidak valid (format: 62...)';
    }
    
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors.join(', ');
    }
    
    if (formData.password !== formData.password_confirm) {
      errors.password_confirm = 'Password tidak sama';
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    const result = await register({
      ...formData,
      phone: formattedPhone,
    });
    
    if (result.success && result.message) {
      toast.success('Sukses', {
        description: result.message,
      });
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setDateOfBirth(date);
    if (date) {
      const formattedDate = format(date, 'dd-MM-yyyy');
      setFormData({ ...formData, dateofbirth: formattedDate });
    } else {
      setFormData({ ...formData, dateofbirth: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-slate-800 mb-2">
              Admin Register
            </CardTitle>
            <CardDescription className="text-slate-600 text-base">
              Daftar sebagai administrator RIJIK
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="px-8 pb-8">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-6">
                {/* Row 1: Nama & Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Masukkan nama lengkap"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`h-11 ${validationErrors.name || fieldErrors.name ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300 focus-visible:ring-slate-600"}`}
                    />
                    {(validationErrors.name || fieldErrors.name) && (
                      <p className="text-sm text-red-600 mt-1">
                        {validationErrors.name || fieldErrors.name?.[0]}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-semibold text-slate-700">
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={formData.gender} 
                      onValueChange={(value) => setFormData({ ...formData, gender: value as 'laki-laki' | 'perempuan' })}
                    >
                      <SelectTrigger className="h-11 border-slate-300 focus:ring-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="laki-laki">Laki-laki</SelectItem>
                        <SelectItem value="perempuan">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Row 2: Tanggal Lahir & Tempat Lahir */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dateofbirth" className="text-sm font-semibold text-slate-700">
                      Tanggal Lahir <span className="text-red-500">*</span>
                    </Label>
                    <EnhancedDatePicker
                      date={dateOfBirth}
                      onDateChange={handleDateChange}
                      placeholder="Pilih tanggal lahir"
                      maxDate={new Date()}
                      minDate={new Date(1920, 0, 1)}
                      className={`h-11 ${validationErrors.dateofbirth || fieldErrors.dateofbirth ? "border-red-500" : "border-slate-300"}`}
                    />
                    {(validationErrors.dateofbirth || fieldErrors.dateofbirth) && (
                      <p className="text-sm text-red-600 mt-1">
                        {validationErrors.dateofbirth || fieldErrors.dateofbirth?.[0]}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="placeofbirth" className="text-sm font-semibold text-slate-700">
                      Tempat Lahir
                    </Label>
                    <Input
                      id="placeofbirth"
                      placeholder="Masukkan tempat lahir"
                      value={formData.placeofbirth}
                      onChange={(e) => setFormData({ ...formData, placeofbirth: e.target.value })}
                      className="h-11 border-slate-300 focus-visible:ring-slate-600"
                    />
                  </div>
                </div>
                
                {/* Row 3: Phone & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">
                      Nomor Telepon <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      placeholder="081234567890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`h-11 ${validationErrors.phone || fieldErrors.phone ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300 focus-visible:ring-slate-600"}`}
                    />
                    {(validationErrors.phone || fieldErrors.phone) && (
                      <p className="text-sm text-red-600 mt-1">
                        {validationErrors.phone || fieldErrors.phone?.[0]}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`h-11 ${validationErrors.email || fieldErrors.email ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300 focus-visible:ring-slate-600"}`}
                    />
                    {(validationErrors.email || fieldErrors.email) && (
                      <p className="text-sm text-red-600 mt-1">
                        {validationErrors.email || fieldErrors.email?.[0]}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Row 4: Password & Confirm Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Masukkan password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`h-11 ${validationErrors.password || fieldErrors.password ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300 focus-visible:ring-slate-600"}`}
                    />
                    {(validationErrors.password || fieldErrors.password) && (
                      <p className="text-sm text-red-600 mt-1">
                        {validationErrors.password || fieldErrors.password?.[0]}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password_confirm" className="text-sm font-semibold text-slate-700">
                      Konfirmasi Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password_confirm"
                      type="password"
                      placeholder="Konfirmasi password"
                      value={formData.password_confirm}
                      onChange={(e) => setFormData({ ...formData, password_confirm: e.target.value })}
                      className={`h-11 ${validationErrors.password_confirm || fieldErrors.password_confirm ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300 focus-visible:ring-slate-600"}`}
                    />
                    {(validationErrors.password_confirm || fieldErrors.password_confirm) && (
                      <p className="text-sm text-red-600 mt-1">
                        {validationErrors.password_confirm || fieldErrors.password_confirm?.[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="px-8 pt-6 pb-8 bg-slate-50/50">
              <div className="w-full space-y-4">
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-base transition-colors duration-200" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Mendaftar...
                    </>
                  ) : (
                    'Daftar'
                  )}
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-slate-600">
                    Sudah punya akun?{' '}
                    <Link 
                      href="/sys-rijig-adminpanel/login" 
                      className="font-semibold text-slate-800 hover:text-slate-600 transition-colors duration-200"
                    >
                      Login
                    </Link>
                  </p>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}