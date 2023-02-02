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
 
   if (isPasswordCorrect) {
      res.status(200).json({
         msg:"Login Successfully"
      })
   }
   else{
      return next(new Error("User not existsss"));
   }
}
module.exports={createUser,loginUser}