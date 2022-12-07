const express = require("express");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const UserModel = require("../model/user.model");

const authorization = require("../middlewares/authorization");
const {
  signup,
  login,
  refresh,
  checkemail,
  resetpassword,
} = require("../controllers/user.controller");

const app = express.Router();

app.post("/signup", async (req, res) => {
  // let { email, password } = req.body;
  // try {
  //   let user = await UserModel.findOne({ email: email, password: password });
  //   if (user) {
  //     return res
  //       .status(500)
  //       .json({ status: "Failed", message: "Please try with different email" });
  //   }
  //   user = await UserModel.create(req.body);
  //   return res.status(201).send("Signed in successfully");
  // } catch (error) {
  //   return res.status(500).json({ message: error.message, status: "Failed" });
  // }

  let { email, password, name, role } = req.body;
  try {
    console.log(email, password);
    let data = await signup({ email, password, name, role });
    if (data.status == "Failed") {
      return res.status(500).json(data);
    }
    return res.status(201).send(data);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message, status: "Failed" });
  }
});

app.post("/login", async (req, res) => {
  // try {
  //   let { email, password, role } = req.body;
  //   let user = await UserModel.findOne({ email });

  //   if (!user) {
  //     return res
  //       .status(500)
  //       .json({ status: "failed", message: "Please check your email" });
  //   }

  //   const matchpassword = user.password === password;

  //   if (!matchpassword) {
  //     return res
  //       .status(500)
  //       .json({ status: "failed", message: "Please check your password" });
  //   }

  //   const matchrole = user.role === role;

  //   if (!matchrole) {
  //     return res
  //       .status(500)
  //       .json({ status: "failed", message: "Can't Login with this Role" });
  //   }

  //   const token = jwt.sign({ user }, "1234", { expiresIn: "1 hr" });
  //   const refreshtoken = jwt.sign({ user }, "refresh1234", {
  //     expiresIn: "7 days",
  //   });
  //   res.status(201).send({
  //     jwttoken: token,
  //     userid: user._id,
  //     role: user.role,
  //     refreshtoken: refreshtoken,
  //   });
  // } catch (error) {
  //   res.status(500).send(error.message);
  // }

  try {
    let { email, password, role } = req.body;
    let data = await login({ email, password, role });
    if (data.status == "Failed") {
      return res.status(500).json(data);
    }
    return res.status(201).send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/checkmail", async (req, res) => {
  // try {
  //   let user = await UserModel.findOne({ email: req.body.data });

  //   const otp = Math.floor(Math.random() * (9999 - 1000) + 1000);

  //   transport.sendMail({
  //     to: user.email,
  //     subject: "Password reset OTP",
  //     from: "venketsh@gmail.com",
  //     text: `Your password reset otp is ${otp}. This OTP will valid for 5 minutes.`,
  //   });

  //   return res.status(201).send({ email: user.email, otp: otp });
  // } catch (error) {
  //   return res
  //     .status(500)
  //     .json({ status: "failed", message: "With This Email There Is No User" });
  // }
  let email = req.body.data;
  try {
    let data = await checkemail(email);
    if (data.status == "Failed") {
      return res.status(500).json(data);
    }
    return res.status(201).send(data);
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failed", message: "With This Email There Is No User" });
  }
});

app.post("/resetpassword", async (req, res) => {
  // let password = req.body.data.password;
  // let email = req.body.data.email;
  // try {
  //   let filter = { email: email };
  //   let update = { password: password };
  //   let user = await UserModel.findOneAndUpdate(filter, update);
  //   return res.status(201).send("Password updated successfully Login Now");
  // } catch (error) {
  //   return res.send(error.message);
  // }

  let password = req.body.data.password;
  let email = req.body.data.email;
  try {
    let data = await resetpassword({ email, password });
    return res.status(201).send(data);
  } catch (error) {
    return res.send(error.message);
  }
});

app.post("/logout", (req, res) => {
  return res.send({ message: "Logout successfuly" });
});

app.post("/refresh", async (req, res) => {
  // const bearerToken = req?.body?.headers?.Authorization;
  // if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
  //   return res
  //     .status(404)
  //     .json({ message: "Login again Session Expired", status: "Failed" });
  // }

  // const refreshtoken = bearerToken.split(" ")[1];

  // const verifyRefreshToken = jwt.verify(refreshtoken, "refresh1234");

  // if (verifyRefreshToken) {
  //   const user = verifyRefreshToken.user;
  //   const token = jwt.sign({ user }, "1234", { expiresIn: "1 hr" });

  //   return res.status(201).send({
  //     jwttoken: token,
  //     userid: user._id,
  //     role: user.role,
  //   });
  // } else {
  //   return res
  //     .status(404)
  //     .json({ message: "Login again Session Expired", status: "Failed" });
  // }

  const bearerToken = req?.body?.headers?.Authorization;
  try {
    let data = await refresh(bearerToken);
    if (data.status == "Failed") {
      return res.status(404).json(data);
    }
    return res.status(201).send(data);
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ message: error.message, status: "Failed" });
  }
});

module.exports = app;
