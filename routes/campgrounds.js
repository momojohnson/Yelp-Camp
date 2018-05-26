var express = require('express'), // Express variable
    Campground = require('../models/campgrounds'), // Campground module
    middleware = require('../middleware/index'), // Middleware module
    NodeGeocoder = require('node-geocoder'), // Google geocoder for node
    cloudinary = require('cloudinary'), // Cloudinary module
    multer = require('multer'), // Multer module
    router = express.Router(); // express router


    var storage = multer.diskStorage({
    filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
    }
  });
  // Setting up of cloudinary configuration
  var imageFilter = function (req, file, cb) {
      // accept image files only
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
  };
  var upload = multer({ storage: storage, fileFilter: imageFilter})
  cloudinary.config({
    cloud_name: 'diuj5cx43',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

// Setting configuration of NodeGeocoder
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
}
var geocoder = NodeGeocoder(options);
router.get('/', function(req, res){
  Campground.find({}, function(err, campgrounds){
    if(err){
      res.redirect('back')
      return;
    }
    res.render('campgrounds/list_campgrounds', {campgrounds: campgrounds, title: "Camgrounds"})
  });
});

// Show form to create new campground at route campgroun/new
router.get('/new', middleware.isLogin, function(req, res){
  res.render('campgrounds/new_campground', {title:'Add Campground'})
});

// Create new campground at route / with post request
router.post('/', middleware.isLogin, upload.single('image'), function(req, res){
  cloudinary.v2.uploader.upload(req.file.path, function(err, result){
  author = {
    id: req.user._id,
    username: req.user.username,
    name:{
      first: req.user.name.first,
      last: req.user.name.last
    }
  };
  // User the location entered by the user to get full address of the user location
  geocoder.geocode(req.body.location, function(err, data){
    if(err || !data.length){
      req.flash('error', 'Invalid urls');
      res.redirect('back');
      return;
    }
    // Set various campground fields to be save to the database
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;
    req.body.campground.image = result.secure_url;
    req.body.campground.imageId = result.public_id;
    req.body.campground.author = author;
    Campground.create(req.body.campground, function(err, campground){
      if(err){
        req.flash('error', 'An error occur while trying to create the campground');
        res.redirect('back');
        return;
      }
      req.flash('success', campground.name + ' was added successfully.');
      res.redirect('/campgrounds');
    });
  });
});
});

// Render for editing of campground information at route /campgrounds/id/edit
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      req.flash('error', 'An error occur finding the campground.');
      res.redirect('back');
      return;
    }
    res.render('campgrounds/edit_campground', { campground: campground, title: "Edit Campground"})
  });
});

// Handles edit of campground at route /campground/:id
router.put('/:id', upload.single('image'), middleware.checkCampgroundOwnership,  function(req, res){
  geocoder.geocode(req.body.location, function(err, data){
    if(err || !data.length){
      req.flash('error', 'The address you provided is incorrect.')
      res.redirect('back');
      return;
    };
    // Set lat and lng to be used for google map. Get full location address from the formatteedAddress of geocoder
    lat = data[0].latitude;
    lng = data[0].longitude;
    location = data[0].formattedAddress;
    Campground.findById(req.params.id, async function(err, campground){
      if(err){
        req.flash('error', 'There was an error editing campground.');
        res.redirect('back');
        return;
      }
      if(req.file){
        try{
          // Delete current from cloudinary if the user uploads a new image
          await cloudinary.v2.uploader.destroy(campground.imageId)
         // Upload the new image being uploaded by the user to cloudinary
         var result = await cloudinary.v2.uploader.upload(req.file.path)
         // Update campground image id and image from cloudinary api
         campground.imageId = result.public_id;
         campground.image = result.secure_url;

       }catch(err){
         req.flash('error', err.message);
         return res.redirect('back');
       }

      }
      // Update various campround fields
    campground.name = req.body.name;
    campground.price = req.body.price;
    campground.description = req.body.description;
    campground.lat = lat;
    campground.lng = lng;
    campground.location = location;
    campground.save()
    req.flash(campground.name + ' has been successfully updated')
    res.redirect('/campgrounds/'+req.params.id);
    });
  });
});

// Show details about the particular campground and comments at route /campground/:id
router.get('/:id', function(req, res){
  Campground.findById(req.params.id).populate('comments').exec(function(err, campground){
    if(err){
      req.flash('error', 'Error loading comments for this campground.');
      res.redirect('back');
      return;
    }
    res.render('campgrounds/show_campgrounds', {campground:campground, title: 'Show Campgrounds'})
  });
});

// Delete a particlular campground at route /campground/:id and redirect to /campgrounds
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err, campground){
    if(err){
      req.flash('error','An error occur while trying to delete campground');
      res.redirect('back');
      return;
    }
    cloudinary.v2.uploader.destroy(campground.imageId,function(err, result){
      if(err){
        req.flash('error', err.message);
        return res.redirect('back');
      }
      req.flash('success', 'successfully remove '+campground.name);
      res.redirect('/campgrounds');
    })

  });
});

module.exports = router;
