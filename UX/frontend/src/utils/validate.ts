import { SupportForm, SupportFormValidity } from '@/types/types';

// Email Regex
// https://regex101.com/library/SOgUIV
const emailRegex = /^[^@]+@[^@]+\.[^@]+$/gim

// Name Regex
const nameRegex = /^[a-z ,.'-]+$/i
// const serialRegex = /^[A-Z]{2}-\d{4}[A-Z]{2}-\d{2}[A-Z]{5}$/i
const issueCategories = ["Wheels", "Base", "Battery", "Camera", "Claw Arm"];

// Returns TRUE if valid, FALSE if not
export const validateInput = (input: string, value: string): string => {
  switch (input) {
    case 'f_name_input':
    case 's_name_input':
      if (value.trim().length < 1) return `Please provide a name`
      if (!nameRegex.test(value)) return `Invalid name`
      return ''
    case 'email_input':
      if (value.trim().length < 1) return `Please provide an e-mail`
      return ''
    case 'issue_category_input':
      if (!issueCategories.includes(value)) return `Please provide an issue category`
      return '';
    case 'serial_input':
      if (value.trim().length < 1) return `Please provide a serial number`
      return '';
    case 'date_input':
      if (value.trim().length < 1) return `Please provide an approximate date`
      return '';
    case 'issue_description_input':
      if (value.trim().length < 1) return `Please provide some details regarding your issue`
      return '';
    default:
      if (value.trim().length < 1) return `Missing input`
      return ''
  }
}

export const validateSupportForm = (formData: SupportForm) => {
  const {fileUploads, ...rest} = formData

  const VALIDITY = {}

  // Check no required input is missing or invalid
  for (const [key, value] of Object.entries(rest)) {
    const isValid = validateInput(key, value)
    Object.assign(VALIDITY, {...VALIDITY, [key]: isValid})
  }
  return VALIDITY as SupportFormValidity
}