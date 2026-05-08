import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Widget } from '../../components/dashboard/Widget';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { Send, MessageCircle, Save } from 'lucide-react';
export default function AIInsightsPage() {
    const [messages, setMessages] = useState([
        {
            id: '1',
            role: 'assistant',
            content: 'Hello! I\'m your SupplySense AI Assistant. I can help you analyze your supply chain data, predict trends, and optimize your operations. What would you like to know?',
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [savedInsights, setSavedInsights] = useState([
        {
            id: '1',
            title: 'Supplier Performance Analysis',
            query: 'Which suppliers have the highest reliability scores?',
            response: 'Tech Supply Ltd leads with 97% reliability, followed by Global Parts Inc at 94%...',
            savedAt: new Date(Date.now() - 86400000),
        },
        {
            id: '2',
            title: 'Inventory Forecast',
            query: 'Predict stockout risks for next 30 days',
            response: 'Based on current trends, 3 SKUs will likely go below reorder point...',
            savedAt: new Date(Date.now() - 172800000),
        },
    ]);
    const handleSendMessage = async () => {
        if (!inputValue.trim())
            return;
        // Add user message
        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setLoading(true);
        try {
            // Simulate API call to AI service
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const assistantMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'This is a simulated AI response. In production, this would call your Python AI service with the analyzed data.',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
        }
        catch (error) {
            console.error('Failed to get AI response:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSaveInsight = () => {
        if (messages.length < 2)
            return;
        const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
        const lastAssistantMessage = [...messages].reverse().find((m) => m.role === 'assistant');
        if (lastUserMessage && lastAssistantMessage) {
            const newInsight = {
                id: Date.now().toString(),
                title: lastUserMessage.content.substring(0, 50) + '...',
                query: lastUserMessage.content,
                response: lastAssistantMessage.content,
                savedAt: new Date(),
            };
            setSavedInsights((prev) => [newInsight, ...prev]);
        }
    };
    return (_jsx(DashboardLayout, { children: _jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex justify-between items-center", children: _jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "AI Insights" }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx(Widget, { title: "AI Assistant", className: "h-full", children: _jsxs("div", { className: "flex flex-col h-96", children: [_jsxs("div", { className: "flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg", children: [messages.map((msg) => (_jsx("div", { className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-xs px-4 py-2 rounded-lg ${msg.role === 'user'
                                                            ? 'bg-blue-600 text-white rounded-br-none'
                                                            : 'bg-gray-200 text-gray-900 rounded-bl-none'}`, children: [_jsx("p", { className: "text-sm", children: msg.content }), _jsx("span", { className: "text-xs opacity-70 mt-1 block", children: msg.timestamp.toLocaleTimeString() })] }) }, msg.id))), loading && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-gray-200 text-gray-900 px-4 py-2 rounded-lg", children: _jsx(Loader, {}) }) }))] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { type: "text", placeholder: "Ask me anything about your supply chain...", value: inputValue, onChange: (e) => setInputValue(e.target.value), onKeyPress: (e) => {
                                                        if (e.key === 'Enter' && !loading) {
                                                            handleSendMessage();
                                                        }
                                                    } }), _jsx(Button, { onClick: handleSendMessage, disabled: loading || !inputValue.trim(), className: "flex items-center gap-2", children: _jsx(Send, { className: "w-4 h-4" }) })] })] }) }) }), _jsxs("div", { className: "space-y-4", children: [_jsx(Widget, { title: "Actions", children: _jsxs(Button, { onClick: handleSaveInsight, className: "w-full flex items-center justify-center gap-2", children: [_jsx(Save, { className: "w-4 h-4" }), "Save Insight"] }) }), _jsx(Widget, { title: "Saved Insights", children: _jsx("div", { className: "space-y-3 max-h-96 overflow-y-auto", children: savedInsights.length === 0 ? (_jsx("p", { className: "text-sm text-gray-500 text-center py-4", children: "No saved insights yet" })) : (savedInsights.map((insight) => (_jsxs("div", { className: "p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition", children: [_jsx("h4", { className: "font-semibold text-sm text-gray-900", children: insight.title }), _jsxs("p", { className: "text-xs text-gray-600 mt-1", children: [insight.query.substring(0, 40), "..."] }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: insight.savedAt.toLocaleDateString() })] }, insight.id)))) }) }), _jsx(Widget, { title: "Quick Questions", children: _jsxs("div", { className: "space-y-2", children: [_jsxs("button", { className: "w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition", children: [_jsx(MessageCircle, { className: "w-3 h-3 inline mr-2" }), "Predict next month demand"] }), _jsxs("button", { className: "w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition", children: [_jsx(MessageCircle, { className: "w-3 h-3 inline mr-2" }), "Analyze supplier risks"] }), _jsxs("button", { className: "w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition", children: [_jsx(MessageCircle, { className: "w-3 h-3 inline mr-2" }), "Optimize inventory"] })] }) })] })] })] }) }));
}
