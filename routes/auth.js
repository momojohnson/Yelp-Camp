var express = require('express'), // Express js
    router = express.Router(), // Express router
    User = require('../models/users'), // User
    passport = require('passport'), // Passportjs package
    randomString = require('randomstring'), // random string package
    nodemailer = require('nodemailer'),
    Joi = require('joi'),
    userSchemaValidator = require('../validator/validators');


// Render registration form for the user at route /account/register
router.get('/register', function(req, res){
  res.render('auth/register', {title: "Registration", page: 'register'})
});

// perform registration for a user at route /account/Register

router.post('/register', function(req, res){
   //var resultError = Validator.validateReq(req.body)
  Joi.validate(req.body, userSchemaValidator, function(err, result){
    if(err){
      req.flash('error', err.details[0].message)
      console.log(err.details[0])
      res.redirect('/account/register');
      return;
    }
    var name = {
      firstName: req.body.firstName,
      lastName: req.body.lastName
    }
    User.register(new User({
      username: req.body.username,
       email:req.body.email,
       name: name,

     }), req.body.password, function(err, user){
       if(err){
         req.flash('error', err.message);
         res.redirect('back');
         return;
       }
         req.flash('success', 'You have registered successfully. You may now login!')
         req.logout()
         res.redirect('/account/login');
     });
  })

});

// Render form for to login a user at route /account/login
router.get('/login', function(req, res){
  res.render('auth/login', {title: 'Login', page: 'login'})
});

// Handles user authentication and login a user if success, redirect to index page,
// If failure,  display failure err message and redirect to /account/login
router.post('/login', passport.authenticate('local',
{
  successRedirect: '/',
  failureRedirect: '/account/login',
  failureFlash: 'Invalid Email  or password.'
}), function(req, res){

});

// Logout login user at route /account/logout

router.get('/logout', function(req, res){
  var username = req.user.name.firstName + " "+ req.user.name.lastName;
  console.log(req.user.name)
  req.logout();
  req.flash('success','You have been successfully logout. Hope to see you again '+username)
  res.redirect('/account/login')
})
module.exports = router;
