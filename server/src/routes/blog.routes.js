const express = require("express");
const authorization = require("../middlewares/authorization");
const {
  getAllBlogs,
  postBlog,
  getAllYourBlogs,
  deleteblog,
} = require("../controllers/blog.controller");

const app = express.Router();

app.post("/blog", authorization, async (req, res) => {
  try {
    const title = req.body.data.title;
    const description = req.body.data.description;
    const user = req.user._id;
    const name = req.user.name;
    let data = await postBlog({ title, description, user, name });
    return res.send(data);
  } catch (error) {
    return res.send(error);
  }
});

app.get("/", authorization, async (req, res) => {
  try {
    const page = req.query.page;
    let data = await getAllBlogs(page);
    return res.send(data);
  } catch (error) {
    return res.send(error.message);
  }
});

app.get("/yourblogs", authorization, async (req, res) => {
  try {
    const page = req.query.page;
    const userid = req.query.userid;
    let data = await getAllYourBlogs({ userid, page });
    return res.send(data);
  } catch (error) {
    return res.send(error.message);
  }
});

app.delete("/deleteblog", async (req, res) => {
  const id = req.query.id;
  try {
    let data = await deleteblog(id);
    return res.send(data);
  } catch (error) {
    return res.send(error.message);
  }
});

module.exports = app;
