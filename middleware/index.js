const   Print = require('../models/print'),
        Comment = require('../models/comment');

const   middlewareObj = {};

middlewareObj.checkPrintOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Print.findById(req.params.id, function(err, foundPrint){
            if(err){
                res.redirect('back');
            } else {
                if(foundPrint.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash('error','You do not have permission to do this!');
                    res.redirect('back');
                }
            }
        });
    } else {
        res.redirect('back');
    }
} 

middlewareObj.checkCommentOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect('back'); 
            } else {
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash('error','You do not have permission to do this!');
                    res.redirect('back');
                }
            }
        });
    } else {
        res.redirect('back');
    }
} 

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to sign in first');
    res.redirect('/login');
}

module.exports = middlewareObj;