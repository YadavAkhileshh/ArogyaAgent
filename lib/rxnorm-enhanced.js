import { logEvent } from './audit';

export async function getRxCUI(drugName) {
    try {
        const response = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(drugName)}&search=1`);
        const payload = await response.json();
        const conceptId = payload.idGroup?.rxnormId?.[0];
        logEvent('rxnorm_cui_lookup', { medicine: drugName, rxcui: conceptId });
        return conceptId;
    } catch (error) {
        return null;
    }
}

export async function getGenericName(brandDrug) {
    try {
        const conceptId = await getRxCUI(brandDrug);
        if (!conceptId) return null;
        
        const response = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui/${conceptId}/related.json?tty=IN`);
        const payload = await response.json();
        const genericDrug = payload.relatedGroup?.conceptGroup?.[0]?.conceptProperties?.[0]?.name;
        
        logEvent('rxnorm_generic_lookup', { brand: brandDrug, generic: genericDrug, rxcui: conceptId });
        return genericDrug;
    } catch (error) {
        return null;
    }
}

export async function checkInteractionRxNorm(conceptId1, conceptId2) {
    try {
        const response = await fetch(`https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui=${conceptId1}`);
        const payload = await response.json();
        
        const interactionList = payload.interactionTypeGroup?.[0]?.interactionType?.[0]?.interactionPair || [];
        const matchedInteraction = interactionList.find(item => 
            item.interactionConcept?.some(concept => concept.minConceptItem?.rxcui === conceptId2)
        );
        
        if (matchedInteraction) {
            logEvent('rxnorm_interaction_found', { rxcui1: conceptId1, rxcui2: conceptId2, severity: matchedInteraction.severity });
            return {
                found: true,
                severity: matchedInteraction.severity,
                description: matchedInteraction.description
            };
        }
        
        return { found: false };
    } catch (error) {
        return { found: false };
    }
}
