const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require("bcrypt");
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please provide the name"],
        maxLength: [40, "Please privide valid name"],
      },
    lastName:{
        type:String,
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


//Export the model
module.exports = mongoose.model('User', userSchema);