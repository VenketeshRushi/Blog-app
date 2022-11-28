const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const port = 8080;

const app = express();

const mongoose = require("mongoose");
const UserModel = require("./user.model");
const BlogModel = require("./blog.model");

app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
  let { email } = req.body;
  try {
    let user = await UserModel.findOne({ email: email });
    if (user) {
      return res
        .status(500)
        .json({ status: "Failed", message: "Please try with different email" });
    }
    user = await UserModel.create(req.body);
    console.log(user);
    return res.status(201).send("Signed in successfully");
  } catch (error) {
    return res.status(500).json({ message: error.message, status: "Failed" });
  }
});

app.post("/login", async (req, res) => {
  try {
    let { email, password, role } = req.body;
    console.log(req.body);
    let user = await UserModel.findOne({ email });
    console.log(user);

    if (!user) {
      return res
        .status(500)
        .json({ status: "failed", message: "Please check your email" });
    }

    const matchpassword = user.password === password;

    if (!matchpassword) {
      return res
        .status(500)
        .json({ status: "failed", message: "Please check your password" });
    }

    const matchrole = user.role === role;

    if (!matchrole) {
      return res
        .status(500)
        .json({ status: "failed", message: "Can't Login with this Role" });
    }

    const token = jwt.sign({ user }, "1234", { expiresIn: "30 min" });
    res.status(201).send({ jwttoken: token, userid: user._id, role: role });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/blog", async (req, res) => {
  console.log(req.body);
  let info = jwt.decode(req.body.jwt);
  let id = info.user._id;
  let userName = info.user.name;
  let data = req.body.data;
  console.log(id, data);
  try {
    let user = await BlogModel.create({ ...data, user: id, name: userName });
    console.log(user);
    res.send(userName);
  } catch (error) {
    res.send(error);
  }
});

app.get("/", async (req, res) => {
  try {
    let blogs = await BlogModel.find();
    console.log(blogs);
    res.send(blogs);
  } catch (error) {
    res.send(error.message);
  }
});

mongoose
  .connect("mongodb+srv://raman:raman@cluster0.fm7rpoi.mongodb.net/ecom")
  .then(() => {
    app.listen(port, () => {
      console.log(`listed on ${port}`);
    });
  })
  .catch((e) => console.log(e));
