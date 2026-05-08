import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/landing/Navbar';
import { Hero } from '../../components/landing/Hero';
import { PlanCard } from '../../components/landing/PlanCard';
import { PaymentInstructions } from '../../components/landing/PaymentInstructions';
import { Footer } from '../../components/landing/Footer';
import { CheckCircle } from 'lucide-react';
export default function LandingPage() {
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const plans = [
        {
            name: 'Starter',
            price: 49,
            description: 'Perfect for small businesses',
            features: [
                'Up to 100 SKUs',
                'Basic demand forecasting',
                'Standard support',
                '1 user account',
                'Monthly reports',
                '30-day data retention',
            ],
        },
        {
            name: 'Professional',
            price: 199,
            description: 'For growing supply chains',
            features: [
                'Unlimited SKUs',
                'Advanced AI predictions',
                'Real-time anomaly detection',
                'Up to 5 user accounts',
                'Custom reports',
                '1-year data retention',
                'API access',
                'Priority support',
            ],
            highlighted: true,
        },
        {
            name: 'Enterprise',
            price: 499,
            description: 'For large organizations',
            features: [
                'Unlimited SKUs',
                'Custom ML models',
                'White-label solution',
                'Unlimited user accounts',
                'Advanced analytics',
                'Unlimited data retention',
                'Full API access',
                '24/7 dedicated support',
                'On-premise deployment',
            ],
        },
    ];
    const handlePlanSelect = (planName) => {
        setSelectedPlan(planName);
        navigate('/register', { state: { plan: planName } });
    };
    return (_jsxs("div", { className: "min-h-screen bg-white", children: [_jsx(Navbar, {}), _jsx(Hero, {}), _jsx("section", { id: "pricing", className: "py-20 bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("div", { className: "inline-block mb-4", children: _jsx("span", { className: "px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold", children: "\uD83D\uDCB0 Simple, Transparent Pricing" }) }), _jsx("h2", { className: "text-4xl md:text-5xl font-bold text-gray-900 mb-4", children: "Choose Your Plan" }), _jsx("p", { className: "text-xl text-gray-600 max-w-2xl mx-auto", children: "All plans include a 14-day free trial. No credit card required." })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 mb-16", children: plans.map((plan) => (_jsx(PlanCard, { plan: plan, onSelect: handlePlanSelect }, plan.name))) }), _jsxs("div", { className: "bg-white rounded-2xl p-12 border-2 border-gray-100", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-8 text-center", children: "Frequently Asked Questions" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
                                        {
                                            q: 'Can I change plans anytime?',
                                            a: 'Yes! You can upgrade, downgrade, or cancel your subscription at any time with no penalties.',
                                        },
                                        {
                                            q: 'Is there a setup fee?',
                                            a: 'No, there are no setup or hidden fees. Just choose your plan and start your free trial immediately.',
                                        },
                                        {
                                            q: 'Do you offer discounts for annual billing?',
                                            a: 'Yes! Save 20% when you choose annual billing. Monthly billing is also available.',
                                        },
                                        {
                                            q: 'What support do I get?',
                                            a: 'All plans include email support. Professional and Enterprise plans get priority support and phone assistance.',
                                        },
                                    ].map((faq, index) => (_jsxs("div", { className: "pb-6 border-b border-gray-200 last:border-b-0", children: [_jsxs("h4", { className: "font-semibold text-gray-900 mb-2 flex items-center gap-2", children: [_jsx(CheckCircle, { size: 20, className: "text-green-600" }), faq.q] }), _jsx("p", { className: "text-gray-600", children: faq.a })] }, index))) })] })] }) }), _jsx(PaymentInstructions, {}), _jsx(Footer, {})] }));
}
