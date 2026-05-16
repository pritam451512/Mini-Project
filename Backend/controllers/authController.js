// controllers/authController.js
// Spendora Final Production Auth Controller

const User = require("../Models/users")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const validUser = require("../utils/validUser")
const redisClient = require("../config/redis")
const crypto = require("crypto")


// ---------------- TOKEN ----------------

const createToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      emailId: user.emailId
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1d"
    }
  )
}

const setCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
     path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
}



// ---------------- MAIL ----------------

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
})

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP ERROR:", error)
  } else {
    console.log("SMTP READY")
  }
})



// ---------------- OTP ----------------

const generateOtp = () => {
  return Math.floor(
    100000 +
    Math.random() *
    900000
  ).toString()
}



// ---------------- REGISTER ----------------

const register =
async (req,res)=>{
try{

validUser(req.body)

const {
name,
emailId,
password
} = req.body

const existingUser =
await User.findOne({
emailId
})

if(existingUser){
throw new Error(
"User already exists"
)
}

const hashedPassword =
await bcrypt.hash(
password,
10
)

const otp =generateOtp()

// await transporter.sendMail({
// from: "Spendora <spendora.verify@gmail.com>",
// to: emailId,
// subject:
// "Spendora Email Verification",
// html: `
// <h2>Your OTP is ${otp}</h2>
// <p>Valid for 10 minutes</p>
// `
// })

await User.create({
  name,
  emailId,
  password: hashedPassword,
  provider: "local",
  isVerified: false,
  otp: otp,
  otpExpiry: Date.now() + 10 * 60 * 1000,
  otpAttempts: 0
})

res.status(201).json({
message:
"OTP sent successfully",
emailId
})

}catch(err){
res.status(400).json({
message:
err.message
})
}
}




// ---------------- VERIFY OTP ----------------
const verifyOtp =
async (req,res)=>{
try{

const {
emailId,
otp
} = req.body

const user =
await User.findOne({
emailId
})

if(!user){
throw new Error(
"User not found"
)
}

if(user.isVerified){
throw new Error(
"Email already verified"
)
}

if(
user.otpExpiry <
Date.now()
){
throw new Error(
"OTP expired"
)
}

if(
user.otpAttempts >= 5
){
throw new Error(
"Too many wrong attempts"
)
}

if(
user.otp !== otp
){

user.otpAttempts += 1
await user.save()

throw new Error(
"Wrong OTP"
)
}

user.isVerified = true
user.otp = null
user.otpExpiry = null
user.otpAttempts = 0

await user.save()



// ✅ Auto Login Token
const token =
createToken(user)

setCookie(
res,
token
)



res.json({
message:
"Email verified successfully"
})

}catch(err){
res.status(400).json({
message:
err.message
})
}
}


// ---------------- LOGIN ----------------

const login =
async (req,res)=>{
try{

const {
emailId,
password
} = req.body

const user =
await User.findOne({
emailId
})

if(!user){
throw new Error(
"Invalid credentials"
)
}

if(
user.provider ===
"google"
){
throw new Error(
"Please continue with Google"
)
}

if(
!user.isVerified
){
throw new Error(
"Please verify email first"
)
}

const isMatch =
await bcrypt.compare(
password,
user.password
)

if(!isMatch){
throw new Error(
"Invalid credentials"
)
}

const token =
createToken(user)

setCookie(
res,
token
)

res.json({
message:
"Login successful"
})

}catch(err){
res.status(400).json({
message:
err.message
})
}
}




// ---------------- GOOGLE AUTH ----------------

const googleAuth =
async (req,res)=>{
try{

const {
name,
emailId,
photo
} = req.body

let user =
await User.findOne({ emailId })

if(!user){

  user = await User.create({
    name,
    emailId,
    password: null,
    provider: "google",
    isVerified: true,
    photo: photo || ""
  })

}else{

  // 🔥 IMPORTANT FIX
  user.name = name || user.name
  user.photo = photo || user.photo
  user.provider = "google"

  await user.save()
}

const token =
createToken(user)

setCookie(res, token)

res.json({
message: "Google login successful"
})

}catch(err){
res.status(400).json({
message: err.message
})
}
}



// ---------------- LOGOUT ----------------

const logout =
async (req,res)=>{
try{

const { token } =
req.cookies

if (!token) {
  return res.json({
    message: "Logout successful"
  });
}

res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/"
})

res.json({
message:
"Logout successful"
})

}catch(err){
res.status(400).json({
message:
err.message
})
}
}




// ---------------- GET ME ----------------

const getMe =
async (req,res)=>{
try{

res.json(req.user)

}catch(err){
res.status(400).json({
message:
err.message
})
}
}




// ---------------- UPDATE PROFILE ----------------

const updateProfile =
async (req,res)=>{
try{

const {
name,
photo
} = req.body

const user =
await User.findByIdAndUpdate(
req.user._id,
{
name,
photo
},
{
new:true
}
).select("-password")

res.json({
message:
"Profile updated",
user
})

}catch(err){
res.status(400).json({
message:
err.message
})
}
}


// ---------------- FORGOT PASSWORD ----------------

const forgotPassword =
async (req,res)=>{
try{

const { emailId } = req.body

const user =
await User.findOne({ emailId })

if(!user){
throw new Error(
"User not found"
)
}

const resetToken =
crypto.randomBytes(32)
.toString("hex")

user.resetToken =
resetToken

user.resetTokenExpiry =
Date.now() +
15 * 60 * 1000

await user.save()

const resetLink =
`${process.env.FRONTEND_URL}/reset-password/${resetToken}`

await transporter.sendMail({
from:
process.env.EMAIL,
to: emailId,
subject:
"Spendora Password Reset",
html: `
<h2>Reset Password</h2>
<p>Click below link:</p>
<a href="${resetLink}">
Reset Password
</a>
<p>Valid for 15 minutes</p>
`
})

res.json({
message:
"Reset link sent to email"
})

}catch(err){
res.status(400).json({
message:
err.message
})
}
}



// ---------------- RESET PASSWORD ----------------

const resetPassword =
async (req,res)=>{
try{

const { token } =
req.params

const { password } =
req.body

const user =
await User.findOne({
resetToken: token,
resetTokenExpiry: {
$gt: Date.now()
}
})

if(!user){
throw new Error(
"Invalid or expired token"
)
}

const hashedPassword =
await bcrypt.hash(
password,
10
)

user.password =
hashedPassword

user.resetToken = null
user.resetTokenExpiry = null

await user.save()

res.json({
message:
"Password reset successful"
})

}catch(err){
res.status(400).json({
message:
err.message
})
}
}


module.exports = {
 register,
 verifyOtp,
 login,
 googleAuth,
 logout,
 getMe,
 updateProfile,
 forgotPassword,
 resetPassword
}