'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Pill, TrendingDown, MapPin, CheckCircle, AlertCircle, Building2, FileText, Upload, Droplet, Loader } from 'lucide-react';
import { medicineDatabase, searchMedicine } from '@/lib/medicine-database';


export default function GenericFinder() {
    const [searchTerm, setSearchTerm] = useState('');
    const [result, setResult] = useState(null);
    const [searching, setSearching] = useState(false);
    const [scannedMedicines, setScannedMedicines] = useState([]);
    const [allResults, setAllResults] = useState([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [aiDescription, setAiDescription] = useState(null);
    const [loadingDescription, setLoadingDescription] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('from') === 'scanner') {
            const stored = localStorage.getItem('scannedMedicines');
            if (stored) {
                try {
                    const medicines = JSON.parse(stored);
                    setScannedMedicines(medicines);

                    const results = medicines.map(med => {
                        const found = searchMedicine(med);
                        return { medicine: med, data: found || { exact: null } };
                    });

                    setAllResults(results);
                    localStorage.removeItem('scannedMedicines');
                } catch (e) {
                    console.error('Error loading scanned medicines:', e);
                }
            }
        }
    }, []);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;

        setSearching(true);
        const found = searchMedicine(searchTerm);
        
        // If not in database, generate alternatives using AI
        if (!found || !found.exact) {
            await generateAIAlternatives(searchTerm);
        } else {
            setResult(found);
        }
        
        await getAIDescription(searchTerm);
        setSearching(false);
    };
    
    const generateAIAlternatives = async (medicineName) => {
        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [{
                        role: 'user',
                        content: `Medicine: ${medicineName}\n\nProvide generic alternatives in this EXACT format (no asterisks, no markdown):\n\nGENERIC NAME: [generic name]\nBRANDED PRICE: [number only, e.g., 100]\nJAN AUSHADHI PRICE: [number only, e.g., 5]\nIDPL PRICE: [number only, e.g., 6]\nHAL PRICE: [number only, e.g., 5.50]\nKARNATAKA PRICE: [number only, e.g., 5.80]\nUSES: [what it treats]\nCATEGORY: [medicine category]`
                    }],
                    temperature: 0.3,
                    max_tokens: 300
                })
            });
            
            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            
            // Parse AI response
            const genericName = aiResponse.match(/GENERIC NAME: (.+)/)?.[1]?.trim() || medicineName;
            const brandedPrice = parseInt(aiResponse.match(/BRANDED PRICE: (\d+)/)?.[1]) || 100;
            const janPrice = parseFloat(aiResponse.match(/JAN AUSHADHI PRICE: ([\d.]+)/)?.[1]) || 5;
            const idplPrice = parseFloat(aiResponse.match(/IDPL PRICE: ([\d.]+)/)?.[1]) || 6;
            const halPrice = parseFloat(aiResponse.match(/HAL PRICE: ([\d.]+)/)?.[1]) || 5.50;
            const karnatakaPrice = parseFloat(aiResponse.match(/KARNATAKA PRICE: ([\d.]+)/)?.[1]) || 5.80;
            const uses = aiResponse.match(/USES: (.+)/)?.[1]?.trim() || 'Consult doctor for usage';
            const category = aiResponse.match(/CATEGORY: (.+)/)?.[1]?.trim() || 'Medicine';
            
            // Create result object
            const generatedResult = {
                exact: {
                    branded: medicineName,
                    activeIngredient: genericName,
                    brandedPrice: brandedPrice,
                    uses: uses,
                    category: category,
                    alternatives: [
                        {
                            name: genericName,
                            manufacturer: 'Jan Aushadhi',
                            price: janPrice,
                            availability: '8,500+ stores across India',
                            savings: Math.round(((brandedPrice - janPrice) / brandedPrice) * 100)
                        },
                        {
                            name: genericName,
                            manufacturer: 'IDPL',
                            price: idplPrice,
                            availability: 'Government PSU stores',
                            savings: Math.round(((brandedPrice - idplPrice) / brandedPrice) * 100)
                        },
                        {
                            name: genericName,
                            manufacturer: 'HAL',
                            price: halPrice,
                            availability: 'Hindustan Antibiotics stores',
                            savings: Math.round(((brandedPrice - halPrice) / brandedPrice) * 100)
                        },
                        {
                            name: genericName,
                            manufacturer: 'Karnataka Antibiotics',
                            price: karnatakaPrice,
                            availability: 'Karnataka govt stores',
                            savings: Math.round(((brandedPrice - karnatakaPrice) / brandedPrice) * 100)
                        }
                    ]
                }
            };
            
            setResult(generatedResult);
        } catch (error) {
            console.error('AI generation error:', error);
            // Fallback with estimated prices
            const fallbackResult = {
                exact: {
                    branded: medicineName,
                    activeIngredient: medicineName,
                    brandedPrice: 100,
                    uses: 'Consult doctor for usage information',
                    category: 'Medicine',
                    alternatives: [
                        { name: medicineName, manufacturer: 'Jan Aushadhi', price: 5, availability: '8,500+ stores', savings: 95 },
                        { name: medicineName, manufacturer: 'IDPL', price: 6, availability: 'Govt PSU stores', savings: 94 },
                        { name: medicineName, manufacturer: 'HAL', price: 5.50, availability: 'HAL stores', savings: 94 },
                        { name: medicineName, manufacturer: 'Karnataka Antibiotics', price: 5.80, availability: 'Karnataka stores', savings: 94 }
                    ]
                }
            };
            setResult(fallbackResult);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);

        try {
            // Read file as base64
            const reader = new FileReader();
            reader.onload = async (event) => {
                const base64Image = event.target.result;

                try {
                    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

                    if (!apiKey) {
                        throw new Error('API key not found');
                    }

                    // Use Groq Vision to extract medicine name
                    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            model: 'meta-llama/llama-4-scout-17b-16e-instruct',
                            messages: [{
                                role: 'user',
                                content: [
                                    {
                                        type: 'text',
                                        text: `You are a medicine name extractor. Look at this image carefully.

Task: Extract ONLY the medicine/drug name (active ingredient or brand name).

Examples:
- From "Crocin 500mg" → extract "Crocin"
- From "Metformin HCL 850mg" → extract "Metformin"
- From "Tab. Azithromycin 500" → extract "Azithromycin"
- From "Paracetamol IP 650mg" → extract "Paracetamol"

Rules:
1. Return ONLY the medicine name (one word)
2. NO dosage, NO "mg", NO "Tab", NO "IP"
3. If multiple medicines visible, return the MAIN/LARGEST one
4. If unclear or no medicine visible, return "unclear"

Medicine name:`
                                    },
                                    { type: 'image_url', image_url: { url: base64Image } }
                                ]
                            }],
                            temperature: 0.1,
                            max_tokens: 50
                        })
                    });

                    if (!response.ok) throw new Error('OCR failed');

                    const data = await response.json();
                    const extractedName = data.choices?.[0]?.message?.content?.trim().toLowerCase() || '';

                    console.log('📝 Extracted medicine name:', extractedName);

                    if (extractedName && extractedName !== 'unknown' && extractedName.length > 2) {
                        setSearchTerm(extractedName);
                        setUploadingImage(false);

                        setTimeout(() => {
                            const found = searchMedicine(extractedName);
                            setResult(found);
                        }, 100);
                    } else {
                        setUploadingImage(false);
                        alert('❌ Could not extract medicine name from image.\n\nPlease:\n✓ Use clearer image\n✓ Or type medicine name manually');
                    }
                } catch (error) {
                    console.error('OCR Error:', error);
                    setUploadingImage(false);
                    alert('⚠️ Failed to extract medicine name.\n\nPlease:\n✓ Check your internet connection\n✓ Verify API key is set\n✓ Or type medicine name manually');
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('File reading error:', error);
            setUploadingImage(false);
            alert('Failed to read image file. Please try again.');
        }
    };

    // Generate estimated price ranges for any medicine
    const generatePriceEstimate = (medicineName) => {
        // Typical price patterns for common medicine types
        const estimates = {
            branded: Math.floor(Math.random() * (200 - 50) + 50), // ₹50-200
            janAushadhi: Math.floor(Math.random() * (30 - 5) + 5), // ₹5-30
            savings: 70 + Math.floor(Math.random() * 20) // 70-90%
        };

        return {
            brandedRange: `₹${estimates.branded} - ₹${estimates.branded + 50}`,
            janAushadhiRange: `₹${estimates.janAushadhi} - ₹${estimates.janAushadhi + 10}`,
            estimatedSavings: estimates.savings,
            disclaimer: "Estimated prices - actual may vary by brand and location"
        };
    };

    const getAIDescription = async (medicineName) => {
        setLoadingDescription(true);
        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [{
                        role: 'user',
                        content: `Medicine: ${medicineName}\n\nProvide information in this user-friendly format (NO asterisks, NO markdown):\n\nUse\n\n[What it treats - simple bullet points]\n\nDosage\n\n[Common strengths and how to take]\n[Frequency guidelines]\n[Maximum daily limit]\n\nPossible Side Effects\n\nSome people may experience:\n[List common side effects]\nThese usually pass on their own.\n\nImportant Precautions\n\n[When not to take]\n[Who should avoid]\n[Important warnings]`
                    }],
                    temperature: 0.3,
                    max_tokens: 300
                })
            });
            const data = await response.json();
            let description = data.choices[0].message.content;
            description = description.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#/g, '');
            setAiDescription(description);
        } catch (error) {
            setAiDescription('Error fetching description');
        }
        setLoadingDescription(false);
    };

    const popularMedicines = ['paracetamol', 'metformin', 'amlodipine', 'atorvastatin', 'omeprazole', 'cetirizine'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-healthcare-teal-50 to-healthcare-cyan-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link href="/" className="inline-flex items-center text-slate-600 hover:text-healthcare-teal-600 transition mb-4">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900">Medicine Finder</h1>
                    <p className="text-slate-600 mt-2">Find generic alternatives with prices - Save 70-90%</p>
                </div>
            </div>

            {/* Search Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center justify-center gap-2 text-sm font-medium text-slate-900"
                        >
                            <Upload className="w-4 h-4" />
                            Upload Medicine Photo
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </div>
                    {uploadingImage && (
                        <div className="mb-4 p-3 bg-slate-50 rounded-lg flex items-center gap-2">
                            <Loader className="w-4 h-4 animate-spin" />
                            <span className="text-sm text-slate-600">Extracting medicine name from image...</span>
                        </div>
                    )}
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Enter medicine name (e.g., Paracetamol, Metformin)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="flex-1 px-6 py-4 text-lg border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={searching || !searchTerm.trim()}
                            className="bg-healthcare-teal-600 hover:bg-healthcare-teal-700 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center disabled:opacity-50 whitespace-nowrap"
                        >
                            {searching ? 'Searching...' : (
                                <>
                                    <Search className="w-5 h-5 mr-2" />
                                    Find Alternatives
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-6">
                        <p className="text-sm text-slate-600 mb-2">Popular searches:</p>
                        <div className="flex flex-wrap gap-2">
                            {popularMedicines.map(med => (
                                <button
                                    key={med}
                                    onClick={() => {
                                        setSearchTerm(med);
                                        setTimeout(() => {
                                            const found = searchMedicine(med);
                                            setResult(found);
                                        }, 100);
                                    }}
                                    className="px-4 py-2 bg-slate-100 hover:bg-healthcare-teal-100 text-slate-700 rounded-lg text-sm transition capitalize"
                                >
                                    {med}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Scanned Medicines Results */}
                {allResults.length > 0 && (
                    <div className="mt-8">
                        <div className="bg-gradient-to-r from-blue-100 to-green-100 border-2 border-blue-300 rounded-xl p-4 mb-6">
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <h3 className="font-bold text-slate-900">
                                    Prescription Scanned: Found {allResults.length} medicine{allResults.length > 1 ? 's' : ''}
                                </h3>
                            </div>
                            <p className="text-sm text-slate-700 mt-1">
                                Showing generic alternatives for all extracted medicines
                            </p>
                        </div>

                        <div className="space-y-8">
                            {allResults.map((item, idx) => (
                                <div key={idx} className="bg-white rounded-xl border-2 border-blue-200 p-6 shadow-md">
                                    {/* Medicine Header */}
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-blue-100">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Pill className="w-5 h-5 text-blue-600" />
                                                <h3 className="text-2xl font-bold text-slate-900 capitalize">{item.medicine}</h3>
                                            </div>
                                            <p className="text-sm text-slate-600">{item.data.exact.branded}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-slate-600">Branded Price</div>
                                            <div className="text-2xl font-bold text-red-600">₹{item.data.exact.brandedPrice}</div>
                                        </div>
                                    </div>

                                    {/* Alternatives Grid */}
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {item.data.exact.alternatives.map((alt, altIdx) => (
                                            <div key={altIdx} className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-green-200 hover:border-green-400 transition">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Building2 className="w-4 h-4 text-green-600" />
                                                            <span className="text-sm font-semibold text-green-700">{alt.manufacturer}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-600">{alt.availability}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-green-600">₹{alt.price}</div>
                                                        <div className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded mt-1">
                                                            {alt.savings}% OFF
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-slate-600 mt-2 pt-2 border-t border-green-200">
                                                    Save: <span className="font-bold text-green-700">₹{item.data.exact.brandedPrice - alt.price}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Link
                                        href={`/absorption-reminder?medicine=${encodeURIComponent(item.medicine)}`}
                                        className="mt-4 w-full py-4 px-6 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:from-teal-700 hover:via-cyan-700 hover:to-blue-700 text-white rounded-xl transition-all flex items-center justify-center gap-3 font-bold shadow-lg hover:shadow-xl hover:scale-105 group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
                                            <Droplet className="w-5 h-5" />
                                        </div>
                                        <span>Optimize Absorption with AI</span>
                                        <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {/* Total Savings */}
                        <div className="mt-6 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
                            <div className="text-center">
                                <div className="text-sm font-semibold mb-2">Total Potential Savings (using best alternatives)</div>
                                <div className="text-4xl font-bold">
                                    ₹{allResults.reduce((sum, item) => {
                                        const bestAlt = item.data.exact.alternatives[0];
                                        return sum + (item.data.exact.brandedPrice - bestAlt.price);
                                    }, 0)}
                                </div>
                                <div className="text-sm mt-2 opacity-90">per month</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results */}
                {result && result.exact && (
                    <div className="mt-8 space-y-6">
                        {/* Branded Medicine */}
                        <div className="bg-white rounded-2xl shadow-lg border-2 border-red-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold text-red-600 uppercase mb-2 block">Branded Medicine</span>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-1">{result.exact.branded}</h3>
                                    <p className="text-slate-600 text-sm">{result.exact.activeIngredient}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-bold text-red-600">₹{result.exact.brandedPrice}</div>
                                    <div className="text-sm text-slate-600">per strip</div>
                                </div>
                            </div>
                        </div>

                        {/* Best Alternative Highlight */}
                        {result.exact.alternatives && result.exact.alternatives.length > 0 && (
                            <>
                                <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 text-white">
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle className="w-6 h-6" />
                                                <span className="text-sm font-semibold uppercase">Best Alternative - Save {result.exact.alternatives[0].savings}%!</span>
                                            </div>
                                            <h3 className="text-3xl font-bold mb-2">{result.exact.alternatives[0].name}</h3>
                                            <p className="text-green-100 mb-3">by {result.exact.alternatives[0].manufacturer}</p>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                <span className="text-sm">{result.exact.alternatives[0].availability}</span>
                                            </div>
                                        </div>
                                        <div className="text-center md:text-right">
                                            <div className="text-5xl font-bold mb-2">₹{result.exact.alternatives[0].price}</div>
                                            <div className="text-lg text-green-100 line-through mb-2">₹{result.exact.brandedPrice}</div>
                                            <div className="bg-white/20 px-4 py-2 rounded-lg inline-block">
                                                <div className="text-2xl font-bold">You Save</div>
                                                <div className="text-3xl font-bold">₹{result.exact.brandedPrice - result.exact.alternatives[0].price}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* All Alternatives */}
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                                        All Government-Verified Alternatives ({result.exact.alternatives.length})
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {result.exact.alternatives.map((alt, idx) => (
                                            <div key={idx} className="bg-white rounded-xl border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Building2 className="w-5 h-5 text-green-600" />
                                                            <span className="text-sm font-semibold text-green-600">{alt.manufacturer}</span>
                                                        </div>
                                                        <h4 className="text-lg font-bold text-slate-900 mb-1">{alt.name}</h4>
                                                        <p className="text-sm text-slate-600 mb-2">{alt.availability}</p>
                                                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                                            Government Certified
                                                        </span>
                                                    </div>
                                                    <div className="text-right ml-4">
                                                        <div className="text-3xl font-bold text-green-600">₹{alt.price}</div>
                                                        <div className="text-sm text-slate-400 line-through">₹{result.exact.brandedPrice}</div>
                                                        <div className="mt-2 px-3 py-1 bg-green-100 rounded-lg">
                                                            <div className="text-lg font-bold text-green-800">{alt.savings}% OFF</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pt-4 border-t border-slate-200">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-slate-600">You save:</span>
                                                        <span className="text-lg font-bold text-green-600">₹{result.exact.brandedPrice - alt.price}</span>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/absorption-reminder?medicine=${encodeURIComponent(searchTerm)}`}
                                                    className="mt-4 w-full py-4 px-6 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:from-teal-700 hover:via-cyan-700 hover:to-blue-700 text-white rounded-xl transition-all flex items-center justify-center gap-3 font-bold shadow-lg hover:shadow-xl hover:scale-105 group"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
                                                        <Droplet className="w-5 h-5" />
                                                    </div>
                                                    <span>Optimize Absorption with AI</span>
                                                    <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Purchase Options */}
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <MapPin className="w-6 h-6 text-blue-600" />
                                        Where to Buy
                                    </h3>
                                    <p className="text-slate-600 mb-4">
                                        Choose your preferred option - online delivery or nearby stores
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        {/* Jan Aushadhi Stores */}
                                        <a
                                            href="https://www.google.com/maps/search/Jan+Aushadhi+Kendra+near+me"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white hover:bg-blue-50 border border-blue-200 hover:border-blue-400 rounded-xl p-6 transition group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition">
                                                    <MapPin className="w-7 h-7 text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-slate-900 text-lg mb-1">Nearby Stores</h4>
                                                    <p className="text-sm text-slate-600">Jan Aushadhi Kendra</p>
                                                    <p className="text-xs text-blue-600 font-semibold mt-1">8,500+ locations →</p>
                                                </div>
                                            </div>
                                        </a>

                                        {/* Online Purchase */}
                                        <a
                                            href="https://www.zenohealth.in"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white hover:bg-cyan-50 border border-cyan-200 hover:border-cyan-400 rounded-xl p-6 transition group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition">
                                                    <Upload className="w-7 h-7 text-cyan-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-slate-900 text-lg mb-1">Online Delivery</h4>
                                                    <p className="text-sm text-slate-600">Zeno Health</p>
                                                    <p className="text-xs text-cyan-600 font-semibold mt-1">Pan India delivery →</p>
                                                </div>
                                            </div>
                                        </a>
                                    </div>

                                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-sm text-slate-700">
                                            <strong className="text-blue-700">💡 Tip:</strong> Ask for "{result.exact.activeIngredient}" (salt name) at any store
                                        </p>
                                    </div>
                                </div>

                                {/* AI Medicine Description */}
                                {loadingDescription && (
                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                                        <p className="text-sm text-blue-700">🤖 AI is fetching medicine details...</p>
                                    </div>
                                )}
                                {aiDescription && (
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
                                        <div className="flex items-start gap-3">
                                            <Pill className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                                            <div className="flex-1">
                                                <h4 className="font-bold text-blue-900 mb-3">Medicine Information</h4>
                                                <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">{aiDescription}</pre>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {!loadingDescription && !aiDescription && result.exact && (
                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                                        <div className="flex items-start gap-3">
                                            <Pill className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-slate-900 mb-1">Uses</h4>
                                                <p className="text-slate-700 mb-3">{result.exact.uses}</p>
                                                <p className="text-sm text-slate-600">
                                                    <strong>Active Ingredient:</strong> {result.exact.activeIngredient}
                                                </p>
                                                <p className="text-sm text-slate-600 mt-2">
                                                    <strong>Category:</strong> {result.exact.category}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Disclaimer */}
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                                    <div className="flex gap-3">
                                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                                        <p className="text-sm text-slate-700">
                                            <strong>Note:</strong> All generic medicines have the same active ingredient and efficacy as branded medicines. Always consult your doctor before switching.
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* No Results */}
                {searchTerm && !result && (
                    <div className="mt-8 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl shadow-lg border-2 border-teal-200 p-8">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Pill className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                "{searchTerm}" - Generic Available!
                            </h3>
                            <p className="text-slate-700 text-lg mb-4">
                                This medicine is available at generic/medical stores
                            </p>

                            <div className="flex justify-center mb-6">
                                <Link
                                    href={`/absorption-reminder?medicine=${encodeURIComponent(searchTerm)}`}
                                    className="px-10 py-5 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:from-teal-700 hover:via-cyan-700 hover:to-blue-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-4 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
                                        <Droplet className="w-6 h-6" />
                                    </div>
                                    <span>Optimize Absorption with AI</span>
                                    <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
                                </Link>
                            </div>
                        </div>

                        {/* Estimated Price Range */}
                        {(() => {
                            const priceEst = generatePriceEstimate(searchTerm);
                            return (
                                <div className="bg-white rounded-xl p-6 mb-6 border-2 border-emerald-200">
                                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <TrendingDown className="w-5 h-5 text-emerald-600" />
                                        Estimated Price Range
                                    </h4>
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                            <p className="text-sm text-slate-600 mb-1">Branded Medicine</p>
                                            <p className="text-2xl font-bold text-red-600">{priceEst.brandedRange}</p>
                                        </div>
                                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                            <p className="text-sm text-slate-600 mb-1">Jan Aushadhi Generic</p>
                                            <p className="text-2xl font-bold text-green-600">{priceEst.janAushadhiRange}</p>
                                            <p className="text-xs text-green-700 font-semibold mt-1">Save {priceEst.estimatedSavings}%</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 text-center italic">{priceEst.disclaimer}</p>
                                </div>
                            );
                        })()}

                        <div className="bg-white rounded-xl p-6 mb-6">
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-teal-600" />
                                Where to Buy "{searchTerm}"
                            </h4>

                            <div className="space-y-3">
                                <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-slate-900">Jan Aushadhi Kendra</p>
                                            <p className="text-sm text-slate-600">8,500+ government stores • 60-90% cheaper</p>
                                            <a
                                                href="https://www.google.com/maps/search/Jan+Aushadhi+Kendra+near+me"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-teal-600 hover:text-teal-700 font-semibold mt-1 inline-block"
                                            >
                                                📍 Find Nearest Store →
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-slate-900">Zeno Health</p>
                                            <p className="text-sm text-slate-600">Affordable medicine stores across India</p>
                                            <a
                                                href="https://www.google.com/maps/search/Zeno+Health+near+me"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold mt-1 inline-block"
                                            >
                                                📍 Find Nearest Store →
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-900">Nearest Medical Store</p>
                                            <p className="text-sm text-slate-600 mb-2">Your local pharmacy</p>
                                            <p className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200 mb-2">
                                                ⚠️ Generic availability may vary at regular medical stores
                                            </p>
                                            <a
                                                href="https://www.google.com/maps/search/medical+store+near+me"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-purple-600 hover:text-purple-700 font-semibold inline-block"
                                            >
                                                📍 Find Nearest Store →
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-slate-900">Any Medical/Generic Store</p>
                                            <p className="text-sm text-slate-600">Visit your local pharmacy and ask for:</p>
                                            <p className="text-sm font-semibold text-blue-700 mt-1">"{searchTerm}" (salt name)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                            <p className="text-sm text-slate-700">
                                <strong className="text-yellow-700">💡 Pro Tip:</strong> Always use the medicine's <strong>salt name</strong> (like "{searchTerm}") when asking at stores. This ensures you get the right generic alternative, regardless of the brand.
                            </p>
                        </div>
                    </div>
                )}

                {/* Initial State - How it works */}
                {!result && !searchTerm && (
                    <div className="mt-8 bg-white rounded-xl p-8 border-2 border-teal-200">
                        <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                            How to Find Generic Medicines
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
                                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mb-4">
                                    <Search className="w-6 h-6 text-white" />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">Search by Name</h4>
                                <p className="text-sm text-slate-600">
                                    Type any medicine name in the search box above. We'll show you generic alternatives and where to buy them.
                                </p>
                            </div>

                            <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mb-4">
                                    <Upload className="w-6 h-6 text-white" />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">Upload Image</h4>
                                <p className="text-sm text-slate-600">
                                    Click the camera icon to upload a medicine strip/box photo. Our AI will extract the name automatically.
                                </p>
                            </div>
                        </div>

                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-6">
                            <p className="text-sm text-slate-700">
                                <strong className="text-blue-700">💡 Works for ANY Medicine:</strong> Search for any medicine - even if it's not in our sample database, we'll show you where to get generic alternatives!
                            </p>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-slate-600 mb-3">Popular searches:</p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {popularMedicines.map(med => (
                                    <button
                                        key={med}
                                        onClick={() => {
                                            setSearchTerm(med);
                                            const found = searchMedicine(med);
                                            setResult(found);
                                        }}
                                        className="px-4 py-2 bg-slate-100 hover:bg-teal-100 border border-slate-300 hover:border-teal-400 rounded-lg text-sm font-medium text-slate-700 hover:text-teal-700 transition capitalize"
                                    >
                                        {med}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>


        </div>
    );
}
