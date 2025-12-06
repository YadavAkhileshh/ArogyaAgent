import { NextResponse } from 'next/server';

// Secure WhatsApp API route
export async function POST(request) {
    try {
        const { to, message } = await request.json();

        const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
        const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
        const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

        if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
            return NextResponse.json(
                { success: false, error: 'Twilio credentials not configured' },
                { status: 500 }
            );
        }

        const response = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
            {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64'),
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    To: `whatsapp:${to}`,
                    From: `whatsapp:${TWILIO_PHONE_NUMBER}`,
                    Body: message
                })
            }
        );

        if (!response.ok) {
            const error = await response.text();
            return NextResponse.json(
                { success: false, error: 'WhatsApp message failed to send' },
                { status: response.status }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
