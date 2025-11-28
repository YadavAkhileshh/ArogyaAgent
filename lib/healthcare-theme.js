export const healthcareTheme = {
    // Primary Healthcare Colors
    primary: {
        teal: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14b8a6', // Main teal
            600: '#0d9488',
            700: '#0f766e',
            800: '#115e59',
            900: '#134e4a',
        },
        cyan: {
            500: '#06b6d4',
            600: '#0891b2',
            700: '#0e7490',
        },
        blue: {
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
        }
    },

    // Medical Status Colors
    status: {
        success: '#10b981', // Green - Safe/Approved
        warning: '#f59e0b', // Amber - Caution
        danger: '#ef4444',  // Red - Critical
        info: '#3b82f6',    // Blue - Information
    },

    // Government Data Colors
    government: {
        verified: '#059669',   // Green checkmark
        official: '#0891b2',   // Cyan badge
        trusted: '#7c3aed',    // Purple seal
    },

    // Gradients
    gradients: {
        primary: 'from-teal-600 via-cyan-600 to-blue-600',
        success: 'from-emerald-500 to-teal-600',
        warning: 'from-amber-500 to-orange-600',
        danger: 'from-red-500 to-rose-600',
        info: 'from-blue-500 to-cyan-600',
        subtle: 'from-slate-50 to-teal-50',
    },

    // UI Components
    components: {
        card: {
            background: 'bg-white',
            border: 'border-slate-200',
            shadow: 'shadow-md hover:shadow-lg',
            hover: 'hover:border-teal-300',
        },
        button: {
            primary: 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white',
            secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-900',
            success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
            danger: 'bg-red-600 hover:bg-red-700 text-white',
        },
        badge: {
            verified: 'bg-emerald-100 text-emerald-800 border-emerald-300',
            official: 'bg-cyan-100 text-cyan-800 border-cyan-300',
            warning: 'bg-amber-100 text-amber-800 border-amber-300',
        }
    },

    // Typography
    text: {
        heading: 'text-slate-900 font-bold',
        subheading: 'text-slate-700 font-semibold',
        body: 'text-slate-600',
        muted: 'text-slate-500',
        accent: 'text-teal-700',
    }
};

// Helper function to get theme color
export function getThemeColor(category, shade = 500) {
    return healthcareTheme.primary[category]?.[shade] || healthcareTheme.primary.teal[500];
}

// Government platform badges
export const governmentPlatforms = [
    {
        name: 'Jan Aushadhi',
        url: 'https://janaushadhi.gov.in',
        description: '10,000+ Generic Medicines',
        verified: true,
        color: 'teal'
    },
    {
        name: 'NPPA',
        url: 'https://www.nppaindia.nic.in',
        description: 'Price Control Authority',
        verified: true,
        color: 'cyan'
    },
    {
        name: 'CDSCO',
        url: 'https://cdsco.gov.in',
        description: 'Drug Approval Database',
        verified: true,
        color: 'blue'
    },
    {
        name: 'National Health Portal',
        url: 'https://www.nhp.gov.in',
        description: 'Patient Education',
        verified: true,
        color: 'emerald'
    },
    {
        name: 'eAushadhi',
        url: 'https://eaushadhi.nic.in',
        description: 'Medicine Availability',
        verified: true,
        color: 'sky'
    },
    {
        name: 'WHO Essential Medicines',
        url: 'https://www.who.int/medicines',
        description: 'Global Standards',
        verified: true,
        color: 'indigo'
    },
    {
        name: 'RxNorm (NLM)',
        url: 'https://www.nlm.nih.gov/research/umls/rxnorm',
        description: 'Drug Classification',
        verified: true,
        color: 'violet'
    },
    {
        name: 'DrugBank',
        url: 'https://go.drugbank.com',
        description: 'Interaction Database',
        verified: true,
        color: 'purple'
    }
];

export default healthcareTheme;
