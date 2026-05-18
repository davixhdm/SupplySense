import { apiFetch } from './api'
import { UserSettings } from './types'

export const preferencesService = {
  getPreferences: () => apiFetch<UserSettings>('/preferences'),
  updatePreferences: (data: Partial<UserSettings>) =>
    apiFetch<UserSettings>('/preferences', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
}
