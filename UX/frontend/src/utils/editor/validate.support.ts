export function validateNewFile(files: FileList): {
  isValid: boolean,
  errorMessage?: string
} {
  if (files.length > 1)  return {isValid: false, errorMessage: 'Please upload only one file'}
  if (files[0].type !== 'application/pdf') return {isValid: false, errorMessage: 'File must be of PDF format!'}
  return {
    isValid: true
  }
}