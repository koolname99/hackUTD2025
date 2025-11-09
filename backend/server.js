const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Account = require("./models/Account.js");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// LOGIN route
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // tìm account trong MongoDB theo email
    const account = await Account.findOne({ "auth.email": email });

    if (!account) {
      return res.status(404).json({ message: "User not found" });
    }

    // kiểm tra password (chưa hash)
    if (account.auth.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // nếu hợp lệ
    res.json({
      message: "Login successful",
      user: {
        email: account.auth.email,
        role: account.auth.role,
        customerName: account.customer?.name,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Get transactions grouped by month
app.get("/api/transactions", async (req, res) => {
  try {
    const account = await Account.findOne();
    if (!account) return res.status(404).json({ message: "Account not found" });

    const grouped = {};
    account.transactions.forEach((txn) => {
      const month = txn.date.slice(0, 7); // e.g., "2025-05"
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(txn);
    });

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
