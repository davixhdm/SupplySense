import { CreditCard, Smartphone, DollarSign } from 'lucide-react'

export function PaymentInstructions() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl font-bold mb-12 text-center">How to Pay</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-8 text-center">
            <CreditCard size={48} className="mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold mb-4">Credit Card</h3>
            <p className="text-gray-600">
              Pay securely with Visa, Mastercard, or American Express.
            </p>
          </div>
          <div className="bg-white rounded-lg p-8 text-center">
            <Smartphone size={48} className="mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold mb-4">M-Pesa</h3>
            <p className="text-gray-600">
              Quick and easy payment using Safaricom's M-Pesa service.
            </p>
          </div>
          <div className="bg-white rounded-lg p-8 text-center">
            <DollarSign size={48} className="mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold mb-4">PayPal</h3>
            <p className="text-gray-600">
              Use your PayPal account for convenient payments.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
