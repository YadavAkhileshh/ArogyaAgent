export async function extractMedicinesWithGemini(base64Image) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('Gemini API key not configured');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [
                    {
                        text: `Extract ALL medicine names from this prescription image. Return ONLY valid JSON array format:
[{"name":"Paracetamol","dosage":"500mg","frequency":"2 times daily","duration":"7 days","confidence":0.95}]

Rules:
- Extract medicine name only (no "Tab.", "Syp.", "Inj.")
- Include dosage, frequency, duration if visible
- Confidence score 0-1 based on image clarity
- If unclear, return confidence < 0.7
- Minimum 1 medicine, maximum 10 medicines`
                    },
                    {
                        inline_data: {
                            mime_type: base64Image.split(';')[0].split(':')[1],
                            data: base64Image.split(',')[1]
                        }
                    }
                ]
            }],
            generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 2000
            }
        })
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('Gemini API Error:', error);
        throw new Error('Gemini extraction failed');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    const jsonMatch = text.match(/\[.*\]/s);
    if (!jsonMatch) {
        throw new Error('No valid JSON in response');
    }

    return JSON.parse(jsonMatch[0]);
}

export async function checkInteractionsWithGemini(medicines) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('Gemini API key not configured');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `Analyze drug interactions for: ${medicines.join(', ')}

Return ONLY valid JSON:
{
  "safe": boolean,
  "interactions": [
    {
      "drugs": ["drug1", "drug2"],
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "description": "brief description",
      "recommendation": "what to do"
    }
  ],
  "overallRecommendation": "summary"
}

Use medical knowledge to identify:
- CRITICAL: Life-threatening (bleeding, organ damage)
- HIGH: Serious side effects
- MEDIUM: Moderate interactions
- LOW: Minor interactions`
                }]
            }],
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 1500
            }
        })
    });

    if (!response.ok) {
        throw new Error('Gemini interaction check failed');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('No valid JSON in response');
    }

    return JSON.parse(jsonMatch[0]);
}

export async function explainMedicine(medicineName) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('Gemini API key not configured');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `Explain ${medicineName} medicine in simple terms:

1. What it treats
2. How it works
3. Common side effects
4. Important warnings
5. When to take it

Keep it brief, clear, and patient-friendly. Use simple language.`
                }]
            }],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 800
            }
        })
    });

    if (!response.ok) {
        throw new Error('Gemini explanation failed');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Explanation not available';
}
