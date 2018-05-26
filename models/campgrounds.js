var mongoose = require('mongoose');
/*
Creates a mongoose campground schema with fields
name, price, image, imageId, location lat, lng, description, createdAt
imageId: image id returns from cloudinary api for a particular image
image: image url returns from cloudinary api for a particular image
comments: Ref Comment model 
author: ref User model
*/
var camgroundSchema = mongoose.Schema({
  name: {type:String, required: true },
  price: {type: Number, required: true},
  image: {type: String, required: true},
  imageId: String,
  location: {type: String},
  lat: Number,
  lng: Number,
  description: {type: String, required: true },
  createdAt: {type: Date, default: Date.now },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String,
    name:{
        first: String,
        last: String
    },

  }

})

module.exports = mongoose.model('Campground', camgroundSchema);
