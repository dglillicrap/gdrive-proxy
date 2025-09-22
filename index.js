const express = require('express');
const axios   = require('axios');
const app     = express();
const PORT    = process.env.PORT || 3000;

// Hard-coded Apps Script endpoint and key
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxJiWlkjCxxGOh69tEHB08QK5ZYJciW6GZBuTF-F-Z-ANCoifcQqhdIlXZHuQ--RQ1z/exec';
const SCRIPT_KEY = 'chatgpt_temp_key_01';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Proxy all requests
app.all('*', async (req, res) => {
  try {
    // Merge incoming query params with required key
    const params = { ...req.query, key: SCRIPT_KEY };

    const response = await axios({
      method: req.method,
      url: SCRIPT_URL,
      params,
      data: req.body,
      headers: req.headers['content-type']
        ? { 'Content-Type': req.headers['content-type'] }
        : {},
      validateStatus: () => true,
    });

    res.status(response.status).send(response.data);
  } catch (err) {
    console.error('Proxy error:', err.message);
    res.status(500).send('Proxy error: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
