const { verify_jwt } = require("../utils/jwt_helpers");
const { ObjectId } = require("mongodb");
const { mongoClient } = require("../database");

const db = mongoClient.db("news");
const admins = db.collection("news-admin");

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "A token is required for authentication.",
    });
  }
  try {
    const decoded = verify_jwt(token);
    req.userId = decoded.id;
  } catch (err) {
    return res.status(401).json({
      status: "error",
      message: "Invalid Token.",
    });
  }
  return next();
};

const verifyManager = async (req, res, next) => {
  const userId = req.userId;
  const query = { _id: new ObjectId(userId) };
  const manager = await admins.findOne(query);
  if (!manager) {
    return res
      .status(401)
      .json({ status: "error", message: "Manager does not exist." });
  }
  req.manager = manager;
  return next();
};

module.exports = { verifyToken, verifyManager };
