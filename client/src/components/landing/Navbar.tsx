import { Link } from 'react-router-dom'
import { Button } from '../common/Button'

export function Navbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container flex justify-between items-center py-4">
        <div className="text-2xl font-bold text-blue-600">SupplySense</div>
        <div className="flex gap-4">
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
      </div>
    </nav>
  )
}
