const mongoose = require("mongoose");

let productSchema = new mongoose.Schema({

    name: String,
    category: String,
    quantity: Number,
    price: Number,
    userId: String

});

module.exports = mongoose.model("Product", productSchema);