import { Link } from 'react-router-dom'
import { Button } from '../common/Button'
import { Zap, TrendingUp, Shield } from 'lucide-react'

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            AI-Powered Supply Chain Intelligence
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Make smarter decisions with real-time predictions, anomaly detection, and actionable insights.
          </p>
          <div className="flex gap-4 justify-center mb-16">
            <Link to="/register">
              <Button size="lg">Start Free Trial</Button>
            </Link>
            <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50">
              Learn More
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur">
              <Zap size={32} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-Time Predictions</h3>
              <p className="text-blue-100">Get instant forecasts for demand and supply.</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur">
              <TrendingUp size={32} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
              <p className="text-blue-100">Discover patterns and optimize operations.</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur">
              <Shield size={32} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Risk Management</h3>
              <p className="text-blue-100">Detect anomalies and mitigate risks early.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
