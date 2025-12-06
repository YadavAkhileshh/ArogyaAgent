// Client-side Twilio service - calls secure API route
// Handles SMS messaging
export async function sendSMS(to, message) {
    try {
        const response = await fetch('/api/send-sms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ to, message })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('SMS Error:', error);
        return { success: false, error: error.message };
    }
}

export async function sendWhatsApp(to, message) {
    try {
        const response = await fetch('/api/send-whatsapp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ to, message })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('WhatsApp Error:', error);
        return { success: false, error: error.message };
    }
}
