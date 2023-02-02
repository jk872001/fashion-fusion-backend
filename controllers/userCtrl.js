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
module.exports={createUser}