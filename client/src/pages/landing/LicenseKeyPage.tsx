import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../../layouts/AuthLayout'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'
import { AlertBanner } from '../../components/common/AlertBanner'
import { PlanCard } from '../../components/landing/PlanCard'

export default function LicenseKeyPage() {
  const navigate = useNavigate()
  const [licenseKey, setLicenseKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const plans = [
    {
      name: 'Starter',
      price: 29,
      features: ['Up to 5 users', 'Basic analytics', 'Email support'],
    },
    {
      name: 'Professional',
      price: 79,
      features: ['Up to 20 users', 'Advanced analytics', 'Priority support', 'Custom reports'],
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 199,
      features: ['Unlimited users', 'AI insights', '24/7 phone support', 'Dedicated account manager'],
    },
  ]

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/license/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey }),
      })

      if (!response.ok) throw new Error('Invalid license key')

      const data = await response.json()
      navigate('/login', { state: { planTier: data.plan } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'License validation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Validate Your License</h2>
          <p className="text-gray-600">Enter your license key to get started with SupplySense</p>
        </div>

        <form onSubmit={handleValidate} className="space-y-4">
          {error && <AlertBanner type="error" message={error} />}

          <Input
            label="License Key"
            type="text"
            placeholder="XXXX-XXXX-XXXX-XXXX"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
            required
          />

          <Button type="submit" loading={loading} className="w-full">
            Validate License
          </Button>
        </form>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Your Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <PlanCard
                key={plan.name}
                {...plan}
                onSelect={() => setSelectedPlan(plan.name)}
              />
            ))}
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
