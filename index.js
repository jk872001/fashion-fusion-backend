const express=require("express");
const dotenv=require("dotenv").config()

const PORT=process.env.PORT || 4000
const dbConnect=require("./configs/dbConnect");

var bodyParser = require('body-parser')
var app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
dbConnect();

const authRouter=require("./routes/authRoute")

app.use("/api/v1",authRouter)

app.listen(PORT,()=>
{
    console.log(`Server is running at PORT ${PORT}`);
})  