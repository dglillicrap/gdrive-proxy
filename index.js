const express = require('express');
const axios   = require('axios');
const app     = express();
const PORT    = process.env.PORT || 3000;

// Hard‑coded Apps Script URL and key
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxJiWlkjCxxGOh69tEHB08QK5ZYJciW6GZBuTF-F-Z-ANCoifcQqhdIlXZHuQ--RQ1z/exec';
const SCRIPT_KEY = 'chatgpt_temp_key_01';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all('/', async (req, res) => {
  try {
    // Always inject the key and forward query params
    const params = { ...req.query, key: SCRIPT_KEY };

    // Build axios config without a body for GET/HEAD
    const config = {
      method: req.method,
      url: SCRIPT_URL,
      params,
      headers: req.headers['content-type']
        ? { 'Content-Type': req.headers['content-type'] }
        : {},
    };

    // Only attach a body for POST, PUT, PATCH
    if (!['GET', 'HEAD'].includes(req.method)) {
      config.data = req.body;
    }

    const response = await axios(config);
    res.status(response.status).send(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).send(
      typeof err.response?.data === 'string'
        ? err.response.data
        : err.message,
    );
  }
});

app.listen(PORT, () => {
  console.log(`Proxy listening on port ${PORT}`);
});
