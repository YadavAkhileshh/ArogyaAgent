'use client';

import { CheckCircle, Loader, Clock, Search, Shield, Pill, MapPin, FileText, Brain } from 'lucide-react';

const agentIcons = {
    'OCR Agent': FileText,
    'Safety Agent': Shield,
    'Search Agent': Pill,
    'Store Locator': MapPin,
    'Generic Matcher': Search,
    'Interaction Checker': Brain
};

export default function AgentStatus({ steps }) {
    return (
        <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Agent Activity Panel</h3>
            </div>
            <div className="space-y-3">
                {steps.map((step, index) => {
                    const Icon = agentIcons[step.name] || Brain;
                    return (
                        <div key={index} className={`flex items-start gap-3 p-3 rounded-xl border-2 transition ${
                            step.status === 'completed' ? 'bg-slate-50 border-slate-200' :
                            step.status === 'processing' ? 'bg-slate-900 border-slate-900' :
                            'bg-white border-slate-200'
                        }`}>
                            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                                step.status === 'completed' ? 'bg-slate-900' :
                                step.status === 'processing' ? 'bg-white' :
                                'bg-slate-100'
                            }`}>
                                {step.status === 'processing' ? (
                                    <Loader className="w-5 h-5 text-slate-900 animate-spin" />
                                ) : (
                                    <Icon className={`w-5 h-5 ${
                                        step.status === 'completed' ? 'text-white' : 'text-slate-400'
                                    }`} />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-sm font-semibold ${
                                        step.status === 'processing' ? 'text-white' : 'text-slate-900'
                                    }`}>
                                        {step.name}
                                    </span>
                                    {step.processingTime && (
                                        <span className={`text-xs flex items-center gap-1 ${
                                            step.status === 'processing' ? 'text-slate-300' : 'text-slate-500'
                                        }`}>
                                            <Clock className="w-3 h-3" />
                                            {step.processingTime}ms
                                        </span>
                                    )}
                                </div>
                                {step.reasoning && (
                                    <p className={`text-xs mt-1 ${
                                        step.status === 'processing' ? 'text-slate-300' : 'text-slate-600'
                                    }`}>{step.reasoning}</p>
                                )}
                                {step.confidence && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-slate-900 rounded-full transition-all duration-500"
                                                style={{ width: `${step.confidence}%` }}
                                            />
                                        </div>
                                        <span className={`text-xs font-semibold ${
                                            step.status === 'processing' ? 'text-white' : 'text-slate-900'
                                        }`}>{step.confidence}%</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-4 pt-4 border-t-2 border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Real-time AI Processing</span>
                    <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-slate-900 rounded-full animate-pulse"></div>
                        Live
                    </span>
                </div>
            </div>
        </div>
    );
}
