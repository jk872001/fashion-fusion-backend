const User = require("../models/userModel");
const ErrorHandle = require("../utils/errorHandle");
const bigPromise = require("../middlewares/bigPromise");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

const sendToken = require("../utils/sendToken");
const sendEmail = require("../utils/sendEmail");

// Register a user   => /api/v1/register
const createUser = bigPromise(async (req, res, next) => {
    // const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //     folder: "shopx/avatar",
    //     width: 150,
    //     crop: "scale",
    // });

    const { name, email, password } = req.body;
// Checks if email and password is entered by user
if (!email || !password || !name) {
    return next(new ErrorHandler("Please Fill All the Fields", 400));
}
    const isEmail=await User.findOne({email});
    if(isEmail)
    {
        return next(new ErrorHandler("Email Already Exists", 400));
    }
    const user = await User.create({
        name,
        email,
        password,
        // avatar: {
        //     public_id: result.public_id,
        //     url: result.secure_url,
        // },
    });

    sendToken(user, 200, res);
});

  const loginUser= async (req,res,next)=>
{
   const { email, password } = req.body;

   if (!(email || password)) {
     return next(new Error("Please fill all the fields"));
   }
 
   const user = await User.findOne({ email });
 
   if (!user) {
     return next(new Error("User not exist"));
   }
 
   const isPasswordCorrect = await user.isValidatedPassword(password);
   const token = await user.getToken();
 
   if (isPasswordCorrect) {
      res.status(200).json({
        name:user?.name,
       
        email:email,
        token:token
      })
   }
   else{
      return next(new Error("User not existsss"));
   }
}

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