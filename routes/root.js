const express = require("express");
const auth = require("./api/auth");

const app = express.Router();

app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to Rastriya TV API" })
})

app.use("/api/auth", auth);

module.exports = app;