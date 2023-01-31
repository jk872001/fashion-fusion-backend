const mongoose=require("mongoose");


 const dbConnect=()=>
{
    try{
        const conn=mongoose.connect('mongodb://127.0.0.1:27017/fashion-fusion',{
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
