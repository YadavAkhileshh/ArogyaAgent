'use client';

import { LogoCloud } from '@/app/components/LogoCloud';

export default function TrustedDataSources() {
    return (
        <div className="w-full bg-gray-50 py-20">
            <div className="container mx-auto px-4">
                <section className="relative mx-auto grid max-w-4xl">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Powered by{' '}
                            <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                                Official Government Data
                            </span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            100% verified data from 8 trusted Indian healthcare authorities.
                            No random APIs, no guesswork - only official sources.
                        </p>
                    </div>

                    <LogoCloud />

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5" />
                            <p>
                                <strong className="text-gray-900">Jan Aushadhi:</strong> 10,000+ generic medicines, 8,500+ stores
                            </p>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5" />
                            <p>
                                <strong className="text-gray-900">NPPA:</strong> National Pharmaceutical Pricing Authority
                            </p>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5" />
                            <p>
                                <strong className="text-gray-900">CDSCO:</strong> Drug safety and approval verification
                            </p>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5" />
                            <p>
                                <strong className="text-gray-900">WHO:</strong> Essential Medicines List standards
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
