import { Link } from 'react-router-dom'
import { Button } from '../common/Button'
import { Zap, TrendingUp, Shield, ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 pb-32 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Content */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              ✨ AI-Powered Intelligence for Supply Chains
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
              Smart Supply Chain
            </span>
            <br />
            <span className="text-gray-900">Management</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Harness the power of AI to predict demand, detect anomalies, and optimize your supply chain with real-time insights and intelligent forecasting.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/register">
              <Button size="lg" className="flex items-center gap-2 px-8">
                Start Free Trial
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Link to="/license">
              <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 border-2 border-gray-200 transition flex items-center gap-2 justify-center">
                Have a License?
                <ArrowRight size={20} />
              </button>
            </Link>
          </div>

          <p className="text-gray-500 text-sm">No credit card required • Free 14-day trial • Full feature access</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
              <Zap size={28} className="text-blue-600 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Predictions</h3>
            <p className="text-gray-600">Get instant demand and supply forecasts with 95% accuracy using advanced ML models.</p>
          </div>

          {/* Feature 2 */}
          <div className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100">
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
              <TrendingUp size={28} className="text-green-600 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Actionable Insights</h3>
            <p className="text-gray-600">Discover optimization opportunities and make data-driven decisions to reduce costs.</p>
          </div>

          {/* Feature 3 */}
          <div className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100">
            <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
              <Shield size={28} className="text-purple-600 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Risk Management</h3>
            <p className="text-gray-600">Detect anomalies early and mitigate risks before they impact your operations.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
