const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./models/Product");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/invenlistDB")
    .then(function () {
        console.log("MongoDB Connected");
    })
    .catch(function () {
        console.log("Connection Failed");
    });

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
    res.send("InvenList Server is Running");
});


app.post("/signup", async function (req, res) {
    try {
        let alreadyUser = await User.findOne({
            email: req.body.email
        });

        if (alreadyUser) {
            return res.status(400).send("Email already exists");
        }

        let newUser = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password
        });

        await newUser.save();

        res.send("Account Created");
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});


app.put("/products/:id", async function (req, res) {
    try {
        let updatedProduct = await Product.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.body.userId
            },
            {
                name: req.body.name,
                category: req.body.category,
                quantity: req.body.quantity,
                price: req.body.price
            },
            {
                new: true
            }
        );

        if (!updatedProduct) {
            return res.status(404).send("Product not found");
        }

        res.send("Product Updated");
    } catch (error) {
        console.log(error);

        res.status(500).send("Cannot Update Product");
    }
});

app.post("/login", async function (req, res) {
    try {
        let foundUser = await User.findOne({
            email: req.body.email,
            password: req.body.password
        });

        if (foundUser) {
            res.json({
                message: "Login Success",
                userId: foundUser._id,
                fullName: foundUser.fullName
            });
        } else {
            res.status(401).send("Invalid Email or Password");
        }
    } catch (error) {
        console.log(error);

        res.status(500).send("Something went wrong");
    }
});


app.post("/products", async function (req, res) {
    try {
        let newProduct = new Product({
            name: req.body.name,
            category: req.body.category,
            quantity: req.body.quantity,
            price: req.body.price,
            userId: req.body.userId
        });

        await newProduct.save();

        res.send("Product Added");
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});


app.get("/products", async function (req, res) {
    try {
        let allProducts = await Product.find({
            userId: req.query.userId
        });

        res.json(allProducts);
    } catch (error) {
        res.status(500).send("Cannot get products");
    }
});


app.delete("/products/:id", async function (req, res) {
    try {
        await Product.findByIdAndDelete(req.params.id);

        res.send("Product Deleted");
    } catch (error) {
        res.status(500).send("Cannot Delete Product");
    }
});

app.listen(5000, function () {
    console.log("Server Started on Port 5000");
});