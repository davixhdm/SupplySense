import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { AuthLayout } from '../../layouts/AuthLayout'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'
import { AlertBanner } from '../../components/common/AlertBanner'
import { authService } from '../../services/authService'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authService.login(formData.email, formData.password)
      setAuth(response.user, response.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <AlertBanner type="error" message={error} />}
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>
        
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
        
        <Button type="submit" loading={loading} className="w-full">
          Sign In
        </Button>
        
        <p className="text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
