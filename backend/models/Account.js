const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model("Account", accountSchema, "accounts");