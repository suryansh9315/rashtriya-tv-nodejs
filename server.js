const express = require('express')
const cors = require('cors');
const root = require('./routes/root')
const { connectDb } = require("./database");

const app = express()
const port = 8080

connectDb()

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/", root)

app.listen(port, () => {
    console.log(`Server running on Port ${port}.`)
})