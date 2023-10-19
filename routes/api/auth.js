const express = require("express");
const dotenv = require("dotenv").config();
const { sign_jwt } = require("../../utils/jwt_helpers");
const { verifyToken } = require("../../middlewares/auth");
const { ObjectId } = require("mongodb");
const { mongoClient } = require("../../database");

const db = mongoClient.db("news");
const admins = db.collection("news-admin");
const app = express.Router();

app.post("/login", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "Missing fields for login." });
  }
  const email = req.body.email;
  const password = req.body.password;
  try {
    const query = { email };
    const admin = await admins.findOne(query);
    if (admin) {
      if (admin.password === password) {
        const token = sign_jwt({ id: admin._id });
        return res
          .status(200)
          .json({ message: "Successfully logged in", token });
      } else {
        return res.status(400).json({ message: "Wrong Password" });
      }
    } else {
      return res.status(400).json({ message: "Admin D.N.E" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong" });
  }
});

app.post("/check-token", verifyToken, async (req, res) => {
  res.status(200).json({ message: "Correct Token" });
});

module.exports = app;
