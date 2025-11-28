import { getWHOStatus, getSafetyBadgeColor, getAWaReClassification } from '@/lib/who-eml';

export default function EssentialMedicineBadge({ medicineName }) {
    const whoData = getWHOStatus(medicineName);
    const aware = getAWaReClassification(medicineName);

    if (!whoData.whoEML) {
        return (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 border border-gray-300 rounded-lg">
                <span className="text-gray-600 text-sm">Not in WHO EML</span>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {/* WHO Essential Medicine Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 ${whoData.badgeColor} border-2 rounded-lg`}>
                <span className="text-2xl">🌍</span>
                <div>
                    <div className="font-bold text-sm">WHO Essential Medicine</div>
                    <div className="text-xs opacity-75">{whoData.priority}</div>
                </div>
            </div>

            {/* AWaRe Classification for Antibiotics */}
            {aware.hasClassification && (
                <div className={`inline-flex items-center gap-2 px-4 py-2 bg-${aware.color}-100 border-2 border-${aware.color}-300 rounded-lg`}>
                    <span className="text-xl">{aware.icon}</span>
                    <div>
                        <div className={`font-bold text-sm text-${aware.color}-800`}>{aware.label}</div>
                        <div className={`text-xs text-${aware.color}-700`}>{aware.description}</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export function EssentialBadgeCompact({ medicineName }) {
    const whoData = getWHOStatus(medicineName);

    if (!whoData.whoEML) return null;

    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
            <span>🌍</span>
            WHO Essential
        </span>
    );
}

export function SafetyProfile({ medicineName }) {
    const whoData = getWHOStatus(medicineName);

    if (!whoData.whoEML) return null;

    const safetyColors = {
        'Generally safe': 'bg-green-50 border-green-200 text-green-800',
        'Use with caution': 'bg-yellow-50 border-yellow-200 text-yellow-800',
        'Restricted use': 'bg-red-50 border-red-200 text-red-800'
    };

    const color = safetyColors[whoData.safetyProfile] || safetyColors['Use with caution'];

    return (
        <div className={`p-4 rounded-xl border-2 ${color}`}>
            <div className="font-semibold mb-2">💊 Safety Profile</div>
            <div className="text-sm mb-3">{whoData.safetyProfile}</div>

            {whoData.warnings && (
                <div className="text-xs bg-white/50 p-2 rounded">
                    <strong>⚠️ Warnings:</strong> {whoData.warnings}
                </div>
            )}

            {whoData.indication && (
                <div className="text-xs mt-2">
                    <strong>Indication:</strong> {whoData.indication}
                </div>
            )}
        </div>
    );
}
