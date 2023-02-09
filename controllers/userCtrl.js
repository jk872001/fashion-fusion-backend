const User = require("../models/userModel");
const ErrorHandle = require("../utils/errorHandle");
const bigPromise = require("../middlewares/bigPromise");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

const sendToken = require("../utils/sendToken");
const sendEmail = require("../utils/sendEmail");

// Register a user   => /api/v1/register
const createUser = bigPromise(async (req, res, next) => {


    //    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //       folder: "fashion-fusion-backend/avatar",
    //       width: 150,
    //       crop: "scale",
    //   });


    //   console.log("result",result)
    const { name, email, password } = req.body;
    // Checks if email and password is entered by user
    if (!email || !password || !name) {
        return next(new ErrorHandle("Please Fill All the Fields", 400));
    }
    const isEmail = await User.findOne({ email });
    if (isEmail) {
        return next(new ErrorHandle("Email Already Exists", 400));
    }
    const user = await User.create({
        name,
        email,
        password,
        //   avatar: {
        //       public_id: result.public_id,
        //       url: result.secure_url,
        //   },
    });

    sendToken(user, 200, res);
});

// Login User  =>  /api/v1/login
const loginUser = bigPromise(async (req, res, next) => {
    const { email, password } = req.body;

    // Checks if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandle("Please enter email & password", 400));
    }

    // Finding user in database
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandle("Invalid Email or Password", 401));
    }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandle("Invalid Email or Password", 401));
    }

    sendToken(user, 200, res);
});

// Forgot Password   =>  /api/v1/password/forgot
const forgotPassword = bigPromise(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandle("User not found with this email", 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset password url
    const resetUrl = `${req.protocol}://${req.get(
        "host"
    )}/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: "ShopX Password Recovery",
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandle(error.message, 500));
    }
});

// Reset Password   =>  /api/v1/password/reset/:token
const resetPassword = bigPromise(async (req, res, next) => {
    // Hash URL token
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new ErrorHandle(
                "Password reset token is invalid or has been expired",
                400
            )
        );
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandle("Password does not match", 400));
    }

    // Setup new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

const getAllUsers = async (req, res, next) => {
    const users = await User.find();
    res.status(200).send(users)

}

// Get currently logged in user details   =>   /api/v1/me
const getUserById = bigPromise(async (req, res, next) => {
    const user = await User.findById(req.body.id);

    res.status(200).json({
        success: true,
        user,
    });
});

// Update / Change password   =>  /api/v1/password/update
const updatePassword = bigPromise(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if (!isMatched) {
        return next(new ErrorHandle("Old password is incorrect"));
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res);
});

module.exports = { createUser, loginUser, forgotPassword, resetPassword,getUserById,updatePassword}