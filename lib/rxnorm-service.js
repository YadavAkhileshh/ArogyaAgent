const RXNORM_BASE_URL = 'https://rxnav.nlm.nih.gov/REST';

export class RxNormService {

    /**
     * Search for drug by name
     * @param {string} drugName - Medicine name to search
     * @returns {Promise<Object>} Drug information
     */
    async searchDrug(drugName) {
        try {
            const response = await fetch(
                `${RXNORM_BASE_URL}/drugs.json?name=${encodeURIComponent(drugName)}`
            );
            const data = await response.json();

            if (data.drugGroup?.conceptGroup) {
                const concepts = data.drugGroup.conceptGroup
                    .flatMap(group => group.conceptProperties || [])
                    .slice(0, 5);

                return {
                    success: true,
                    drugs: concepts.map(concept => ({
                        rxcui: concept.rxcui,
                        name: concept.name,
                        synonym: concept.synonym,
                        tty: concept.tty // Term type
                    }))
                };
            }

            return { success: false, error: 'Drug not found in RxNorm' };
        } catch (error) {
            console.error('RxNorm API error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get drug interactions by RxCUI
     * @param {string} rxcui - RxNorm Concept Unique Identifier
     * @returns {Promise<Object>} Interaction information
     */
    async getInteractions(rxcui) {
        try {
            const response = await fetch(
                `${RXNORM_BASE_URL}/interaction/interaction.json?rxcui=${rxcui}`
            );
            const data = await response.json();

            if (data.interactionTypeGroup) {
                const interactions = data.interactionTypeGroup
                    .flatMap(group => group.interactionType || [])
                    .flatMap(type => type.interactionPair || [])
                    .slice(0, 10);

                return {
                    success: true,
                    interactions: interactions.map(pair => ({
                        drug1: pair.interactionConcept[0]?.minConceptItem?.name,
                        drug2: pair.interactionConcept[1]?.minConceptItem?.name,
                        severity: pair.severity || 'Unknown',
                        description: pair.description
                    }))
                };
            }

            return { success: true, interactions: [] };
        } catch (error) {
            console.error('RxNorm interaction error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get drug class information
     * @param {string} rxcui - RxNorm Concept Unique Identifier
     * @returns {Promise<Object>} Drug class information
     */
    async getDrugClass(rxcui) {
        try {
            const response = await fetch(
                `${RXNORM_BASE_URL}/rxclass/class/byRxcui.json?rxcui=${rxcui}&relaSource=ATC`
            );
            const data = await response.json();

            if (data.rxclassDrugInfoList?.rxclassDrugInfo) {
                const classes = data.rxclassDrugInfoList.rxclassDrugInfo;

                return {
                    success: true,
                    classes: classes.map(cls => ({
                        className: cls.rxclassMinConceptItem?.className,
                        classId: cls.rxclassMinConceptItem?.classId
                    }))
                };
            }

            return { success: true, classes: [] };
        } catch (error) {
            console.error('RxNorm class error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get related drugs (generics, brands)
     * @param {string} rxcui - RxNorm Concept Unique Identifier
     * @returns {Promise<Object>} Related drugs
     */
    async getRelatedDrugs(rxcui) {
        try {
            const response = await fetch(
                `${RXNORM_BASE_URL}/rxcui/${rxcui}/related.json?tty=SBD+SCD`
            );
            const data = await response.json();

            if (data.relatedGroup?.conceptGroup) {
                const related = data.relatedGroup.conceptGroup
                    .flatMap(group => group.conceptProperties || []);

                return {
                    success: true,
                    related: related.map(drug => ({
                        rxcui: drug.rxcui,
                        name: drug.name,
                        type: drug.tty
                    }))
                };
            }

            return { success: true, related: [] };
        } catch (error) {
            console.error('RxNorm related error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Enhanced drug search with interactions
     * @param {string} drugName - Medicine name
     * @returns {Promise<Object>} Complete drug information
     */
    async getCompleteDrugInfo(drugName) {
        try {
            // Step 1: Search for drug
            const searchResult = await this.searchDrug(drugName);

            if (!searchResult.success || searchResult.drugs.length === 0) {
                return { success: false, error: 'Drug not found' };
            }

            const primaryDrug = searchResult.drugs[0];
            const rxcui = primaryDrug.rxcui;

            // Step 2: Get interactions, class, and related drugs in parallel
            const [interactions, drugClass, related] = await Promise.all([
                this.getInteractions(rxcui),
                this.getDrugClass(rxcui),
                this.getRelatedDrugs(rxcui)
            ]);

            return {
                success: true,
                data: {
                    drug: primaryDrug,
                    interactions: interactions.interactions || [],
                    classes: drugClass.classes || [],
                    relatedDrugs: related.related || []
                },
                source: 'RxNorm (NLM)'
            };
        } catch (error) {
            console.error('Complete drug info error:', error);
            return { success: false, error: error.message };
        }
    }
}

// Export singleton instance
export const rxNormService = new RxNormService();

/**
 * Helper function to check if drug is high-risk
 * @param {Array} classes - Drug classes from RxNorm
 * @returns {Object} Risk assessment
 */
export function assessDrugRisk(classes) {
    const highRiskClasses = [
        'Antibiotics',
        'Steroids',
        'Opioids',
        'Psychotropics',
        'Anticoagulants',
        'Antipsychotics'
    ];

    const isHighRisk = classes.some(cls =>
        highRiskClasses.some(risk =>
            cls.className?.toLowerCase().includes(risk.toLowerCase())
        )
    );

    return {
        isHighRisk,
        riskLevel: isHighRisk ? 'HIGH' : 'NORMAL',
        requiresPrescription: isHighRisk
    };
}

/**
 * Helper to format interaction severity
 * @param {string} severity - RxNorm severity
 * @returns {Object} Formatted severity
 */
export function formatSeverity(severity) {
    const severityMap = {
        'high': { color: 'red', label: 'High Risk', icon: '🔴' },
        'moderate': { color: 'orange', label: 'Moderate', icon: '🟠' },
        'low': { color: 'yellow', label: 'Low Risk', icon: '🟡' },
        'unknown': { color: 'gray', label: 'Unknown', icon: '⚪' }
    };

    const level = (severity || 'unknown').toLowerCase();
    return severityMap[level] || severityMap.unknown;
}
