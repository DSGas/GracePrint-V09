const   express = require('express'),
        router  = express.Router({mergeParams: true}),
        Print   = require('../models/print.js'),
        Comment   = require('../models/comment.js'),
        middleware = require('../middleware');

router.get('/new', middleware.isLoggedIn, function(req, res){
    Print.findById(req.params.id, function(err, foundPrint){
        if(err){
            console.log(err);
        } else {
            res.render('comments/new.ejs',{print: foundPrint})
        }
    });
});

router.post('/', middleware.isLoggedIn, function(req, res){
    Print.findById(req.params.id, function(err, foundPrint){
        if(err){
            console.log(err);
            res.redirect('/print');
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundPrint.comments.push(comment);
                    foundPrint.save();
                    res.redirect('/print/'+  foundPrint._id);
                }
            });
        }
    });
});

router.get('/:comment_id/edit', middleware.checkCommentOwner, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect('back');
        } else {
            res.render('comments/edit.ejs', {print_id: req.params.id, comment: foundComment});
        }
    });
}); 

router.put('/:comment_id', middleware.checkCommentOwner, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect('back');
        } else {
            res.redirect('/print/'+req.params.id);
        }
    });
});

router.delete('/:comment_id', middleware.checkCommentOwner, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect('/print/'+req.params.id);
        } else {
            req.flash('success', 'You delete your comment.');
            res.redirect('/print/'+req.params.id);
        }
    });
});

module.exports = router;