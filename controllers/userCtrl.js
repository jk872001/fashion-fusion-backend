const User=require("../models/userModel");

  const createUser= async (req,res,next)=>
{
   //  console.log(req.body);
    const email=req.body.email;
   const findUser= await User.findOne({email});
   if(!findUser)
   {
      const userCreate= await User.create(req.body);
      res.status(200).send(userCreate);
   }
   else{
       res.json({
          msg:"User Already Exists",
          success:false
       })
   }
}
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
        firstName:user?.firstName,
        lastName:user?.lastName,
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
module.exports={createUser,loginUser,getAllUsers,getSingleUser,deleteUser}