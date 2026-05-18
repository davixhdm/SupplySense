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
  Sparkles,
  Rocket,
} from 'lucide-react'

import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/authService'

// Add smooth animations with inline CSS
const smoothAnimations = `
  @keyframes smoothFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  @keyframes smoothGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
    50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
  }
  .animate-float {
    animation: smoothFloat 3s ease-in-out infinite;
  }
  .animate-glow {
    animation: smoothGlow 2s ease-in-out infinite;
  }
  .glass-effect {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  .input-smooth {
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(59, 130, 246, 0.2);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .input-smooth:focus {
    background: rgba(255, 255, 255, 0.8);
    border-color: rgba(59, 130, 246, 0.6);
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.3);
  }
  .btn-smooth {
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .btn-smooth::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.6s;
  }
  .btn-smooth:hover::before {
    left: 100%;
  }
`

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
    <>
      <style>{smoothAnimations}</style>
      <div className="min-h-screen flex overflow-hidden relative bg-gradient-to-br from-slate-900 via-slate-900 to-black">
        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: '2s'}}></div>

        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6 lg:p-12 relative z-10">
          <style>{smoothAnimations}</style>
          <div className="w-full max-w-md">
            {/* Logo with Glow */}
            <div className="mb-8 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-glow">
                <Rocket className="text-white" size={24} />
              </div>
              <div>
                <p className="text-xs text-blue-400 font-semibold tracking-widest">SUPPLYSENSE</p>
                <p className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">NEXGEN</p>
              </div>
            </div>

            {/* Header */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={20} className="text-purple-400" />
                <span className="text-xs font-semibold text-purple-400 tracking-widest">CREATE ACCOUNT</span>
              </div>
              <h2 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-3">
                Join the Future
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Experience next-generation supply chain management
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 text-red-400 text-sm backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="group">
                <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 opacity-60 group-focus-within:opacity-100 transition-opacity" size={18} />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-smooth w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* License Key */}
              <div className="group">
                <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">License Key</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 opacity-60 group-focus-within:opacity-100 transition-opacity" size={18} />
                  <input
                    type="text"
                    placeholder="Enter your license key"
                    value={formData.licenseKey}
                    onChange={(e) => setFormData({ ...formData, licenseKey: e.target.value })}
                    className="input-smooth w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1.5">Find this in your welcome email</p>
              </div>

              {/* Password */}
              <div className="group">
                <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 opacity-60 group-focus-within:opacity-100 transition-opacity" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    className="input-smooth w-full pl-12 pr-12 py-3 rounded-xl text-white placeholder-gray-500 outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 opacity-60 hover:opacity-100 transition-opacity"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Strength */}
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400">Strength</span>
                      <span className="text-xs font-semibold text-blue-400">{Math.round((passwordStrength / 5) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getStrengthColor()} rounded-full`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="group">
                <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 opacity-60 group-focus-within:opacity-100 transition-opacity" size={18} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="input-smooth w-full pl-12 pr-12 py-3 rounded-xl text-white placeholder-gray-500 outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 opacity-60 hover:opacity-100 transition-opacity"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Match Indicator */}
                {formData.confirmPassword && (
                  <div className="flex items-center gap-2 mt-2">
                    {passwordsMatch ? (
                      <>
                        <CheckCircle size={16} className="text-emerald-400" />
                        <span className="text-xs text-emerald-400">Passwords match perfectly</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={16} className="text-orange-400" />
                        <span className="text-xs text-orange-400">Passwords don't match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-1 accent-blue-500 cursor-pointer rounded"
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-400 cursor-pointer leading-relaxed">
                  I agree to the{' '}
                  <Link to="#" className="text-blue-400 font-semibold hover:text-cyan-400 transition-colors">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="#" className="text-blue-400 font-semibold hover:text-cyan-400 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !agreeTerms || !passwordsMatch || passwordStrength < 2}
                className="btn-smooth w-full py-3 px-4 mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              {/* Login Link */}
              <p className="text-center text-gray-400 text-sm pt-4">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text hover:from-cyan-400 hover:to-blue-400 transition-all">
                  Sign in here
                </Link>
              </p>
            </form>

            {/* Security Banner */}
            <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 backdrop-blur-sm">
              <p className="text-xs text-emerald-300">
                🔐 Enterprise-grade encryption • GDPR/CCPA compliant • Zero-knowledge architecture
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Showcase */}
        <div className="hidden lg:flex w-1/2 min-h-screen items-center justify-center p-12 relative">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-black"></div>

          {/* Floating Cards */}
          <div className="relative z-10 w-full">
            <div className="mb-12">
              <h3 className="text-5xl font-black text-white mb-4 leading-tight">
                Welcome to the<br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Future</span>
              </h3>
              <p className="text-xl text-gray-300 leading-relaxed">
                Transform how you manage your supply chain with cutting-edge AI and real-time insights.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div
                    key={index}
                    className="group glass-effect p-5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Icon size={20} className="text-white" />
                    </div>
                    <h4 className="font-bold text-white text-sm mb-1">{benefit.title}</h4>
                    <p className="text-xs text-gray-400">{benefit.desc}</p>
                  </div>
                )
              })}
            </div>

            {/* Stats */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">10K+</p>
                  <p className="text-xs text-gray-400 mt-1">Active Users</p>
                </div>
                <div className="text-center border-x border-white/10">
                  <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">99.9%</p>
                  <p className="text-xs text-gray-400 mt-1">Uptime</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">24/7</p>
                  <p className="text-xs text-gray-400 mt-1">Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}