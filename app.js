require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const whatsappRoutes = require('./routes/whatsapp');
const webhookRoutes = require('./routes/webhook');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/api/whatsapp', whatsappRoutes);
app.use('/api', webhookRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
