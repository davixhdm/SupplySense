import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CreditCard, Smartphone, DollarSign, Zap, Globe, Banknote, Building2, Shield, TrendingUp, Clock } from 'lucide-react';
export function PaymentInstructions() {
    const methods = [
        {
            icon: CreditCard,
            name: 'Credit Card',
            description: 'Visa, Mastercard, American Express, Discover',
            color: 'from-blue-500 to-blue-600',
            badge: 'Instant',
            features: ['No fees', 'Instant approval', '3D Secure']
        },
        {
            icon: Smartphone,
            name: 'Mobile Wallets',
            description: 'Apple Pay, Google Pay, Samsung Pay',
            color: 'from-purple-500 to-purple-600',
            badge: 'Fast',
            features: ['One-tap payment', 'Secure encryption', 'Auto-fill']
        },
        {
            icon: DollarSign,
            name: 'Digital Payments',
            description: 'PayPal, Stripe, Square Cash',
            color: 'from-yellow-500 to-yellow-600',
            badge: 'Popular',
            features: ['Buyer protection', 'Dispute resolution', 'Easy setup']
        },
        {
            icon: Banknote,
            name: 'Bank Transfer',
            description: 'Direct deposit, ACH, Wire transfer',
            color: 'from-green-500 to-green-600',
            badge: 'Secure',
            features: ['Lower fees', 'Recurring billing', 'Bulk payments']
        },
        {
            icon: Globe,
            name: 'International',
            description: '180+ countries, 135+ currencies',
            color: 'from-cyan-500 to-cyan-600',
            badge: 'Global',
            features: ['Multi-currency', 'Local methods', 'Geo-specific']
        },
        {
            icon: Building2,
            name: 'Enterprise',
            description: 'Custom invoicing, PO billing, Net 30',
            color: 'from-slate-500 to-slate-600',
            badge: 'B2B',
            features: ['Custom terms', 'Volume pricing', 'Dedicated support']
        },
    ];
    const benefits = [
        { icon: Zap, text: 'Instant Processing', desc: 'Get access immediately after payment' },
        { icon: Shield, text: '256-bit Encryption', desc: 'Military-grade security for your data' },
        { icon: TrendingUp, text: 'Global Network', desc: 'Process payments from anywhere' },
        { icon: Clock, text: '24/7 Support', desc: 'Round-the-clock customer assistance' },
    ];
    return (_jsx("section", { id: "payment", className: "py-24 bg-gradient-to-b from-white via-blue-50 to-white", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "text-center mb-20", children: [_jsx("div", { className: "inline-block mb-4", children: _jsx("span", { className: "px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold uppercase tracking-wider", children: "\uD83D\uDCB3 Payment Solutions" }) }), _jsx("h2", { className: "text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight", children: "Multiple Ways to Pay" }), _jsx("p", { className: "text-xl text-gray-600 max-w-3xl mx-auto", children: "Choose from 6+ payment methods. All transactions are encrypted, secure, and processed instantly." })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20", children: methods.map((method, index) => {
                        const Icon = method.icon;
                        return (_jsxs("div", { className: "group relative bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-blue-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden", children: [_jsx("div", { className: `absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300` }), _jsxs("div", { className: "relative z-10", children: [_jsx("div", { className: `w-16 h-16 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300`, children: _jsx(Icon, { size: 32, className: "text-white" }) }), _jsx("div", { className: "inline-block mb-4", children: _jsx("span", { className: `px-3 py-1 bg-gradient-to-r ${method.color} text-white text-xs font-bold rounded-full`, children: method.badge }) }), _jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-2", children: method.name }), _jsx("p", { className: "text-gray-600 text-sm mb-6 leading-relaxed", children: method.description }), _jsx("ul", { className: "space-y-2", children: method.features.map((feature, idx) => (_jsxs("li", { className: "flex items-center gap-2 text-sm text-gray-700", children: [_jsx("div", { className: "w-1.5 h-1.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" }), feature] }, idx))) })] })] }, index));
                    }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-8 mb-20", children: benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (_jsxs("div", { className: "text-center group", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300", children: _jsx(Icon, { size: 28, className: "text-white" }) }), _jsx("h4", { className: "text-lg font-bold text-gray-900 mb-2", children: benefit.text }), _jsx("p", { className: "text-sm text-gray-600", children: benefit.desc })] }, index));
                    }) }), _jsx("div", { className: "bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-white mb-20", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-12", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-2xl font-bold mb-4 flex items-center gap-2", children: [_jsx(Shield, { size: 28 }), "Bank-Level Security"] }), _jsxs("ul", { className: "space-y-3 text-blue-100", children: [_jsx("li", { className: "flex items-center gap-2", children: "\u2713 PCI DSS Level 1 Certified" }), _jsx("li", { className: "flex items-center gap-2", children: "\u2713 256-bit AES Encryption" }), _jsx("li", { className: "flex items-center gap-2", children: "\u2713 Zero Data Storage Policy" })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold mb-4 flex items-center gap-2", children: "\u2705 Compliance & Standards" }), _jsxs("ul", { className: "space-y-3 text-blue-100", children: [_jsx("li", { className: "flex items-center gap-2", children: "\u2713 GDPR Compliant" }), _jsx("li", { className: "flex items-center gap-2", children: "\u2713 CCPA Compliant" }), _jsx("li", { className: "flex items-center gap-2", children: "\u2713 SOC 2 Type II Audited" })] })] })] }) }), _jsxs("div", { className: "mb-20", children: [_jsx("h3", { className: "text-3xl font-bold text-gray-900 text-center mb-12", children: "Payment Method Comparison" }), _jsx("div", { className: "overflow-x-auto rounded-2xl border-2 border-gray-100 shadow-lg", children: _jsxs("table", { className: "w-full text-center", children: [_jsx("thead", { className: "bg-gradient-to-r from-gray-50 to-gray-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left font-bold text-gray-900", children: "Payment Method" }), _jsx("th", { className: "px-6 py-4 font-bold text-gray-900", children: "Processing Time" }), _jsx("th", { className: "px-6 py-4 font-bold text-gray-900", children: "Fees" }), _jsx("th", { className: "px-6 py-4 font-bold text-gray-900", children: "Coverage" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: [
                                            { method: 'Credit Card', time: 'Instant', fees: '2.9% + $0.30', coverage: '190+ countries' },
                                            { method: 'Mobile Wallet', time: 'Instant', fees: '3.2%', coverage: '100+ countries' },
                                            { method: 'Bank Transfer', time: '1-3 days', fees: '$1-5', coverage: 'All countries' },
                                            { method: 'Digital Payment', time: '1 hour', fees: '3% + fees', coverage: '180+ countries' },
                                            { method: 'International', time: '2-5 days', fees: 'Varies', coverage: '190+ countries' },
                                            { method: 'Enterprise', time: 'Custom', fees: 'Negotiated', coverage: 'Global' },
                                        ].map((row, idx) => (_jsxs("tr", { className: idx % 2 === 0 ? 'bg-white' : 'bg-gray-50', children: [_jsx("td", { className: "px-6 py-4 font-semibold text-gray-900 text-left", children: row.method }), _jsx("td", { className: "px-6 py-4 text-gray-700", children: row.time }), _jsx("td", { className: "px-6 py-4 text-gray-700", children: row.fees }), _jsx("td", { className: "px-6 py-4 text-gray-700", children: row.coverage })] }, idx))) })] }) })] }), _jsxs("div", { className: "bg-gray-50 rounded-2xl p-8 md:p-12", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-8", children: "Frequently Asked Questions" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
                                { q: 'Is my payment information safe?', a: 'Yes! We use 256-bit SSL encryption and never store payment data.' },
                                { q: 'What if my payment fails?', a: 'We automatically retry failed payments. You can also retry manually.' },
                                { q: 'Do you support refunds?', a: 'Full refunds within 30 days. Partial refunds available after that.' },
                                { q: 'Can I use multiple payment methods?', a: 'Absolutely! Switch methods anytime without interrupting your service.' },
                            ].map((faq, idx) => (_jsxs("div", { className: "pb-6", children: [_jsxs("h4", { className: "font-bold text-gray-900 mb-2 flex items-center gap-2", children: ["\uD83D\uDC99 ", faq.q] }), _jsx("p", { className: "text-gray-700", children: faq.a })] }, idx))) })] })] }) }));
}
