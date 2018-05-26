var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    minlength: [6, "User name must be atleast 6 characters"]
   },
  email: {
    type: String,
     lowercase: true,
     unique: true
   },
  name: {
    first: {
      type: String,
    },
    last: {
      type: String,
     }
   },
  profile_pic: {
    type: String
  },
  password: {
    type: String,
    minlength: [6, 'Password must aleast be 6 characters']
  }

});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);
