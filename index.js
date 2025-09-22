const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

// 🔁 Your Google Apps Script Web App URL
const TARGET_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxJiWlkjCxxGOh69tEHB08QK5ZYJciW6GZBuTF-F-Z-ANCoifcQqhdIlXZHuQ--RQ1z/exec";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("*", async (req, res) => {
  try {
    const url = TARGET_SCRIPT_URL;
    const method = req.method.toLowerCase();

    const response = await axios({
      method,
      url,
      headers: Object.fromEntries(
        Object.entries(req.headers).filter(([key]) => key.toLowerCase() !== "host")
      ),
      params: req.query,
      data: req.body,
      responseType: "stream"
    });

    res.set(response.headers);
    response.data.pipe(res);
  } catch (err) {
    console.error("Proxy error:", err.message);
    res.status(err.response?.status || 500).json({
      error: err.message,
      details: err.response?.data || "No response data"
    });
  }
});


app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
