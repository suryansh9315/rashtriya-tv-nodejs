const express = require("express");
const dotenv = require("dotenv").config();
const { verifyToken, verifyManager } = require("../../middlewares/auth");
const { ObjectId } = require("mongodb");
const { mongoClient } = require("../../database");

const db = mongoClient.db("news");
const blogs = db.collection("news-blogs");
const app = express.Router();

app.post("/create-blog", verifyToken, verifyManager, async (req, res) => {
  if (!req.body.blogDetails) {
    return res
      .status(400)
      .json({ message: "Missing fields for creating blog." });
  }
  const blogDetails = req.body.blogDetails;
  try {
    const blog_obj = {
      ...blogDetails,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: true,
    };
    const newBlog = await blogs.insertOne(blog_obj);
    return res
      .status(200)
      .json({ message: "Successfully created blog", newBlog });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong" });
  }
});

app.get("/getBlogById/:id", async (req, res) => {
  const blogId = req.params["id"];
  try {
    const query = { _id: new ObjectId(blogId) };
    const blog = await blogs.findOne(query);
    if (!blog) {
      return res.status(400).json({ message: "Blog does not exist." });
    }
    if (!blog.status) {
      return res.status(400).json({ message: "Blog is not active." });
    }
    res.status(200).json({ message: "Found blog with this id.", blog });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong" });
  }
});

app.get("/getBlogsByTag/:tag", async (req, res) => {
  const tag = req.params["tag"];
  const tags = ["Action", "Adventure"];
  if (!tags.includes(tag)) {
    return res.status(400).json({ message: "Use Correct tag." });
  }
  try {
    const blogs_pointer = blogs.find();
    const blogs_list = [];
    for await (const blog of blogs_pointer) {
      if (blog.tags.includes(tag)) {
        blogs_list.push(blog);
      }
    }
    res
      .status(200)
      .json({ message: "Found blogs with this id.", result: blogs_list });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong" });
  }
});

app.post("/changeBlogStatus", verifyToken, verifyManager, async (req, res) => {
  if (!req.body.blogId) {
    return res.status(400).json({ message: "Missing blog ID." });
  }
  const blogId = req.body.blogId;
  try {
    const query = { _id: new ObjectId(blogId) };
    const old_blog = await blogs.findOne(query);
    if (!old_blog) {
      return res.status(400).json({ message: "Blog does not exist." });
    }
    const update = {
      $set: {
        status: !old_blog.status,
      },
    };
    const options = { upsert: false };
    const result = await blogs.updateOne(query, update, options);
    const { matchedCount, modifiedCount } = result;
    if (matchedCount !== modifiedCount) {
      return res.status(400).json({
        message: "Update went wrong.",
      });
    }
    res.status(200).json({ message: "Blog Updated." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong" });
  }
});

module.exports = app;
