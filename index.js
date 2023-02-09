const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const connectDatabase = require("./configs/dbConnect");
const cloudinary = require("cloudinary");
const PORT = process.env.PORT || 4000;
const path = require("path");
// const errorMiddleware = require("./middleware/error");
const  cors = require('cors')
const app = express();


app.use(express.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

// routes
const auth = require("./routes/authRoute");
const products = require("./routes/productRoute");



// routes app.use
app.use("/api/v1", auth);
app.use("/api/v1", products);

// Database connection 
connectDatabase();


// Setting up cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// app.use("/", (req, res) => {
//     res.send("App is running.");
// });

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});