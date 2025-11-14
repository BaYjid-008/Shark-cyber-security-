const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.static("."));
app.use(express.urlencoded({ extended: true }));

app.post("/send", upload.single("photo"), async (req, res) => {
  const { name, age, phone, email } = req.body;
  const photoPath = req.file?.path;

  const transporter = nodemailer.createTransport({
    service: "yahoo", // Gmail ব্যবহার করলে "gmail" দাও
    auth: {
      user: "shark.agency@yahoo.com", // তোমার ইমেইল
      pass: "YOUR_APP_PASSWORD", // এখানে তোমার App Password দাও
    },
  });

  const mailOptions = {
    from: "shark.agency@yahoo.com",
    to: "shark.agency@yahoo.com",
    subject: "🦈 New Shark Form Submission",
    html: `
      <h3>New Form Submission</h3>
      <p><b>Name:</b> ${name}</p>
      <p><b>Age:</b> ${age}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Email:</b> ${email}</p>
      <p>Photo attached below 👇</p>
    `,
    attachments: photoPath
      ? [{ filename: req.file.originalname, path: photoPath }]
      : [],
  };

  try {
    await transporter.sendMail(mailOptions);
    if (photoPath) fs.unlinkSync(photoPath);
    res.send("✅ Successfully sent to Shark Gmail!");
  } catch (error) {
    console.error(error);
    res.send("❌ Failed to send email: " + error.message);
  }
});

app.listen(3000, () => console.log("🦈 Shark Form running at http://localhost:3000"));
