
const express=require("express")
const router = express.Router();
const {createUser,loginUser,forgotPassword,resetPassword,getAllUsers,getSingleUser,deleteUser,updateUser}=require("../controllers/userCtrl");

router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.get("/getalluser",getAllUsers);
router.get("/getsingleuser/:id",getSingleUser);
router.delete("/deleteuser/:id",deleteUser);
router.patch("/updateuser/:id",updateUser);

module.exports= router;