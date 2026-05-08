import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { AuthLayout } from '../../layouts/AuthLayout'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'
import { AlertBanner } from '../../components/common/AlertBanner'
import { authService } from '../../services/authService'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    licenseKey: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const response = await authService.register(
        formData.email,
        formData.password,
        formData.email.split('@')[0]
      )

      setAuth(response.user, response.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <AlertBanner type="error" message={error} />}

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h2>

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
        />

        <Input
          label="License Key"
          type="text"
          placeholder="Enter your license key"
          value={formData.licenseKey}
          onChange={(e) => setFormData({ ...formData, licenseKey: e.target.value })}
          required
        />

        <Button type="submit" loading={loading} className="w-full">
          Create Account
        </Button>

        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
