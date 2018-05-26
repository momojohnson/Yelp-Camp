var express = require('express'),
    router = express.Router({mergeParams: true}),
    Campground = require('../models/campgrounds'),
    Comment = require('../models/comments'),
    middleware = require('../middleware/index');

// Display form for the creation of a new comment at /campgrounds/:id/comments/new
router.get('/new', middleware.isLogin, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      req.flash('error', 'We encounter a problem while to find this campground.')
      res.redirect('back');
      return;
    }
    res.render('comments/new_comment', {campground:campground, title:'New comment'})
  });
});

router.post('/', middleware.isLogin, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      req.flash('error', 'Couldn\'t find the campground name');
      res.redirect('back');
      return;
    }
    author = {
      id: req.user._id,
      username: req.user.username,
      name:{
        first: req.user.name.first,
        last: req.user.name.last,
      }
    }
    req.body.comments.author=author;
    Comment.create(req.body.comments, function(err, comment){
      if(err){
        req.flash('error', 'An error occur while trying to create a comment');
        res.redirect('back');
        return;
      }
      campground.comments.push(comment);
      campground.save()
      req.flash('success', 'Comment for '+ campground.name + ' was added successfully');
      res.redirect('/campgrounds/'+req.params.id);
    });
  });
});

router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      req.flash('error', 'An error occur while trying to look up the campground for this comment')
      res.redirect('back');
      return;
    }
    Comment.findById(req.params.comment_id, function(err, comment){
      if(err){
        req.flash('error', 'An error occur while trying to find the comment');
        res.redirect('back');
        return;
      }
      res.render('comments/edit_comment', {comment: comment, campground: campground, title: "Edit Comment"})
    });
  });
});

// Route to edit a particular comment at /campground/:id/comments/:comment_id
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comments, function(err, comment){
    if(err){
      req.flash('error', 'Couldn\'t save changes for edited comment');
      res.redirect('back');
      return;
    }
    req.flash('success', 'Comment successfully edited');
    res.redirect('/campgrounds/'+req.params.id);
  });
});

// Handles campground deletion at /campgrounds/id/comments/:comment_id/delete
router.delete('/:comment_id/delete', middleware.checkCommentOwnership, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      req.flash('error', 'Couldn\'t find campground for this comment');
      res.redirect('back')
      return;
    }
    Comment.findByIdAndRemove(req.params.comment_id, function(err, comment){
      if(err){
        req.flash('error', 'An error occur while trying to delete comment.')
        res.redirect('back');
        return;
      }
      req.flash('success', campground.name+' successfully deleted.')
      res.redirect('/campgrounds/'+req.params.id);
    });
  });
});





module.exports = router;
