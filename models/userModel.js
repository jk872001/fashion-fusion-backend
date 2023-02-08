const mongoose = require('mongoose'); // Erase if already required
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide the name"],
        maxLength: [40, "Please privide valid name"],
      },
   
    email: {
        type: String,
        required: [true, "Please provide the email"],
        unique: true,
      },
    
      password: {
        type: String,
        required: [true, "Please provide the password"],
        minLength: [8, "Password must be 8 char"],
      },
      role: {
        type: String,
        default: "user",
      },
});


// hashing the password
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10); //converting to hash password
    }
    next();
  });

//   matching the password
userSchema.methods.isValidatedPassword = async function (userSendPassword) {
    // console.log(userSendPassword,this.password)
    return await bcrypt.compare(userSendPassword, this.password);
  };

// jwt token generation
userSchema.methods.getToken =   function () {
  return  jwt.sign({ id: this._id }, 
    'secret', {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

//Export the model
module.exports = mongoose.model('User', userSchema);