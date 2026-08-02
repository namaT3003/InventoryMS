const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String
});

module.exports = mongoose.model("User", userSchema);