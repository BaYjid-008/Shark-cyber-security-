const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch"); // npm install node-fetch@2
const fs = require("fs");
const FormData = require("form-data"); // npm install form-data

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.urlencoded({ extended: true }));
app.use(express.static("."));

// ✅ Your Telegram Bot Token
const BOT_TOKEN = "8472395100:AAEBP0g0ZsardCH2GO-FDs2TW1u9AafCPpw";

// ✅ Your personal Chat ID
const CHAT_ID = "6313533050";

app.post("/send", upload.single("photo"), async (req, res) => {
  const { name, age, phone, email } = req.body;
  let text = `🦈 New Shark Form Submission\nName: ${name}\nAge: ${age}\nPhone: ${phone}\nEmail: ${email}`;

  try {
    if (req.file) {
      // Photo থাকলে Telegram এ পাঠাও
      const formData = new FormData();
      formData.append("chat_id", CHAT_ID);
      formData.append("photo", fs.createReadStream(req.file.path));
      formData.append("caption", text);

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        body: formData,
      });
      fs.unlinkSync(req.file.path); // file remove
    } else {
      // Text-only
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      });
    }

    res.send("✅ Sent to Telegram successfully!");
  } catch (err) {
    console.error(err);
    res.send("❌ Failed to send: " + err.message);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("🦈 Shark Form running at http://localhost:3000");
});
