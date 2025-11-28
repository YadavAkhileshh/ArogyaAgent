'use client';

import { AlertTriangle, AlertCircle, Info, Shield } from 'lucide-react';

export default function SafetyAlert({ severity, title, message, recommendation }) {
    const config = {
        critical: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
            titleColor: 'text-red-900',
            textColor: 'text-red-700'
        },
        high: {
            bg: 'bg-orange-50',
            border: 'border-orange-200',
            icon: <AlertCircle className="w-5 h-5 text-orange-600" />,
            titleColor: 'text-orange-900',
            textColor: 'text-orange-700'
        },
        medium: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
            titleColor: 'text-yellow-900',
            textColor: 'text-yellow-700'
        },
        low: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            icon: <Info className="w-5 h-5 text-blue-600" />,
            titleColor: 'text-blue-900',
            textColor: 'text-blue-700'
        },
        safe: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            icon: <Shield className="w-5 h-5 text-green-600" />,
            titleColor: 'text-green-900',
            textColor: 'text-green-700'
        }
    };

    const style = config[severity];

    return (
        <div className={`${style.bg} ${style.border} border rounded-lg p-4`}>
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">{style.icon}</div>
                <div className="flex-1">
                    <h4 className={`font-semibold text-sm ${style.titleColor} mb-1`}>{title}</h4>
                    <p className={`text-sm ${style.textColor}`}>{message}</p>
                    {recommendation && (
                        <p className={`text-sm ${style.textColor} mt-2 font-medium`}>
                            → {recommendation}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
