export function logEvent(eventName, metadata = {}) {
    const timestamp = new Date().toISOString();
    const log = { timestamp, event: eventName, ...metadata };
    
    const logs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
    logs.push(log);
    if (logs.length > 100) logs.shift();
    localStorage.setItem('auditLogs', JSON.stringify(logs));
    
    console.log(`[AUDIT] ${eventName}:`, metadata);
}

export function getAuditLogs() {
    return JSON.parse(localStorage.getItem('auditLogs') || '[]');
}
