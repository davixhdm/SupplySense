import { Mail, Phone, MapPin, Twitter, Linkedin, Github, Send, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Stay Updated
              </h3>
              <p className="text-blue-100">
                Get the latest insights on supply chain optimization delivered to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
              >
                <Send size={18} />
                <span className="hidden sm:inline">Subscribe</span>
              </button>
            </form>
            {subscribed && (
              <p className="text-white text-sm md:col-span-2 mt-2">
                ✓ Thanks for subscribing! Check your email for confirmation.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <span className="text-white font-bold text-lg">SupplySense</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                AI-powered supply chain intelligence for modern businesses worldwide.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Twitter, label: 'Twitter' },
                  { icon: Linkedin, label: 'LinkedIn' },
                  { icon: Github, label: 'GitHub' },
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition hover:scale-110 duration-200"
                    aria-label={label}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-widest flex items-center gap-2">
                <ChevronRight size={16} className="text-blue-400" />
                Product
              </h4>
              <ul className="space-y-3 text-sm">
                {['Features', 'Pricing', 'Security', 'API Docs', 'Roadmap'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition hover:translate-x-1 inline-block duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-widest flex items-center gap-2">
                <ChevronRight size={16} className="text-blue-400" />
                Company
              </h4>
              <ul className="space-y-3 text-sm">
                {['About Us', 'Blog', 'Careers', 'Press', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition hover:translate-x-1 inline-block duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-widest flex items-center gap-2">
                <ChevronRight size={16} className="text-blue-400" />
                Legal
              </h4>
              <ul className="space-y-3 text-sm">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR Compliance', 'SOC 2'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition hover:translate-x-1 inline-block duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-widest flex items-center gap-2">
                <ChevronRight size={16} className="text-blue-400" />
                Contact
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3 text-gray-400 hover:text-white transition group cursor-pointer">
                  <Mail size={18} className="text-blue-400 group-hover:scale-110 transition" />
                  <span>hello@supplysense.com</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400 hover:text-white transition group cursor-pointer">
                  <Phone size={18} className="text-blue-400 group-hover:scale-110 transition" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <MapPin size={18} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>San Francisco, CA 94105, USA</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 my-8"></div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center py-8">
            {/* Copyright */}
            <p className="text-gray-500 text-sm">
              &copy; 2024 SupplySense. All rights reserved.
            </p>

            {/* Status */}
            <div className="text-center text-sm text-gray-400">
              <p>🟢 <span className="text-gray-300">All systems operational</span></p>
            </div>

            {/* Made with love */}
            <p className="text-sm text-gray-500 text-right">
              Made with <span className="text-red-500">❤️</span> by the SupplySense team
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
