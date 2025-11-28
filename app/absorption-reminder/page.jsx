'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Droplet, Bell, Trash2, Clock, Copy, Check, MessageSquare, Sparkles } from 'lucide-react';

export default function AbsorptionReminder() {
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
            id: 'wakeTime',
            question: 'What time do you usually wake up?',
            type: 'text',
            placeholder: 'e.g., 7 AM, सुबह 7 बजे, 7:00, morning 7'
        },
        {
            id: 'breakfast',
            question: 'What time do you have breakfast?',
            type: 'text',
            placeholder: 'e.g., 8 AM, नाश्ता 8 बजे, 8:00, morning 8'
        },
        {
            id: 'lunch',
            question: 'What time do you have lunch?',
            type: 'text',
            placeholder: 'e.g., 1 PM, दोपहर 1 बजे, 13:00, afternoon 1'
        },
        {
            id: 'dinner',
            question: 'What time do you have dinner?',
            type: 'text',
            placeholder: 'e.g., 8 PM, रात 8 बजे, 20:00, evening 8'
        },
        {
            id: 'sleep',
            question: 'What time do you go to sleep?',
            type: 'text',
            placeholder: 'e.g., 10 PM, रात 10 बजे, 22:00, night 10'
        },
        {
            id: 'frequency',
            question: 'How many times per day should you take this medicine?',
            type: 'text',
            placeholder: 'e.g., once daily, दिन में एक बार, twice, 2 times'
        }
    ];

    useEffect(() => {
        const stored = localStorage.getItem('medicineReminders');
        if (stored) setReminders(JSON.parse(stored));
        
        const params = new URLSearchParams(window.location.search);
        const medicineName = params.get('medicine');
        if (medicineName) {
            setMedicine(medicineName);
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
                        content: `You are a multilingual medical AI. The user has provided their daily routine in their native language. Parse and understand the times, then create a personalized medicine schedule for ${medicine}.

User's Daily Routine (may be in Hindi, English, or any language):
- Wake up: ${userAnswers.wakeTime}
- Breakfast: ${userAnswers.breakfast}
- Lunch: ${userAnswers.lunch}
- Dinner: ${userAnswers.dinner}
- Sleep: ${userAnswers.sleep}
- Frequency: ${userAnswers.frequency}

First, understand and convert all times to 24-hour format. Then provide response in this EXACT format (no asterisks, no markdown):

SCHEDULE:
Time 1: [HH:MM format] - [with meal/empty stomach]
Time 2: [HH:MM format] - [with meal/empty stomach]
Time 3: [HH:MM format] - [with meal/empty stomach]

BEST TIME: [explanation based on medicine absorption]
TAKE WITH: [milk/water/juice/food - specific for this medicine]
WHY: [absorption science for this specific medicine]
AVOID: [what not to take with - specific interactions]
PRO TIP: [personalized advice based on their exact routine]`
                    }],
                    temperature: 0.3,
                    max_tokens: 500
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
                    <Link href="/" className="inline-flex items-center text-slate-600 hover:text-teal-600 transition mb-4">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900">AI Medicine Schedule Optimizer</h1>
                    <p className="text-slate-600 mt-2">Answer in any language → AI creates your personalized schedule</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Medicine Input */}
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
                                            <input
                                                type="text"
                                                placeholder={questions[currentQuestion].placeholder}
                                                onChange={(e) => setAnswers({...answers, [questions[currentQuestion].id]: e.target.value})}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                                        handleAnswer(e.target.value);
                                                    }
                                                }}
                                                className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-lg"
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
                                                Next
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
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900">
                            <Sparkles className="w-7 h-7 text-teal-600" />
                            Your Personalized Medicine Schedule
                        </h2>
                        
                        <div className="space-y-4 mb-6">
                            {(() => {
                                const scheduleLines = fullSchedule.match(/Time \d+: .+/g) || [];
                                return scheduleLines.map((line, idx) => (
                                    <div key={idx} className="bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                                                <Clock className="w-5 h-5 text-white" />
                                            </div>
                                            <p className="text-slate-800 font-semibold">{line.replace(/Time \d+: /, '')}</p>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            {(() => {
                                const bestTime = fullSchedule.match(/BEST TIME: (.+)/)?.[1]?.trim();
                                const takeWith = fullSchedule.match(/TAKE WITH: (.+)/)?.[1]?.trim();
                                const why = fullSchedule.match(/WHY: (.+)/)?.[1]?.trim();
                                const avoid = fullSchedule.match(/AVOID: (.+)/)?.[1]?.trim();
                                const tip = fullSchedule.match(/PRO TIP: (.+)/)?.[1]?.trim();
                                
                                return (
                                    <>
                                        {bestTime && (
                                            <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-5">
                                                <h3 className="font-bold text-teal-900 mb-2 flex items-center gap-2">
                                                    <Clock className="w-5 h-5" />
                                                    Best Time
                                                </h3>
                                                <p className="text-slate-700">{bestTime}</p>
                                            </div>
                                        )}
                                        
                                        {takeWith && (
                                            <div className="bg-cyan-50 border-2 border-cyan-200 rounded-xl p-5">
                                                <h3 className="font-bold text-cyan-900 mb-2 flex items-center gap-2">
                                                    <Droplet className="w-5 h-5" />
                                                    Take With
                                                </h3>
                                                <p className="text-slate-700">{takeWith}</p>
                                            </div>
                                        )}
                                        
                                        {why && (
                                            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                                                <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                                    <span className="text-lg">💡</span>
                                                    Why This Works
                                                </h3>
                                                <p className="text-slate-700">{why}</p>
                                            </div>
                                        )}
                                        
                                        {avoid && (
                                            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-5">
                                                <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                                                    <span className="text-lg">⚠️</span>
                                                    Avoid
                                                </h3>
                                                <p className="text-slate-700">{avoid}</p>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                        
                        {(() => {
                            const tip = fullSchedule.match(/PRO TIP: (.+)/)?.[1]?.trim();
                            return tip && (
                                <div className="bg-gradient-to-r from-teal-100 to-cyan-100 border-2 border-teal-300 rounded-xl p-5 mb-6">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">💡</span>
                                        <div>
                                            <h3 className="font-bold text-teal-900 mb-2">Pro Tip</h3>
                                            <p className="text-slate-700 text-lg">{tip}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

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
                                            <div className="text-xs text-teal-700 bg-teal-100 px-3 py-2 rounded-lg mt-2">
                                                {r.schedule.match(/Time \d+: .+/g)?.[0] || 'View full schedule'}
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
