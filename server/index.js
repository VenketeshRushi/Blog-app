const express = require("express");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const cors = require("cors");
const port = 8080;

const app = express();

const mongoose = require("mongoose");
const UserModel = require("./user.model");
const BlogModel = require("./blog.model");
const authorization = require("./middlewares/authorization");

app.use(express.json());
app.use(cors());

const transport = nodemailer.createTransport({
  service:"gmail",
  host: "smtp.gmail.com",
  secure:"false",
  port: 587,
  auth: {
    user: "ramanrushi97@gmail.com",
    pass: "jxdshyhirwvwuael",
  },
});

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
    return res.status(201).send("Signed in successfully");
  } catch (error) {
    return res.status(500).json({ message: error.message, status: "Failed" });
  }
});

app.post("/login", async (req, res) => {
  try {
    let { email, password, role } = req.body;
    let user = await UserModel.findOne({ email });

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
      role: user.role,
      refreshtoken: refreshtoken,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/checkmail", async (req, res) => {
  try {
    let user = await UserModel.findOne({ email: req.body.data });
    console.log(user);
    const otp = Math.floor(Math.random() * (9999 - 1000) + 1000);

    transport.sendMail({
      to: user.email,
      subject: "Password reset OTP",
      from: "venketsh@gmail.com",
      text: `Your password reset otp is ${otp}`,
    });

    return res.status(201).send({ email: user.email, otp: otp });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failed", message: "With This Email There Is No User" });
  }
});

app.post("/resetpassword", async (req, res) => {
  let password = req.body.data.password;
  let email = req.body.data.email;
  try {
    let filter = { email: email };
    let update = { password: password };
    let user = await UserModel.findOneAndUpdate(filter, update);
    return res.status(201).send("Password updated successfully Login Now");
  } catch (error) {
    return res.send(error.message);
  }
});

app.post("/logout", authorization, (req, res) => {
  return res.send({ message: "Logout successfuly" });
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
        userid: user._id,
        role: user.role,
      });
    }
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Login again Session Expired", status: "Failed" });
  }
});

app.post("/blog", authorization, async (req, res) => {
  try {
    let user = await BlogModel.create({
      title: req.body.data.title,
      description: req.body.data.description,
      user: req.user._id,
      name: req.user.name,
    });
    //console.log(user);
    res.send(req.user.name);
  } catch (error) {
    res.send(error);
  }
});

app.get("/", authorization, async (req, res) => {
  try {
    let blogs = await BlogModel.find();
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
