import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Eye, EyeOff, Zap, Layers, TrendingUp, BarChart3, Shield, Infinity, LogIn, Sparkles } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/authService'

// Smooth animations CSS
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
    <>
      <style>{smoothAnimations}</style>
      <div className="min-h-screen flex overflow-hidden relative bg-gradient-to-br from-slate-900 via-slate-900 to-black">
        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: '2s'}}></div>

        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6 lg:p-12 relative z-10 overflow-y-auto">
          <div className="w-full max-w-md">
            {/* Logo with Glow */}
            <div className="mb-8 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-glow">
                <LogIn className="text-white" size={24} />
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
                <span className="text-xs font-semibold text-purple-400 tracking-widest">SIGN IN</span>
              </div>
              <h2 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-3">
                Welcome Back
              </h2>
              <p className="text-gray-400 text-lg">
                Access your intelligent supply chain dashboard
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 text-red-400 text-sm backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
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

              {/* Password */}
              <div className="group">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">Password</label>
                  <Link to="#" className="text-xs text-blue-400 hover:text-cyan-400 transition-colors font-semibold">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 opacity-60 group-focus-within:opacity-100 transition-opacity" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-blue-500 cursor-pointer rounded"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-400 cursor-pointer">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-smooth w-full py-3 px-4 mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-gradient-to-br from-slate-900 to-black text-xs text-gray-400">Continue with</span>
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
                    className="glass-effect py-3 px-2 rounded-xl hover:bg-white/20 transition-all duration-300 text-center font-medium text-sm hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    <span className="text-xl">{provider.icon}</span>
                  </button>
                ))}
              </div>

              {/* Register Link */}
              <p className="text-center text-gray-400 text-sm pt-4">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text hover:from-cyan-400 hover:to-blue-400 transition-all">
                  Create one now
                </Link>
              </p>
            </form>

            {/* Security Info */}
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
                Unlock Your<br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Potential</span>
              </h3>
              <p className="text-xl text-gray-300 leading-relaxed">
                Join thousands of businesses optimizing their supply chains with AI-powered intelligence.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className="group glass-effect p-5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Icon size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm mb-1">{feature.title}</h4>
                        <p className="text-xs text-gray-400">{feature.desc}</p>
                      </div>
                    </div>
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
