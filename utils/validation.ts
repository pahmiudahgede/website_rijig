export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^62\d{8,14}$/;
  return phoneRegex.test(phone);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password minimal 8 karakter");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password harus memiliki minimal 1 huruf kapital");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password harus memiliki karakter khusus");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePIN = (pin: string): boolean => {
  return /^\d{6}$/.test(pin);
};

export const validateOTP = (otp: string): boolean => {
  return /^\d{4}$/.test(otp);
};

export const validateDateFormat = (date: string): boolean => {
  const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

  if (!dateRegex.test(date)) {
    return false;
  }

  const [day, month, year] = date.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day);

  return (
    dateObj.getDate() === day &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getFullYear() === year
  );
};

export const formatPhoneNumber = (phone: string): string => {
  let cleaned = phone.replace(/\D/g, "");

  if (!cleaned.startsWith("62")) {
    if (cleaned.startsWith("0")) {
      cleaned = "62" + cleaned.substring(1);
    } else {
      cleaned = "62" + cleaned;
    }
  }

  return cleaned;
};

// Format date from DD-MM-YYYY to Date object
export const parseDate = (dateStr: string): Date | null => {
  if (!validateDateFormat(dateStr)) return null;
  
  const [day, month, year] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

// Format Date object to DD-MM-YYYY
export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}-${month}-${year}`;
};

// Validate company data
export const validateCompanyData = (data: any): {
  isValid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};
  
  if (!data.companyname || data.companyname.trim().length < 3) {
    errors.companyname = "Nama perusahaan minimal 3 karakter";
  }
  
  if (!data.companyaddress || data.companyaddress.trim().length < 10) {
    errors.companyaddress = "Alamat perusahaan minimal 10 karakter";
  }
  
  if (!validatePhone(data.companyphone)) {
    errors.companyphone = "Nomor telepon perusahaan tidak valid (format: 62...)";
  }
  
  if (!validateEmail(data.companyemail)) {
    errors.companyemail = "Email perusahaan tidak valid";
  }
  
  if (data.companywebsite && !isValidUrl(data.companywebsite)) {
    errors.companywebsite = "Website perusahaan tidak valid";
  }
  
  if (!data.taxid || data.taxid.trim().length < 9) {
    errors.taxid = "NPWP minimal 9 karakter";
  }
  
  if (!validateDateFormat(data.foundeddate)) {
    errors.foundeddate = "Format tanggal tidak valid (DD-MM-YYYY)";
  }
  
  if (!data.companytype || data.companytype.trim().length < 3) {
    errors.companytype = "Jenis perusahaan minimal 3 karakter";
  }
  
  if (!data.companydescription || data.companydescription.trim().length < 20) {
    errors.companydescription = "Deskripsi perusahaan minimal 20 karakter";
  }
  
  if (!data.company_logo) {
    errors.company_logo = "Logo perusahaan wajib diupload";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate URL
export const isValidUrl = (urlString: string): boolean => {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '')
    .trim();
};