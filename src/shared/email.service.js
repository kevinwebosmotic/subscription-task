const nodemailer = require('nodemailer');
const { logger } = require('../middleware/logger');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return null;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

async function send(to, subject, html) {
  const t = getTransporter();
  if (!t) { logger.debug('Email transport not configured — skipping', { to, subject }); return; }
  try {
    await t.sendMail({ from: process.env.EMAIL_FROM, to, subject, html });
    logger.info('Email sent', { to, subject });
  } catch (err) {
    logger.error('Failed to send email', { to, subject, error: err.message });
  }
}

async function paymentSuccess({ customerEmail, customerName, planName, amount, nextBillingDate }) {
  await send(
    customerEmail,
    `Payment received — ${planName}`,
    `<p>Hi ${customerName},</p>
     <p>Your payment of <strong>$${Number(amount).toFixed(2)}</strong> for <strong>${planName}</strong> was successful.</p>
     <p>Next billing date: <strong>${new Date(nextBillingDate).toDateString()}</strong></p>
     <p>Thank you for your subscription!</p>`
  );
}

async function paymentFailed({ customerEmail, customerName, planName, retryCount, maxRetries, nextRetryDate }) {
  const hasRetry = retryCount <= maxRetries;
  await send(
    customerEmail,
    'Payment failed — action required',
    `<p>Hi ${customerName},</p>
     <p>We were unable to process your payment for <strong>${planName}</strong>.</p>
     ${hasRetry
       ? `<p>We will retry on <strong>${new Date(nextRetryDate).toDateString()}</strong> (attempt ${retryCount} of ${maxRetries}).</p>`
       : `<p>All retry attempts exhausted. Your subscription has been <strong>suspended</strong>.</p>`}
     <p>Please update your payment information to avoid service interruption.</p>`
  );
}

async function subscriptionSuspended({ customerEmail, customerName, planName }) {
  await send(
    customerEmail,
    `Subscription suspended — ${planName}`,
    `<p>Hi ${customerName},</p>
     <p>Your subscription to <strong>${planName}</strong> has been suspended due to repeated payment failures.</p>
     <p>Please contact support to reactivate your account.</p>`
  );
}

module.exports = { paymentSuccess, paymentFailed, subscriptionSuspended };
