import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useAdminDashboardStore } from '../store/adminDashboardStore'
import { classNames } from '../utils/helpers'
import { useState, useEffect } from 'react'
import { useAdminAuthStore } from '../store/adminAuthStore'
import { adminAuthService } from '../services/adminAuthService'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import toast from 'react-hot-toast'

export default function AdminDashboardLayout() {
  const sidebarCollapsed = useAdminDashboardStore((state) => state.sidebarCollapsed)
  const admin = useAdminAuthStore((state) => state.admin)
  const setAuth = useAdminAuthStore((state) => state.setAuth)

  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [profileForm, setProfileForm] = useState({ fullName: '', phone: '' })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' })
  const [profileSaving, setProfileSaving] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)

  useEffect(() => {
    const handleOpenProfile = () => {
      setProfileForm({ fullName: admin?.fullName || '', phone: admin?.phone || '' })
      setShowProfileModal(true)
    }
    const handleOpenPassword = () => setShowPasswordModal(true)
    
    document.addEventListener('open-profile-modal', handleOpenProfile)
    document.addEventListener('open-password-modal', handleOpenPassword)
    
    return () => {
      document.removeEventListener('open-profile-modal', handleOpenProfile)
      document.removeEventListener('open-password-modal', handleOpenPassword)
    }
  }, [admin])

  const handleProfileSave = async () => {
    setProfileSaving(true)
    try {
      const res = await adminAuthService.updateProfile(profileForm)
      setAuth(useAdminAuthStore.getState().token!, { ...admin!, ...profileForm })
      toast.success('Profile updated')
      setShowProfileModal(false)
    } catch (err) {
      toast.error('Failed to update profile')
    } finally {
      setProfileSaving(false)
    }
  }

  const handlePasswordSave = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error('Both fields are required')
      return
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setPasswordSaving(true)
    try {
      await adminAuthService.changePassword(passwordForm.currentPassword, passwordForm.newPassword)
      toast.success('Password changed')
      setShowPasswordModal(false)
      setPasswordForm({ currentPassword: '', newPassword: '' })
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to change password')
    } finally {
      setPasswordSaving(false)
    }
  }

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className={classNames('flex-1 flex flex-col transition-all duration-300', sidebarCollapsed ? 'ml-20' : 'ml-64')}>
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      <Modal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} title="Manage Profile">
        <div className="space-y-3">
          <Input label="Full Name" value={profileForm.fullName} onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })} />
          <Input label="Phone" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
          <Button onClick={handleProfileSave} loading={profileSaving} className="w-full">Save Changes</Button>
        </div>
      </Modal>

      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Change Password">
        <div className="space-y-3">
          <Input label="Current Password" type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
          <Input label="New Password" type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
          <Button onClick={handlePasswordSave} loading={passwordSaving} className="w-full">Change Password</Button>
        </div>
      </Modal>
    </div>
  )
}