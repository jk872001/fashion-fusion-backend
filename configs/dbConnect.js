const mongoose=require("mongoose");


 const dbConnect=()=>
{
    try{
        const conn=mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
         console.log("Database connected successfully");
    }
    catch{
        console.log("database error");
    }
}
module.exports=dbConnect;
