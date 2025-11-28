export async function extractMedicinesWithQwen(base64Image) {
    const apiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
    if (!apiKey) {
        throw new Error('Hugging Face API key not configured');
    }

    const response = await fetch('https://api-inference.huggingface.co/models/Qwen/Qwen2-VL-7B-Instruct', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            inputs: {
                image: base64Image.split(',')[1],
                question: `Extract ALL medicine names from this prescription. Return ONLY JSON array:
[{"name":"Paracetamol","dosage":"500mg","frequency":"2x daily","duration":"7 days","confidence":0.95}]

Rules:
- Medicine name only (no Tab/Syp/Inj)
- Include dosage if visible
- Confidence 0-1 based on clarity
- Minimum 1 medicine`
            },
            parameters: {
                max_new_tokens: 500,
                temperature: 0.1
            }
        })
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('Qwen API Error:', error);
        throw new Error('Qwen extraction failed');
    }

    const data = await response.json();
    const text = data[0]?.generated_text || data.generated_text || '';
    
    const jsonMatch = text.match(/\[.*\]/s);
    if (!jsonMatch) {
        throw new Error('No valid JSON in response');
    }

    return JSON.parse(jsonMatch[0]);
}

export async function extractWithMultipleModels(base64Image) {
    const results = [];
    
    try {
        const qwenResult = await extractMedicinesWithQwen(base64Image);
        results.push({ model: 'Qwen2.5-VL', data: qwenResult, priority: 1 });
    } catch (e) {
        console.log('Qwen failed, trying Gemini...');
    }

    if (results.length === 0) {
        const { extractMedicinesWithGemini } = await import('./gemini-service');
        try {
            const geminiResult = await extractMedicinesWithGemini(base64Image);
            results.push({ model: 'Gemini 2.0', data: geminiResult, priority: 2 });
        } catch (e) {
            console.log('Gemini failed, trying Groq...');
        }
    }

    if (results.length === 0) {
        throw new Error('All OCR models failed');
    }

    return results[0];
}
