const User = require("../models/userModel");
const ErrorHandle = require("../utils/errorHandle");
const bigPromise = require("../middlewares/bigPromise");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

const sendToken = require("../utils/sendToken");
const sendEmail = require("../utils/sendEmail");

// Register a user   => /api/v1/register
const createUser = bigPromise(async (req, res, next) => {

   // if(req.body.avatar)
   // {
   //    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
   //       folder: "fashion-fusion-backend/avatar",
   //       width: 150,
   //       crop: "scale",
   //   });
   // }
    
   //   console.log("result",result)
    const { name, email, password } = req.body;
// Checks if email and password is entered by user
if (!email || !password || !name) {
    return next(new ErrorHandle("Please Fill All the Fields", 400));
}
    const isEmail=await User.findOne({email});
    if(isEmail)
    {
        return next(new ErrorHandle("Email Already Exists", 400));
    }
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: 1,
            url: "https://lh3.googleusercontent.com/ogw/AAEL6shiS4iiAVqKdrV4FhEYxgPWvGzop8C9iAWWooVruw=s64-c-mo",
        },
    });

    sendToken(user, 200, res);
});

 // Login User  =>  /api/v1/login
const loginUser = bigPromise(async (req, res, next) => {
   const { email, password } = req.body;

   // Checks if email and password is entered by user
   if (!email || !password) {
       return next(new ErrorHandle("Please enter email & password", 400));
   }

   // Finding user in database
   const user = await User.findOne({ email }).select("+password");

   if (!user) {
       return next(new ErrorHandle("Invalid Email or Password", 401));
   }

   // Checks if password is correct or not
   const isPasswordMatched = await user.comparePassword(password);

   if (!isPasswordMatched) {
       return next(new ErrorHandle("Invalid Email or Password", 401));
   }

   sendToken(user, 200, res);
});

const getAllUsers=async (req,res,next)=>
{
   const users=await User.find();
   res.status(200).send(users)

}

const getSingleUser=async (req,res,next)=>
{
   const {id}=req.params;
   const user=await User.findById(id);
   if(user)
   {
      res.status(200).send(user)
   }
   else{
      return next(new Error("User not existsss"));
   }
   

}
const deleteUser=async (req,res,next)=>
{
   const {id}=req.params;
   const user=await User.findByIdAndDelete(id);

   if(user)
   {
      res.status(200).send(user)
   }
   else{
      return next(new Error("User not existsss"));
   }

}
const updateUser=async (req,res,next)=>
{
   const {id}=req.params;
   const {email,firstName,lastName,mobile} = req.body;
   const user=await User.findByIdAndUpdate(id,{
      firstName:firstName,
        lastName:lastName,
        mobile:mobile,
        email:email,
        });

   if(user)
   {
      res.status(200).send({
         firstName:firstName,
         lastName:lastName,
         mobile:mobile,
         email:email,
      })
   }
   else{
      return next(new Error("User not existsss"));
   }

}
module.exports={createUser,loginUser,getAllUsers,getSingleUser,deleteUser,updateUser}