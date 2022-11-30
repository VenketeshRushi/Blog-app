transport
  .sendMail({
    to: user.email,
    subject: "Password reset OTP",
    from: "venketsh@gmail.com",
    text: `Your password reset otp is ${otp}`,
  })
  .then(() => console.log("mail sent successfully"));
