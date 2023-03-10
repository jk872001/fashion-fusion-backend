
const express=require("express")
const router = express.Router();
const {createUser,loginUser,forgotPassword,resetPassword,getUserById,updatePassword}=require("../controllers/userCtrl");
const {isAuthenticatedUser}=require("../middlewares/auth")




router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword)
router.route("/me").get(getUserById);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

module.exports= router;