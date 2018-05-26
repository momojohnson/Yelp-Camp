var express = require('express'),
    router = express.Router(),
    User = require('../models/users'),
    passport = require('passport');

// Render registration form for the user at route /account/register
router.get('/register', function(req, res){
  res.render('auth/register', {title: "Registration", page: 'register'})
});

// perform registration for a user at route /account/Register

router.post('/register', function(req, res){
  var name = {
    first: req.body.first_name,
    last: req.body.last_name
  }
  User.register(new User({
    username: req.body.username,
     email:req.body.email,
     name: name,
     profile_pic: req.body.profile_pic,
   }), req.body.password, function(err, user){
     if(err){
       req.flash('error', err.message);
       res.redirect('back');
       return;
     }
     passport.authenticate('local')(req, res, function(){
       req.flash('success', 'You have registered successfully. You may now login!')
       req.logout()
       res.redirect('/account/login');
     });
   });
});

// Render form for to login user at route /account/login
router.get('/login', function(req, res){
  res.render('auth/login', {title: 'Login', page: 'login'})
});

router.post('/login', passport.authenticate('local',
{
  successRedirect: '/',
  failureRedirect: '/account/login',
  failureFlash: 'Invalid username or password.'
}), function(req, res){

});

// Logout login user at route /account/logout

router.get('/logout', function(req, res){
  var username = req.user.name.first + " "+ req.user.name.last;
  req.logout();
  req.flash('success','You have been successfully logout. Hope to see you again '+username)
  res.redirect('/account/login')
})
module.exports = router;
