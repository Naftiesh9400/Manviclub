import type { VercelRequest, VercelResponse } from '@vercel/node';

interface EmailRecipient {
    to: Array<{
        name: string;
        email: string;
    }>;
    cc?: Array<{
        name: string;
        email: string;
    }>;
    bcc?: Array<{
        name: string;
        email: string;
    }>;
    variables?: Record<string, string>;
}

interface EmailAttachment {
    filePath?: string;
    file?: string;
    fileName: string;
}

interface EmailRequest {
    recipients: EmailRecipient[];
    from: {
        name: string;
        email: string;
    };
    domain: string;
    reply_to?: Array<{
        email: string;
    }>;
    attachments?: EmailAttachment[];
    template_id: string;
    validate_before_send?: boolean;
}

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { recipients, from, domain, reply_to, attachments, template_id, validate_before_send } = req.body as EmailRequest;

        // Validate required fields
        if (!recipients || !from || !template_id) {
            return res.status(400).json({
                error: 'Missing required fields: recipients, from, and template_id are required'
            });
        }

        // Get MSG91 auth key from environment variables
        const authKey = process.env.MSG91_AUTH_KEY;
        if (!authKey) {
            return res.status(500).json({
                error: 'MSG91_AUTH_KEY not configured on server'
            });
        }

        // Prepare the request payload
        const payload: EmailRequest = {
            recipients,
            from,
            domain: domain || 'manvifishingclub.com',
            template_id,
            validate_before_send: validate_before_send ?? true,
        };

        // Add optional fields if provided
        if (reply_to) payload.reply_to = reply_to;
        if (attachments) payload.attachments = attachments;

        // Send email via MSG91 API
        const response = await fetch('https://control.msg91.com/api/v5/email/send', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'authkey': authKey,
                'content-type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('MSG91 API Error:', data);
            return res.status(response.status).json({
                error: 'Failed to send email',
                details: data
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Email sent successfully',
            data
        });

    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
