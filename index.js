const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

// 🔁 REPLACE THIS WITH YOUR GOOGLE APPS SCRIPT URL
const TARGET_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("*", async (req, res) => {
  try {
    const url = `${TARGET_SCRIPT_URL}${req.url}`;
    const method = req.method.toLowerCase();

    const response = await axios({
      method,
      url,
      headers: { ...req.headers },
      data: req.body,
      responseType: "stream"
    });

    res.set(response.headers);
    response.data.pipe(res);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: err.message,
      details: err.response?.data || "No response data"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
