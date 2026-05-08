import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Widget } from '../../../components/dashboard/Widget';
import { Button } from '../../../components/common/Button';
import { Download, RefreshCw, HardDrive } from 'lucide-react';
export default function BackupPage() {
    const [backups, setBackups] = useState([
        {
            id: '1',
            date: '2026-05-05 02:00 AM',
            size: '2.4 GB',
            status: 'completed',
        },
        {
            id: '2',
            date: '2026-05-04 02:00 AM',
            size: '2.3 GB',
            status: 'completed',
        },
        {
            id: '3',
            date: '2026-05-03 02:00 AM',
            size: '2.2 GB',
            status: 'completed',
        },
    ]);
    const [autoBackup, setAutoBackup] = useState(true);
    const [backupFrequency, setBackupFrequency] = useState('daily');
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [lastBackupTime, setLastBackupTime] = useState('Today at 2:00 AM');
    const handleBackupNow = async () => {
        setIsBackingUp(true);
        try {
            // Simulate backup process
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setLastBackupTime('Just now');
            setBackups([
                {
                    id: Date.now().toString(),
                    date: new Date().toLocaleString(),
                    size: '2.5 GB',
                    status: 'completed',
                },
                ...backups,
            ]);
        }
        catch (error) {
            console.error('Backup failed:', error);
        }
        finally {
            setIsBackingUp(false);
        }
    };
    const handleDownloadBackup = (backupId) => {
        console.log(`Downloading backup: ${backupId}`);
        // Implement download logic
    };
    const handleDeleteBackup = (backupId) => {
        setBackups(backups.filter((b) => b.id !== backupId));
    };
    return (_jsx(DashboardLayout, { children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Backup & Recovery" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Manage your data backups and recovery options" })] }), _jsx(Widget, { title: "Backup Status", icon: _jsx(HardDrive, { className: "w-5 h-5" }), children: _jsx("div", { className: "space-y-4", children: _jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Last Backup" }), _jsx("p", { className: "text-lg font-semibold text-gray-900", children: lastBackupTime })] }), _jsxs(Button, { onClick: handleBackupNow, disabled: isBackingUp, className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2", children: [_jsx(RefreshCw, { className: `w-4 h-4 ${isBackingUp ? 'animate-spin' : ''}` }), isBackingUp ? 'Backing up...' : 'Backup Now'] })] }) }) }) }), _jsx(Widget, { title: "Backup Settings", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: "Automatic Backups" }), _jsx("p", { className: "text-sm text-gray-600", children: "Automatically backup your data" })] }), _jsx("label", { className: "flex items-center cursor-pointer", children: _jsx("input", { type: "checkbox", checked: autoBackup, onChange: (e) => setAutoBackup(e.target.checked), className: "w-5 h-5 text-blue-600 rounded" }) })] }), autoBackup && (_jsxs("div", { className: "border-t pt-6", children: [_jsx("p", { className: "font-medium text-gray-900 mb-3", children: "Backup Frequency" }), _jsxs("select", { value: backupFrequency, onChange: (e) => setBackupFrequency(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900", children: [_jsx("option", { value: "hourly", children: "Hourly" }), _jsx("option", { value: "daily", children: "Daily (at 2:00 AM)" }), _jsx("option", { value: "weekly", children: "Weekly (Every Sunday at 2:00 AM)" }), _jsx("option", { value: "monthly", children: "Monthly (1st of month at 2:00 AM)" })] })] }))] }) }), _jsx(Widget, { title: "Backup History", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "Date" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "Size" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "Status" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: backups.map((backup) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-3 text-sm text-gray-900", children: backup.date }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-600", children: backup.size }), _jsx("td", { className: "px-4 py-3 text-sm", children: _jsx("span", { className: "px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium", children: backup.status }) }), _jsxs("td", { className: "px-4 py-3 text-sm space-x-2 flex", children: [_jsxs("button", { onClick: () => handleDownloadBackup(backup.id), className: "text-blue-600 hover:text-blue-800 flex items-center gap-1", children: [_jsx(Download, { className: "w-4 h-4" }), "Download"] }), _jsx("button", { onClick: () => handleDeleteBackup(backup.id), className: "text-red-600 hover:text-red-800", children: "Delete" })] })] }, backup.id))) })] }) }) })] }) }));
}
