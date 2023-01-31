const express=require("express");
const dotenv=require("dotenv").config()
const app=express();
const PORT=process.env.PORT || 4000
const dbConnect=require("./configs/dbConnect");
dbConnect();

app.use("/",(req,res)=>
{
    res.send("Hello its me");
})

app.use("/user",(req,res)=>
{
    res.send({
        name:"jitesh"
    });
})


app.listen(PORT,()=>
{
    console.log(`Server is running at PORT ${PORT}`);
})  