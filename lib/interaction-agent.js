import { groqConfig, isAIAvailable, useFallbackMode } from './ai-config';

const KNOWN_INTERACTIONS = {
    'aspirin+ibuprofen': {
        severity: 'HIGH',
        description: 'Increased risk of stomach bleeding',
        recommendation: 'Avoid taking together. Space at least 8 hours apart.'
    },
    'metformin+alcohol': {
        severity: 'HIGH',
        description: 'Risk of lactic acidosis',
        recommendation: 'Avoid alcohol while on Metformin'
    },
    'paracetamol+alcohol': {
        severity: 'MEDIUM',
        description: 'Liver damage risk',
        recommendation: 'Limit alcohol consumption'
    },
    'warfarin+aspirin': {
        severity: 'CRITICAL',
        description: 'Severe bleeding risk',
        recommendation: 'DO NOT combine. Consult doctor immediately.'
    }
};

export class DrugInteractionAgent {
    async checkInteractions(medicines) {
        if (!isAIAvailable()) {
            return this.fallbackCheck(medicines);
        }

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${groqConfig.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: groqConfig.model,
                    messages: [
                        {
                            role: 'system',
                            content: `You are a medical safety expert. Analyze drug interactions.
              
              Return JSON ONLY in this format:
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
              }`
                        },
                        {
                            role: 'user',
                            content: `Check interactions between: ${medicines.join(', ')}`
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 1000,
                }),
            });

            const data = await response.json();
            const result = JSON.parse(data.choices[0].message.content);

            return {
                success: true,
                data: result,
                source: 'AI'
            };

        } catch (error) {
            console.error('AI interaction check failed:', error);
            return this.fallbackCheck(medicines);
        }
    }

    fallbackCheck(medicines) {
        const interactions = [];
        const meds = medicines.map(m => m.toLowerCase());

        for (let i = 0; i < meds.length; i++) {
            for (let j = i + 1; j < meds.length; j++) {
                const key1 = `${meds[i]}+${meds[j]}`;
                const key2 = `${meds[j]}+${meds[i]}`;

                const interaction = KNOWN_INTERACTIONS[key1] || KNOWN_INTERACTIONS[key2];
                if (interaction) {
                    interactions.push({
                        drugs: [medicines[i], medicines[j]],
                        ...interaction
                    });
                }
            }
        }

        const hasCritical = interactions.some(i => i.severity === 'CRITICAL');
        const hasHigh = interactions.some(i => i.severity === 'HIGH');

        return {
            success: true,
            data: {
                safe: interactions.length === 0,
                interactions,
                overallRecommendation: hasCritical
                    ? 'CRITICAL: Consult doctor immediately!'
                    : hasHigh
                        ? 'WARNING: Potential serious interactions detected'
                        : interactions.length > 0
                            ? 'CAUTION: Minor interactions possible'
                            : 'No known dangerous interactions'
            },
            source: 'Database'
        };
    }
}
