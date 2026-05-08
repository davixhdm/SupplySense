import { Check } from 'lucide-react'
import { Button } from '../common/Button'

interface Plan {
  name: string
  price: number
  description: string
  features: string[]
  highlighted?: boolean
}

interface PlanCardProps {
  plan: Plan
  onSelect: (name: string) => void
}

export function PlanCard({ plan, onSelect }: PlanCardProps) {
  return (
    <div className={`rounded-lg p-8 ${plan.highlighted ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white border border-gray-200'}`}>
      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold">${plan.price}</span>
        <span className={plan.highlighted ? 'text-blue-100' : 'text-gray-600'}>/month</span>
      </div>
      <p className={`mb-6 ${plan.highlighted ? 'text-blue-100' : 'text-gray-600'}`}>
        {plan.description}
      </p>
      <Button
        onClick={() => onSelect(plan.name)}
        variant={plan.highlighted ? 'secondary' : 'primary'}
        className="w-full mb-6"
      >
        Choose Plan
      </Button>
      <ul className="space-y-3">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <Check size={20} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
