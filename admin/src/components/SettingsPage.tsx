import { useState } from 'react'
import GeneralTab from './admin/GeneralTab'
import SystemSettingsTab from './admin/SystemSettingsTab'
import PaymentConfigTab from './admin/PaymentConfigTab'
import PricingTab from './admin/PricingTab'
import AdminUsersTab from './admin/AdminUsersTab'
import LegalTab from './admin/LegalTab'
import BackupTab from './admin/BackupTab'
import { classNames } from '../utils/helpers'

const tabs = [
  { key: 'general', label: 'General', component: GeneralTab },
  { key: 'system', label: 'System', component: SystemSettingsTab },
  { key: 'payment', label: 'Payment', component: PaymentConfigTab },
  { key: 'pricing', label: 'Pricing', component: PricingTab },
  { key: 'users', label: 'Admin Users', component: AdminUsersTab },
  { key: 'legal', label: 'Legal', component: LegalTab },
  { key: 'backups', label: 'Backups', component: BackupTab },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const ActiveComponent = tabs.find(t => t.key === activeTab)?.component || GeneralTab

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Settings</h1>

      <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={classNames(
              'px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
              activeTab === tab.key
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ActiveComponent />
    </div>
  )
}