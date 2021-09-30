const mongoose = require('mongoose');
var bcrypt = require("bcrypt");
var UserSchema = mongoose.Schema({
    name: {
      type: String,
      require: true
    },
    emailAddress:{
        type:String,
        require:true
    },
    password: {
      type: String,
      require: true
    }

  });
  module.exports = User = mongoose.model("User", UserSchema);
  