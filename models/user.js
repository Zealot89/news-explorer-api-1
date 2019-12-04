const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: 8
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    }
});

userSchema.statics.findUserByCredentials = function (email, password) {
    return this.findOne({ email }).select("+password")
      .then((user) => {
        if (!user) {
          return Promise.reject(new Error("Mail or password not correct"));
        }
  
        return bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              return Promise.reject(new Error("Mail or password not correct"));
            }
  
            return user;
          });
      });
  };

module.exports = mongoose.model("user",userSchema);