import { Check, ArrowRight } from 'lucide-react'
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
    <div
      className={`relative rounded-2xl transition-all duration-300 ${
        plan.highlighted
          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-2xl scale-105 ring-2 ring-blue-600'
          : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl'
      }`}
    >
      {/* Badge */}
      {plan.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold">
            Most Popular
          </span>
        </div>
      )}

      <div className="p-8">
        {/* Plan Name */}
        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>

        {/* Description */}
        <p className={`text-sm mb-6 ${plan.highlighted ? 'text-blue-100' : 'text-gray-600'}`}>
          {plan.description}
        </p>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-bold">${plan.price}</span>
            <span className={plan.highlighted ? 'text-blue-100' : 'text-gray-600'}>/month</span>
          </div>
          <p className={`text-xs mt-2 ${plan.highlighted ? 'text-blue-100' : 'text-gray-500'}`}>
            Billed annually, save 20%
          </p>
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => onSelect(plan.name)}
          variant={plan.highlighted ? 'secondary' : 'primary'}
          size="lg"
          className="w-full mb-8 flex items-center justify-center gap-2"
        >
          Choose Plan
          <ArrowRight size={18} />
        </Button>

        {/* Features List */}
        <div className="space-y-4">
          <p className={`text-xs font-semibold uppercase tracking-wide ${plan.highlighted ? 'text-blue-100' : 'text-gray-500'}`}>
            Includes:
          </p>
          <ul className="space-y-3">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className={`rounded-full p-1 mt-0.5 ${plan.highlighted ? 'bg-white bg-opacity-20' : 'bg-blue-100'}`}>
                  <Check size={16} className={plan.highlighted ? 'text-white' : 'text-blue-600'} />
                </div>
                <span className={`text-sm leading-relaxed ${plan.highlighted ? 'text-blue-50' : 'text-gray-700'}`}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Note */}
        <div className={`mt-8 pt-6 border-t ${plan.highlighted ? 'border-blue-500 border-opacity-30' : 'border-gray-200'}`}>
          <p className={`text-xs text-center ${plan.highlighted ? 'text-blue-100' : 'text-gray-500'}`}>
            14-day free trial • No credit card required
          </p>
        </div>
      </div>
    </div>
  )
}
