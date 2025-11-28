// Unified AI Service - Multi-model orchestration for healthcare data extraction

// Vision Model: Qwen 2.5 VL for prescription OCR
async function qwenVisionExtract(imageData) {
    const apiToken = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
    if (!apiToken) throw new Error('HF token unavailable');

    const response = await fetch('https://api-inference.huggingface.co/models/Qwen/Qwen2-VL-7B-Instruct', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            inputs: { image: imageData.split(',')[1], question: 'Parse prescription to JSON array: [{"name":"","dosage":"","frequency":"","confidence":0.9}]' },
            parameters: { max_new_tokens: 500, temperature: 0.1 }
        })
    });
    const result = await response.json();
    const content = result[0]?.generated_text || result.generated_text || '';
    return JSON.parse(content.match(/\[.*\]/s)?.[0] || '[]');
}

// Reasoning Model: Deepseek V3 for drug interaction analysis
async function deepseekInteractionCheck(drugList) {
    const apiToken = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;
    if (!apiToken) throw new Error('Deepseek token unavailable');

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: `Evaluate drug-drug interactions: ${drugList.join(', ')}. Output JSON: {"safe":bool,"interactions":[{"drugs":[],"severity":"","description":"","recommendation":""}]}` }],
            temperature: 0.2
        })
    });
    const result = await response.json();
    return JSON.parse(result.choices[0].message.content.match(/\{[\s\S]*\}/)?.[0] || '{}');
}

// 3. KIMI K1.5 - Best for Chinese/multilingual (Moonshot API)
async function extractMultilingual(base64Image, language = 'en') {
    const key = process.env.NEXT_PUBLIC_MOONSHOT_API_KEY;
    if (!key) throw new Error('Moonshot key missing');

    const prompts = {
        en: 'Extract medicines',
        hi: 'दवाओं के नाम निकालें',
        ta: 'மருந்துகளை பிரித்தெடுக்கவும்'
    };

    const res = await fetch('https://api.moonshot.cn/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'moonshot-v1-8k',
            messages: [{ role: 'user', content: [{ type: 'text', text: prompts[language] || prompts.en }, { type: 'image_url', image_url: { url: base64Image } }] }],
            temperature: 0.1
        })
    });
    const data = await res.json();
    return JSON.parse(data.choices[0].message.content.match(/\[.*\]/s)?.[0] || '[]');
}

// Fallback Model: Gemini 2.0 Flash for rapid OCR
async function geminiVisionParse(imageData) {
    const apiToken = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiToken) throw new Error('Gemini token unavailable');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: 'Convert prescription to JSON array format' }, { inline_data: { mime_type: 'image/jpeg', data: imageData.split(',')[1] } }] }],
            generationConfig: { temperature: 0.1, maxOutputTokens: 1000 }
        })
    });
    const result = await response.json();
    const content = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return JSON.parse(content.match(/\[.*\]/s)?.[0] || '[]');
}

// Primary: Consensus-based medicine extraction
export async function extractMedicinesPerfect(imageData, lang = 'en') {
    const modelOutputs = [];
    
    // Parallel model execution
    const tasks = [
        qwenVisionExtract(imageData).then(r => ({ model: 'Qwen2.5-VL', data: r, weight: 10 })).catch(() => null),
        geminiVisionParse(imageData).then(r => ({ model: 'Gemini 2.0', data: r, weight: 8 })).catch(() => null)
    ].filter(Boolean);

    const completed = await Promise.allSettled(tasks);
    completed.forEach(r => { if (r.status === 'fulfilled' && r.value) modelOutputs.push(r.value); });

    if (modelOutputs.length === 0) throw new Error('All extraction models failed');

    // Consensus algorithm: aggregate model outputs
    const drugRegistry = {};
    modelOutputs.forEach(({ data, weight }) => {
        data.forEach(drug => {
            const identifier = drug.name.toLowerCase();
            if (!drugRegistry[identifier]) drugRegistry[identifier] = { ...drug, voteCount: 0, weightSum: 0 };
            drugRegistry[identifier].voteCount++;
            drugRegistry[identifier].weightSum += weight;
            if (drug.confidence > (drugRegistry[identifier].confidence || 0)) {
                drugRegistry[identifier] = { ...drugRegistry[identifier], ...drug };
            }
        });
    });

    // Sort by consensus strength
    const consolidatedDrugs = Object.values(drugRegistry)
        .sort((a, b) => (b.voteCount * b.weightSum) - (a.voteCount * a.weightSum))
        .map(({ voteCount, weightSum, ...drug }) => drug);

    return {
        medicines: consolidatedDrugs,
        models: modelOutputs.map(r => r.model),
        confidence: consolidatedDrugs.reduce((sum, m) => sum + (m.confidence || 0), 0) / consolidatedDrugs.length
    };
}

// Enhanced search with AI-powered brand resolution
export async function searchMedicinePerfect(searchQuery) {
    const { searchMedicine } = await import('./medicine-database');
    let searchResult = searchMedicine(searchQuery);

    // AI fallback for unrecognized brands
    if (!searchResult || searchResult.type === 'not_found') {
        try {
            const apiToken = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
            if (!apiToken) return searchResult;

            const apiUrl = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY 
                ? 'https://api.deepseek.com/v1/chat/completions'
                : `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiToken}`;

            const payload = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY
                ? { model: 'deepseek-chat', messages: [{ role: 'user', content: `Identify generic/salt name for "${searchQuery}". Return only the name.` }], temperature: 0.1 }
                : { contents: [{ parts: [{ text: `Generic equivalent of "${searchQuery}"? Single word response.` }] }], generationConfig: { temperature: 0.1 } };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            const resolvedName = (result.choices?.[0]?.message?.content || result.candidates?.[0]?.content?.parts?.[0]?.text || '').trim().toLowerCase();

            if (resolvedName && resolvedName.length > 2) {
                searchResult = searchMedicine(resolvedName) || searchResult;
            }
        } catch (error) {
            console.log('AI resolution failed:', error);
        }
    }

    return searchResult;
}

// Multi-tier interaction validation
export async function checkInteractionsPerfect(drugList) {
    const validationResults = [];

    // Primary: Deepseek reasoning engine
    try {
        const deepseekOutput = await deepseekInteractionCheck(drugList);
        validationResults.push({ model: 'Deepseek V3', data: deepseekOutput, tier: 1 });
    } catch (error) {
        console.log('Deepseek unavailable');
    }

    // Secondary: Gemini fallback
    if (validationResults.length === 0) {
        try {
            const { checkInteractionsWithGemini } = await import('./gemini-service');
            const geminiOutput = await checkInteractionsWithGemini(drugList);
            validationResults.push({ model: 'Gemini 2.0', data: geminiOutput, tier: 2 });
        } catch (error) {
            console.log('Gemini unavailable');
        }
    }

    // Tertiary: Local database
    if (validationResults.length === 0) {
        const { DrugInteractionAgent } = await import('./interaction-agent');
        const localAgent = new DrugInteractionAgent();
        const localOutput = await localAgent.checkInteractions(drugList);
        validationResults.push({ model: 'Local DB', data: localOutput.data, tier: 3 });
    }

    return validationResults[0];
}
