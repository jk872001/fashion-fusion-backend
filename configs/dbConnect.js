const mongoose=require("mongoose");


 const dbConnect=()=>
{
    try{
        const conn=mongoose.connect('mongodb+srv://jitesh123:jitesh123@cluster0.xemvdr7.mongodb.net/?retryWrites=true&w=majority',{
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
