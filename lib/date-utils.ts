import { format, parse, isValid, isFuture, differenceInYears } from "date-fns";

export const formatDateForAPI = (date: Date): string => {
  return format(date, "dd-MM-yyyy");
};

export const parseDateFromAPI = (dateString: string): Date | null => {
  try {
    const parsed = parse(dateString, "dd-MM-yyyy", new Date());
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const formatDateForDisplay = (date: Date): string => {
  return format(date, "dd MMMM yyyy");
};

export const validateBirthDate = (date: Date): string | null => {
  if (isFuture(date)) {
    return "Date of birth cannot be in the future";
  }
  
  const age = differenceInYears(new Date(), date);
  if (age < 17) {
    return "You must be at least 17 years old";
  }
  
  if (age > 100) {
    return "Please enter a valid date of birth";
  }
  
  return null;
};
