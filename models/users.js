const mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');// passport-local-mongoose

// User schema for this application. username, email, firstname, lastname,
// profile pic
var userSchema = mongoose.Schema({
  username: {
    type: String },
  email: {
    type: String},
  name: {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
     }
   },
   isAdmin: {type: Boolean, default: false },
  profile_pic: {
    type: String
  },
  password: {
    type: String,
  },

});
userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
module.exports = mongoose.model('User', userSchema);
