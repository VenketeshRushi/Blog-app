const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const port = 8080;

const app = express();

const mongoose = require("mongoose");
const UserModel = require("./user.model");
const BlogModel = require("./blog.model");
const authorization = require("./middlewares/authorization");

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

    const token = jwt.sign({ user }, "1234", { expiresIn: "1 hr" });
    const refreshtoken = jwt.sign({ user }, "refresh1234", {
      expiresIn: "7 days",
    });
    res.status(201).send({
      jwttoken: token,
      userid: user._id,
      role: role,
      refreshtoken: refreshtoken,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/blog", authorization, async (req, res) => {
  try {
    console.log(req.user);
    let user = await BlogModel.create({
      title: req.body.data.title,
      description: req.body.data.description,
      user: req.user._id,
      name: req.user.name,
    });
    console.log(user);
    res.send(req.user.name);
  } catch (error) {
    res.send(error);
  }
});

app.get("/", authorization, async (req, res) => {
  try {
    let blogs = await BlogModel.find();
    //console.log(blogs);
    res.send(blogs);
  } catch (error) {
    res.send(error.message);
  }
});

app.post("/refresh", (req, res) => {
  const bearerToken = req?.body?.headers?.Authorization;
  if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
    return res
      .status(404)
      .json({ message: "Login again Session Expired", status: "Failed" });
  }
  const refreshtoken = bearerToken.split(" ")[1];
  try {
    const verifyRefreshToken = jwt.verify(refreshtoken, "refresh1234");
    if (verifyRefreshToken) {
      let user = verifyRefreshToken.user;
      const token = jwt.sign({ user }, "1234", { expiresIn: "1 hr" });
      return res.status(201).send({
        jwttoken: token,
      });
    }
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Login again Session Expired", status: "Failed" });
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
