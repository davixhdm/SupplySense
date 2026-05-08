import { Link } from 'react-router-dom'
import { Button } from '../common/Button'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              SupplySense
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition">
              Pricing
            </a>
            <a href="#payment" className="text-gray-600 hover:text-gray-900 font-medium transition">
              Payment
            </a>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <Button variant="secondary" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <a href="#features" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              Features
            </a>
            <a href="#pricing" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              Pricing
            </a>
            <a href="#payment" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              Payment
            </a>
            <div className="flex flex-col gap-2 px-4">
              <Link to="/login" className="w-full">
                <Button variant="secondary" size="sm" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/register" className="w-full">
                <Button size="sm" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
