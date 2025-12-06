'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Droplet, Bell, Trash2, Clock, Copy, Check, MessageSquare, Sparkles } from 'lucide-react';

export default function AbsorptionReminder() {
    // AI schedule builder component
    const [medicine, setMedicine] = useState('');
    const [phone, setPhone] = useState('');
    const [absorptionAdvice, setAbsorptionAdvice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [reminders, setReminders] = useState([]);
    const [smsMessage, setSmsMessage] = useState('');
    const [copied, setCopied] = useState(false);
    
    // AI Questionnaire states
    const [showQuestionnaire, setShowQuestionnaire] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [generatingSchedule, setGeneratingSchedule] = useState(false);
    const [fullSchedule, setFullSchedule] = useState(null);

    const questions = [
        {
            id: 'medicineFrequency',
            question: 'What medicine are you going to take and how many times a day has it been prescribed?',
            type: 'text',
            placeholder: 'e.g., Paracetamol 500 mg, three times a day'
        },
        {
            id: 'todayDose',
            question: 'Have you already taken any dose today? If yes, what time? If no, we\'ll start fresh.',
            type: 'text',
            placeholder: 'e.g., No, not yet or Yes, at 9 AM'
        },
        {
            id: 'mealTimes',
            question: 'What time do you usually eat breakfast, lunch, and dinner?',
            type: 'text',
            placeholder: 'e.g., Breakfast at 9 am, lunch at 2 pm, dinner at 9 pm'
        },
        {
            id: 'foodTiming',
            question: 'Do you know if this medicine should be taken before food, with food, or after food?',
            type: 'text',
            placeholder: 'e.g., After food or I don\'t know'
        },
        {
            id: 'beverages',
            question: 'Do you drink tea, coffee, milk, or juice around meal or medicine time? If yes, when?',
            type: 'text',
            placeholder: 'e.g., Tea at 8:30 am and 5 pm'
        },
        {
            id: 'otherMedicines',
            question: 'Are you taking any other medicines, vitamins, or supplements during the day?',
            type: 'text',
            placeholder: 'e.g., No or Vitamin D in morning'
        },
        {
            id: 'stomachIssues',
            question: 'Do you have acidity, gas, indigestion, or stomach-related issues?',
            type: 'text',
            placeholder: 'e.g., Sometimes mild acidity after lunch'
        },
        {
            id: 'waterIntake',
            question: 'How much water do you drink in a typical day?',
            type: 'text',
            placeholder: 'e.g., Around 1.5 liters or 6-8 glasses'
        },
        {
            id: 'physicalActivity',
            question: 'Do you do any regular physical activity like gym, running, or heavy work? If yes, at what time?',
            type: 'text',
            placeholder: 'e.g., Gym from 7 pm to 8 pm or No'
        },
        {
            id: 'sleepPattern',
            question: 'Do you sleep or lie down soon after meals or medicines?',
            type: 'text',
            placeholder: 'e.g., I usually lie down 20 minutes after dinner'
        }
    ];

    useEffect(() => {
        const stored = localStorage.getItem('medicineReminders');
        if (stored) setReminders(JSON.parse(stored));
        
        const params = new URLSearchParams(window.location.search);
        const medicineName = params.get('medicine');
        if (medicineName) {
            setMedicine(medicineName);
            setShowQuestionnaire(true);
        }
    }, []);

    const startQuestionnaire = () => {
        setShowQuestionnaire(true);
        setCurrentQuestion(0);
        setAnswers({});
    };

    const handleAnswer = (value) => {
        const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
        setAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            generateAISchedule(newAnswers);
        }
    };

    const generateAISchedule = async (userAnswers) => {
        setGeneratingSchedule(true);
        setShowQuestionnaire(false);

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
                        content: `You are an expert medical AI creating absorption-focused medicine schedules.

Medicine: ${medicine}

Patient Information:
1. Medicine & Frequency: ${userAnswers.medicineFrequency}
2. Today's Dose: ${userAnswers.todayDose}
3. Meal Times: ${userAnswers.mealTimes}
4. Food Timing: ${userAnswers.foodTiming}
5. Beverages: ${userAnswers.beverages}
6. Other Medicines: ${userAnswers.otherMedicines}
7. Stomach Issues: ${userAnswers.stomachIssues}
8. Water Intake: ${userAnswers.waterIntake}
9. Physical Activity: ${userAnswers.physicalActivity}
10. Sleep Pattern: ${userAnswers.sleepPattern}

Provide response in this EXACT format (no asterisks, no markdown):

Ideal Absorption-Focused Timing Plan

I will optimize timing based on:
• empty stomach vs full
• avoiding tea/coffee
• avoiding gym/exercise time
• digestion time
• acidity management
• hydration

Dose 1 — [time]

Reason:
• [meal timing detail]
• [beverage avoidance]
• [absorption benefit]
• [effect timing]

Dose 2 — [time]

Reason:
• [gap from previous dose]
• [meal timing detail]
• [beverage avoidance]
• [absorption window]

Dose 3 (Only if needed) — [time]

Reason:
• [gap maintenance]
• [exercise consideration]
• [meal digestion time]
• [sleep timing]

Extra absorption boosters:

1. [Water intake advice]
2. [Beverage timing advice]
3. [Exercise timing advice]
4. [Posture advice]
5. [Meal advice]`
                    }],
                    temperature: 0.3,
                    max_tokens: 800
                })
            });

            const data = await response.json();
            let schedule = data.choices[0].message.content;
            schedule = schedule.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#/g, '');
            
            setFullSchedule(schedule);
            setAbsorptionAdvice(schedule);
        } catch (error) {
            setFullSchedule('Error generating schedule. Please try again.');
        }
        setGeneratingSchedule(false);
    };

    const addReminder = () => {
        if (!medicine || !phone || !absorptionAdvice) {
            alert('Please complete the AI schedule first');
            return;
        }

        const newReminder = {
            id: Date.now(),
            medicine,
            phone,
            schedule: fullSchedule,
            createdAt: new Date().toISOString()
        };

        const updated = [...reminders, newReminder];
        setReminders(updated);
        localStorage.setItem('medicineReminders', JSON.stringify(updated));

        const scheduleLines = fullSchedule?.match(/Time \d+: .+/g) || [];
        const message = `🔔 Medicine Schedule - ${medicine}\n\n${scheduleLines.join('\n')}\n\nSet by ArogyaAgent`;
        setSmsMessage(message);
        
        alert('✅ Schedule saved! Copy the SMS message below.');
    };
    
    const copySMS = () => {
        navigator.clipboard.writeText(smsMessage);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const deleteReminder = (id) => {
        const updated = reminders.filter(r => r.id !== id);
        setReminders(updated);
        localStorage.setItem('medicineReminders', JSON.stringify(updated));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
            <div className="bg-white border-b border-teal-100 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <button onClick={() => window.history.back()} className="inline-flex items-center text-slate-600 hover:text-teal-600 transition mb-4">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900">AI Medicine Schedule Optimizer</h1>
                    <p className="text-slate-600 mt-2">Answer in any language → AI creates your personalized schedule</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {!medicine && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-teal-100">
                        <h2 className="text-xl font-bold mb-6 text-slate-900">Step 1: Enter Medicine Name</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-slate-700">Medicine Name</label>
                                <input
                                    type="text"
                                    value={medicine}
                                    onChange={(e) => setMedicine(e.target.value)}
                                    placeholder="e.g., Vitamin D3, Metformin"
                                    className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition"
                                />
                            </div>

                            <button
                                onClick={startQuestionnaire}
                                disabled={!medicine}
                                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                            >
                                <Sparkles className="w-5 h-5" />
                                Start AI Schedule Builder
                            </button>
                        </div>
                    </div>
                )}

                {/* AI Questionnaire */}
                {showQuestionnaire && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-teal-100">
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-slate-900">Building Your Schedule</h2>
                                <span className="text-sm font-semibold text-teal-600">
                                    Question {currentQuestion + 1} of {questions.length}
                                </span>
                            </div>
                            <div className="w-full bg-teal-100 rounded-full h-2">
                                <div 
                                    className="bg-gradient-to-r from-teal-600 to-cyan-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-3">
                                <MessageSquare className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                        {questions[currentQuestion].question}
                                    </h3>

                                    {questions[currentQuestion].type === 'text' && (
                                        <div>
                                            <textarea
                                                placeholder={questions[currentQuestion].placeholder}
                                                value={answers[questions[currentQuestion].id] || ''}
                                                onChange={(e) => setAnswers({...answers, [questions[currentQuestion].id]: e.target.value})}
                                                className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-lg min-h-[100px] resize-none"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => {
                                                    const value = answers[questions[currentQuestion].id];
                                                    if (value?.trim()) handleAnswer(value);
                                                }}
                                                disabled={!answers[questions[currentQuestion].id]?.trim()}
                                                className="mt-3 w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
                                            >
                                                {currentQuestion === questions.length - 1 ? 'Generate Schedule' : 'Next Question'}
                                            </button>
                                            <p className="text-xs text-slate-500 mt-2 text-center">Write in any language - AI will understand</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Generating Schedule */}
                {generatingSchedule && (
                    <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-6 mb-8">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-teal-600 animate-pulse" />
                            <p className="text-teal-700 font-semibold">AI is analyzing your routine and creating optimal schedule...</p>
                        </div>
                    </div>
                )}

                {/* AI Generated Schedule */}
                {fullSchedule && !generatingSchedule && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-teal-100">
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900 mb-6">
                            <Sparkles className="w-7 h-7 text-teal-600" />
                            Your Medicine Schedule
                        </h2>
                        
                        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl p-6 mb-6">
                            <pre className="text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">{fullSchedule}</pre>
                        </div>



                        <h3 className="text-lg font-bold mb-4 text-slate-900">Step 2: Set Reminder</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-slate-700">Phone Number (for SMS reminder)</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+91 9876543210"
                                    className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                />
                            </div>

                            <button
                                onClick={addReminder}
                                disabled={!phone}
                                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
                            >
                                <Bell className="w-5 h-5" />
                                Save Schedule + Get SMS Message
                            </button>
                        </div>
                    </div>
                )}

                {/* SMS Message */}
                {smsMessage && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-teal-200">
                        <h2 className="text-xl font-bold mb-4 text-teal-900 flex items-center gap-2">
                            <Check className="w-6 h-6" />
                            Schedule Saved!
                        </h2>
                        <p className="text-sm text-slate-600 mb-4">Copy this message and send it to <strong>{phone}</strong> via SMS/WhatsApp:</p>
                        
                        <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 mb-4">
                            <pre className="text-sm whitespace-pre-wrap font-mono text-slate-800">{smsMessage}</pre>
                        </div>
                        
                        <button
                            onClick={copySMS}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-5 h-5" />
                                    Copy SMS Message
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Saved Reminders */}
                {reminders.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-teal-100">
                        <h2 className="text-xl font-bold mb-6 text-slate-900">Your Saved Schedules ({reminders.length})</h2>
                        <div className="space-y-4">
                            {reminders.map((r) => (
                                <div key={r.id} className="bg-teal-50 border-2 border-teal-200 rounded-xl p-6 flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock className="w-5 h-5 text-teal-600" />
                                            <h3 className="font-bold text-slate-900">{r.medicine}</h3>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-2">📱 {r.phone}</p>
                                        {r.schedule && (
                                            <div className="text-xs text-teal-700 bg-teal-100 px-3 py-2 rounded-lg mt-2 line-clamp-2">
                                                {r.schedule.substring(0, 100)}...
                                            </div>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => deleteReminder(r.id)} 
                                        className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
