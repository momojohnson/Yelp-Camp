var   env = require('dotenv').config(),
      express = require('express'),
      mongoose = require('mongoose'),
      passport = require('passport'),
      bodyParser = require('body-parser'),
      flash = require('connect-flash'),
      methodOverride = require('method-override'),
      LocalStrategy = require('passport-local'),
      User = require('./models/users'),
      Campground = require('./models/campgrounds'),
      Comment = require('./models/comments'),
      app = express();

// Routes for yelp camp

var authRoutes = require('./routes/auth'),
    campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes = require('./routes/comments'),
    indexRoutes = require('./routes/index');

mongoose.connect('mongodb://localhost/yelp_camp_db');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(flash())
app.locals.moment = require('moment');

// Configurating passport
app.use(require("express-session")({
    secret: "this is my secret key",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// Requiring various routes
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/account', authRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use(indexRoutes);

app.listen(8080, function(){
  console.log('Yelp camp server started');
})
