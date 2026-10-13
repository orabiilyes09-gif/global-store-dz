exports.handler = async (event) => {
    if (event.httpMethod === 'GET') {
        const q = event.queryStringParameters || {};
        const mode = q['hub.mode'];
        const token = q['hub.verify_token'];
        const challenge = q['hub.challenge'];

        const VERIFY_TOKEN = '21/08/94';

        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            return {
                statusCode: 200,
                body: challenge
            };
        }
        return { statusCode: 403, body: 'Forbidden' };
    }

    if (event.httpMethod === 'POST') {
        return { statusCode: 200, body: 'EVENT_RECEIVED' };
    }

    return { statusCode: 405, body: 'Method Not Allowed' };
};
