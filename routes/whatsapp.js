const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/send-template', async (req, res) => {
    const { phoneNumber, templateName, languageCode, parameters, buttons } = req.body;

    if (!phoneNumber || !templateName || !languageCode) {
        return res.status(400).json({ message: 'Phone number, template name, and language code are required' });
    }

    try {
        const whatsappApiUrl = process.env.WHATSAPP_API_URL;
        const apiToken = process.env.WHATSAPP_API_TOKEN;

        const components = [];

        if (parameters && parameters.length > 0) {
            components.push({
                type: "body",
                parameters: parameters.map(param => ({
                    type: "text",
                    text: param
                }))
            });
        }

        if (buttons && buttons.length > 0) {
            buttons.forEach((button, index) => {
                if (button.type === "quick_reply") {
                    components.push({
                        type: "button",
                        sub_type: "quick_reply",
                        index: String(index),
                        parameters: [{ type: "payload", payload: button.payload }]
                    });
                } else if (button.type === "url") {
                    components.push({
                        type: "button",
                        sub_type: "url",
                        index: String(index),
                        parameters: [
                            {
                                type: "text",
                                text: button.url
                            }
                        ]
                    });
                }
            });
        }

        const requestBody = {
            messaging_product: "whatsapp",
            to: phoneNumber,
            type: "template",
            template: {
                name: templateName,
                language: {
                    code: languageCode
                },
                ...(components.length > 0 && { components })
            }
        };

        const response = await axios.post(whatsappApiUrl, requestBody, {
            headers: {
                Authorization: `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            }
        });

        res.status(200).json({ message: 'WhatsApp template sent successfully', data: response.data });
    } catch (error) {
        console.error('Error sending WhatsApp template:', error.response?.data || error.message);
        res.status(500).json({ message: 'Error sending WhatsApp template', error: error.response?.data || error.message });
    }
});

module.exports = router;
