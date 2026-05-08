import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Eye, EyeOff, Zap, Layers, TrendingUp, BarChart3, Shield, Infinity } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/authService'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authService.login(formData.email, formData.password)
      setAuth(response.user, response.token)
      if (rememberMe) {
        localStorage.setItem('rememberEmail', formData.email)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const features = [
    { icon: Zap, title: 'Real-Time Analytics', desc: 'Instant insights into your supply chain' },
    { icon: Layers, title: 'Smart Forecasting', desc: 'AI-powered demand predictions' },
    { icon: TrendingUp, title: 'Cost Optimization', desc: 'Reduce expenses up to 30%' },
    { icon: BarChart3, title: 'Advanced Reporting', desc: 'Comprehensive dashboards' },
    { icon: Shield, title: 'Enterprise Security', desc: 'Bank-grade data protection' },
    { icon: Infinity, title: 'Unlimited Scalability', desc: 'Grow without limits' },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
        <div className="mb-8 flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">SupplySense</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your SupplySense account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-gray-900">Password</label>
              <Link to="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700 cursor-pointer">
              Remember me for 30 days
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : (
              <>
                Sign In
                <ArrowRight size={20} />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-600">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'Google', icon: '🔍' },
              { name: 'GitHub', icon: '🐙' },
              { name: 'Microsoft', icon: '🪟' },
            ].map((provider) => (
              <button
                key={provider.name}
                type="button"
                className="py-3 px-2 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition text-center font-medium text-sm"
              >
                <span className="text-xl">{provider.icon}</span>
              </button>
            ))}
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-700 pt-4">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition">
              Create one now
            </Link>
          </p>
        </form>

        {/* Security Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-900">
            🔒 Your connection is secure and encrypted. We never store your password on our servers.
          </p>
        </div>
      </div>

      {/* Right Side - Features (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 items-center justify-center p-12 relative overflow-hidden">
        {/* Background Animation Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

        {/* Content */}
        <div className="relative z-10 text-white">
          {/* Main Message */}
          <div className="mb-12">
            <h3 className="text-4xl font-bold mb-4">Unlock Your Supply Chain Potential</h3>
            <p className="text-xl text-blue-100">
              Join thousands of businesses optimizing their supply chains with AI-powered intelligence.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex gap-4 items-start group">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">{feature.title}</h4>
                    <p className="text-blue-100">{feature.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Stats */}
          <div className="mt-12 pt-8 border-t border-blue-400 flex gap-8">
            <div>
              <p className="text-3xl font-bold">10K+</p>
              <p className="text-blue-100">Active Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold">99.9%</p>
              <p className="text-blue-100">Uptime</p>
            </div>
            <div>
              <p className="text-3xl font-bold">24/7</p>
              <p className="text-blue-100">Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
