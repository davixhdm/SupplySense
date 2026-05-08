import { Navbar } from '../../components/landing/Navbar'
import { Hero } from '../../components/landing/Hero'
import { PaymentInstructions } from '../../components/landing/PaymentInstructions'
import { Footer } from '../../components/landing/Footer'

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <PaymentInstructions />
      <Footer />
    </div>
  )
}
