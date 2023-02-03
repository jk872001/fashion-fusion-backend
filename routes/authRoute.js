
const express=require("express")
const router = express.Router();
const {createUser,loginUser,getAllUsers,getSingleUser,deleteUser}=require("../controllers/userCtrl");

router.post("/register",createUser);
router.post("/login",loginUser);
router.get("/getalluser",getAllUsers);
router.get("/getsingleuser/:id",getSingleUser);
router.delete("/deleteuser/:id",deleteUser);

module.exports= router;