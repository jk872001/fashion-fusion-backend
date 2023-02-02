
const express=require("express")
const router = express.Router();
const {createUser,loginUser,getAllUsers}=require("../controllers/userCtrl");

router.post("/register",createUser);
router.post("/login",loginUser);
router.get("/getalluser",getAllUsers);

module.exports= router;