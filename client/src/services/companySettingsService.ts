import { apiFetch, apiFetchFormData } from './api'
import { CompanyInfo } from './types'

export const companySettingsService = {
  getCompanySettings: () => apiFetch<CompanyInfo>('/company-settings'),
  updateCompanySettings: (data: Partial<CompanyInfo>) =>
    apiFetch<CompanyInfo>('/company-settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  uploadCompanyLogo: (file: File) => {
    const formData = new FormData()
    formData.append('logo', file)
    return apiFetchFormData<CompanyInfo>('/company-settings/logo', formData)
  },
}
