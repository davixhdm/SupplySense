import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Mail,
  Lock,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Zap,
  Users,
  BarChart3,
  Lock as LockIcon,
  Globe,
  TrendingUp,
} from 'lucide-react'

import { useAuthStore } from '../../store/authStore'
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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const getPasswordStrength = (password: string) => {
    let strength = 0

    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[!@#$%^&*]/.test(password)) strength++

    return strength
  }

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const pwd = e.target.value

    setFormData({
      ...formData,
      password: pwd,
    })

    setPasswordStrength(getPasswordStrength(pwd))
  }

  const passwordsMatch =
    formData.password === formData.confirmPassword

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500'
    if (passwordStrength <= 2) return 'bg-orange-500'
    if (passwordStrength <= 3) return 'bg-yellow-500'
    if (passwordStrength <= 4) return 'bg-blue-500'

    return 'bg-green-500'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError('')

    if (!agreeTerms) {
      setError(
        'Please agree to the Terms of Service and Privacy Policy'
      )
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (passwordStrength < 2) {
      setError('Password is too weak')
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
      setError(
        err instanceof Error
          ? err.message
          : 'Registration failed'
      )
    } finally {
      setLoading(false)
    }
  }

  const benefits = [
    {
      icon: Zap,
      title: 'Instant Setup',
      desc: 'Get started in minutes',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      desc: 'Work together seamlessly',
    },
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      desc: 'Data-driven decisions',
    },
    {
      icon: LockIcon,
      title: 'Enterprise Security',
      desc: 'Your data is protected',
    },
    {
      icon: Globe,
      title: 'Global Scale',
      desc: 'Manage worldwide operations',
    },
    {
      icon: TrendingUp,
      title: 'Cost Savings',
      desc: 'Reduce expenses by 30%',
    },
  ]

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6 lg:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                S
              </span>
            </div>

            <span className="text-2xl font-bold text-gray-900">
              SupplySense
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>

            <p className="text-gray-600">
              Join SupplySense and optimize your supply chain
              today
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition"
                  required
                />
              </div>
            </div>

            {/* License Key */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                License Key
              </label>

              <div className="relative">
                <Key
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />

                <input
                  type="text"
                  placeholder="Enter your license key"
                  value={formData.licenseKey}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      licenseKey: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition"
                  required
                />
              </div>

              <p className="text-xs text-gray-500">
                You'll find this in your welcome email
              </p>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />

                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {/* Password Strength */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${getStrengthColor()} transition-all duration-300`}
                      style={{
                        width: `${
                          (passwordStrength / 5) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Confirm Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />

                <input
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {formData.confirmPassword && (
                <p className="text-xs flex items-center gap-1">
                  {passwordsMatch ? (
                    <>
                      <CheckCircle
                        size={14}
                        className="text-green-600"
                      />

                      <span className="text-green-600">
                        Passwords match
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle
                        size={14}
                        className="text-red-600"
                      />

                      <span className="text-red-600">
                        Passwords don't match
                      </span>
                    </>
                  )}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) =>
                  setAgreeTerms(e.target.checked)
                }
                className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded cursor-pointer"
              />

              <label
                htmlFor="agreeTerms"
                className="text-sm text-gray-700 cursor-pointer"
              >
                I agree to the{' '}
                <Link
                  to="#"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  to="#"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={
                loading ||
                !agreeTerms ||
                !passwordsMatch ||
                passwordStrength < 2
              }
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                'Creating account...'
              ) : (
                <>
                  Create Account
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {/* Login */}
            <p className="text-center text-gray-700 pt-4">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                Sign in here
              </Link>
            </p>
          </form>

          {/* Security */}
          <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-900">
              🔒 Your data is encrypted end-to-end. We
              comply with GDPR, CCPA, and ISO 27001.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden lg:flex w-1/2 min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 items-center justify-center p-12 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

        {/* Content */}
        <div className="relative z-10 text-white">
          {/* Main Heading */}
          <div className="mb-12">
            <h3 className="text-4xl font-bold mb-4">
              Join SupplySense Today
            </h3>

            <p className="text-xl text-blue-100">
              Transform your supply chain with AI-powered
              insights and real-time analytics.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon

              return (
                <div
                  key={index}
                  className="flex gap-3 items-start"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Icon
                      size={20}
                      className="text-white"
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-1">
                      {benefit.title}
                    </h4>

                    <p className="text-xs text-blue-100">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Stats */}
          <div className="mt-12 pt-8 border-t border-blue-400">
            <p className="text-sm text-blue-100 mb-3">
              ✓ Trusted by over 10,000 businesses worldwide
            </p>

            <p className="text-sm text-blue-100">
              ✓ 99.9% uptime guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}