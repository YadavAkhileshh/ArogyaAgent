'use client';

import { useState, useEffect } from 'react';
import { User, X, AlertCircle, CheckCircle, Plus, Trash2 } from 'lucide-react';

export default function PatientProfile({ isOpen, onClose, onSave }) {
    const [profile, setProfile] = useState({
        age: '',
        pregnant: false,
        diabetes: false,
        bloodPressure: false,
        kidneyDisease: false,
        liverDisease: false,
        smoking: false,
        alcohol: false,
        customConditions: []
    });
    const [newCondition, setNewCondition] = useState('');
    const [showAddCondition, setShowAddCondition] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const saved = localStorage.getItem('patientProfile');
            if (saved) {
                setProfile(JSON.parse(saved));
            }
        }
    }, [isOpen]);

    const handleSave = () => {
        localStorage.setItem('patientProfile', JSON.stringify(profile));
        localStorage.setItem('profileCompleted', 'true');
        onSave?.(profile);
        onClose();
    };

    const addCustomCondition = () => {
        if (newCondition.trim()) {
            setProfile({
                ...profile,
                customConditions: [...profile.customConditions, newCondition.trim()]
            });
            setNewCondition('');
            setShowAddCondition(false);
        }
    };

    const removeCustomCondition = (index) => {
        setProfile({
            ...profile,
            customConditions: profile.customConditions.filter((_, i) => i !== index)
        });
    };

    const hasConditions = profile.pregnant || profile.diabetes || profile.bloodPressure || 
                          profile.kidneyDisease || profile.liverDisease || profile.smoking || 
                          profile.alcohol || profile.customConditions.length > 0;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-slate-900 text-white p-6 flex items-center justify-between rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <User className="w-6 h-6" />
                        <div>
                            <h2 className="text-xl font-bold">Patient Profile</h2>
                            <p className="text-sm text-slate-300">Get 10x more accurate safety checks</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="hover:bg-slate-800 p-2 rounded-lg transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <div className="text-sm font-semibold text-blue-900 mb-1">Optional but Powerful</div>
                            <div className="text-sm text-blue-800">
                                This information helps our AI provide <strong>10x more accurate</strong> personalized safety warnings and avoid dangerous drug interactions specific to your health.
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-3">Age (Years)</label>
                        <input
                            type="number"
                            value={profile.age}
                            onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                            placeholder="Enter your age"
                            className="w-full px-5 py-4 text-lg border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
                        />
                    </div>

                    <div className="space-y-4">
                        <p className="text-base font-bold text-slate-900">Medical Conditions</p>
                        
                        {[
                            { key: 'pregnant', label: 'Pregnant or Breastfeeding' },
                            { key: 'diabetes', label: 'Diabetes' },
                            { key: 'bloodPressure', label: 'High Blood Pressure' },
                            { key: 'kidneyDisease', label: 'Kidney Disease' },
                            { key: 'liverDisease', label: 'Liver Disease' }
                        ].map(({ key, label }) => (
                            <label key={key} className="flex items-center gap-4 p-5 bg-white rounded-xl border-2 border-slate-200 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                                <input
                                    type="checkbox"
                                    checked={profile[key]}
                                    onChange={(e) => setProfile({ ...profile, [key]: e.target.checked })}
                                    className="w-6 h-6 accent-blue-600"
                                />
                                <span className="font-semibold text-slate-900 text-base">{label}</span>
                            </label>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <p className="text-base font-bold text-slate-900">Lifestyle Factors</p>
                        
                        {[
                            { key: 'smoking', label: 'Smoking' },
                            { key: 'alcohol', label: 'Alcohol Consumption' }
                        ].map(({ key, label }) => (
                            <label key={key} className="flex items-center gap-4 p-5 bg-white rounded-xl border-2 border-slate-200 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                                <input
                                    type="checkbox"
                                    checked={profile[key]}
                                    onChange={(e) => setProfile({ ...profile, [key]: e.target.checked })}
                                    className="w-6 h-6 accent-blue-600"
                                />
                                <span className="font-semibold text-slate-900 text-base">{label}</span>
                            </label>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-base font-bold text-slate-900">Other Health Conditions</p>
                            <button
                                onClick={() => setShowAddCondition(!showAddCondition)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                            >
                                <Plus className="w-4 h-4" />
                                Add Condition
                            </button>
                        </div>

                        {showAddCondition && (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newCondition}
                                    onChange={(e) => setNewCondition(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addCustomCondition()}
                                    placeholder="e.g., Asthma, Thyroid, Heart Disease"
                                    className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                                />
                                <button
                                    onClick={addCustomCondition}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
                                >
                                    Add
                                </button>
                            </div>
                        )}

                        {profile.customConditions.length > 0 && (
                            <div className="space-y-2">
                                {profile.customConditions.map((condition, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                                        <span className="font-medium text-slate-900">{condition}</span>
                                        <button
                                            onClick={() => removeCustomCondition(index)}
                                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {hasConditions && (
                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 flex items-start gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <div className="text-sm font-bold text-green-900 mb-1">Profile Enhanced!</div>
                                <div className="text-sm text-green-800">
                                    Your safety checks will now be <strong>10x more accurate</strong> based on your health profile.
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="sticky bottom-0 bg-white border-t-2 border-slate-200 p-6 flex gap-4 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="flex-1 px-8 py-4 border-2 border-slate-300 rounded-xl font-bold text-slate-900 hover:bg-slate-50 transition text-lg"
                    >
                        Skip for Now
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 text-lg shadow-lg"
                    >
                        <CheckCircle className="w-6 h-6" />
                        Save Profile
                    </button>
                </div>
            </div>
        </div>
    );
}
