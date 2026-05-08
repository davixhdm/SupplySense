import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { AlertBanner } from '../../components/common/AlertBanner';
import { PlanCard } from '../../components/landing/PlanCard';
export default function LicenseKeyPage() {
    const navigate = useNavigate();
    const [licenseKey, setLicenseKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedPlan, setSelectedPlan] = useState(null);
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
    ];
    const handleValidate = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/license/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ licenseKey }),
            });
            if (!response.ok)
                throw new Error('Invalid license key');
            const data = await response.json();
            navigate('/login', { state: { planTier: data.plan } });
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'License validation failed');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(AuthLayout, { children: _jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Validate Your License" }), _jsx("p", { className: "text-gray-600", children: "Enter your license key to get started with SupplySense" })] }), _jsxs("form", { onSubmit: handleValidate, className: "space-y-4", children: [error && _jsx(AlertBanner, { type: "error", message: error }), _jsx(Input, { label: "License Key", type: "text", placeholder: "XXXX-XXXX-XXXX-XXXX", value: licenseKey, onChange: (e) => setLicenseKey(e.target.value), required: true }), _jsx(Button, { type: "submit", loading: loading, className: "w-full", children: "Validate License" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Select Your Plan" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: plans.map((plan) => (_jsx(PlanCard, { ...plan, onSelect: () => setSelectedPlan(plan.name) }, plan.name))) })] })] }) }));
}
