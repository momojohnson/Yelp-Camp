var mongoose = require('mongoose');
// Comment schema for Campground model ref User model
var commentSchema = mongoose.Schema({
  comment: {type: String, required: true},
  createdAt: {type:Date, default: Date.now},
  author: {
    id: { type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: String,
      name:{
          first: String,
          last: String,
      }
    }
});

module.exports = mongoose.model('Comment', commentSchema);
