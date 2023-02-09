
const express=require("express")
const router = express.Router();
const {newProduct}=require("../controllers/productCtrl");

router
    .route("/products")
    .post(newProduct);


module.exports= router;