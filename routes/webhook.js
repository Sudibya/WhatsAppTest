require('dotenv').config();
const express = require('express');
const router = express.Router();

const verifyToken = process.env.VERIFY_TOKEN;

router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === verifyToken) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

router.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object === 'whatsapp_business_account') {
    body.entry.forEach(entry => {
      entry.changes.forEach(change => {
        if (change.value.messages) {
          change.value.messages.forEach(message => {
            const from = message.from;
            let messageContent = '';

            if (message.text) {
              messageContent = message.text.body;
            } else if (message.button) {
              messageContent = message.button.text;
            } else if (message.interactive) {
              if (message.interactive.type === 'button_reply') {
                messageContent = message.interactive.button_reply.title;
              } else if (message.interactive.type === 'list_reply') {
                messageContent = message.interactive.list_reply.title;
              }
            }

            console.log(`Received message from ${from}: ${messageContent}`);
          });
        }
      });
    });

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
