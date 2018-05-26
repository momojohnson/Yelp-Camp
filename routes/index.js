var express = require('express'), // Express
    router = express.Router(); // Express router

// Renders the application index page
router.get('/', function(req, res){
  res.render('index', {title:"Home"});
})

module.exports = router;
