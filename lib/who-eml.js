export const WHO_EML_DATABASE = {
    // Pain & Fever
    "paracetamol": {
        whoEML: true,
        category: "Essential Medicine - Core",
        priority: "Core list",
        indication: "Pain and palliative care",
        strength: ["100-500 mg"],
        safetyProfile: "Generally safe",
        warnings: "Liver toxicity at high doses"
    },
    "ibuprofen": {
        whoEML: true,
        category: "Essential Medicine - Core",
        priority: "Core list",
        indication: "Pain and palliative care",
        strength: ["200-400 mg"],
        safetyProfile: "Use with caution",
        warnings: "GI bleeding risk, avoid in pregnancy"
    },
    "aspirin": {
        whoEML: true,
        category: "Essential Medicine - Core",
        priority: "Core list",
        indication: "Cardiovascular disease, Pain",
        strength: ["75-300 mg"],
        safetyProfile: "Use with caution",
        warnings: "Bleeding risk, not for children"
    },

    // Diabetes
    "metformin": {
        whoEML: true,
        category: "Essential Medicine - Core",
        priority: "Core list",
        indication: "Diabetes and blood glucose control",
        strength: ["500 mg", "850 mg"],
        safetyProfile: "Generally safe",
        warnings: "Lactic acidosis risk, avoid in kidney disease"
    },
    "glimepiride": {
        whoEML: true,
        category: "Essential Medicine - Core",
        priority: "Core list",
        indication: "Diabetes",
        strength: ["1-4 mg"],
        safetyProfile: "Use with caution",
        warnings: "Hypoglycemia risk"
    },

    // Blood Pressure
    "amlodipine": {
        whoEML: true,
        category: "Essential Medicine - Core",
        priority: "Core list",
        indication: "Cardiovascular diseases",
        strength: ["5 mg", "10 mg"],
        safetyProfile: "Generally safe",
        warnings: "Ankle swelling common"
    },
    "atenolol": {
        whoEML: true,
        category: "Essential Medicine - Core",
        priority: "Core list",
        indication: "Cardiovascular diseases",
        strength: ["50 mg", "100 mg"],
        safetyProfile: "Use with caution",
        warnings: "Not for asthma, diabetes monitoring needed"
    },
    "losartan": {
        whoEML: false, // ARBs not in core EML, but commonly used
        category: "Complementary Medicine",
        priority: "Alternative to ACE inhibitors",
        indication: "Hypertension",
        strength: ["50 mg"],
        safetyProfile: "Generally safe",
        warnings: "Monitor kidney function"
    },

    // Cholesterol
    "atorvastatin": {
        whoEML: true,
        category: "Essential Medicine - Core",
        priority: "Core list",
        indication: "Cardiovascular diseases",
        strength: ["10-80 mg"],
        safetyProfile: "Generally safe",
        warnings: "Muscle pain, liver monitoring"
    },
    "rosuvastatin": {
        whoEML: false,
        category: "Alternative Statin",
        priority: "Complementary",
        indication: "Hyperlipidemia",
        strength: ["10-20 mg"],
        safetyProfile: "Generally safe",
        warnings: "Similar to atorvastatin"
    },

    // Antibiotics
    "amoxicillin": {
        whoEML: true,
        category: "Essential Medicine - Core",
        priority: "Core list - ACCESS group",
        indication: "Bacterial infections",
        strength: ["250-500 mg"],
        safetyProfile: "Generally safe",
        warnings: "Allergy risk, complete full course",
        accessGroup: "ACCESS" // WHO AWaRe classification
    },
    "azithromycin": {
        whoEML: true,
        category: "Essential Medicine - Core",
        priority: "Core list - WATCH group",
        indication: "Respiratory infections",
        strength: ["250-500 mg"],
        safetyProfile: "Use with caution",
        warnings: "Antibiotic resistance concern",
        accessGroup: "WATCH" // Higher priority monitoring
    },
    "ciprofloxacin": {
        whoEML: true,
        category: "Essential Medicine - Core",
        priority: "Core list - WATCH group",
        indication: "Bacterial infections",
        strength: ["250-750 mg"],
        safetyProfile: "Use with caution",
        warnings: "Tendon rupture risk, resistance",
        accessGroup: "WATCH"
    },

    // Allergy
    "cetirizine": {
        whoEML: true,
        category: "Essential Medicine - Core",
        priority: "Core list",
        indication: "Allergic conditions",
        strength: ["10 mg"],
        safetyProfile: "Generally safe",
        warnings: "Drowsiness possible"
    },
    "montelukast": {
        whoEML: false,
        category: "Complementary Medicine",
        priority: "Alternative to steroids",
        indication: "Asthma",
        strength: ["10 mg"],
        safetyProfile: "Generally safe",
        warnings: "Mood changes reported"
    },

    // Stomach
    "omeprazole": {
        whoEML: true,
        category: "Essential Medicine - Core",
        priority: "Core list",
        indication: "Gastric acid disorders",
        strength: ["20 mg", "40 mg"],
        safetyProfile: "Generally safe",
        warnings: "Long-term use - bone fracture risk"
    },
    "pantoprazole": {
        whoEML: false,
        category: "Alternative PPI",
        priority: "Complementary",
        indication: "Acid reflux",
        strength: ["40 mg"],
        safetyProfile: "Generally safe",
        warnings: "Similar to omeprazole"
    },

    // Vitamins
    "vitamin_d3": {
        whoEML: true,
        category: "Essential Medicine - Core",
        priority: "Core list",
        indication: "Nutritional deficiencies",
        strength: ["Various"],
        safetyProfile: "Generally safe",
        warnings: "Toxicity at very high doses"
    },

    // Women's Health
    "iron_folic": {
        whoEML: true,
        category: "Essential Medicine - Core",
        priority: "Core list",
        indication: "Anemia, Pregnancy",
        strength: ["Various combinations"],
        safetyProfile: "Generally safe",
        warnings: "GI upset common"
    },

    // Thyroid
    "levothyroxine": {
        whoEML: true,
        category: "Essential Medicine - Core",
        priority: "Core list",
        indication: "Thyroid disorders",
        strength: ["50-100 mcg"],
        safetyProfile: "Generally safe",
        warnings: "Regular monitoring needed"
    }
};

/**
 * Get WHO EML status for a medicine
 * @param {string} medicineName - Medicine name (lowercase)
 * @returns {Object} WHO EML information
 */
export function getWHOStatus(medicineName) {
    const medicine = WHO_EML_DATABASE[medicineName.toLowerCase()];

    if (!medicine) {
        return {
            whoEML: false,
            category: "Not in WHO EML",
            message: "Medicine not found in WHO Essential Medicines List"
        };
    }

    return medicine;
}

/**
 * Check if medicine is high-priority/essential
 * @param {string} medicineName - Medicine name
 * @returns {Object} Priority assessment
 */
export function assessPriority(medicineName) {
    const whoData = getWHOStatus(medicineName);

    return {
        isEssential: whoData.whoEML === true,
        priority: whoData.priority || 'Not classified',
        requiresMonitoring: whoData.accessGroup === 'WATCH' || whoData.accessGroup === 'RESERVE',
        safetyLevel: whoData.safetyProfile || 'Unknown'
    };
}

/**
 * Get safety badge color based on WHO classification
 * @param {Object} whoData - WHO EML data
 * @returns {string} Tailwind CSS classes
 */
export function getSafetyBadgeColor(whoData) {
    if (!whoData.whoEML) {
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }

    if (whoData.accessGroup === 'ACCESS') {
        return 'bg-green-100 text-green-800 border-green-300';
    }

    if (whoData.accessGroup === 'WATCH') {
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }

    if (whoData.accessGroup === 'RESERVE') {
        return 'bg-red-100 text-red-800 border-red-300';
    }

    return 'bg-blue-100 text-blue-800 border-blue-300';
}

/**
 * Get all WHO EML medicines
 * @returns {Array} List of WHO EML medicines
 */
export function getAllWHOEMLMedicines() {
    return Object.entries(WHO_EML_DATABASE)
        .filter(([_, data]) => data.whoEML === true)
        .map(([name, data]) => ({ name, ...data }));
}

/**
 * Get WHO AWaRe classification for antibiotics
 * @param {string} medicineName - Antibiotic name
 * @returns {Object} AWaRe classification
 */
export function getAWaReClassification(medicineName) {
    const medicine = WHO_EML_DATABASE[medicineName.toLowerCase()];

    if (!medicine || !medicine.accessGroup) {
        return { hasClassification: false };
    }

    const classifications = {
        'ACCESS': {
            color: 'green',
            label: 'ACCESS - First choice',
            description: 'Antibiotics with lower resistance potential',
            icon: '✅'
        },
        'WATCH': {
            color: 'yellow',
            label: 'WATCH - Monitor usage',
            description: 'Higher resistance risk, use with caution',
            icon: '⚠️'
        },
        'RESERVE': {
            color: 'red',
            label: 'RESERVE - Last resort',
            description: 'Reserve for resistant infections only',
            icon: '🔴'
        }
    };

    return {
        hasClassification: true,
        group: medicine.accessGroup,
        ...classifications[medicine.accessGroup]
    };
}

/**
 * Enhanced medicine info with WHO EML
 * @param {string} medicineName - Medicine name
 * @param {Object} existingData - Existing medicine data
 * @returns {Object} Enhanced data with WHO info
 */
export function enhanceWithWHO(medicineName, existingData) {
    const whoData = getWHOStatus(medicineName);
    const priority = assessPriority(medicineName);
    const aware = getAWaReClassification(medicineName);

    return {
        ...existingData,
        who: {
            ...whoData,
            priority,
            aware,
            badgeColor: getSafetyBadgeColor(whoData)
        }
    };
}
