import { ContactForm, SupportForm, SupportFormValidity } from '@/types/types';

// Email Regex
// https://regex101.com/library/SOgUIV
const emailRegex = /^[^@]+@[^@]+$/;

// Name Regex
const nameRegex = /^[a-z ,.'-]+$/i
const serialRegex = /^[A-Z]{2}-\d{4}[A-Z]{2}-\d{2}[A-Z]{5}$/i
//const issueCategories = ["Wheels", "Base", "Battery", "Camera", "Claw Arm"];

// Returns TRUE if valid, FALSE if not
export const validateSupportInput = (input: string, value: string): string => {
  switch (input) {
    case 'f_name_input':
    case 's_name_input':
      if (value.trim().length < 1) return `Please provide a name`
      if (!nameRegex.test(value)) return `Invalid name`
      return ''
    case 'email_input':
      if (value.trim().length < 1) return `Please provide an e-mail`
      if (!emailRegex.test(value)) return `Please provide a valid e-mail`
      return ''
    case 'issue_category_input':
      if (value === 'Select an option') return `Please provide an issue category`
      return '';
    case 'serial_input':
      if (value.trim().length < 1) return `Please provide a serial number`
      if (!serialRegex.test(value)) return `Invalid serial number`
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
    const isValid = validateSupportInput(key, value)
    Object.assign(VALIDITY, {...VALIDITY, [key]: isValid})
  }
  return VALIDITY as SupportFormValidity
}

export const validateContactInput = (input: string, value: string): string => {
  switch (input) {
    case 'firstName':
    case 'surName':
      if (value.trim().length < 1) return `Please provide a name`
      if (!nameRegex.test(value)) return `Invalid name`
      return ''
    case 'email':
      if (value.trim().length < 1) return `Please provide an e-mail`
      if (!emailRegex.test(value)) return `Please provide a valid e-mail`
      return ''
    case 'companyName':
      if (value.trim().length < 1) return `Please provide a company name`
      return ''
    case 'businessField':
      if (value === 'Select an option') return `Please provide a business field`
      return '';
    case 'message':
      if (value.trim().length < 1) return `Please provide a message`
      return '';
    default:
      if (value.trim().length < 1) return `Missing input`
      return ''
  }
}

export const validateContactForm = (formData: ContactForm) => {
  const {booking, telephone, ...rest} = formData
  const VALIDITY = {}

  // Check no required input is missing or invalid
  for (const [key, value] of Object.entries(rest)) {
    const isValid = validateContactInput(key, value)
    Object.assign(VALIDITY, {...VALIDITY, [key]: isValid})
  }
  return VALIDITY as Omit<ContactForm, 'telephone' | 'booking'>
}