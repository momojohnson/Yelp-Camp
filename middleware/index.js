// Middleware for this application
var Campgrounds = require("../models/campgrounds"); // Campground module
var Comment = require("../models/comments") // Comment module

var middlewareObj = {};
// Check a user ownership of a partical campground
middlewareObj.checkCampgroundOwnership = function(req, res, next){
     if(req.isAuthenticated()){
        Campgrounds.findById(req.params.id, function(err, campground){
        if(err){
            res.redirect('back');
        }
        if(campground.author.id.equals(req.user._id) || req.user.isAdmin){
             next();
        }else{
           req.flash('error', "You can't edit another's person campground")
           res.redirect('back')
        }

    });
    }
    else{
        req.flash("error", "You need to login to do that.");
        res.redirect('/account/login')
    }
}
// Check user ownership of a particular comment
middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campgrounds.findById(req.params.id, function(err, campground){
            if(err){
                res.redirect("/campgrounds/"+req.params.id);
                return;
            }

            Comment.findById(req.params.comment_id, function(err, comment) {
                if(err){
                    req.flash('error', "We had an error finding the campground")
                    res.redirect("back")
                    return;
                }
                if(comment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();

                }else{
                    req.flash('error', "You can't edit another person's comment")
                     res.redirect('back')
                }

            })

        })

    }else{
        req.flash("error", "You need to login to do that.");
         res.redirect("/account/login")
    }

}
// Check if a user has been authenticated before allowing them to access certain routes
middlewareObj.isLogin = function(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash("error", "You must be signed in to perform this action.");
    res.redirect("/account/login")
}

module.exports = middlewareObj
