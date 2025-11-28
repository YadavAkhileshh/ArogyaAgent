const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

// Groq Configuration (Fast LLM for text)
export const groqConfig = {
    apiKey: GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
    model: 'llama-3.1-70b-versatile', // Fast and accurate
};

// Gemini Configuration (For vision and complex tasks)
export const geminiConfig = {
    apiKey: GEMINI_API_KEY,
    model: 'gemini-1.5-flash', // Fast and free
};

// Check if AI is available
export const isAIAvailable = () => {
    return GROQ_API_KEY || GEMINI_API_KEY;
};

// Fallback mode when no API keys
export const useFallbackMode = () => {
    console.warn('AI API keys not configured. Using fallback mode.');
    return true;
};
