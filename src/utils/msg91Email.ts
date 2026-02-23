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

interface MSG91EmailPayload {
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

/**
 * Send email using MSG91 API
 * @param payload Email payload
 * @param authKey MSG91 Auth Key
 * @returns Promise with response
 */
export const sendMSG91Email = (
    payload: MSG91EmailPayload,
    authKey: string
): Promise<any> => {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(payload);

        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener('readystatechange', function () {
            if (this.readyState === this.DONE) {
                try {
                    const response = JSON.parse(this.responseText);
                    if (this.status >= 200 && this.status < 300) {
                        resolve(response);
                    } else {
                        reject({
                            status: this.status,
                            error: response,
                        });
                    }
                } catch (error) {
                    reject({
                        status: this.status,
                        error: 'Failed to parse response',
                        raw: this.responseText,
                    });
                }
            }
        });

        xhr.addEventListener('error', function () {
            reject({
                error: 'Network error occurred',
            });
        });

        xhr.open('POST', 'https://control.msg91.com/api/v5/email/send');
        xhr.setRequestHeader('accept', 'application/json');
        xhr.setRequestHeader('authkey', authKey);
        xhr.setRequestHeader('content-type', 'application/json');

        xhr.send(data);
    });
};

/**
 * Send a test email using MSG91
 */
export const sendTestEmail = async (authKey: string) => {
    const testPayload: MSG91EmailPayload = {
        recipients: [
            {
                to: [
                    {
                        name: 'Test Recipient 1',
                        email: 'test1@example.com', // Replace with actual email
                    },
                ],
                variables: {
                    name: 'Test User 1',
                },
            },
            {
                to: [
                    {
                        name: 'Test Recipient 2',
                        email: 'test2@example.com', // Replace with actual email
                    },
                ],
                cc: [
                    {
                        name: 'CC Recipient',
                        email: 'cc@example.com', // Replace with actual email
                    },
                ],
                bcc: [
                    {
                        name: 'BCC Recipient',
                        email: 'bcc@example.com', // Replace with actual email
                    },
                ],
                variables: {
                    name: 'Test User 2',
                },
            },
        ],
        from: {
            name: 'Manvi Fishing Club',
            email: 'noreply@manvifishingclub.com', // Replace with your verified sender email
        },
        domain: 'manvifishingclub.com', // Replace with your registered domain
        reply_to: [
            {
                email: 'support@manvifishingclub.com', // Replace with actual reply-to email
            },
        ],
        template_id: 'YOUR_TEMPLATE_ID', // Replace with your actual template ID
        validate_before_send: true,
    };

    try {
        const response = await sendMSG91Email(testPayload, authKey);
        console.log('✅ Email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        throw error;
    }
};
