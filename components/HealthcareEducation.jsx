import { AlertTriangle, Shield, BookOpen, CheckCircle, TrendingDown, Database, Info } from 'lucide-react';

export function MedicationSafetyEducation() {
    return (
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-red-900 mb-2">
                        Why Medication Safety Matters
                    </h3>
                    <p className="text-red-800 font-semibold">
                        43,000+ deaths every year in India from medication errors
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-white/80 rounded-lg p-4 border border-red-200">
                    <h4 className="font-semibold text-slate-900 mb-2">Common Dangerous Combinations:</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                            <span className="text-red-600 font-bold">•</span>
                            <span><strong>Aspirin + Ibuprofen:</strong> High bleeding risk</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-600 font-bold">•</span>
                            <span><strong>Multiple Antihistamines:</strong> Extreme drowsiness, falls</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-600 font-bold">•</span>
                            <span><strong>BP Medicines + Antidepressants:</strong> Sudden blood pressure drops</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-600 font-bold">•</span>
                            <span><strong>Antibiotics + Blood Thinners:</strong> Dangerous bleeding</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-teal-50 rounded-lg p-4 border border-teal-300">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-teal-700" />
                        <h4 className="font-semibold text-teal-900">How ArogyaAgent Protects You:</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-teal-800">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5" />
                            <span>Checks your medicines against DrugBank interaction database</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5" />
                            <span>Uses AI to analyze complex drug combinations instantly</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5" />
                            <span>Shows severity levels (Critical, High, Medium, Low)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5" />
                            <span>Provides clear recommendations from medical databases</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export function WhyGenericMedicines() {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-teal-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-2">
                        Understanding Generic Medicines
                    </h3>
                    <p className="text-blue-800">
                        Why generic medicines are safe, effective, and affordable
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white/80 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        Same Medicine, Lower Price
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                        <li><strong>Same active ingredient</strong> as branded version</li>
                        <li><strong>Same strength & dosage</strong> form</li>
                        <li><strong>Same effectiveness</strong> (bioequivalent)</li>
                        <li><strong>Same safety</strong> standards</li>
                        <li><strong>70-90% cheaper</strong> price</li>
                    </ul>
                </div>

                <div className="bg-white/80 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-teal-600" />
                        Government Verified
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                        <li><strong>CDSCO approved</strong> (same as branded)</li>
                        <li><strong>WHO certified</strong> manufacturers</li>
                        <li><strong>Good Manufacturing Practices</strong> (GMP)</li>
                        <li><strong>Batch tested</strong> for quality</li>
                        <li><strong>Same regulations</strong> as branded drugs</li>
                    </ul>
                </div>
            </div>

            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-300">
                <h4 className="font-semibold text-emerald-900 mb-2">Why the Price Difference?</h4>
                <p className="text-sm text-emerald-800 mb-3">
                    Branded medicines cost more because companies spend on:
                </p>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-emerald-800">
                    <div>• Advertising & marketing</div>
                    <div>• Brand building</div>
                    <div>• Fancy packaging</div>
                    <div>• Sales representatives</div>
                </div>
                <p className="text-sm text-emerald-900 font-semibold mt-3">
                    Generic medicines skip these costs and pass savings to you!
                </p>
            </div>
        </div>
    );
}

export function DataSourcesExplanation() {
    return (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-purple-900 mb-2">
                        Where We Get Our Data
                    </h3>
                    <p className="text-purple-800">
                        All information is verified across multiple official sources
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="bg-white/80 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <h4 className="font-semibold text-slate-900">Medicine Names & Availability</h4>
                    </div>
                    <p className="text-sm text-slate-700 mb-2">
                        <strong>Source:</strong> Jan Aushadhi Kendra official database
                    </p>
                    <p className="text-sm text-slate-600">
                        Official list of 10,000+ generic medicines available across 8,500+ Jan Aushadhi stores nationwide
                    </p>
                </div>

                <div className="bg-white/80 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <h4 className="font-semibold text-slate-900">Medicine Prices</h4>
                    </div>
                    <p className="text-sm text-slate-700 mb-2">
                        <strong>Sources:</strong> Jan Aushadhi + NPPA (National Pharmaceutical Pricing Authority)
                    </p>
                    <p className="text-sm text-slate-600">
                        Jan Aushadhi publishes fixed MRP. NPPA sets ceiling prices for essential medicines. We compare both.
                    </p>
                </div>

                <div className="bg-white/80 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <h4 className="font-semibold text-slate-900">Drug Interactions</h4>
                    </div>
                    <p className="text-sm text-slate-700 mb-2">
                        <strong>Sources:</strong> DrugBank + RxNorm (US National Library of Medicine) + Groq AI
                    </p>
                    <p className="text-sm text-slate-600">
                        DrugBank has 14,000+ drugs with known interactions. RxNorm provides drug classifications. AI analyzes your specific combination.
                    </p>
                </div>

                <div className="bg-white/80 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                        <h4 className="font-semibold text-slate-900">Safety & Approval Status</h4>
                    </div>
                    <p className="text-sm text-slate-700 mb-2">
                        <strong>Sources:</strong> CDSCO + WHO Essential Medicines List
                    </p>
                    <p className="text-sm text-slate-600">
                        CDSCO (Central Drugs Standard Control Organization) approves all medicines in India. WHO certifies essential medicines globally.
                    </p>
                </div>

                <div className="bg-white/80 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                        <h4 className="font-semibold text-slate-900">Manufacturer Information</h4>
                    </div>
                    <p className="text-sm text-slate-700 mb-2">
                        <strong>Sources:</strong> CDSCO approved manufacturer list + eAushadhi portal
                    </p>
                    <p className="text-sm text-slate-600">
                        We show ONLY government-owned or government-certified manufacturers: IDPL, HAL, IPHB, Karnataka Antibiotics
                    </p>
                </div>
            </div>

            <div className="mt-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4 border border-purple-300">
                <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-purple-900">
                        <strong>100% Verified:</strong> We NEVER use unverified sources. Every data point is cross-checked across minimum 2 official government databases. No hallucination, no guessing.
                    </div>
                </div>
            </div>
        </div>
    );
}

export function MultipleManufacturersExplanation() {
    return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-amber-900 mb-2">
                        Why We Show 4 Manufacturers
                    </h3>
                    <p className="text-amber-800">
                        Availability varies - we give you options!
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="bg-white/80 rounded-lg p-4 border border-amber-200">
                    <h4 className="font-semibold text-slate-900 mb-2">The Availability Problem:</h4>
                    <ul className="space-y-1 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                            <span className="text-amber-600">•</span>
                            <span>Jan Aushadhi store may be far from your location</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-600">•</span>
                            <span>Specific medicine may be out of stock</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-600">•</span>
                            <span>Local pharmacies may not stock Jan Aushadhi brand</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-600">•</span>
                            <span>Different states have different distribution</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-300">
                    <h4 className="font-semibold text-emerald-900 mb-2">Our Solution - 4 Government Options:</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-3">
                            <span className="font-bold text-emerald-700 w-4">1.</span>
                            <div>
                                <strong className="text-slate-900">Jan Aushadhi</strong>
                                <p className="text-slate-600">8,500+ stores nationwide, cheapest option</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="font-bold text-emerald-700 w-4">2.</span>
                            <div>
                                <strong className="text-slate-900">IDPL (Indian Drugs & Pharmaceuticals)</strong>
                                <p className="text-slate-600">Government PSU, available in major pharmacies</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="font-bold text-emerald-700 w-4">3.</span>
                            <div>
                                <strong className="text-slate-900">HAL (Hindustan Antibiotics)</strong>
                                <p className="text-slate-600">Government company, online & offline availability</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="font-bold text-emerald-700 w-4">4.</span>
                            <div>
                                <strong className="text-slate-900">Karnataka Antibiotics / IPHB</strong>
                                <p className="text-slate-600">State government manufacturers, regional availability</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                    <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900">
                            <strong>Smart Choice:</strong> If one manufacturer is unavailable near you, you have 3 backup options - all government-certified, all 70-90% cheaper than branded!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function HealthcareEducation() {
    return (
        <div className="space-y-8">
            <MedicationSafetyEducation />
            <WhyGenericMedicines />
            <DataSourcesExplanation />
            <MultipleManufacturersExplanation />
        </div>
    );
}
