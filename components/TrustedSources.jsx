import { governmentPlatforms } from '@/lib/healthcare-theme';
import { CheckCircle, ExternalLink, Shield, Database } from 'lucide-react';

export default function GovernmentDataSources({ variant = 'full' }) {
    if (variant === 'compact') {
        return (
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 py-4 border-y border-teal-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Shield className="w-5 h-5 text-teal-700" />
                        <span className="text-sm font-semibold text-teal-900">
                            Verified by {governmentPlatforms.length} Official Sources
                        </span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {governmentPlatforms.map((source, idx) => (
                            <div
                                key={idx}
                                className="px-3 py-1.5 bg-white rounded-full border border-slate-200 flex items-center gap-2 shadow-sm hover:shadow-md transition"
                            >
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                <span className="text-xs font-medium text-slate-700">{source.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50 py-16 border-y border-teal-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full border-2 border-teal-300 shadow-md mb-6">
                        <Database className="w-6 h-6 text-teal-700" />
                        <span className="text-sm font-bold text-teal-900 uppercase tracking-wide">
                            100% Verified Data
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Powered by Official Government & International Sources
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Every medicine, price, and interaction is cross-verified across {governmentPlatforms.length} trusted databases
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
                    {governmentPlatforms.map((source, idx) => (
                        <a
                            key={idx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-white border-2 border-slate-200 hover:border-teal-400 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:scale-105"
                        >
                            <div className="text-center">
                                <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center border-2 border-teal-200 group-hover:border-teal-400 transition">
                                    {source.verified && (
                                        <CheckCircle className="w-7 h-7 text-teal-700" />
                                    )}
                                </div>

                                <h3 className="font-bold text-sm mb-1 text-slate-900 group-hover:text-teal-700 transition">
                                    {source.name}
                                </h3>

                                <p className="text-xs text-slate-600 mb-3 min-h-[2.5rem]">
                                    {source.description}
                                </p>

                                <div className="flex items-center justify-center gap-1">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                    <span className="text-xs font-semibold text-emerald-700">
                                        Verified
                                    </span>
                                </div>

                                <div className="mt-3 text-xs font-semibold text-teal-600 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1">
                                    <span>Visit Source</span>
                                    <ExternalLink className="w-3 h-3" />
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

                <div className="bg-white rounded-2xl p-6 border-2 border-teal-200 shadow-lg">
                    <div className="grid md:grid-cols-4 gap-6 text-center">
                        <div className="border-r border-slate-200 last:border-r-0">
                            <div className="text-3xl font-bold text-teal-700 mb-1">15,000+</div>
                            <div className="text-sm text-slate-600">Verified Medicines</div>
                        </div>
                        <div className="border-r border-slate-200 last:border-r-0">
                            <div className="text-3xl font-bold text-cyan-700 mb-1">{governmentPlatforms.length}</div>
                            <div className="text-sm text-slate-600">Official Sources</div>
                        </div>
                        <div className="border-r border-slate-200 last:border-r-0">
                            <div className="text-3xl font-bold text-blue-700 mb-1">100%</div>
                            <div className="text-sm text-slate-600">Data Accuracy</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-emerald-700 mb-1">Daily</div>
                            <div className="text-sm text-slate-600">Updates</div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <span>Government Verified</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200">
                        <Database className="w-4 h-4 text-cyan-600" />
                        <span>Cross-Validated Data</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200">
                        <CheckCircle className="w-4 h-4 text-teal-600" />
                        <span>100% Accurate</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function DataSourceBadge({ sources = ['Jan Aushadhi', 'NPPA', 'CDSCO'] }) {
    return (
        <div className="flex flex-wrap gap-2">
            {sources.map((sourceName, idx) => {
                const source = governmentPlatforms.find(s => s.name === sourceName);
                if (!source) return null;

                return (
                    <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-800 border border-teal-300 rounded-full text-xs font-semibold"
                    >
                        <CheckCircle className="w-3 h-3" />
                        {source.name}
                    </span>
                );
            })}
        </div>
    );
}
