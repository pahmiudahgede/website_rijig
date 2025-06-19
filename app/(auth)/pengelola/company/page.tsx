'use client';

import { useState, useEffect } from 'react';
import { usePengelolaAuth } from '@/hooks/usePengelolaAuth';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';
import { CompanyProfileData } from '@/types/auth.types';
import { validateCompanyData, formatPhoneNumber } from '@/utils/validation';

export default function PengelolaCompanyPage() {
  const { createCompanyProfile } = usePengelolaAuth();
  const { isLoading, error } = useAuthStore();
  const { user } = useAuth({
    requireAuth: true,
    requireRole: 'pengelola',
  });
  
  const [formData, setFormData] = useState<Omit<CompanyProfileData, 'company_logo'>>({
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
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Redirect if not at correct step
    if (user && user.registration_status !== 'uncomplete') {
      // Handle redirect based on status
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setValidationErrors({});
    
    // Format phone
    const formattedData = {
      ...formData,
      companyphone: formatPhoneNumber(formData.companyphone),
    };
    
    // Validate
    const validation = validateCompanyData({
      ...formattedData,
      company_logo: logoFile,
    });
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }
    
    if (!logoFile) {
      setValidationErrors({ company_logo: 'Logo perusahaan wajib diupload' });
      return;
    }
    
    // Submit
    await createCompanyProfile({
      ...formattedData,
      company_logo: logoFile,
    } as CompanyProfileData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Data Perusahaan
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Lengkapi data perusahaan Anda untuk melanjutkan proses registrasi
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Logo Perusahaan *
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="h-20 w-20 object-contain border rounded"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                </div>
                {validationErrors.company_logo && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.company_logo}</p>
                )}
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nama Perusahaan *
                </label>
                <input
                  type="text"
                  value={formData.companyname}
                  onChange={(e) => setFormData({ ...formData, companyname: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="PT. Contoh Perusahaan"
                />
                {validationErrors.companyname && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.companyname}</p>
                )}
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Alamat Perusahaan *
                </label>
                <textarea
                  rows={3}
                  value={formData.companyaddress}
                  onChange={(e) => setFormData({ ...formData, companyaddress: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Jl. Contoh No. 1, Jakarta"
                />
                {validationErrors.companyaddress && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.companyaddress}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nomor Telepon Perusahaan *
                </label>
                <input
                  type="tel"
                  value={formData.companyphone}
                  onChange={(e) => setFormData({ ...formData, companyphone: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="081234567890"
                />
                {validationErrors.companyphone && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.companyphone}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Perusahaan *
                </label>
                <input
                  type="email"
                  value={formData.companyemail}
                  onChange={(e) => setFormData({ ...formData, companyemail: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="info@perusahaan.com"
                />
                {validationErrors.companyemail && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.companyemail}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Website Perusahaan
                </label>
                <input
                  type="url"
                  value={formData.companywebsite}
                  onChange={(e) => setFormData({ ...formData, companywebsite: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="https://perusahaan.com"
                />
                {validationErrors.companywebsite && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.companywebsite}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  NPWP *
                </label>
                <input
                  type="text"
                  value={formData.taxid}
                  onChange={(e) => setFormData({ ...formData, taxid: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="123456789"
                />
                {validationErrors.taxid && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.taxid}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tanggal Berdiri * (DD-MM-YYYY)
                </label>
                <input
                  type="text"
                  value={formData.foundeddate}
                  onChange={(e) => setFormData({ ...formData, foundeddate: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="10-09-2015"
                />
                {validationErrors.foundeddate && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.foundeddate}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Jenis Perusahaan *
                </label>
                <input
                  type="text"
                  value={formData.companytype}
                  onChange={(e) => setFormData({ ...formData, companytype: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Waste recycle"
                />
                {validationErrors.companytype && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.companytype}</p>
                )}
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Deskripsi Perusahaan *
                </label>
                <textarea
                  rows={4}
                  value={formData.companydescription}
                  onChange={(e) => setFormData({ ...formData, companydescription: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Deskripsi tentang perusahaan Anda..."
                />
                {validationErrors.companydescription && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.companydescription}</p>
                )}
              </div>
            </div>
            
            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Loading...' : 'Kirim Data'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}