'use client';

import Link from 'next/link';
import { Search, Upload, Shield, ArrowRight, CheckCircle, Heart, Zap, Award, AlertTriangle, Newspaper, TrendingUp, Users, Activity, Bell, ExternalLink, Droplet } from 'lucide-react';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            <nav className="border-b border-blue-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                                <Heart className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">ArogyaAgent</h1>
                                <p className="text-xs text-slate-500">AI Healthcare Platform</p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center space-x-6">
                            <a href="#how-it-works" className="text-sm text-slate-600 hover:text-blue-700 transition font-medium">How It Works</a>
                            <a href="#agents" className="text-sm text-slate-600 hover:text-blue-700 transition font-medium">AI Agents</a>
                            <a href="#sources" className="text-sm text-slate-600 hover:text-blue-700 transition font-medium">Data Sources</a>
                            <Link href="/generic-finder" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2.5 rounded-lg transition font-semibold shadow-lg">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 opacity-5"></div>
                <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 left-10 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-white shadow-lg px-6 py-3 rounded-full mb-8 border border-blue-100">
                            <Zap className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold text-blue-900">2 AI Agents • 10,827 Medicines • 100% Verified</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
                            Find <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Cheaper</span> Medicines
                            <br />Never <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Miss</span> a Dose
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto mb-10 leading-relaxed">
                            <strong className="text-slate-900">80% Indians overpay</strong> for medicines.
                            <br />AI finds government alternatives + sends smart reminders.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                            <Link href="/generic-finder" className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-2xl hover:shadow-blue-500/50 hover:scale-105">
                                <Search className="w-6 h-6" />
                                Find Generic Alternatives
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/absorption-reminder" className="group bg-white hover:bg-blue-50 text-blue-600 px-10 py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 border-2 border-blue-600 shadow-xl hover:shadow-2xl hover:scale-105">
                                <Bell className="w-6 h-6" />
                                Create AI Schedule
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <StatCard number="85%" label="Avg Savings" />
                            <StatCard number="10,827" label="Medicines" />
                            <StatCard number="2" label="AI Agents" />
                        </div>
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-blue-50 px-6 py-3 rounded-full mb-6 border border-blue-200">
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold text-blue-900">How We Help You Save</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Save Money + Take Medicines Correctly</h2>
                        <p className="text-lg text-slate-600 max-w-4xl mx-auto mb-12">AI-powered platform to find cheaper alternatives and optimize absorption</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <div className="bg-blue-50 rounded-2xl p-8 border-2 border-blue-200">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                                    <Search className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">Step 1: Find Cheaper Alternatives</h3>
                                    <ul className="space-y-2 text-slate-700">
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 font-bold mt-1">1.</span>
                                            <span><strong>Search any medicine</strong> - Type name or upload photo</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 font-bold mt-1">2.</span>
                                            <span><strong>Get 4 government options</strong> - Jan Aushadhi, IDPL, HAL, Karnataka</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 font-bold mt-1">3.</span>
                                            <span><strong>See real prices</strong> - ₹10 generic vs ₹100 branded</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 font-bold mt-1">4.</span>
                                            <span><strong>AI explains everything</strong> - Uses, dosage, side effects</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-cyan-50 rounded-2xl p-8 border-2 border-cyan-200">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-cyan-600 flex items-center justify-center flex-shrink-0">
                                    <Droplet className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">Step 2: Optimize Absorption</h3>
                                    <ul className="space-y-2 text-slate-700">
                                        <li className="flex items-start gap-2">
                                            <span className="text-cyan-600 font-bold mt-1">1.</span>
                                            <span><strong>AI tells best method</strong> - Vitamin D3 with milk, Iron with juice</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-cyan-600 font-bold mt-1">2.</span>
                                            <span><strong>Set your schedule</strong> - Time, frequency, duration</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-cyan-600 font-bold mt-1">3.</span>
                                            <span><strong>Get reminder message</strong> - Copy SMS text for your phone</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-cyan-600 font-bold mt-1">4.</span>
                                            <span><strong>Never miss a dose</strong> - Personalized instructions</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                </div>
            </section>

            <section id="agents" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">2 AI Agents</h2>
                        <p className="text-xl text-slate-600">Smart medicine finder + absorption optimizer</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <Link href="/generic-finder" className="block">
                            <div className="bg-white rounded-2xl p-10 border-2 border-slate-200 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all hover:scale-105 group h-full">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-all">
                                    <Search className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">Smart Generic Finder</h3>
                                <p className="text-slate-600 leading-relaxed mb-4">Search any medicine → Get 4 government alternatives with prices → AI explains uses, dosage, side effects</p>
                                <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold">
                                    <span>10,827 medicines</span>
                                    <span>•</span>
                                    <span>85% savings</span>
                                </div>
                            </div>
                        </Link>
                        <Link href="/absorption-reminder" className="block">
                            <div className="bg-white rounded-2xl p-10 border-2 border-slate-200 hover:border-cyan-400 shadow-lg hover:shadow-2xl transition-all hover:scale-105 group h-full">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center text-cyan-600 mb-6 group-hover:scale-110 transition-all">
                                    <Bell className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">Absorption Optimizer + Reminders</h3>
                                <p className="text-slate-600 leading-relaxed mb-4">AI tells best way to take medicines (e.g., Vitamin D3 with milk) → Set schedule → Get SMS/WhatsApp reminders</p>
                                <div className="flex items-center gap-2 text-sm text-cyan-600 font-semibold">
                                    <span>AI-powered advice</span>
                                    <span>•</span>
                                    <span>Free SMS</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            <section id="sources" className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-white shadow-lg px-6 py-3 rounded-full mb-6 border border-blue-200">
                            <Award className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold text-blue-900">100% Verified Data</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Government Data Sources</h2>
                        <p className="text-xl text-slate-600">Official medicine database from Jan Aushadhi</p>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        <SourceCard name="Jan Aushadhi" desc="10,827 medicines" />
                        <SourceCard name="NPPA" desc="Price ceilings" />
                        <SourceCard name="IDPL" desc="Govt manufacturer" />
                        <SourceCard name="HAL" desc="Govt manufacturer" />
                    </div>
                </div>
            </section>

            <section className="bg-gradient-to-r from-blue-600 to-cyan-600 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Start Saving Lives & Money Today
                    </h2>
                    <p className="text-xl text-blue-100 mb-10">
                        Join thousands using AI-powered healthcare intelligence
                    </p>
                    <Link href="/generic-finder" className="inline-flex items-center bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all group">
                        Find Generic Medicines
                        <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition" />
                    </Link>
                </div>
            </section>

            <footer className="bg-slate-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Heart className="w-6 h-6 text-blue-400" />
                        <span className="text-2xl font-bold">ArogyaAgent</span>
                    </div>
                    <p className="text-slate-400 mb-2">AI Healthcare Intelligence Platform</p>
                    <p className="text-slate-500 text-sm">Verified by Jan Aushadhi • NPPA • IDPL • HAL</p>
                </div>
            </footer>
        </main>
    );
}

function StatCard({ number, label }) {
    return (
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">{number}</div>
            <div className="text-sm font-semibold text-slate-700">{label}</div>
        </div>
    );
}

function AgentCard({ icon, title, desc }) {
    return (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-300 shadow-md hover:shadow-xl transition-all hover:scale-105 group h-full">
            <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 mb-6 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{desc}</p>
        </div>
    );
}

function SourceCard({ name, desc }) {
    return (
        <div className="bg-white rounded-xl p-6 border border-blue-200 hover:border-blue-400 shadow-md hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-slate-900">{name}</h3>
            </div>
            <p className="text-sm text-slate-600">{desc}</p>
        </div>
    );
}
