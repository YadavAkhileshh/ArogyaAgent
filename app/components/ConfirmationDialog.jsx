'use client';

import { AlertTriangle, RefreshCw, Upload, Search } from 'lucide-react';

export default function ConfirmationDialog({ 
    isOpen, 
    onClose, 
    confidence, 
    message, 
    onRetry, 
    onConfirm,
    type = 'low-confidence' // 'low-confidence', 'unclear-image', 'no-results'
}) {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'unclear-image':
                return <Upload className="w-12 h-12 text-orange-600" />;
            case 'no-results':
                return <Search className="w-12 h-12 text-blue-600" />;
            default:
                return <AlertTriangle className="w-12 h-12 text-yellow-600" />;
        }
    };

    const getTitle = () => {
        switch (type) {
            case 'unclear-image':
                return 'Image Quality Issue';
            case 'no-results':
                return 'Need Your Help';
            default:
                return `I'm ${confidence}% Sure`;
        }
    };

    const getDescription = () => {
        switch (type) {
            case 'unclear-image':
                return 'The image quality is not clear enough for accurate extraction. Please upload a clearer image for better results.';
            case 'no-results':
                return 'I couldn\'t find exact matches. Would you like to try a different search term or upload a clearer image?';
            default:
                return message || 'The extracted information might not be 100% accurate. Please review and confirm before proceeding.';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
                <div className="p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
                        {getIcon()}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                        {getTitle()}
                    </h3>
                    
                    <p className="text-slate-600 mb-6 text-base leading-relaxed">
                        {getDescription()}
                    </p>

                    {confidence && confidence < 80 && (
                        <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-yellow-900">Confidence Level</span>
                                <span className="text-lg font-bold text-yellow-900">{confidence}%</span>
                            </div>
                            <div className="w-full h-3 bg-yellow-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-yellow-600 rounded-full transition-all duration-500"
                                    style={{ width: `${confidence}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        {onRetry && (
                            <button
                                onClick={onRetry}
                                className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 text-lg shadow-lg"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Try Again
                            </button>
                        )}
                        
                        {onConfirm && (
                            <button
                                onClick={onConfirm}
                                className="w-full px-6 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition text-lg"
                            >
                                Confirm & Continue
                            </button>
                        )}
                        
                        <button
                            onClick={onClose}
                            className="w-full px-6 py-4 border-2 border-slate-300 text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition text-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
