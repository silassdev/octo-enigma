/**
 * Mock Email Orchestration Engine
 * In a production environment, this would integrate with Resend, SendGrid, or AWS SES.
 */

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    console.log(`[EMAIL ORCHESTRATOR] Sending email to ${to}...`);
    console.log(`[SUBJECT] ${subject}`);
    console.log(`[CONTENT] ${html}`);
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { success: true, messageId: `mock_${Date.now()}` };
}

export async function notifyAdminOfNewContact(contactData: any) {
    const { name, email, subject, message } = contactData;
    
    const html = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #0066FF;">New Support Inquiry Received</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr />
            <p><strong>Message:</strong></p>
            <blockquote style="background: #f4f4f4; padding: 15px; border-left: 4px solid #0066FF;">
                ${message}
            </blockquote>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">
                This inquiry has been logged in the Admin Dashboard under Contact Requests.
            </p>
        </div>
    `;

    return sendEmail({
        to: "9thshila@gmail.com",
        subject: `[Support Inquiry] ${subject}`,
        html
    });
}
