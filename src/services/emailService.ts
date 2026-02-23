import { sendMSG91Email } from '@/utils/msg91Email';

interface EmailResponse {
    success: boolean;
    message?: string;
    error?: string;
}

/**
 * Send login notification email to user
 */
export const sendLoginEmail = async (
    userEmail: string,
    userName: string
): Promise<EmailResponse> => {
    try {
        // Get MSG91 credentials from environment
        const authKey = import.meta.env.VITE_MSG91_AUTH_KEY;
        const templateId = import.meta.env.VITE_MSG91_TEMPLATE_ID;
        const senderEmail = import.meta.env.VITE_MSG91_SENDER_EMAIL || 'noreply@manvifishingclub.com';
        const domain = import.meta.env.VITE_MSG91_DOMAIN || 'manvifishingclub.com';

        if (!authKey || !templateId) {
            console.warn('MSG91 credentials not configured. Skipping email notification.');
            return {
                success: false,
                error: 'MSG91 credentials not configured'
            };
        }

        const payload = {
            recipients: [
                {
                    to: [
                        {
                            name: userName,
                            email: userEmail,
                        },
                    ],
                    variables: {
                        name: userName,
                        action: 'logged in',
                        message: 'Welcome back to Manvi Fishing Club!',
                    },
                },
            ],
            from: {
                name: 'Manvi Fishing Club',
                email: senderEmail,
            },
            domain: domain,
            reply_to: [
                {
                    email: 'support@manvifishingclub.com',
                },
            ],
            template_id: templateId,
            validate_before_send: true,
        };

        await sendMSG91Email(payload, authKey);

        return {
            success: true,
            message: 'Login email sent successfully',
        };
    } catch (error) {
        console.error('Failed to send login email:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};

/**
 * Send welcome email to new user
 */
export const sendWelcomeEmail = async (
    userEmail: string,
    userName: string
): Promise<EmailResponse> => {
    try {
        // Get MSG91 credentials from environment
        const authKey = import.meta.env.VITE_MSG91_AUTH_KEY;
        const templateId = import.meta.env.VITE_MSG91_TEMPLATE_ID;
        const senderEmail = import.meta.env.VITE_MSG91_SENDER_EMAIL || 'noreply@manvifishingclub.com';
        const domain = import.meta.env.VITE_MSG91_DOMAIN || 'manvifishingclub.com';

        if (!authKey || !templateId) {
            console.warn('MSG91 credentials not configured. Skipping email notification.');
            return {
                success: false,
                error: 'MSG91 credentials not configured'
            };
        }

        const payload = {
            recipients: [
                {
                    to: [
                        {
                            name: userName,
                            email: userEmail,
                        },
                    ],
                    variables: {
                        name: userName,
                        action: 'signed up',
                        message: 'Welcome to Manvi Fishing Club! We\'re excited to have you join our community.',
                    },
                },
            ],
            from: {
                name: 'Manvi Fishing Club',
                email: senderEmail,
            },
            domain: domain,
            reply_to: [
                {
                    email: 'support@manvifishingclub.com',
                },
            ],
            template_id: templateId,
            validate_before_send: true,
        };

        await sendMSG91Email(payload, authKey);

        return {
            success: true,
            message: 'Welcome email sent successfully',
        };
    } catch (error) {
        console.error('Failed to send welcome email:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};
