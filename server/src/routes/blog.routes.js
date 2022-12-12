const express = require("express");
const authorization = require("../middlewares/authorization");
const {
  getAllBlogs,
  postBlog,
  getAllYourBlogs,
  deleteblog,
} = require("../controllers/blog.controller");
const fileUpload = require("express-fileupload");
const BlogModel = require("../model/blog.model");
const cloudinary = require("cloudinary").v2;

const app = express.Router();

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

cloudinary.config({
  cloud_name: "dkdfmmywa",
  api_key: "371296886297185",
  api_secret: "7TDFMzxqMJ0tyx7ct8-DN8bqfaY",
});

app.post("/blog", authorization, async (req, res) => {
  try {
    const title = req.body.title;
    const description = req.body.description;
    const img = req.files.image;
    const user = req.user._id;
    const name = req.user.name;
    console.log(title, description, img, user, name);
    cloudinary.uploader
      .upload(img.tempFilePath)
      .then(async (res) => {
        let url = res.secure_url;
        let data = await postBlog({ title, description, user, name, url });
        return res.send(data);
      })
      .catch((err) => res.send(err));
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
