import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Widget } from '../../../components/dashboard/Widget';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { AlertBanner } from '../../../components/common/AlertBanner';
export default function CompanyInfoPage() {
    const [formData, setFormData] = useState({
        name: 'SupplySense Demo Corp',
        email: 'contact@supplysense.com',
        phone: '+1-555-0100',
        address: '123 Business Ave',
        city: 'New York',
        country: 'United States',
        postalCode: '10001',
        industry: 'Retail & Distribution',
        employeeCount: '50-100',
    });
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSaved(false);
        try {
            // API call to save company info
            await new Promise((resolve) => setTimeout(resolve, 500));
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
        catch (error) {
            console.error('Failed to save:', error);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(DashboardLayout, { children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Company Information" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Manage your company details" })] }), saved && (_jsx(AlertBanner, { type: "success", message: "Company information updated successfully" })), _jsx(Widget, { title: "Basic Information", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(Input, { label: "Company Name", type: "text", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }) }), _jsx(Input, { label: "Email", type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }) }), _jsx(Input, { label: "Phone", type: "tel", value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }) }), _jsxs("select", { value: formData.industry, onChange: (e) => setFormData({ ...formData, industry: e.target.value }), className: "px-3 py-2 border border-gray-300 rounded-lg text-gray-900", children: [_jsx("option", { children: "Retail & Distribution" }), _jsx("option", { children: "Manufacturing" }), _jsx("option", { children: "Wholesale" }), _jsx("option", { children: "E-Commerce" }), _jsx("option", { children: "Other" })] }), _jsx(Input, { label: "Address", type: "text", value: formData.address, onChange: (e) => setFormData({ ...formData, address: e.target.value }) }), _jsx(Input, { label: "City", type: "text", value: formData.city, onChange: (e) => setFormData({ ...formData, city: e.target.value }) }), _jsx(Input, { label: "Country", type: "text", value: formData.country, onChange: (e) => setFormData({ ...formData, country: e.target.value }) }), _jsx(Input, { label: "Postal Code", type: "text", value: formData.postalCode, onChange: (e) => setFormData({ ...formData, postalCode: e.target.value }) }), _jsxs("select", { value: formData.employeeCount, onChange: (e) => setFormData({ ...formData, employeeCount: e.target.value }), className: "px-3 py-2 border border-gray-300 rounded-lg text-gray-900", children: [_jsx("option", { children: "1-10" }), _jsx("option", { children: "10-50" }), _jsx("option", { children: "50-100" }), _jsx("option", { children: "100-500" }), _jsx("option", { children: "500+" })] })] }), _jsx(Button, { type: "submit", loading: loading, children: "Save Changes" })] }) })] }) }));
}
