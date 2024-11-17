const   express = require('express'),
        router  = express.Router(),
        multer  = require('multer'),
        path    = require('path'),
        storage = multer.diskStorage({
                    destination: function(req,file, callback){
                        callback(null,'./public/uploads/');
                    },
                    filename: function(req, file, callback){
                        callback(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname));
                    }
                }),
        imageFilter = function(req,file,callback){
            if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)){
                return callback(new Error('Only jpg, jpeg, png and gif.'), false);
            }
            callback(null, true);
        },
        upload = multer({storage: storage, fileFilter: imageFilter}),        
        Print   = require('../models/print.js'),
        middleware = require('../middleware');

        
router.get('/', function(req, res){
    let noMatch = null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Print.find({name: regex}, function(err, allPrints){
           if(err){
               console.log(err);
           } else {
              if(allPrints.length < 1) {
                  noMatch = "No prints match that query, please try again.";
              }
              res.render("print/print.ejs",{prints:allPrints, noMatch: noMatch});
           }
        });
    } else {
        Print.find({}, function(err, allPrints){
            if(err){
                console.log(err);
            } else {
                res.render('print/print.ejs',{prints:allPrints});
            }
        });
    }
});

router.get('/new', middleware.isLoggedIn,function(req, res){
    res.render('print/new.ejs');
});

router.post('/', middleware.isLoggedIn, upload.single('image'), function(req, res){
    req.body.print.image = '/uploads/'+ req.file.filename;
    req.body.print.author = {
        id: req.user._id,
        username: req.user.username
    };
    Print.create(req.body.print, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/print");
        }
    });
});

router.get('/:id', function(req,res){
    Print.findById(req.params.id).populate('comments').exec(function(err, foundPrint){
        if(err){
            console.log(err);
        } else {
            res.render('print/show.ejs',{print: foundPrint})
        }
    });
});

router.get('/:id/edit', middleware.checkPrintOwner,  function(req,res){
    Print.findById(req.params.id,function(err, foundPrint){
        if(err){
            console.log(err);
        } else {
            res.render('print/edit.ejs',{print: foundPrint})
        }
    });
});

router.put('/:id', upload.single('image'), function(req, res){
    if(req.file){
        req.body.print.image = '/uploads /' + req.file.filename;
    }
    Print.findByIdAndUpdate(req.params.id, req.body.print, function(err, updatedPrint){
        if(err){
            console.log(err);
            res.redirect('/print/');s
        } else {
            res.redirect('/print/'+req.params.id);
        }
    });
});

router.delete('/:id', middleware.checkPrintOwner, function(req, res){
    Print.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/print/');
        } else {
            res.redirect('/print/');
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
