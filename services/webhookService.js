const axios = require('axios');

/**
 * Sends a notification to the webhook URL.
 * @param {string} webhookUrl - The URL of the webhook endpoint.
 * @param {Object} data - Data to be sent to the webhook.
 */
const sendWebhookNotification = async (webhookUrl, data) => {
    try {
        await axios.post(webhookUrl, data);
        console.log('Webhook notification sent successfully.');
    } catch (error) {
        console.error('Error sending webhook notification:', error);
    }
};

module.exports = { sendWebhookNotification };
