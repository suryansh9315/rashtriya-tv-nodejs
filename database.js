const { MongoClient } = require("mongodb");
const dotenv = require("dotenv").config();

const url = process.env.MONGO_URI;
const mongoClient = new MongoClient(url);

const connectDb = async () => {
  try {
    await mongoClient.connect();
    console.log("Successfully connected to Atlas");
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports = { connectDb, mongoClient };
