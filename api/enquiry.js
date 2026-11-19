// Vercel Function: POST /api/enquiry
// Sends website enquiries through the client's own GoDaddy mailbox over SMTP.
// Configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO and MAIL_FROM in the Vercel project settings.
import nodemailer from 'nodemailer';
import { createEnquiryHandler } from './_lib/enquiry-handler.js';

export default createEnquiryHandler({ createTransport: (options) => nodemailer.createTransport(options) });
