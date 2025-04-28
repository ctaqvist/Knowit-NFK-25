import { SupportForm, SupportFormValidity } from '@/types/types';

// Email Regex
// https://regex101.com/library/SOgUIV
const emailRegex = /^[^@]+@[^@]+\.[^@]+$/gim

// Name Regex
const nameRegex = /^[a-z ,.'-]+$/i
const serialRegex = /^[A-Z]{2}-\d{4}[A-Z]{2}-\d{2}[A-Z]{5}$/i
const issueCategories = ["Wheels", "Base", "Battery", "Camera", "Claw Arm"];

// Returns TRUE if valid, FALSE if not
export const validateInput = (input: string, value: string): boolean => {
  switch (input) {
    case 'f_name_input':
    case 's_name_input':
      return nameRegex.test(value) && (value.trim().length > 0);
    case 'email_input':
      // Insert email regex
      return value.trim().length > 0
    case 'issue_category_input':
      return issueCategories.includes(value) && (value.trim().length > 0);
    case 'serial_input':
      return serialRegex.test(value) && (value.trim().length > 0);
    default:
      return value.trim().length > 0;
  }
}

export const validateSupportForm = (formData: SupportForm) => {
  const {fileUploads, ...rest} = formData

  const VALIDITY = {}

  // Check no required input is missing or invalid
  for (const [key, value] of Object.entries(rest)) {
    const isValid = validateInput(key, value) ? undefined : true
    Object.assign(VALIDITY, {...VALIDITY, [key]: isValid})
  }
  return VALIDITY as SupportFormValidity
}