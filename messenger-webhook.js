const crypto = require('crypto');

exports.handler = async (event) => {
  if (event.httpMethod === 'GET') {
    const q = event.queryStringParameters || {};
    const mode = q['hub.mode'];
    const token = q['hub.verify_token'];
    const challenge = q['hub.challenge'];
    const expected = process.env.META_VERIFY_TOKEN || process.env.VERIFY_TOKEN;

    if (!expected) {
      return { statusCode: 500, headers: { 'Content-Type': 'text/plain' }, body: 'META_VERIFY_TOKEN is not configured' };
    }
    if (mode === 'subscribe' && token === expected && challenge) {
      return { statusCode: 200, headers: { 'Content-Type': 'text/plain' }, body: challenge };
    }
    return { statusCode: 403, headers: { 'Content-Type': 'text/plain' }, body: 'Webhook verification failed' };
  }

  if (event.httpMethod === 'POST') {
    // Verify Meta's request signature when the app secret is configured.
    const appSecret = process.env.META_APP_SECRET;
    if (appSecret) {
      const signature = (event.headers && (event.headers['x-hub-signature-256'] || event.headers['X-Hub-Signature-256'])) || '';
      const rawBody = event.body || '';
      const expected = 'sha256=' + crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex');
      const a = Buffer.from(signature);
      const b = Buffer.from(expected);
      if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        return { statusCode: 401, body: 'Invalid signature' };
      }
    }

    // Acknowledge webhook events. Business logic can be added after Meta verification.
    return { statusCode: 200, headers: { 'Content-Type': 'text/plain' }, body: 'EVENT_RECEIVED' };
  }

  return { statusCode: 405, headers: { Allow: 'GET, POST' }, body: 'Method Not Allowed' };
};
