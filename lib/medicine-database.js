import { expandedMedicineDB, brandMapping, fuzzySearch as fuzzySearchExpanded } from './expanded-medicine-db';

export const medicineDatabase = expandedMedicineDB;

export const medicineDatabase_OLD = {
    "paracetamol": {
        category: "Pain & Fever",
        branded: "Crocin 500mg",
        brandedPrice: 30,
        activeIngredient: "Paracetamol",
        uses: "Fever, Pain relief, Headache, Body ache",
        alternatives: [
            { name: "Paracetamol 500mg", manufacturer: "Jan Aushadhi", price: 2, savings: 93, availability: "8,500+ Jan Aushadhi Kendras" },
            { name: "Paracetamol 500mg", manufacturer: "IDPL (Govt)", price: 2.5, savings: 92, availability: "Major pharmacies" },
            { name: "Paracetamol 500mg", manufacturer: "HAL (Govt)", price: 3, savings: 90, availability: "Online & stores" },
            { name: "Paracetamol 500mg", manufacturer: "IPHB (Govt)", price: 2.8, savings: 91, availability: "State pharmacies" }
        ]
    },

    "ibuprofen": {
        category: "Pain & Inflammation",
        branded: "Brufen 400mg",
        brandedPrice: 45,
        activeIngredient: "Ibuprofen",
        uses: "Pain relief, Inflammation, Arthritis, Fever",
        alternatives: [
            { name: "Ibuprofen 400mg", manufacturer: "Jan Aushadhi", price: 3, savings: 93, availability: "8,500+ stores" },
            { name: "Ibuprofen 400mg", manufacturer: "IDPL (Govt)", price: 4, savings: 91, availability: "Nationwide" },
            { name: "Ibuprofen 400mg", manufacturer: "Karnataka Antibiotics", price: 3.5, savings: 92, availability: "South India" }
        ]
    },

    "aspirin": {
        category: "Blood Thinner",
        branded: "Disprin 75mg",
        brandedPrice: 35,
        activeIngredient: "Acetylsalicylic Acid",
        uses: "Blood thinning, Heart protection, Pain relief",
        alternatives: [
            { name: "Aspirin 75mg", manufacturer: "Jan Aushadhi", price: 2.5, savings: 93, availability: "8,500+ stores" },
            { name: "Aspirin 75mg", manufacturer: "IDPL (Govt)", price: 3, savings: 91, availability: "Major pharmacies" }
        ]
    },

    // Diabetes Medicines
    "metformin": {
        category: "Diabetes",
        branded: "Glycomet 500mg",
        brandedPrice: 45,
        activeIngredient: "Metformin Hydrochloride",
        uses: "Type 2 Diabetes, Blood sugar control, PCOS",
        alternatives: [
            { name: "Metformin 500mg", manufacturer: "Jan Aushadhi", price: 5, savings: 89, availability: "8,500+ stores" },
            { name: "Metformin 500mg", manufacturer: "IDPL (Govt)", price: 6, savings: 87, availability: "Major pharmacies" },
            { name: "Metformin 500mg", manufacturer: "Karnataka Antibiotics", price: 5.5, savings: 88, availability: "South India" },
            { name: "Metformin 500mg", manufacturer: "HAL (Govt)", price: 6.5, savings: 86, availability: "Nationwide" }
        ]
    },

    "glimepiride": {
        category: "Diabetes",
        branded: "Amaryl 2mg",
        brandedPrice: 120,
        activeIngredient: "Glimepiride",
        uses: "Type 2 Diabetes, Blood sugar control",
        alternatives: [
            { name: "Glimepiride 2mg", manufacturer: "Jan Aushadhi", price: 8, savings: 93, availability: "8,500+ stores" },
            { name: "Glimepiride 2mg", manufacturer: "IDPL (Govt)", price: 10, savings: 92, availability: "Available" }
        ]
    },

    // Blood Pressure
    "amlodipine": {
        category: "Blood Pressure",
        branded: "Amlong 5mg",
        brandedPrice: 60,
        activeIngredient: "Amlodipine Besylate",
        uses: "High Blood Pressure, Hypertension, Angina",
        alternatives: [
            { name: "Amlodipine 5mg", manufacturer: "Jan Aushadhi", price: 4, savings: 93, availability: "8,500+ stores" },
            { name: "Amlodipine 5mg", manufacturer: "IDPL (Govt)", price: 4.5, savings: 92, availability: "Major pharmacies" },
            { name: "Amlodipine 5mg", manufacturer: "HAL (Govt)", price: 5, savings: 92, availability: "Nationwide" }
        ]
    },

    "atenolol": {
        category: "Blood Pressure",
        branded: "Tenormin 50mg",
        brandedPrice: 55,
        activeIngredient: "Atenolol",
        uses: "High Blood Pressure, Angina, Heart attack prevention",
        alternatives: [
            { name: "Atenolol 50mg", manufacturer: "Jan Aushadhi", price: 3, savings: 95, availability: "8,500+ stores" },
            { name: "Atenolol 50mg", manufacturer: "IDPL (Govt)", price: 4, savings: 93, availability: "Available" }
        ]
    },

    "losartan": {
        category: "Blood Pressure",
        branded: "Losar 50mg",
        brandedPrice: 85,
        activeIngredient: "Losartan Potassium",
        uses: "High Blood Pressure, Kidney protection in diabetes",
        alternatives: [
            { name: "Losartan 50mg", manufacturer: "Jan Aushadhi", price: 5, savings: 94, availability: "8,500+ stores" },
            { name: "Losartan 50mg", manufacturer: "IDPL (Govt)", price: 6, savings: 93, availability: "Major pharmacies" }
        ]
    }
};

// Brand name to generic name mapping
export const brandToGeneric = brandMapping;

export const brandToGeneric_OLD = {
    // Paracetamol brands
    "crocin": "paracetamol",
    "dolo": "paracetamol",
    "calpol": "paracetamol",
    "metacin": "paracetamol",
    "pyrigesic": "paracetamol",

    // Ibuprofen brands
    "brufen": "ibuprofen",
    "combiflam": "ibuprofen", // Contains ibuprofen + paracetamol
    "ibuclin": "ibuprofen",
    "nurofen": "ibuprofen",

    // Aspirin brands
    "disprin": "aspirin",
    "ecosprin": "aspirin",

    // Diabetes brands
    "glycomet": "metformin",
    "glucophage": "metformin",
    "amaryl": "glimepiride",
    "glimestar": "glimepiride",

    // BP brands
    "amlong": "amlodipine",
    "amlokind": "amlodipine",
    "tenormin": "atenolol",
    "losar": "losartan",
    "repace": "losartan"
};

// Intelligent medicine lookup
export function searchMedicine(searchTerm) {
    if (!searchTerm) return null;

    const normalizedTerm = searchTerm.trim().toLowerCase();

    const resolvedGeneric = brandToGeneric[normalizedTerm];
    if (resolvedGeneric && medicineDatabase[resolvedGeneric]) {
        return {
            type: 'brand_to_generic',
            brandName: searchTerm,
            genericName: resolvedGeneric,
            exact: medicineDatabase[resolvedGeneric],
            medicine: resolvedGeneric,
            message: `"${searchTerm}" is branded. Generic equivalent: "${medicineDatabase[resolvedGeneric].activeIngredient}".`,
            alternatives: []
        };
    }

    if (medicineDatabase[normalizedTerm]) {
        return {
            type: 'exact_match',
            exact: medicineDatabase[normalizedTerm],
            medicine: normalizedTerm,
            alternatives: []
        };
    }

    const approximateMatches = fuzzySearchExpanded(normalizedTerm);
    if (approximateMatches.length > 0) {
        return {
            type: 'fuzzy_match',
            exact: approximateMatches[0].data,
            medicine: approximateMatches[0].key,
            alternatives: approximateMatches.slice(1, 4).map(match => ({ ...match.data, name: match.key })),
            message: `Closest match: "${approximateMatches[0].key}"`
        };
    }

    return {
        type: 'not_found',
        searchTerm: searchTerm,
        exact: null,
        medicine: null,
        alternatives: [],
        suggestion: `"${searchTerm}" unavailable in database. Check Jan Aushadhi outlets.`
    };
}

// Retrieve medicines by therapeutic category
export function getMedicinesByCategory(categoryName) {
    return Object.entries(medicineDatabase)
        .filter(([_, drugData]) => drugData.category === categoryName)
        .map(([drugKey, drugData]) => ({ key: drugKey, ...drugData }));
}

// Extract unique categories
export function getAllCategories() {
    const uniqueCategories = [...new Set(Object.values(medicineDatabase).map(drug => drug.category))];
    return uniqueCategories.sort();
}

// Calculate database metrics
export function getDatabaseStats() {
    const totalDrugs = Object.keys(medicineDatabase).length;
    const categoryCount = getAllCategories().length;
    const alternativeCount = Object.values(medicineDatabase).reduce((total, drug) => total + drug.alternatives.length, 0);
    const avgSavings = Math.round(
        Object.values(medicineDatabase).reduce((total, drug) =>
            total + (drug.alternatives[0]?.savings || 0), 0
        ) / totalDrugs
    );
    
    return {
        totalMedicines: totalDrugs,
        categories: categoryCount,
        totalAlternatives: alternativeCount,
        averageSavings: avgSavings
    };
}

// AI-powered generic resolution for unlisted drugs
export async function getAIAlternatives(drugName) {
    try {
        const apiToken = process.env.NEXT_PUBLIC_GROQ_API_KEY;
        if (!apiToken) return null;

        const apiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-70b-versatile',
                messages: [{
                    role: 'user',
                    content: `Identify generic/salt composition for "${drugName}". Provide only the salt name. If already generic, return as-is.`
                }],
                temperature: 0.1,
                max_tokens: 50
            })
        });

        if (!apiResponse.ok) return null;

        const payload = await apiResponse.json();
        const resolvedSalt = payload.choices?.[0]?.message?.content?.trim();

        return {
            saltName: resolvedSalt,
            estimatedPrice: {
                branded: 80,
                generic: 10
            },
            savings: 88,
            availability: "Available at Jan Aushadhi and govt pharmacies"
        };
    } catch (err) {
        console.error('AI resolution error:', err);
        return null;
    }
}
