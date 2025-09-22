const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send("Missing 'url' parameter");

  fetch(target)
    .then(r => r.text())
    .then(t => res.send(t))
    .catch(e => res.status(500).send("Error: " + e));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Proxy listening on port " + PORT));

